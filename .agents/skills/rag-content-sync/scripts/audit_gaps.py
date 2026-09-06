#!/usr/bin/env python3
"""Audit RAG Content Gaps in Aryan Shah's Portfolio.

Cross-references source data in src/data, src/content, cv/, and src/components
against rag/content/ to identify missing documents, incomplete frontmatter,
and out-of-sync fields.

Usage:
    python audit_gaps.py                       # Audit everything
    python audit_gaps.py --section projects    # Audit only projects
    python audit_gaps.py --section blog        # Audit only blog posts
    python audit_gaps.py --section experience  # Audit only experience
    python audit_gaps.py --section about       # Audit only about/skills/bio
    python audit_gaps.py --target rag/content/projects/chess-ai-nnue.md
    python audit_gaps.py --json                # Output JSON summary
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

# Determine repo root relative to this script
SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
REPO_ROOT = SKILL_DIR.parent.parent
if not (REPO_ROOT / "rag" / "content").is_dir():
    # Fallback to current working directory walk
    current = Path.cwd()
    while current != current.parent:
        if (current / "rag" / "content").is_dir():
            REPO_ROOT = current
            break
        current = current.parent

RAG_CONTENT_DIR = REPO_ROOT / "rag" / "content"
SRC_DATA_DIR = REPO_ROOT / "src" / "data"
SRC_CONTENT_DIR = REPO_ROOT / "src" / "content"
CV_CERTS_DIR = REPO_ROOT / "cv" / "certs"


def parse_frontmatter(content: str) -> tuple[dict[str, Any], str]:
    """Extract YAML frontmatter and body from markdown text."""
    fm_match = re.match(r"^\s*---\s*\r?\n(.*?)\r?\n---\s*(?:\r?\n|$)", content, re.DOTALL)
    if not fm_match:
        return {}, content
    raw_fm = fm_match.group(1)
    body = content[fm_match.end():]
    
    # Lightweight YAML parsing without hard dependency on PyYAML
    data: dict[str, Any] = {}
    current_list_key: str | None = None
    
    for line in raw_fm.splitlines():
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("#"):
            continue
            
        list_item_match = re.match(r"^-\s+(.+)$", trimmed)
        if list_item_match and current_list_key:
            val = list_item_match.group(1).strip().strip("\"'")
            data.setdefault(current_list_key, []).append(val)
            continue
            
        kv_match = re.match(r"^([a-zA-Z0-9_\-]+)\s*:\s*(.*)$", line)
        if kv_match:
            key = kv_match.group(1).strip()
            raw_val = kv_match.group(2).strip()
            if not raw_val:
                current_list_key = key
                data[key] = []
            else:
                current_list_key = None
                # Clean quotes
                val: Any = raw_val.strip("\"'")
                if val.lower() == "true":
                    val = True
                elif val.lower() == "false":
                    val = False
                elif re.match(r"^\d+$", val):
                    val = int(val)
                data[key] = val
                
    return data, body


def validate_rag_file(file_path: Path) -> list[str]:
    """Validate common frontmatter schema required by rag/parser.py."""
    issues = []
    if not file_path.exists():
        return [f"File does not exist: {file_path}"]
    text = file_path.read_text(encoding="utf-8-sig")
    fm, body = parse_frontmatter(text)
    if not fm:
        issues.append("Missing YAML frontmatter (--- header).")
        return issues
        
    for req in ["id", "title", "type", "summary", "source"]:
        if not fm.get(req):
            issues.append(f"Missing required frontmatter field: '{req}'")
            
    if not body.strip():
        issues.append("Markdown body is empty.")
    elif not re.search(r"^[ ]{0,3}#\s+", body, re.MULTILINE):
        issues.append("Missing top-level H1 heading (# Document Title).")
        
    return issues


def audit_projects() -> dict[str, Any]:
    """Audit projects in src/data/projects.ts against rag/content/projects/."""
    projects_file = SRC_DATA_DIR / "projects.ts"
    results: dict[str, Any] = {
        "section": "projects",
        "items": [],
        "missing_count": 0,
        "discrepancy_count": 0,
    }
    if not projects_file.exists():
        results["error"] = f"File not found: {projects_file}"
        return results

    text = projects_file.read_text(encoding="utf-8")
    # Parse project objects
    blocks = re.findall(r"\{\s*id:\s*(\d+).*?status:\s*\"([^\"]+)\".*?\}", text, re.DOTALL)
    
    rag_projects_dir = RAG_CONTENT_DIR / "projects"
    existing_rag_files = list(rag_projects_dir.glob("*.md")) if rag_projects_dir.is_dir() else []
    
    # Read all RAG project files and index by github or slug
    rag_cache: list[tuple[Path, dict[str, Any], str]] = []
    for p in existing_rag_files:
        fm, b = parse_frontmatter(p.read_text(encoding="utf-8-sig"))
        rag_cache.append((p, fm, b))

    for m in re.finditer(
        r"id:\s*(\d+),\s*title:\s*\"([^\"]+)\",\s*description:\s*(?:\"([^\"]*)\"|`([^`]*)`)[^}]+githubLink:\s*\"([^\"]*)\",\s*status:\s*\"([^\"]*)\"",
        text,
    ):
        p_id = int(m.group(1))
        title = m.group(2)
        desc = (m.group(3) or m.group(4) or "").strip()
        github = m.group(5).strip()
        status = m.group(6).strip()
        
        # Extract websiteLink if present
        sub_block = m.group(0)
        web_match = re.search(r"websiteLink:\s*\"([^\"]*)\"", sub_block)
        demo_url = web_match.group(1).strip() if web_match else ""

        # Skip placeholder "See more..."
        if p_id == 99 or "see more" in title.lower():
            continue

        # Match against RAG files
        matched_file = None
        matched_fm: dict[str, Any] = {}
        matched_body: str = ""
        for p_path, fm, b in rag_cache:
            # Match on github url, project_name, or title resemblance
            if github and fm.get("github_url") == github:
                matched_file = p_path
                matched_fm = fm
                matched_body = b
                break
            if fm.get("project_name", "").lower() == title.lower() or fm.get("title", "").lower().startswith(title.lower()):
                matched_file = p_path
                matched_fm = fm
                matched_body = b
                break

        item: dict[str, Any] = {
            "id": p_id,
            "title": title,
            "github": github,
            "demo_url": demo_url,
            "status": status,
            "rag_file": str(matched_file.relative_to(REPO_ROOT)) if matched_file else None,
            "issues": [],
        }

        if not matched_file:
            item["issues"].append("MISSING: No corresponding markdown file in rag/content/projects/.")
            results["missing_count"] += 1
        else:
            # Check schema
            file_issues = validate_rag_file(matched_file)
            item["issues"].extend(file_issues)
            
            # Check field alignment
            if matched_fm.get("status") != status:
                item["issues"].append(f"Status mismatch: projects.ts has '{status}', RAG frontmatter has '{matched_fm.get('status')}'.")
            if github and matched_fm.get("github_url") != github:
                item["issues"].append(f"GitHub URL mismatch: projects.ts has '{github}', RAG frontmatter has '{matched_fm.get('github_url')}'.")
            if demo_url and matched_fm.get("demo_url") != demo_url:
                item["issues"].append(f"Demo URL mismatch: projects.ts has '{demo_url}', RAG frontmatter has '{matched_fm.get('demo_url')}'.")

            if len(matched_body.split()) < 50:
                item["issues"].append("INCOMPLETE: Markdown body is very brief (< 50 words). May lack architecture/technical detail.")

            if item["issues"]:
                results["discrepancy_count"] += 1

        results["items"].append(item)

    return results


def audit_blog() -> dict[str, Any]:
    """Audit blog posts in src/content/blog/ against rag/content/blog/."""
    results: dict[str, Any] = {
        "section": "blog",
        "items": [],
        "missing_count": 0,
        "discrepancy_count": 0,
    }
    src_blog_dir = SRC_CONTENT_DIR / "blog"
    rag_blog_dir = RAG_CONTENT_DIR / "blog"

    if not src_blog_dir.is_dir():
        results["error"] = f"Directory not found: {src_blog_dir}"
        return results

    # Discover blog entries in src/content/blog/
    src_entries = [p for p in src_blog_dir.iterdir() if p.is_dir()]
    for entry in src_entries:
        slug = entry.name
        src_index = entry / "index.md"
        rag_file = rag_blog_dir / f"{slug}.md"
        
        has_src = src_index.is_file()
        has_rag = rag_file.is_file()
        
        item: dict[str, Any] = {
            "slug": slug,
            "has_src_content": has_src,
            "rag_file": str(rag_file.relative_to(REPO_ROOT)) if has_rag else None,
            "issues": [],
        }

        if not has_src:
            item["issues"].append(f"Notice: Directory exists in src/content/blog/ but contains no index.md (draft or placeholder).")
        
        if has_src and not has_rag:
            item["issues"].append(f"MISSING: Source blog post '{slug}/index.md' is not synced into rag/content/blog/{slug}.md.")
            results["missing_count"] += 1
        elif has_rag:
            file_issues = validate_rag_file(rag_file)
            item["issues"].extend(file_issues)
            if file_issues:
                results["discrepancy_count"] += 1

        results["items"].append(item)

    return results


def audit_experience() -> dict[str, Any]:
    """Audit experience data in src/data/experience.ts against rag/content/experience/."""
    results: dict[str, Any] = {
        "section": "experience",
        "items": [],
        "missing_count": 0,
        "discrepancy_count": 0,
    }
    exp_file = SRC_DATA_DIR / "experience.ts"
    if not exp_file.exists():
        results["error"] = f"File not found: {exp_file}"
        return results

    text = exp_file.read_text(encoding="utf-8")
    rag_exp_dir = RAG_CONTENT_DIR / "experience"

    companies = [
        {"id": "microsoft", "name": "Microsoft", "expected_weeks": 26},
        {"id": "pickit-3d", "name": "Pickit 3D", "expected_weeks": 11},
    ]

    for comp in companies:
        c_id = comp["id"]
        c_dir = rag_exp_dir / c_id
        overview_file = c_dir / "overview.md"
        
        item: dict[str, Any] = {
            "company": comp["name"],
            "company_id": c_id,
            "overview_file": str(overview_file.relative_to(REPO_ROOT)) if overview_file.exists() else None,
            "issues": [],
            "weeks_found": 0,
            "expected_weeks": comp["expected_weeks"],
        }

        if not overview_file.exists():
            item["issues"].append(f"MISSING: overview.md not found in rag/content/experience/{c_id}/.")
            results["missing_count"] += 1
        else:
            item["issues"].extend(validate_rag_file(overview_file))

        # Check weekly trackers
        if c_dir.is_dir():
            week_files = sorted(c_dir.glob("week-*.md")) or sorted(c_dir.glob("tracker-week-*.md"))
            item["weeks_found"] = len(week_files)
            if item["weeks_found"] < comp["expected_weeks"]:
                item["issues"].append(
                    f"INCOMPLETE: Found {item['weeks_found']} weekly logs, expected {comp['expected_weeks']}."
                )
                results["discrepancy_count"] += 1
        else:
            item["issues"].append(f"MISSING: Directory rag/content/experience/{c_id}/ does not exist.")
            results["missing_count"] += 1

        results["items"].append(item)

    return results


def audit_about() -> dict[str, Any]:
    """Audit about documents (skills.md, bio.md, contact.md)."""
    results: dict[str, Any] = {
        "section": "about",
        "items": [],
        "missing_count": 0,
        "discrepancy_count": 0,
    }
    about_dir = RAG_CONTENT_DIR / "about"
    files = ["bio.md", "skills.md", "contact.md"]

    for fname in files:
        fpath = about_dir / fname
        item: dict[str, Any] = {
            "file": fname,
            "path": str(fpath.relative_to(REPO_ROOT)) if fpath.exists() else None,
            "issues": [],
        }

        if not fpath.exists():
            item["issues"].append(f"MISSING: {fname} does not exist in rag/content/about/.")
            results["missing_count"] += 1
        else:
            issues = validate_rag_file(fpath)
            item["issues"].extend(issues)
            
            # Specific checks for skills.md
            if fname == "skills.md":
                text = fpath.read_text(encoding="utf-8-sig")
                # Check certifications in cv/certs/
                if CV_CERTS_DIR.is_dir():
                    certs = list(CV_CERTS_DIR.glob("*.pdf"))
                    for c in certs:
                        cert_stem = c.stem.replace("_", " ")
                        # Check key identifiers like AI-102, AI-900, etc.
                        code_match = re.search(r"([a-z]{2}_\d{3})", c.stem)
                        if code_match:
                            code_hyphen = code_match.group(1).upper().replace("_", "-")
                            if code_hyphen not in text:
                                item["issues"].append(f"Notice: Certification {code_hyphen} ({c.name}) not explicitly referenced in skills.md.")

            if item["issues"]:
                results["discrepancy_count"] += 1

        results["items"].append(item)

    return results


def audit_single_file(target_path: Path) -> dict[str, Any]:
    """Audit a single RAG file."""
    results: dict[str, Any] = {
        "section": "single_file",
        "target": str(target_path),
        "issues": validate_rag_file(target_path),
    }
    return results


def print_report(audit_data: list[dict[str, Any]]) -> None:
    """Print a clean human-readable audit report."""
    print("=" * 72)
    print("           PORTFOLIO TO RAG CONTENT AUDIT REPORT")
    print("=" * 72)
    
    total_missing = sum(d.get("missing_count", 0) for d in audit_data)
    total_discrepancies = sum(d.get("discrepancy_count", 0) for d in audit_data)

    for section in audit_data:
        sec_name = section.get("section", "unknown").upper()
        print(f"\n[SECTION: {sec_name}]")
        print("-" * 72)
        
        items = section.get("items", [])
        if not items and "issues" in section:
            # Single file audit
            issues = section["issues"]
            if not issues:
                print(f"  [OK] {section.get('target')} is valid and schema-compliant.")
            else:
                print(f"  [ISSUES] {section.get('target')}:")
                for iss in issues:
                    print(f"    - {iss}")
            continue

        for it in items:
            name = it.get("title") or it.get("slug") or it.get("company") or it.get("file") or "Item"
            issues = it.get("issues", [])
            if not issues:
                print(f"  [OK] {name}")
            else:
                print(f"  [!] {name}:")
                for iss in issues:
                    print(f"      * {iss}")

    print("\n" + "=" * 72)
    print(f"Summary: {total_missing} missing items, {total_discrepancies} items with discrepancies.")
    if total_missing > 0 or total_discrepancies > 0:
        print("ACTION REQUIRED: Present proposed draft updates to the user for explicit confirmation.")
    else:
        print("STATUS: All checked portfolio content is fully synchronized with rag/content/.")
    print("=" * 72)


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit portfolio to RAG content sync status.")
    parser.add_argument(
        "-s", "--section",
        choices=["all", "projects", "blog", "experience", "about"],
        default="all",
        help="Specific section to audit (default: all)",
    )
    parser.add_argument(
        "-t", "--target",
        type=str,
        help="Specific file or directory path to audit",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw JSON instead of formatted text",
    )
    args = parser.parse_args()

    reports: list[dict[str, Any]] = []

    if args.target:
        target_path = Path(args.target).resolve()
        reports.append(audit_single_file(target_path))
    else:
        sec = args.section.lower()
        if sec in ("all", "projects"):
            reports.append(audit_projects())
        if sec in ("all", "blog"):
            reports.append(audit_blog())
        if sec in ("all", "experience"):
            reports.append(audit_experience())
        if sec in ("all", "about"):
            reports.append(audit_about())

    if args.json:
        print(json.dumps(reports, indent=2))
    else:
        print_report(reports)


if __name__ == "__main__":
    main()
