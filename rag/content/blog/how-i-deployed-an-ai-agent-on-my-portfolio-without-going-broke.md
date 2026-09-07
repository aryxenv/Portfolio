---
id: "blog-how-i-deployed-an-ai-agent-on-my-portfolio-without-going-broke"
title: "How I Deployed an AI Agent on My Portfolio Without Going Broke"
type: "blog"
category: "Cloud Architecture & Agentic AI"
tech_stack:
  - "Microsoft Agent Framework"
  - "GPT-5.6-Luna"
  - "Azure Cosmos DB"
  - "text-embedding-3-large"
  - "Azure Virtual Machines"
  - "Cloudflare Pages"
  - "GitHub Actions"
tags:
  - "azure"
  - "cosmosdb"
  - "agent-framework"
  - "rag"
  - "agents"
  - "foundry"
  - "openai"
  - "github-actions"
  - "cost-optimization"
  - "gpt-5-6-luna"
summary: "Cost-optimized architecture guide on deploying an autonomous portfolio AI agent with RAG vector search for $6.18/month (or $0 on an Azure Student subscription) using Azure B1s VM, Cosmos DB NoSQL free tier, Microsoft Agent Framework, and GPT-5.6-Luna."
source: "src/content/blog/how-i-deployed-an-ai-agent-on-my-portfolio-without-going-broke/index.md"
---

# How I Deployed an AI Agent on My Portfolio Without Going Broke

## Overview & Cost Philosophy
Deploying production-grade AI agents and cloud inference typically incurs substantial infrastructure overhead. However, by carefully structuring each tier of the stack on Microsoft Azure and taking strategic advantage of available free tiers and student benefits, an end-to-end agentic application can run reliably for pennies—or completely free under an Azure for Students subscription.

The architecture comprises five distinct functional layers:
1. **Frontend**: The public-facing portfolio website exposing the interactive chat interface to users.
2. **Backend**: An orchestration server hosting HTTP endpoints and managing session lifecycles for the agent.
3. **Database**: A vector database with high-dimensional embeddings for retrieval-augmented generation (RAG).
4. **Agent Orchestration & Inference**: The agent runtime executing multi-step tool calls against knowledge stores and LLMs.
5. **CI/CD Automation**: GitHub Actions pipelines automating incremental vector re-indexing upon content changes and deploying code updates.

Each component is engineered to remain strictly within free-tier limits or minimal operational costs (~$6.18 per month total, fully covered by the $100 annual student credit).

## Frontend Layer: Cloudflare Pages
The public frontend is hosted on Cloudflare Pages, offering enterprise-grade edge distribution and static asset delivery:
- **Free Tier Allowance**: Provides up to 100,000 requests per day (approx. 2,000 requests/day typical for a personal portfolio), comfortably accommodating traffic spikes at zero cost.
- **Custom Domain Integration**: Seamlessly binds to custom domains (e.g., `aryxenv.dev`) with automatic SSL/TLS certificate lifecycle management.
- **Git-Driven Continuous Deployment**: Triggers automatic static site builds whenever commits land on the production repository branch.

## Backend Orchestration Layer: Azure Virtual Machines (B1s)
Rather than provisioning dedicated Azure Container Apps or App Service Plans that incur recurring hourly charges, the backend runs on a burstable virtual machine:
- **Instance Specification**: Azure **B1s VM** (1 vCPU, 1 GB RAM). This specification provides sufficient compute and memory for lightweight HTTP request routing, agent orchestration, and session state management.
- **Cost Model**: Under the Azure for Students subscription, specific B-series VM compute instances are free. Ancillary operational costs (OS disk storage and outbound networking egress) total approximately ~$5.00/month. These charges are fully covered by the recurring $100 student credit safety net.

## Database & Vector Storage: Cosmos DB for NoSQL vs. Azure AI Search
Choosing an appropriate vector storage engine is critical for RAG-enabled agents. Azure offers two primary native candidates:

### 1. Azure AI Search Free Tier
- **Storage Limit**: Capped at 50 MB total storage.
- **Vector Capacity**: Supports approximately 8,000 vectors at 1536 dimensions (assuming 32-bit floating point vectors before indexing and metadata overhead).
- **Limitation**: While viable for minimal datasets, any continuous content growth requires complex database migrations or paid tier upgrades.

### 2. Azure Cosmos DB for NoSQL Lifetime Free Tier
- **Storage & Throughput**: Each Azure subscription includes one free tier Cosmos DB account providing **25 GB of storage** and **1,000 Request Units per second (RU/s)**.
- **Vector Capacity**: Accommodates approximately 4,000,000 vectors at 1536 dimensions (raw vector payload calculation: 1536 * 4 bytes = 6,144 bytes per vector).
- **Embedding Resolution**: Because storage capacity ceases to be a bottleneck, the architecture uses higher-fidelity 3072-dimensional embeddings via Azure OpenAI `text-embedding-3-large`.

Cosmos DB eliminates storage anxiety entirely while providing sufficient RU throughput to serve vector distance queries concurrently.

## Agent Orchestration & Model Selection: Overcoming Rate Limits
The agent orchestration engine is built with **Microsoft Agent Framework**, an open-source orchestration library designed to coordinate multi-turn tool calling, memory management, and Microsoft Foundry model integrations.

During development and load testing, three model providers were evaluated:

