"""CI/CD Incremental RAG Indexing Script.

Designed to run inside a GitHub Actions workflow after a push/merge to main.
Detects which rag/content/ files changed (added, modified, deleted) via
``git diff``, computes content hashes to skip genuinely unchanged files, and
runs upsert-based re-indexing into both Azure AI Search and Cosmos DB.

Deleted files have their stale chunks purged from both stores.
Modified files have previous chunks cleaned up before re-upload to avoid
orphaned chunks when chunk count decreases.

Usage (from the rag/ directory):
    uv run ci_index.py                            # auto-detect changes via git
    uv run ci_index.py --files content/about/bio.md content/projects/chess-ai-nnue.md
    uv run ci_index.py --all                      # full re-index of everything
    uv run ci_index.py --dry-run                   # parse only, no cloud calls
"""
from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

# Ensure rag/ root is importable
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
sys.path.insert(0, str(BASE_DIR))

from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient

from config import (
    DEFAULT_AZURE_OPENAI_BASE_URL,
    DEFAULT_AZURE_SUBSCRIPTION_ID,
    DEFAULT_COSMOS_ACCOUNT_NAME,
    DEFAULT_COSMOS_CONTAINER_NAME,
    DEFAULT_COSMOS_DATABASE_NAME,
    DEFAULT_COSMOS_ENDPOINT,
    DEFAULT_COSMOS_RESOURCE_GROUP,
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
    DEFAULT_INDEX_NAME,
    DEFAULT_SEARCH_ENDPOINT,
    EMBEDDING_BATCH_SIZE,
    UPLOAD_BATCH_SIZE,
)
from parser import collect_markdown_documents, collect_single_file, parse_markdown_file
from embeddings import initialize_openai_client, generate_embeddings

# Silence non-critical Azure SDK warning
logging.getLogger("azure.search.documents._utils.model_base").setLevel(logging.ERROR)

# ---------------------------------------------------------------------------
# Content Hashing & Metadata Cache for Upsert-Skip
# ---------------------------------------------------------------------------

HASH_CACHE_PATH = BASE_DIR / ".content_hashes.json"


def compute_file_hash(file_path: Path) -> str:
    """Compute SHA-256 of a file's contents for change detection."""
    hasher = hashlib.sha256()
    hasher.update(file_path.read_bytes())
    return hasher.hexdigest()


def get_repo_relative_path(file_path: Path) -> str:
    """Return POSIX path relative to repository root for cross-platform portability."""
    try:
        return file_path.resolve().relative_to(REPO_ROOT.resolve()).as_posix()
    except ValueError:
        return file_path.as_posix()


def load_hash_cache() -> dict[str, dict[str, str]]:
    """Load the persisted content hash cache from disk."""
    if HASH_CACHE_PATH.is_file():
        try:
            raw = json.loads(HASH_CACHE_PATH.read_text(encoding="utf-8"))
            cache: dict[str, dict[str, str]] = {}
            for k, v in raw.items():
                if isinstance(v, dict):
                    cache[k] = v
                elif isinstance(v, str):
                    # Backwards compatibility with simple hash strings
                    cache[k] = {"hash": v, "doc_id": Path(k).stem}
            return cache
        except (json.JSONDecodeError, OSError) as err:
            print(f"[WARN] Failed to read hash cache: {err}")
    return {}


def save_hash_cache(cache: dict[str, dict[str, str]]) -> None:
    """Persist the content hash cache to disk."""
    try:
        HASH_CACHE_PATH.write_text(
            json.dumps(cache, indent=2, sort_keys=True), encoding="utf-8"
        )
    except OSError as err:
        print(f"[WARN] Failed to write hash cache: {err}")


# ---------------------------------------------------------------------------
# Git-Based Change Detection
# ---------------------------------------------------------------------------


