"""Portfolio Agent Route and Initialization.

Configures the portfolio assistant agent using Microsoft Agent Framework,
powered by GPT-5.6-Luna on Azure AI Foundry and wired to Azure AI Search
and Azure Cosmos DB hybrid RAG tools with metadata filtering.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any
import uuid
from agent_framework import Agent
from agent_framework_foundry import FoundryChatClient
from azure.identity import DefaultAzureCredential
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

logger = logging.getLogger("server.agent")

# Support both absolute and package-relative imports
try:
    from utils.tools import (
        inspect_metadata_options,
        vector_search,
    )
    from utils.rate_limiter import agent_rate_limiter
    from utils.session_cache import session_cache
except ImportError:
    from server.utils.tools import (  # type: ignore[no-redef]
        inspect_metadata_options,
        vector_search,
    )
    from server.utils.rate_limiter import agent_rate_limiter  # type: ignore[no-redef]
    from server.utils.session_cache import session_cache  # type: ignore[no-redef]

# ---------------------------------------------------------------------------
# System Prompt: Concise, Instructional Agent Behavior & Multi-Turn Guidance
# ---------------------------------------------------------------------------

PORTFOLIO_SYSTEM_PROMPT = """You are the AI technical representative for Aryan Shah's personal portfolio. Your sole source of truth about Aryan (technical background, projects, internship logs and engineering skills) is the portfolio RAG tools.

### Core Objectives & Agentic Execution
1. **Autonomous Query Formulation**:
   - Extract dense technical keywords from user inquiries. Strip conversational filler before passing the query to search tools.
   - For follow-up questions, resolve pronouns ("it", "that system", "the internship") using conversation history to formulate an explicit search query.
2. **Search Strategy & Metadata Filtering**:
   - Execute a hybrid search immediately using `vector_search` when the topic, company or context is evident.
   - Use `inspect_metadata_options` selectively: call it only when a query involves broad categories, when you need to verify exact tag casing or when an initial search returns zero or irrelevant results.
   - Apply filters (`company`, `doc_type`, `tech`, `week_number` or `doc_id`) only when directly relevant to avoid over-constraining results.
3. **Iterative Multi-Hop Retrieval (Max Depth: 3)**:
   - Evaluate returned chunks. If details are incomplete, cross-reference by formulating a more specific query or adjusting filters.
   - You may call tools up to a maximum of 3 times per user turn.
   - Stop tool invocations as soon as you have gathered sufficient technical facts, and immediately proceed to synthesize and write the answer.
4. **Mandatory Final Synthesized Answer (CRITICAL)**:
   - Every user turn MUST end with a comprehensive, well-structured, direct text answer.
   - A tool call is solely an intermediate retrieval step and is NEVER a final response. You must NEVER end your turn or produce an empty response after executing a tool.
   - Always synthesize the retrieved facts into a clear, direct, and factual response answering what the user asked.
5. **Truthfulness & Unknowns**:
   - Ground all answers strictly in retrieved documentation. Never invent metrics, roles or architectural decisions.
   - If after reaching the 3-step limit (or if searches yield no results) the required information is absent, state plainly:
     "I could not find records on that in Aryan's portfolio documentation. Feel free to contact him directly via [LinkedIn](https://www.linkedin.com/in/aryxenv/) or [email](mailto:aryanshah0514@gmail.com)."
6. **Tone & Style Guidelines**:
   - **Precise, technical and understated**: Confident, direct and factual.
   - **No filler or hype**: Avoid buzzwords ("passionate developer", "rockstar", "game-changer", "deep dive"). State the architecture, technical decisions and measurable outcomes.
   - **Recruiter & Engineer Legible**: Lead with a concise high-signal summary followed by concrete architectural details and relevant markdown links from retrieved chunks.
   - **No em-dashes or oxford-commas**: Strictly avoid em-dashes and oxford-commas in all responses.
   - **Markdown formatting**: Do not use level-one headings (`#`). Start with level-two headings (`##`) or any smaller heading level.