### 1. Groq API
- **Pros**: Fast token generation and free tier options.
- **Cons**: The free tier models (`groq/compound` and `groq/compound-mini`) do not support custom tool execution inside Microsoft Agent Framework.

### 2. DeepSeek-v4-flash on Microsoft Foundry
- **Pros**: Outstanding reasoning capabilities, economical token pricing, and reliable tool-calling behavior.
- **Cons**: Microsoft Foundry applies a strict rate limit of **20 Requests Per Minute (RPM)** on this tier.
- **The Agent Bottleneck**: When an agent processes a user inquiry, it routinely performs multiple autonomous tool calls (e.g., 5 sequential tool calls to query RAG indices, check project metadata, and verify sources). Consequently, just 4 concurrent users can generate 20 requests within the same minute. A 5th user inevitably encounters HTTP 429 rate limit exceptions, rendering the agent unusable under modest concurrency.

### 3. GPT-5.6-Luna on Microsoft Foundry
- **Solution**: Migrated the inference pipeline to `gpt-5.6-luna`.
- **Capacity**: Removes the strict RPM cap and provides an allotment of 1,000,000 Tokens Per Minute (TPM), completely eliminating rate-limiting bottlenecks for portfolio usage.
- **Performance**: Matches or exceeds reasoning quality with average user response latencies under 2 seconds.
- **Cost Tradeoff**: Output token pricing is approximately twice that of flash alternatives ($0.20 per 1M input tokens, $1.20 per 1M output tokens). However, at personal portfolio volumes (~600 monthly agent requests), total LLM expenditure amounts to only ~$1.18/month.

## CI/CD Pipeline: GitHub Actions Incremental Indexing
To prevent outdated knowledge without incurring manual synchronization overhead, GitHub Actions powers an automated CI/CD pipeline:
- **Incremental Vector Indexing**: Workflows detect content diffs across markdown documents, computing sha256 checksums to update only altered or newly added files in Cosmos DB.
- **Application Deployment**: Pushes trigger Cloudflare Pages frontend updates and SSH-based zero-downtime redeployments on the Azure VM backend.
- **Resource Footprint**: The incremental jobs run in under 60 seconds per commit, fitting easily inside GitHub's free allowance of 2,000 runner minutes per month.

## Monthly Cost Analysis & Budget Breakdown
Based on empirical production telemetry and traffic metrics on the portfolio website:

| Component | Usage Volume | Monthly Cost | Operational Notes |
| :--- | :--- | :--- | :--- |
| **Frontend** | ~60,000 requests | **$0.00 (Free)** | Cloudflare Pages remains well below the 100k daily request threshold (~2k requests/day). |
| **Backend** | ~600 agent queries (1% of site traffic) | **~$5.00** | Free B1s VM compute via Azure for Students; charges apply only to OS managed disk and bandwidth egress. |
| **Agent Inference** | ~600 queries (~1.8M tokens @ $0.20 in / $1.20 out) | **~$1.18** | Based on ~1k tokens per call across 3 model tool turns per user query using GPT-5.6-Luna. |
| **Database** | ~1,200 vector queries (2 queries per request) | **$0.00 (Free)** | Fully absorbed by the 25 GB / 1,000 RU/s lifetime free tier of Azure Cosmos DB for NoSQL. |
| **GitHub Actions** | Automated CI/CD & incremental indexing | **$0.00 (Free)** | Consumes < 60 minutes of the 2,000 included monthly GitHub Actions minutes. |
| **Total Net Cost** | ~60k site requests / 600 agent interactions | **$6.18/month** | **$0.00 net** on Azure for Students ($100 annual credit covers the ~$74.11 annualized expense). |

*(Optional: Custom domain registration costs approximately $6.00/year).*

## References & Documentation Links
- **Source Code**: [Aryan Shah's Portfolio Repository](https://github.com/aryxenv/Portfolio)
- **Azure for Students**: [Free Cloud Services & $100 Credit Program](https://azure.microsoft.com/free/students/)
- **Cloudflare Pages**: [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- **Azure Burstable VMs**: [Azure B-Series VM Sizing & Specifications](https://learn.microsoft.com/azure/virtual-machines/sizes/b-series-burstable)
- **Azure Cosmos DB**: [Azure Cosmos DB Lifetime Free Tier](https://learn.microsoft.com/azure/cosmos-db/free-tier)
- **Cosmos DB Vector Search**: [Vector Search in Azure Cosmos DB for NoSQL](https://learn.microsoft.com/azure/cosmos-db/nosql/vector-search)
- **Azure AI Search Quotas**: [Service Limits and Quotas in Azure AI Search](https://learn.microsoft.com/azure/search/search-limits-quotas-capacity)
- **Azure OpenAI Embeddings**: [Azure OpenAI Service Embedding Models](https://learn.microsoft.com/azure/ai-foundry/openai/concepts/models#embeddings)
- **Microsoft Agent Framework**: [Microsoft Agent Framework GitHub Repository](https://github.com/microsoft/agent-framework)
- **GitHub Actions Quotas**: [GitHub Actions Billing and Free Tier Minutes](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)
- **Microsoft AI Foundry**: [Azure AI Foundry Overview & Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- **Groq Cloud API**: [Groq API Reference & Model Documentation](https://console.groq.com/docs/models)