def detect_changed_files() -> tuple[list[Path], list[Path]]:
    """Detect added/modified and deleted rag/content/ files via git diff.

    Checks GIT_DIFF_BASE env var (e.g. from GitHub Actions github.event.before),
    falling back to HEAD~1. If git is unavailable or diff fails, returns ([], []).

    Returns:
        (changed_files, deleted_files) – both as absolute Paths.
    """
    diff_base = os.getenv("GIT_DIFF_BASE", "").strip()
    if not diff_base or diff_base.startswith("00000000"):
        diff_base = "HEAD~1"

    print(f"[INFO] Running git diff against base '{diff_base}' for rag/content/...")
    try:
        result = subprocess.run(
            [
                "git", "diff", "--name-status", "--diff-filter=ADMR",
                diff_base, "HEAD", "--", "rag/content/",
            ],
            capture_output=True,
            text=True,
            cwd=str(REPO_ROOT),
            check=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as err:
        print(f"[WARN] git diff against '{diff_base}' failed ({err}).")
        # Try HEAD~1 as fallback if diff_base was custom
        if diff_base != "HEAD~1":
            try:
                print("[INFO] Retrying git diff with 'HEAD~1'...")
                result = subprocess.run(
                    [
                        "git", "diff", "--name-status", "--diff-filter=ADMR",
                        "HEAD~1", "HEAD", "--", "rag/content/",
                    ],
                    capture_output=True,
                    text=True,
                    cwd=str(REPO_ROOT),
                    check=True,
                )
            except Exception:
                return [], []
        else:
            return [], []

    changed: list[Path] = []
    deleted: list[Path] = []

    for line in result.stdout.strip().splitlines():
        if not line.strip():
            continue
        parts = line.split("\t", maxsplit=1)
        if len(parts) < 2:
            continue
        status, filepath = parts[0].strip(), parts[-1].strip()
        abs_path = (REPO_ROOT / filepath).resolve()

        if status.startswith("D"):
            deleted.append(abs_path)
        else:
            # A (added), M (modified), R (renamed)
            if abs_path.is_file() and abs_path.suffix.lower() == ".md":
                changed.append(abs_path)

    print(f"[INFO] Git detected {len(changed)} changed and {len(deleted)} deleted file(s) in rag/content/.")
    return changed, deleted


# ---------------------------------------------------------------------------
# Stale Chunk Cleanup
# ---------------------------------------------------------------------------


def get_doc_id_for_file(file_path: Path, hash_cache: dict[str, dict[str, str]]) -> str:
    """Determine the doc_id of a file, using frontmatter or hash cache fallback."""
    if file_path.is_file():
        try:
            fm, _ = parse_markdown_file(file_path)
            if fm.get("id"):
                return str(fm["id"])
        except Exception:
            pass
    rel_key = get_repo_relative_path(file_path)
    cached = hash_cache.get(rel_key)
    if cached and cached.get("doc_id"):
        return cached["doc_id"]
    return file_path.stem


def purge_doc_chunks_from_ai_search(
    search_client: SearchClient,
    doc_ids: set[str],
) -> None:
    """Delete chunks for given doc_ids from Azure AI Search."""
    for doc_id in doc_ids:
        try:
            results = list(
                search_client.search(
                    search_text="*",
                    filter=f"doc_id eq '{doc_id}'",
                    select=["chunk_id"],
                    top=1000,
                )
            )
            if results:
                keys = [{"chunk_id": r["chunk_id"]} for r in results]
                search_client.delete_documents(documents=keys)
                print(f"[INFO] Deleted {len(keys)} chunks for '{doc_id}' from AI Search.")
        except Exception as err:
            print(f"[WARN] Failed to purge '{doc_id}' from AI Search: {err}")


def purge_doc_chunks_from_cosmos(
    container_client: Any,
    doc_ids: set[str],
) -> None:
    """Delete chunks for given doc_ids from Cosmos DB."""
    for doc_id in doc_ids:
        try:
            query = "SELECT c.id FROM c WHERE c.doc_id = @doc_id"
            items = list(
                container_client.query_items(
                    query=query,
                    parameters=[{"name": "@doc_id", "value": doc_id}],
                    enable_cross_partition_query=True,
                )
            )
            for item in items:
                container_client.delete_item(item=item["id"], partition_key=doc_id)
            if items:
                print(f"[INFO] Deleted {len(items)} chunks for '{doc_id}' from Cosmos DB.")
        except Exception as err:
            print(f"[WARN] Failed to purge '{doc_id}' from Cosmos DB: {err}")


# ---------------------------------------------------------------------------
# Incremental Change Filter via Hash Matching
# ---------------------------------------------------------------------------


def filter_unchanged_files(
    files: list[Path], hash_cache: dict[str, dict[str, str]]
) -> list[Path]:
    """Filter out files whose content hash hasn't changed since last run."""
    truly_changed: list[Path] = []
    for f in files:
        if not f.is_file():
            continue
        current_hash = compute_file_hash(f)
        cache_key = get_repo_relative_path(f)
        cached_info = hash_cache.get(cache_key)
        cached_hash = cached_info.get("hash") if cached_info else None
        if cached_hash == current_hash:
            print(f"[SKIP] {f.name} – content unchanged (hash match).")
        else:
            truly_changed.append(f)
    return truly_changed


def update_hash_cache_for_files(
    files: list[Path], hash_cache: dict[str, dict[str, str]]
) -> None:
    """Update the hash cache with current hashes and doc_ids of indexed files."""
    for f in files:
        if f.is_file():
            doc_id = get_doc_id_for_file(f, hash_cache)
            cache_key = get_repo_relative_path(f)
            hash_cache[cache_key] = {
                "hash": compute_file_hash(f),
                "doc_id": doc_id,
            }


def remove_deleted_from_hash_cache(
    deleted_files: list[Path], hash_cache: dict[str, dict[str, str]]
) -> None:
    """Remove deleted files from the hash cache."""
    for f in deleted_files:
        cache_key = get_repo_relative_path(f)
        hash_cache.pop(cache_key, None)


# ---------------------------------------------------------------------------
# CLI Argument Parsing
# ---------------------------------------------------------------------------


def parse_args(args: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="CI/CD incremental RAG content indexer",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--files", nargs="+", default=None,
        help="Explicit list of rag/content/ files to re-index (relative or absolute).",
    )
    parser.add_argument(
        "--all", action="store_true", dest="full_reindex",
        help="Force a full re-index of all content instead of incremental.",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Parse and chunk only; no Azure API calls.",
    )
    parser.add_argument(
        "--skip-ai-search", action="store_true",
        help="Skip Azure AI Search indexing (only index Cosmos DB).",
    )
    parser.add_argument(
        "--skip-cosmos", action="store_true",
        help="Skip Cosmos DB indexing (only index AI Search).",
    )
    parser.add_argument(
        "--skip-hash-check", action="store_true",
        help="Skip content hash comparison (re-index even if hash matches).",
    )
    return parser.parse_args(args)


# ---------------------------------------------------------------------------
# Main Pipeline
# ---------------------------------------------------------------------------


def main(cli_args: list[str] | None = None) -> None:
    opts = parse_args(cli_args)

    print("=" * 60)
    print("CI/CD Incremental RAG Indexing Pipeline")
    print("=" * 60)

    hash_cache = load_hash_cache()
    deleted_files: list[Path] = []
    files_to_index: list[Path] = []

    # ------- Determine files to process -------
    if opts.full_reindex:
        print("[MODE] Full re-index requested.")
        all_chunks = collect_markdown_documents(BASE_DIR)
        content_dir = BASE_DIR / "content"
        if content_dir.is_dir():
            files_to_index = sorted(p for p in content_dir.rglob("*") if p.is_file() and p.suffix.lower() == ".md")
    elif opts.files:
        print(f"[MODE] Explicit file list: {len(opts.files)} file(s).")
        for f in opts.files:
            p = Path(f)
            abs_p = (BASE_DIR / p).resolve() if not p.is_absolute() else p.resolve()
            if abs_p.is_file():
                files_to_index.append(abs_p)
            else:
                # Might be a deleted file to clean up
                deleted_files.append(abs_p)
        all_chunks = None
    else:
        print("[MODE] Auto-detecting changes via git diff...")
        changed_files, deleted_files = detect_changed_files()
        if not changed_files and not deleted_files:
            print("[INFO] No changes detected via git diff. Falling back to full scan.")
            all_chunks = collect_markdown_documents(BASE_DIR)
            content_dir = BASE_DIR / "content"
            if content_dir.is_dir():
                files_to_index = sorted(p for p in content_dir.rglob("*") if p.is_file() and p.suffix.lower() == ".md")
        else:
            files_to_index = changed_files
            all_chunks = None

    # ------- Hash-based skip for incremental mode -------
    if not opts.full_reindex and files_to_index:
        if not opts.skip_hash_check:
            files_to_index = filter_unchanged_files(files_to_index, hash_cache)
        if not files_to_index and not deleted_files:
            print("[INFO] All changed files matched cached hashes. No re-indexing needed.")
            return

    # ------- Parse changed files -------
    if not opts.full_reindex and files_to_index:
        print(f"[INFO] Parsing {len(files_to_index)} changed file(s)...")
        all_chunks_list: list[dict[str, Any]] = []
        for fp in files_to_index:
            chunks = collect_single_file(fp)
            all_chunks_list.extend(chunks)
        all_chunks = all_chunks_list if all_chunks_list else None

    # Collect doc_ids for purging
    deleted_doc_ids: set[str] = set()
    for df in deleted_files:
        d_id = get_doc_id_for_file(df, hash_cache)
        deleted_doc_ids.add(d_id)
        deleted_doc_ids.add(df.stem)  # Also purge stem as safety

    modified_doc_ids: set[str] = set()
    if all_chunks and not opts.full_reindex:
        for c in all_chunks:
            if c.get("doc_id"):
                modified_doc_ids.add(c["doc_id"])

    if all_chunks:
        print(f"[INFO] Total chunks to index: {len(all_chunks)}")
    elif not deleted_doc_ids:
        print("[INFO] No chunks to index and no files to delete. Exiting.")
        return
    else:
        print(f"[INFO] No new chunks to index, but {len(deleted_doc_ids)} doc_id(s) to purge: {deleted_doc_ids}")

    # ------- Dry-run exit -------
    if opts.dry_run:
        if all_chunks:
            print(f"\n[DRY-RUN] Parsed {len(all_chunks)} chunks successfully.")
            for c in all_chunks[:5]:
                print(f"  • {c['chunk_id']}: {c['title']} > {c['header']}")
            if len(all_chunks) > 5:
                print(f"  ... and {len(all_chunks) - 5} more.")
        if deleted_doc_ids:
            print(f"[DRY-RUN] Would purge chunks for deleted docs: {deleted_doc_ids}")
        if modified_doc_ids:
            print(f"[DRY-RUN] Would clear old chunks for modified docs: {modified_doc_ids}")
        print("[DRY-RUN] Exiting without cloud operations.")
        return

    # ------- Azure Authentication -------
    print("[INFO] Authenticating via DefaultAzureCredential...")
    credential = DefaultAzureCredential()

    # ------- Generate Embeddings -------
    openai_client = None
    if all_chunks:
        openai_client = initialize_openai_client(
            credential=credential,
            foundry_endpoint=DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
            openai_base_url=DEFAULT_AZURE_OPENAI_BASE_URL,
        )
        generate_embeddings(
            openai_client=openai_client,
            chunks=all_chunks,
            model_name=DEFAULT_EMBEDDING_MODEL,
            batch_size=EMBEDDING_BATCH_SIZE,
        )

    # ------- Azure AI Search -------
    if not opts.skip_ai_search:
        from ai_search.search import create_or_update_index, upload_documents_to_search

        print("\n--- Azure AI Search Indexing ---")
        index_client = SearchIndexClient(
            endpoint=DEFAULT_SEARCH_ENDPOINT, credential=credential,
        )
        create_or_update_index(index_client, DEFAULT_INDEX_NAME)

        search_client = SearchClient(
            endpoint=DEFAULT_SEARCH_ENDPOINT,
            index_name=DEFAULT_INDEX_NAME,
            credential=credential,
        )

        # Purge deleted files
        if deleted_doc_ids:
            purge_doc_chunks_from_ai_search(search_client, deleted_doc_ids)

        # For modified files in incremental mode, clear existing chunks first
        # so chunk count reductions do not leave orphaned chunks behind
        if modified_doc_ids:
            purge_doc_chunks_from_ai_search(search_client, modified_doc_ids)

        # Upsert fresh chunks
        if all_chunks:
            upload_documents_to_search(
                search_client=search_client,
                chunks=all_chunks,
                batch_size=UPLOAD_BATCH_SIZE,
            )
        print("[INFO] Azure AI Search indexing complete.")

    # ------- Cosmos DB -------
    if not opts.skip_cosmos:
        from cosmosdb.cosmos import create_or_update_cosmos_resources, upload_documents_to_cosmos

        print("\n--- Cosmos DB Indexing ---")
        _, container_client = create_or_update_cosmos_resources(
            credential=credential,
            account_name=DEFAULT_COSMOS_ACCOUNT_NAME,
            database_name=DEFAULT_COSMOS_DATABASE_NAME,
            container_name=DEFAULT_COSMOS_CONTAINER_NAME,
            cosmos_endpoint=DEFAULT_COSMOS_ENDPOINT,
            resource_group=DEFAULT_COSMOS_RESOURCE_GROUP,
            subscription_id=DEFAULT_AZURE_SUBSCRIPTION_ID,
        )

        # Purge deleted files
        if deleted_doc_ids:
            purge_doc_chunks_from_cosmos(container_client, deleted_doc_ids)

        # For modified files in incremental mode, clear existing chunks first
        if modified_doc_ids:
            purge_doc_chunks_from_cosmos(container_client, modified_doc_ids)

        # Upsert fresh chunks
        if all_chunks:
            upload_documents_to_cosmos(
                container_client=container_client,
                chunks=all_chunks,
                batch_size=UPLOAD_BATCH_SIZE,
            )
        print("[INFO] Cosmos DB indexing complete.")

    # ------- Update Hash Cache -------
    if files_to_index:
        update_hash_cache_for_files(files_to_index, hash_cache)
    if deleted_files:
        remove_deleted_from_hash_cache(deleted_files, hash_cache)
    save_hash_cache(hash_cache)

    print("\n" + "=" * 60)
    print("CI/CD Incremental RAG Indexing Complete")
    print("=" * 60)


if __name__ == "__main__":
    main()
