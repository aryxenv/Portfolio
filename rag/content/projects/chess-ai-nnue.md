---
id: "project-chess-ai-nnue"
title: "Chess AI / NNUE Chessbot - Neural Network Evaluation Engine & Conversational Bot"
type: "project"
project_name: "Chess AI / NNUE Chessbot"
status: "green"
category: "AI / Full-Stack Application"
github_url: "https://github.com/aryxenv/chess-ai"
demo_url: "/nnue-chessbot/"
tech_stack:
  - "Astro"
  - "React"
  - "FastAPI"
  - "C#"
  - "Python"
  - "PyTorch"
  - "NNUE"
  - "Lichess API"
  - "Tailwind CSS"
tags:
  - "chess"
  - "nnue"
  - "neural-network"
  - "csharp"
  - "fastapi"
  - "lichess"
  - "game-ai"
  - "astro"
summary: "An agentic chess application combining a custom Efficiently Updatable Neural Network (NNUE) evaluation engine, a C# high-speed PGN data parsing pipeline, standalone Lichess engine integration, and an interactive Astro/React/FastAPI conversational AI chess assistant."
source: "src/data/projects.ts"
---

# Chess AI / NNUE Chessbot - Neural Network Evaluation Engine & Conversational Bot

## Project Overview
**Chess AI / NNUE Chessbot** is a hybrid game-playing and conversational AI system that brings modern computer chess techniques to the web. While classical chess engines depend on handcrafted evaluation heuristics and heavy GPU deep learning engines incur high inference latency, modern computer chess has converged on **NNUE (Efficiently Updatable Neural Network)** architectures.

This project implements a complete, end-to-end computer chess system: from raw training data ingestion of millions of grandmaster games to custom NNUE neural network training, engine search algorithms, and an interactive web interface powered by Astro and React. The web platform combines a full-featured playable chess client with an intelligent AI chatbot that answers tactical questions, explains openings, and analyzes board states.

## Key Technical Components & Architecture

### 1. High-Performance C# PGN Processing Pipeline
Training an accurate neural evaluation function requires parsing vast corpora of chess games:
- **C# .NET Core Pipeline**: Built a multi-threaded PGN (Portable Game Notation) ingestion parser that processes gigabytes of raw game data from the Lichess Open Database.
- **FEN Extraction & Filtering**: Filters out blitz/bullet anomalies, resolves board positions using bitboard representations, and emits normalized FEN (Forsyth-Edwards Notation) strings labeled with game outcomes and engine evaluations.
- **Binary Serialization**: Converts board positions into custom, highly compressed binary training sets to maximize I/O throughput during neural network training.

### 2. NNUE Neural Network Architecture & PyTorch Training
- **Network Topology**: Implements an NNUE architecture with an input feature transformer mapping board piece-square indices (HalfKP feature representation, encoding king position relative to all other pieces) into an accumulator layer.
- **Efficient Incremental Updates**: The fundamental strength of NNUE is incremental updating: when a move is played, only the features of the moved/captured pieces and king position need recalculation, reducing forward-pass evaluation time on CPU to mere nanoseconds.
- **PyTorch Training Loop**: Employs PyTorch for supervised offline training against grandmaster evaluations, using custom loss functions balancing game outcome probabilities and centipawn evaluations. Quantized to 8-bit integer weights for ultra-fast CPU inference.

### 3. Game Engine & Lichess Protocol Integration
- **Search Algorithm**: Combines alpha-beta pruning with Principal Variation Search (PVS), iterative deepening, transposition tables (Zobrist hashing), null move pruning, and quiescence search to avoid the horizon effect.
- **Lichess API Integration**: Supports Universal Chess Interface (UCI) communication and Lichess bot protocol, enabling automated matchmaking against global players on the Lichess platform.

### 4. Interactive Web Client & Conversational Assistant
- **Frontend Architecture**: Built using Astro 5/7 and React island hydration (`client="load"`).
- **Interactive Board**: Smooth piece dragging, legal move generation and highlighting, live captured piece counts, and dynamic evaluation bars. Supports playing as White, Black, or Random side against the AI.
- **Conversational AI Interface**: Features a persistent chat panel where users can ask questions about chess history, opening theory, rules ("What is En Passant?", "Who is Magnus Carlsen?", "Explain the Sicilian Defense"), or request tactical evaluations of the current board state.
- **FastAPI Backend**: Serves evaluation requests and streams AI conversational insights via REST/WebSocket endpoints.

## Key Technical Specifications & Links
- **Project Name**: Chess AI / NNUE Chessbot
- **Status**: Production / Active (`green`)
- **Primary Category**: AI / Full-Stack Application
- **GitHub Repository**: [https://github.com/aryxenv/chess-ai](https://github.com/aryxenv/chess-ai)
- **Live Demo Path**: `/nnue-chessbot/` (self-hosted client under `public/nnue-chessbot/`)
