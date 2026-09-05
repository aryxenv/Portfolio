from __future__ import annotations
import time
from typing import Any
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from config import EMBEDDING_DIMENSIONS, EMBEDDING_BATCH_SIZE, DEFAULT_EMBEDDING_MODEL

# ---------------------------------------------------------------------------
# Embedding Generation via AIProjectClient
# ---------------------------------------------------------------------------

def initialize_openai_client(
    credential: DefaultAzureCredential,
    foundry_endpoint: str,
    openai_base_url: str,
) -> Any:
    """Initialize authenticated OpenAI client through AIProjectClient."""
    print(f"[INFO] Initializing AIProjectClient with endpoint: {foundry_endpoint}")
    project_client = AIProjectClient(
        endpoint=foundry_endpoint,
        credential=credential,
    )
    print(f"[INFO] Acquiring OpenAI client pointing to: {openai_base_url}")
    return project_client.get_openai_client(base_url=openai_base_url)


def generate_embeddings(
    openai_client: Any,
    chunks: list[dict[str, Any]],
    model_name: str = DEFAULT_EMBEDDING_MODEL,
    batch_size: int = EMBEDDING_BATCH_SIZE,
    max_retries: int = 5,
) -> None:
    """Generate dense vector embeddings for all chunks in batches with backoff.
    
    Guards against empty/whitespace input strings and token length limits,
    and sorts returned embeddings by index to preserve 1:1 chunk mapping.
    """
    if not chunks:
        print("[INFO] No chunks provided for embedding generation.")
        return

    print(
        f"[INFO] Generating embeddings using '{model_name}' ({EMBEDDING_DIMENSIONS} dims) "
        f"for {len(chunks)} chunks..."
    )
    
    MAX_EMBEDDING_CHARS = 24000  # Conservative bound well within 8192 token limit
    total = len(chunks)
    
    def embed_batch_recursive(batch: list[dict[str, Any]], start_idx: int, end_idx: int, depth: int = 0) -> None:
        if not batch:
            return

        # Prepare and sanitize input texts (OpenAI rejects empty strings with 400 BadRequest)
        input_texts: list[str] = []
        for c in batch:
            raw_input = c.get("_embedding_input", "")
            cleaned = raw_input.strip() if isinstance(raw_input, str) else ""
            if not cleaned:
                title = c.get("title") or "Document"
                header = c.get("header") or "Section"
                content = c.get("content") or ""
                cleaned = f"Title: {title}\nSection: {header}\n{content}".strip() or f"Document: {title}"
            if len(cleaned) > MAX_EMBEDDING_CHARS:
                print(f"[WARN] Truncating oversized chunk {c.get('chunk_id')} from {len(cleaned)} to {MAX_EMBEDDING_CHARS} characters.")
                cleaned = cleaned[:MAX_EMBEDDING_CHARS]
            input_texts.append(cleaned)

        for attempt in range(1, max_retries + 1):
            try:
                response = openai_client.embeddings.create(
                    model=model_name,
                    input=input_texts,
                )
                sorted_data = sorted(response.data, key=lambda x: getattr(x, "index", 0))
                for item, chunk in zip(sorted_data, batch):
                    chunk["content_vector"] = item.embedding
                print(f"[INFO] Embedded chunks {start_idx + 1}-{end_idx} of {total}")
                break
            except Exception as err:
                if attempt < max_retries:
                    wait_sec = attempt * 3
                    print(f"[WARN] Embedding batch {start_idx + 1}-{end_idx} attempt {attempt} failed: {err}. Retrying in {wait_sec}s...")
                    time.sleep(wait_sec)
                else:
                    if len(batch) > 1 and depth < 3:
                        mid = len(batch) // 2
                        print(f"[WARN] Splitting failing embedding batch of {len(batch)} into sub-batches of {mid} and {len(batch)-mid}...")
                        embed_batch_recursive(batch[:mid], start_idx, start_idx + mid, depth + 1)
                        embed_batch_recursive(batch[mid:], start_idx + mid, end_idx, depth + 1)
                        return
                    print(f"[ERROR] Embedding batch {start_idx + 1}-{end_idx} failed after {max_retries} attempts: {err}")
                    raise

    for start_idx in range(0, total, batch_size):
        end_idx = min(start_idx + batch_size, total)
        batch = chunks[start_idx:end_idx]
        embed_batch_recursive(batch, start_idx, end_idx)

