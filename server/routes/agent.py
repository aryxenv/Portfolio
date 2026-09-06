"""Portfolio Agent Route and Initialization.

Configures the portfolio assistant agent using Microsoft Agent Framework,
powered by Groq for ultra-low latency inference and wired to Azure AI Search
and Azure Cosmos DB hybrid RAG tools with metadata filtering.
"""
from __future__ import annotations

import os
from agent_framework import Agent, Message
from agent_framework_foundry import FoundryChatClient
from azure.identity import DefaultAzureCredential
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import uuid

# Support both absolute and package-relative imports
try:
    from utils.tools import inspect_metadata_options, vector_search, vector_search_cosmosdb
    from utils.rate_limiter import agent_rate_limiter
    from utils.session_cache import session_cache
except ImportError:
    from server.utils.tools import inspect_metadata_options, vector_search, vector_search_cosmosdb  # type: ignore[no-redef]
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
   - Example: For "Can you tell me how Aryan handled AKS agent governance?", execute search with `query="AKS agent governance architecture sidecar"`.
2. **Search Strategy & Metadata Filtering**:
   - Execute a hybrid search immediately using `vector_search` when the topic, company or context is evident.
   - Use `inspect_metadata_options` selectively: call it only when a query involves broad categories, when you need to verify exact tag casing or when an initial search returns zero or irrelevant results.
   - Apply filters (`company`, `doc_type`, `tech`, `week_number` or `doc_id`) only when directly relevant to avoid over-constraining results.
3. **Iterative Multi-Hop Retrieval (Max Depth: 3)**:
   - Evaluate returned chunks. If details are incomplete, cross-reference by formulating a more specific query or adjusting filters.
   - You may call tools up to a maximum of 3 times per user turn.
   - Stop searching as soon as you have gathered sufficient technical facts to answer thoroughly.
4. **Truthfulness & Unknowns**:
   - Ground all answers strictly in retrieved documentation. Never invent metrics, roles or architectural decisions.
   - If after reaching the 3-step limit (or if searches yield no results) the required information is absent, state plainly:
     "I could not find records on that in Aryan's portfolio documentation. Feel free to contact him directly via [LinkedIn](https://www.linkedin.com/in/aryxenv/) or [email](mailto:aryanshah0514@gmail.com)."
5. **Tone & Style Guidelines**:
   - **Precise, technical and understated**: Confident, direct and factual.
   - **No filler or hype**: Avoid buzzwords ("passionate developer", "rockstar", "game-changer", "deep dive"). State the architecture, technical decisions and measurable outcomes.
   - **Recruiter & Engineer Legible**: Lead with a concise high-signal summary followed by concrete architectural details and relevant markdown links from retrieved chunks.
   - **No em-dashes or oxford-commas**: Strictly avoid em-dashes and oxford-commas in all responses.
"""

client = FoundryChatClient(
    project_endpoint=os.getenv("FOUNDRY_PROJECT_ENDPOINT", "https://ai-portfolio-resource.services.ai.azure.com/api/projects/ai-portfolio"),
    model=os.getenv("FOUNDRY_MODEL", "DeepSeek-V4-Flash-0731"),
    credential=DefaultAzureCredential(),
)

agent = Agent(
    client=client,
    name="PortfolioAgent",
    instructions=PORTFOLIO_SYSTEM_PROMPT,
    tools=[vector_search, inspect_metadata_options], # in tools.py change vector_search_cosmosdb to vector_search name if you want to use cosmosdb instead of azure AI search
)

router = APIRouter()


class AgentQueryRequest(BaseModel):
    query: str = Field(description="User technical inquiry.")
    session_id: str | None = Field(
        default=None,
        description="Optional session ID for multi-turn conversation. If omitted or expired, a new session is initialized.",
    )


@router.post("/agent", dependencies=[Depends(agent_rate_limiter)])
async def ask_agent(request: AgentQueryRequest):
    """Conversational endpoint using native Microsoft Agent Framework AgentSession."""
    active_session_id = request.session_id or str(uuid.uuid4())
    session, _ = session_cache.get_or_create(
        active_session_id,
        lambda sid: agent.create_session(session_id=sid),
    )

    async def generate_response():
        full_response: list[str] = []
        async for chunk in agent.run(request.query, session=session, stream=True):
            if chunk.text:
                full_response.append(chunk.text)
                yield chunk.text

        # Record user and assistant turn in session state for history retrieval
        if "messages" not in session.state:
            session.state["messages"] = []
        session.state["messages"].append({"role": "user", "content": request.query})
        session.state["messages"].append({"role": "assistant", "content": "".join(full_response)})

    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={"X-Session-ID": active_session_id},
    )


@router.get("/agent/history")
async def get_agent_history(session_id: str):
    """Retrieve clean conversation history for a given session."""
    session = session_cache.get(session_id)
    if session is None:
        return {"session_id": session_id, "messages": []}

    clean_messages: list[dict[str, str]] = []
    for msg in session.state.get("messages", []):
        if isinstance(msg, dict):
            clean_messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        else:
            role = getattr(msg, "role", None)
            if role in ("user", "assistant"):
                text = " ".join(
                    [c.text for c in getattr(msg, "contents", []) if hasattr(c, "text")]
                ).strip()
                if text:
                    clean_messages.append({"role": role, "content": text})

    return {"session_id": session_id, "messages": clean_messages}


@router.delete("/agent/history")
async def clear_agent_history(session_id: str):
    """Clear session from server cache."""
    cleared = session_cache.delete(session_id)
    return {"session_id": session_id, "cleared": cleared}