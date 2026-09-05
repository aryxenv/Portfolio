from __future__ import annotations
import re
import yaml
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Markdown Parsing & Frontmatter Extraction
# ---------------------------------------------------------------------------

def parse_markdown_file(file_path: Path) -> tuple[dict[str, Any], str]:
    """Parse a Markdown file and extract YAML frontmatter and body content."""
    raw_text = file_path.read_text(encoding="utf-8-sig")
    fm_match = re.match(r"^\s*---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|$)", raw_text, re.DOTALL)
    if fm_match:
        try:
            frontmatter = yaml.safe_load(fm_match.group(1)) or {}
            if not isinstance(frontmatter, dict):
                frontmatter = {}
        except Exception as err:
            print(f"[WARN] Error parsing YAML frontmatter in {file_path}: {err}")
            frontmatter = {}
        body = raw_text[fm_match.end():]
    else:
        frontmatter = {}
        body = raw_text
    return frontmatter, body


# ---------------------------------------------------------------------------
# Header-Aware Markdown Chunking
# ---------------------------------------------------------------------------

def chunk_markdown_by_headers(
    body: str,
    metadata: dict[str, Any],
    file_path: Path,
    max_header_level: int = 3,
) -> list[dict[str, Any]]:
    """Split Markdown body into chunks based on headers (H1, H2, H3).
    
    Tracks code fences (both backticks and tildes with length awareness) to
    prevent code comments starting with '#' from being misidentified as
    Markdown headers.
    """
    lines = body.splitlines()
    header_regex = re.compile(r"^[ ]{0,3}(#{1,6})\s+(.*)$")
    fence_regex = re.compile(r"^[ ]{0,3}(`{3,}|~{3,})(.*)$")
    
    doc_id = str(metadata.get("id") or file_path.stem)
    doc_title = str(metadata.get("title") or file_path.stem)
    
    current_headers: dict[int, str] = {}
    current_level = 0
    current_header = doc_title
    current_lines: list[str] = []
    raw_chunks: list[dict[str, Any]] = []
    in_code_block = False
    active_fence_char = ""
    active_fence_len = 0
    
    def compute_header_path() -> str:
        levels = sorted(k for k in current_headers.keys() if current_headers[k])
        if levels:
            return " > ".join(current_headers[k] for k in levels)
        return doc_title

    for line in lines:
        fence_match = fence_regex.match(line)
        
        if in_code_block:
            if fence_match:
                char = fence_match.group(1)[0]
                length = len(fence_match.group(1))
                info_string = fence_match.group(2).strip()
                # CommonMark: closing fence cannot have an info string or trailing non-whitespace
                if char == active_fence_char and length >= active_fence_len and not info_string:
                    in_code_block = False
                    active_fence_char = ""
                    active_fence_len = 0
            current_lines.append(line)
            continue
            
        if fence_match:
            char = fence_match.group(1)[0]
            length = len(fence_match.group(1))
            info_string = fence_match.group(2)
            # CommonMark: info strings for backtick/tilde fences cannot contain the fence delimiter
            if char not in info_string:
                in_code_block = True
                active_fence_char = char
                active_fence_len = length
                current_lines.append(line)
                continue
            
        header_match = header_regex.match(line)
        if header_match and len(header_match.group(1)) <= max_header_level:
            level = len(header_match.group(1))
            raw_header_text = header_match.group(2).strip()
            # If the header line contains only hashes and whitespace, it has no heading text
            if not re.sub(r"[#\s]", "", raw_header_text):
                current_lines.append(line)
                continue
            # Strip standard ATX closing hashes preceded by whitespace (e.g., "## Title ##")
            # Preserves valid trailing hashes in names such as "C#" or "F#"
            header_text = re.sub(r"\s+#+\s*$", "", raw_header_text).strip()
            
            if header_text:
                # Flush existing accumulated chunk content
                content_text = "\n".join(current_lines).strip()
                if content_text:
                    raw_chunks.append({
                        "header": current_header,
                        "header_path": compute_header_path(),
                        "level": current_level,
                        "content": content_text,
                    })
                    current_lines = []
                
                # Update hierarchical header stack
                current_headers = {
                    k: v for k, v in current_headers.items() if k < level
                }
                current_headers[level] = header_text
                current_level = level
                current_header = header_text
                continue
                
        current_lines.append(line)
        
    # Flush trailing content
    content_text = "\n".join(current_lines).strip()
    if content_text:
        raw_chunks.append({
            "header": current_header,
            "header_path": compute_header_path(),
            "level": current_level,
            "content": content_text,
        })

    # If no content existed, return nothing
    if not raw_chunks:
        return []

    # Format and enrich final chunk documents
    total_chunks = len(raw_chunks)
    processed_chunks: list[dict[str, Any]] = []
    
    # Safe key prefix
    clean_id = doc_id or "doc"
    sanitized_doc_id = re.sub(r"[^a-zA-Z0-9_\-=]", "_", clean_id)

    def normalize_list(val: Any) -> list[str]:
        if isinstance(val, list):
            return [str(item).strip() for item in val if item is not None and str(item).strip()]
        if isinstance(val, str) and val.strip():
            return [val.strip()]
        return []

    def parse_optional_int(val: Any) -> int | None:
        if val is None:
            return None
        try:
            return int(val)
        except (ValueError, TypeError):
            return None

    def parse_optional_bool(val: Any) -> bool | None:
        if val is None:
            return None
        if isinstance(val, bool):
            return val
        if isinstance(val, (int, float)):
            return bool(val)
        if isinstance(val, str):
            lower = val.strip().lower()
            if lower in ("true", "1", "yes"):
                return True
            if lower in ("false", "0", "no"):
                return False
            return None
        return None

    tech_stack = normalize_list(metadata.get("tech_stack"))
    tags = normalize_list(metadata.get("tags"))
    personal_interests = normalize_list(metadata.get("personal_interests"))
    week_number = parse_optional_int(metadata.get("week_number"))
    nda_redacted = parse_optional_bool(metadata.get("nda_redacted"))
    has_external_logs = parse_optional_bool(metadata.get("has_external_logs"))

    # Determine relative source path (normalized to POSIX forward slashes)
    source_val = metadata.get("source")
    if not source_val:
        try:
            base_dir = Path(__file__).resolve().parent
            source_val = file_path.relative_to(base_dir).as_posix()
        except Exception:
            source_val = file_path.as_posix()
    else:
        source_val = str(source_val).replace("\\", "/")

    for idx, c in enumerate(raw_chunks):
        chunk_id = f"{sanitized_doc_id}_{idx}"
        chunk_content = c["content"]
        header = c["header"]
        header_path = c["header_path"]
        
        # Build contextual text for embedding generation
        meta_descriptors = []
        if metadata.get("type"):
            meta_descriptors.append(f"Type: {metadata.get('type')}")
        if metadata.get("category"):
            meta_descriptors.append(f"Category: {metadata.get('category')}")
        if metadata.get("company"):
            meta_descriptors.append(f"Company: {metadata.get('company')}")
        if week_number is not None:
            meta_descriptors.append(f"Week: {week_number}")
            
        meta_line = " | ".join(meta_descriptors) if meta_descriptors else ""
        raw_embedding_text = (
            f"Title: {doc_title}\n"
            f"Section: {header_path}\n"
            + (f"{meta_line}\n\n" if meta_line else "\n")
            + f"{chunk_content}"
        )
        enriched_embedding_text = raw_embedding_text.strip() or f"Title: {doc_title}\nSection: {header_path}"

        doc: dict[str, Any] = {
            "chunk_id": chunk_id,
            "id": doc_id,
            "doc_id": doc_id,
            "chunk_index": idx,
            "total_chunks": total_chunks,
            "title": doc_title,
            "header": header,
            "header_path": header_path,
            "type": str(metadata.get("type")) if metadata.get("type") is not None else None,
            "category": str(metadata.get("category")) if metadata.get("category") is not None else None,
            "company": str(metadata.get("company")) if metadata.get("company") is not None else None,
            "role": str(metadata.get("role")) if metadata.get("role") is not None else None,
            "project_name": str(metadata.get("project_name")) if metadata.get("project_name") is not None else None,
            "tech_stack": tech_stack,
            "tags": tags,
            "summary": str(metadata.get("summary")) if metadata.get("summary") is not None else None,
            "source": source_val,
            "location": str(metadata.get("location")) if metadata.get("location") is not None else None,
            "date_range": str(metadata.get("date_range")) if metadata.get("date_range") is not None else None,
            "log_date": str(metadata.get("log_date")) if metadata.get("log_date") is not None else None,
            "status": str(metadata.get("status")) if metadata.get("status") is not None else None,
            "education": str(metadata.get("education")) if metadata.get("education") is not None else None,
            "github_url": str(metadata.get("github_url")) if metadata.get("github_url") is not None else None,
            "demo_url": str(metadata.get("demo_url")) if metadata.get("demo_url") is not None else None,
            "personal_interests": personal_interests,
            "week_number": week_number,
            "nda_redacted": nda_redacted,
            "has_external_logs": has_external_logs,
            "content": chunk_content,
            "_embedding_input": enriched_embedding_text,
        }
        processed_chunks.append(doc)

    return processed_chunks


