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

# Support both absolute and package-relative imports
try:
    from utils.tools import inspect_metadata_options, vector_search, vector_search_cosmosdb
    from utils.rate_limiter import agent_rate_limiter
except ImportError:
    from server.utils.tools import inspect_metadata_options, vector_search, vector_search_cosmosdb  # type: ignore[no-redef]
    from server.utils.rate_limiter import agent_rate_limiter  # type: ignore[no-redef]

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


class ChatMessage(BaseModel):
    role: str = Field(description="Role: 'user' or 'assistant'.")
    content: str = Field(description="Text content of the message.")


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(
        description="Chronological conversation message history."
    )


@router.post("/agent", dependencies=[Depends(agent_rate_limiter)])
async def ask_agent_chat(request: ChatRequest):
    """Multi-turn conversational endpoint preserving message history."""
    # Bounded to the last 6 turns to keep context fast, relevant and cost-effective
    formatted_messages = [
        Message(role=m.role, contents=[m.content])
        for m in request.messages[-6:]
    ]

    async def generate_response():
        async for chunk in agent.run(formatted_messages, stream=True):
            if chunk.text:
                yield chunk.text

    return StreamingResponse(generate_response(), media_type="text/plain")