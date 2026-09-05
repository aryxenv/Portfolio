# Portfolio RAG Architecture Strategy

Building a RAG (Retrieval-Augmented Generation) system for your portfolio is a fantastic way to showcase your skills and make your site interactive. Since you're using **Groq** for fast, free LLM inference, here is the optimal strategy for organizing, indexing, and maintaining your data.

## 1. Data Organization: Split by Topic

**Recommendation:** Do not use one huge markdown file. **Split your markdown files by topic/section.**

### Why?

- **Maintainability:** When you get a new job or finish a project, you only update one file.
- **Metadata Tagging:** You can add YAML frontmatter (metadata) to each file (e.g., `type: project`, `tech_stack: [react, node]`). This metadata can be attached to the chunks in your database, allowing you to filter searches (e.g., "only search through projects").
- **Clean Context:** Splitting files naturally provides boundaries so the AI doesn't mix up your experience at Company A with Company B.

### Example Structure:

```text
/content
  /projects
    - project-a.md
    - project-b.md
  /experience
    - company-a.md
  /about
    - bio.md
    - skills.md
```

## 2. Chunking Strategy

For a portfolio, your content isn't massive like an enterprise knowledge base, so you don't need an overly complex chunking strategy.

**Recommendation: Markdown-Aware Chunking**
Instead of blindly splitting text every 500 words, split your text based on Markdown headers (H1, H2, H3). Libraries like LangChain's `MarkdownHeaderTextSplitter` are perfect for this.

### Chunk Size & Overlap

- **Size:** ~500 to 1000 tokens per chunk. Portfolio sections are usually short, so a single project might just be 1 or 2 chunks.
- **Overlap:** ~100 tokens. This ensures that if a sentence spans across a chunk boundary, context isn't lost.

> [!IMPORTANT]
> **Context Enrichment:** When you chunk a file, inject the document's title or metadata into every chunk.
> _Example:_ If a chunk is just bullet points of your responsibilities, the LLM won't know _where_ you did them. Make sure the chunk includes: `[Source: Experience - Senior Dev at TechCorp] - Led a team of 5...`

## 3. Vector Database Options

**Azure AI Search** is incredibly powerful and offers hybrid search (keyword + vector), but it can be **expensive** and complex to configure for a simple portfolio.

**Free / Low-Cost Alternatives:**

- **Pinecone:** Excellent free tier, very easy to set up for personal projects.
- **Supabase (pgvector):** If you already need a traditional database, Supabase gives you a PostgreSQL DB with vector search built-in for free.
- **Qdrant / ChromaDB:** Great open-source options.

If you are set on Azure for learning/certification purposes, it's a great choice, just keep an eye on the pricing tier!

## 4. Maintainable Update Pipeline

You want the AI to automatically know when you update your portfolio, without manual database administration.

**The CI/CD Approach:**

1. Store your `/content` markdown files in your portfolio's Git repository.
2. Create a script (e.g., `scripts/sync-vector-db.js`).
3. When this script runs, it:
   - Reads all markdown files.
   - Hashes the content of each file to see if it changed since the last run.
   - If a file changed (or is new):
     - Deletes the old chunks for that specific file ID from the Vector DB.
     - Embeds the new chunks (using an embedding model like `text-embedding-3-small` or HuggingFace/local embeddings).
     - Inserts the new chunks into the Vector DB.
4. Run this script automatically using **GitHub Actions** whenever you push to the `main` branch, or simply run it locally before you deploy.

## 5. The Application Flow

When a user visits your portfolio and asks a question:

1. **User asks:** _"What experience does Aryan have with Node.js?"_
2. **Your Server:** Takes the question and turns it into a vector embedding.
3. **Vector DB:** Searches for the top 3-5 chunks closest to the question's embedding.
4. **Prompt Construction:** Your server builds a prompt for Groq:

   ```text
   You are an AI assistant for Aryan's portfolio. Use the provided context to answer the user's question.

   Context:
   {chunk 1: Node.js experience at Company A}
   {chunk 2: Project using Node.js}

   Question: {user's question}
   ```

5. **Groq API:** Generates the answer instantly using Llama 3 or Mixtral.
6. **UI:** Streams the answer back to the user.