# ---------------------------------------------------------------------------
# File Collection
# ---------------------------------------------------------------------------

def collect_markdown_documents(
    base_dir: Path,
    custom_content_dir: Path | None = None,
) -> list[dict[str, Any]]:
    """Discover and parse all markdown documents from content/ and rag_strategy.md.
    
    Supports custom content directories, missing directories, and cross-platform
    case-insensitive file extensions (.md / .MD).
    """
    if not base_dir.exists():
        print(f"[WARN] Base directory does not exist: {base_dir}")
        return []

    target_files: list[Path] = []
    
    # Locate rag_strategy.md case-insensitively in base_dir
    rag_strat = next(
        (p for p in base_dir.iterdir() if p.is_file() and p.name.lower() == "rag_strategy.md"),
        None,
    )
    if rag_strat and rag_strat.is_file():
        target_files.append(rag_strat)
        
    content_dir = custom_content_dir if custom_content_dir else (base_dir / "content")
    if content_dir.is_dir():
        # Case-insensitive .md discovery across all operating systems
        md_files = sorted(
            [p for p in content_dir.rglob("*") if p.is_file() and p.suffix.lower() == ".md"]
        )
        target_files.extend(md_files)
    elif custom_content_dir:
        print(f"[WARN] Specified content directory does not exist: {custom_content_dir}")
        
    print(f"[INFO] Discovered {len(target_files)} Markdown files to ingest.")
    all_chunks: list[dict[str, Any]] = []
    
    for file_path in target_files:
        fm, body = parse_markdown_file(file_path)
        chunks = chunk_markdown_by_headers(body, fm, file_path)
        all_chunks.extend(chunks)
        
    print(f"[INFO] Generated {len(all_chunks)} chunks across {len(target_files)} files.")
    return all_chunks