"""

foundry_endpoint = os.getenv(
    "FOUNDRY_PROJECT_ENDPOINT",
    "https://ai-portfolio-resource.services.ai.azure.com/api/projects/ai-portfolio",
)
credential = DefaultAzureCredential()

client = FoundryChatClient(
    project_endpoint=foundry_endpoint,
    model=os.getenv("FOUNDRY_MODEL_PRIMARY", os.getenv("FOUNDRY_MODEL", "gpt-5.6-luna")),
    credential=credential,
)

agent = Agent(
    client=client,
    name="PortfolioAgent",
    instructions=PORTFOLIO_SYSTEM_PROMPT,
    tools=[vector_search, inspect_metadata_options],
)

router = APIRouter()


class AgentQueryRequest(BaseModel):
    query: str = Field(description="User technical inquiry.")
    session_id: str | None = Field(
        default=None,
        description="Optional session ID for multi-turn conversation. If omitted or expired, a new session is initialized.",
    )


def format_sse(event_data: dict[str, Any]) -> str:
    """Helper to format JSON payload as Server-Sent Event."""
    return f"data: {json.dumps(event_data, ensure_ascii=False)}\n\n"


@router.post("/agent", dependencies=[Depends(agent_rate_limiter)])
async def ask_agent(request: AgentQueryRequest):
    """Conversational endpoint with streaming responses and server-side session management."""
    active_session_id = request.session_id or str(uuid.uuid4())
    session, _ = session_cache.get_or_create(
        active_session_id,
        lambda sid: agent.create_session(session_id=sid),
    )

    async def generate_response():
        full_response: list[str] = []
        recorded_blocks: list[dict[str, Any]] = []
        stream_started = False
        text_streamed = False

        async def stream_agent():
            nonlocal stream_started, text_streamed
            tool_call_state: dict[str, dict[str, Any]] = {}

            async for chunk in agent.run(
                request.query, session=session, stream=True
            ):
                for c in chunk.contents:
                    c_type = getattr(c, "type", None)

                    if c_type == "text":
                        text_val = getattr(c, "text", "")
                        if text_val:
                            stream_started = True
                            text_streamed = True
                            full_response.append(text_val)

                            # Group contiguous text chunks into one text block
                            if recorded_blocks and recorded_blocks[-1]["type"] == "text":
                                recorded_blocks[-1]["content"] += text_val
                            else:
                                recorded_blocks.append({"type": "text", "content": text_val})

                            yield format_sse({"type": "text", "delta": text_val})

                    elif c_type == "function_call":
                        stream_started = True
                        call_id = getattr(c, "call_id", None) or str(uuid.uuid4())
                        name = getattr(c, "name", None)
                        raw_args = getattr(c, "arguments", None)

                        if call_id not in tool_call_state:
                            tool_block = {
                                "type": "tool_call",
                                "id": call_id,
                                "name": name or "tool",
                                "args": {},
                                "status": "running",
                            }
                            recorded_blocks.append(tool_block)
                            tool_call_state[call_id] = {
                                "name": name or "tool",
                                "raw_args": "",
                                "args": {},
                                "block": tool_block,
                                "emitted": False,
                            }

                        entry = tool_call_state[call_id]
                        if name and entry["name"] == "tool":
                            entry["name"] = name
                            entry["block"]["name"] = name

                        # Accumulate arguments
                        if isinstance(raw_args, str):
                            entry["raw_args"] += raw_args
                            try:
                                parsed = json.loads(entry["raw_args"])
                                if isinstance(parsed, dict):
                                    entry["args"] = parsed
                                    entry["block"]["args"] = parsed
                            except Exception:
                                pass
                        elif isinstance(raw_args, dict):
                            entry["args"] = raw_args
                            entry["block"]["args"] = raw_args

                        # Emit initial event on start, or emit update once args are fully parsed
                        if not entry["emitted"]:
                            entry["emitted"] = True
                            yield format_sse({
                                "type": "tool_call",
                                "id": call_id,
                                "name": entry["name"],
                                "args": entry["args"],
                                "status": "running",
                            })
                        elif entry["args"] and entry["block"].get("_last_emitted_args") != entry["args"]:
                            entry["block"]["_last_emitted_args"] = entry["args"]
                            yield format_sse({
                                "type": "tool_call",
                                "id": call_id,
                                "name": entry["name"],
                                "args": entry["args"],
                                "status": "running",
                            })

                    elif c_type == "function_result":
                        stream_started = True
                        call_id = getattr(c, "call_id", None)

                        # Finalize args if not yet parsed
                        final_args = None
                        if call_id and call_id in tool_call_state:
                            entry = tool_call_state[call_id]
                            if not entry["args"] and entry["raw_args"]:
                                try:
                                    entry["args"] = json.loads(entry["raw_args"])
                                except Exception:
                                    entry["args"] = entry["raw_args"].strip()
                                entry["block"]["args"] = entry["args"]
                            final_args = entry["args"]

                        for b in recorded_blocks:
                            if b.get("type") == "tool_call" and b.get("id") == call_id:
                                b["status"] = "completed"
                                b.pop("_last_emitted_args", None)
                                break

                        yield format_sse({
                            "type": "tool_result",
                            "call_id": call_id,
                            "name": getattr(c, "name", None),
                            "args": final_args,
                        })

        try:
            async for sse_chunk in stream_agent():
                yield sse_chunk

            # Safeguard: If agent executed tools but produced no text answer
            if not "".join(full_response).strip():
                logger.warning(
                    f"Agent produced no text answer for query '{request.query}'. Running synthesis recovery..."
                )
                synthesis_prompt = (
                    f"Synthesize the documentation retrieved from tools and directly answer the following user question in full detail: {request.query}"
                )
                async for chunk in agent.run(
                    synthesis_prompt, session=session, stream=True
                ):
                    for c in chunk.contents:
                        if getattr(c, "type", None) == "text":
                            t_val = getattr(c, "text", "")
                            if t_val:
                                text_streamed = True
                                full_response.append(t_val)
                                if recorded_blocks and recorded_blocks[-1]["type"] == "text":
                                    recorded_blocks[-1]["content"] += t_val
                                else:
                                    recorded_blocks.append({"type": "text", "content": t_val})
                                yield format_sse({"type": "text", "delta": t_val})

            yield format_sse({"type": "done"})
        except Exception as exc:
            err_str = str(exc).lower()
            is_corrupted_thread = (
                "no tool output found" in err_str
                or "invalid_request_error" in err_str
                or "previous_response_id" in err_str
            )
            logger.warning(
                f"Execution failed (corrupted_thread={is_corrupted_thread}, text_streamed={text_streamed}): {exc}"
            )

            # Retry on clean thread if thread state became invalid and no text was committed yet
            if is_corrupted_thread and not text_streamed:
                logger.warning(
                    f"Session {active_session_id} thread state invalid. Resetting service_session_id and retrying..."
                )
                session.service_session_id = None
                try:
                    async for sse_chunk in stream_agent():
                        yield sse_chunk
                    yield format_sse({"type": "done"})
                    return
                except Exception as retry_exc:
                    logger.error(f"Clean-thread retry failed: {retry_exc}")

            # Terminal Fallback
            session.service_session_id = None
            logger.error(f"Error during agent execution: {exc}")
            err_msg = (
                "\nI encountered a temporary service issue while retrieving documentation. "
                "Please try again in a moment, or feel free to contact Aryan directly via "
                "[LinkedIn](https://www.linkedin.com/in/aryxenv/) or [email](mailto:aryanshah0514@gmail.com)."
            )
            full_response.append(err_msg)
            if recorded_blocks and recorded_blocks[-1]["type"] == "text":
                recorded_blocks[-1]["content"] += err_msg
            else:
                recorded_blocks.append({"type": "text", "content": err_msg})
            yield format_sse({"type": "text", "delta": err_msg})
            yield format_sse({"type": "error", "message": err_msg})
            yield format_sse({"type": "done"})

        # Record user and assistant turn in session state for history retrieval
        if full_response or recorded_blocks:
            for b in recorded_blocks:
                b.pop("_last_emitted_args", None)
            if "messages" not in session.state:
                session.state["messages"] = []
            session.state["messages"].append({"role": "user", "content": request.query})
            session.state["messages"].append({
                "role": "assistant",
                "content": "".join(full_response).strip(),
                "blocks": recorded_blocks,
            })

    return StreamingResponse(
        generate_response(),
        media_type="text/event-stream",
        headers={
            "X-Session-ID": active_session_id,
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/agent/history")
async def get_agent_history(session_id: str):
    """Retrieve clean conversation history for a given session."""
    session = session_cache.get(session_id)
    if session is None:
        return {"session_id": session_id, "messages": []}

    clean_messages: list[dict[str, Any]] = []
    messages = session.state.get("messages", [])
    if not messages and "in_memory" in session.state:
        messages = session.state["in_memory"].get("messages", [])

    for msg in messages:
        if isinstance(msg, dict):
            clean_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", ""),
                "blocks": msg.get("blocks", []),
            })
        else:
            role = getattr(msg, "role", None)
            if role in ("user", "assistant"):
                text = " ".join(
                    [c.text for c in getattr(msg, "contents", []) if hasattr(c, "text") and c.text]
                ).strip()
                if text:
                    clean_messages.append({"role": role, "content": text, "blocks": []})

    return {"session_id": session_id, "messages": clean_messages}


@router.delete("/agent/history")
async def clear_agent_history(session_id: str):
    """Clear session from server cache."""
    cleared = session_cache.delete(session_id)
    return {"session_id": session_id, "cleared": cleared}