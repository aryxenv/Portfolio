---
id: "blog-transcribing-and-translating-in-realtime-with-ai"
title: "Transcribing and Translating in Realtime with AI"
type: "blog"
tags:
  - "foundry"
  - "azure"
  - "openai"
  - "realtime"
  - "whisper"
  - "translate"
  - "speech"
  - "python"
  - "websockets"
summary: "A comprehensive technical implementation guide on using gpt-realtime-whisper and gpt-realtime-translate for multilingual, low-latency live speech transcription and translation on Microsoft Foundry."
source: "src/content/blog/transcribing-and-translating-in-realtime-with-ai/index.md"
---

# Transcribing and Translating in Realtime with AI

## Introduction
OpenAI introduced dedicated realtime speech models for low-latency transcription and translation, which were simultaneously made available on Microsoft Azure through Microsoft Foundry. However, practical developer documentation explaining how to interface directly with these specialized WebSocket endpoints using Microsoft Foundry and Azure OpenAI authentication has historically been scarce.

This guide provides an end-to-end, production-ready implementation walkthrough for deploying and consuming **`gpt-realtime-whisper`** and **`gpt-realtime-translate`** using Python, `asyncio`, `websockets`, and `sounddevice`.

## Essential Prerequisites & Cloud Setup
Before initiating local code, ensure the following cloud resources are provisioned on your Azure subscription:
1. **Azure Region**: Deploy a Microsoft Foundry resource and AI project in `france-central` (or other supported regional deployments).
2. **Role-Based Access Control**: Ensure your identity or service principal has the **`Cognitive Services OpenAI User`** role assignment on the Foundry resource.
3. **Environment Setup**: Install Python (3.11+) and `uv` package manager:
   ```pwsh
   uv init
   uv venv
   uv add aiohttp azure-identity python-dotenv sounddevice websockets
   ```

---

## Part 1: Realtime Transcription with `gpt-realtime-whisper`

The `gpt-realtime-whisper` model enables streaming audio capture and immediate live speech-to-text generation. It supports continuous multilingual speech and dynamic language switching mid-sentence without changing configuration parameters.

### 1. Model Configuration & Audio Parameters
Create a `.env` file containing your Azure OpenAI resource details:
```env
AZURE_OPENAI_RESOURCE_NAME=<your-resource-name>
AZURE_OPENAI_REALTIME_DEPLOYMENT=gpt-realtime-whisper
```

Unlike full conversational voice models, `gpt-realtime-whisper` focuses strictly on transcription and does not support server-side turn detection. Therefore, client applications must implement manual Root-Mean-Square (RMS) audio energy monitoring to detect utterance boundaries and commit audio buffers.

```python
import os
from dotenv import load_dotenv

load_dotenv()
RESOURCE = os.environ["AZURE_OPENAI_RESOURCE_NAME"]
DEPLOYMENT = os.environ["AZURE_OPENAI_REALTIME_DEPLOYMENT"]

URL = f"wss://{RESOURCE}.openai.azure.com/openai/v1/realtime?intent=transcription"

# Audio capture specifications
SAMPLE_RATE = 24000
CHUNK_SAMPLES = 2400  # 100 ms chunks

# Manual turn detection thresholds
SPEECH_RMS = 0.01            # Loudness below this is treated as silence
SILENT_CHUNKS_TO_COMMIT = 9  # 900 ms of quiet triggers buffer commit
MIN_CHUNKS_TO_COMMIT = 5     # Azure requires buffers >= 500 ms
```

### 2. Implementation Code
```python
import asyncio
import base64
import json
import math
import os
import struct

import sounddevice as sd
from azure.identity.aio import DefaultAzureCredential
from dotenv import load_dotenv
from websockets.asyncio.client import connect

load_dotenv()
RESOURCE = os.environ["AZURE_OPENAI_RESOURCE_NAME"]
DEPLOYMENT = os.environ["AZURE_OPENAI_REALTIME_DEPLOYMENT"]
URL = f"wss://{RESOURCE}.openai.azure.com/openai/v1/realtime?intent=transcription"

SAMPLE_RATE = 24000
CHUNK_SAMPLES = 2400
SPEECH_RMS = 0.01
SILENT_CHUNKS_TO_COMMIT = 9
MIN_CHUNKS_TO_COMMIT = 5

async def main():
    # 1. Acquire Entra ID bearer token
    credential = DefaultAzureCredential()
    token = await credential.get_token("https://cognitiveservices.azure.com/.default")

    # 2. Open realtime WebSocket connection
    ws = await connect(
        URL,
        additional_headers={"Authorization": f"Bearer {token.token}"},
        max_size=None,
    )

    # 3. Configure transcription session
    await ws.send(
        json.dumps({
            "type": "session.update",
            "session": {
                "type": "transcription",
                "audio": {
                    "input": {
                        "format": {"type": "audio/pcm", "rate": SAMPLE_RATE},
                        "transcription": {"model": DEPLOYMENT},
                    },
                },
            },
        })
    )

    # 4. Microphone capture queue
    loop = asyncio.get_running_loop()
    mic_queue = asyncio.Queue()

    def on_audio(indata, frames, time, status):
        loop.call_soon_threadsafe(mic_queue.put_nowait, bytes(indata))

    stream = sd.RawInputStream(
        samplerate=SAMPLE_RATE,
        blocksize=CHUNK_SAMPLES,
        channels=1,
        dtype="int16",
        callback=on_audio,
    )
    stream.start()
    print("Listening... press Ctrl+C to stop.\n")

    # 5. Audio streaming and manual turn commitment
    async def send_audio():
        buffered_chunks = 0
        silent_chunks = 0
        heard_speech = False

        while True:
            chunk = await mic_queue.get()
            await ws.send(
                json.dumps({
                    "type": "input_audio_buffer.append",
                    "audio": base64.b64encode(chunk).decode("ascii"),
                })
            )
            buffered_chunks += 1

            samples = struct.unpack(f"<{len(chunk) // 2}h", chunk)
            rms = math.sqrt(sum(s * s for s in samples) / len(samples)) / 32768

            if rms >= SPEECH_RMS:
                heard_speech = True
                silent_chunks = 0
            else:
                silent_chunks += 1

            if (
                heard_speech
                and silent_chunks >= SILENT_CHUNKS_TO_COMMIT
                and buffered_chunks >= MIN_CHUNKS_TO_COMMIT
            ):
                await ws.send(json.dumps({"type": "input_audio_buffer.commit"}))
                buffered_chunks = 0
                silent_chunks = 0
                heard_speech = False

    # 6. Stream transcript deltas as they arrive
    async def receive_transcripts():
        async for message in ws:
            event = json.loads(message)
            kind = event["type"]

            if kind == "conversation.item.input_audio_transcription.delta":
                print(event["delta"], end="", flush=True)
            elif kind == "conversation.item.input_audio_transcription.completed":
                print(f"\n--- {event['transcript']}\n")
            elif kind == "error":
                message = event["error"]["message"]
                if "buffer too small" not in message.lower():
                    print(f"\n[error] {message}\n")

    sender = asyncio.create_task(send_audio())
    receiver = asyncio.create_task(receive_transcripts())

    try:
        await asyncio.gather(sender, receiver)
    finally:
        stream.stop()
        stream.close()
        await ws.close()
        await credential.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
```

---

## Part 2: Realtime Multilingual Translation with `gpt-realtime-translate`

Building beyond transcription, **`gpt-realtime-translate`** streams translated text (and optionally input transcripts) directly from continuous spoken audio into a selected target language.

### 1. Configuration & Translation Protocol
Configure environment variables:
```env
AZURE_OPENAI_RESOURCE_NAME=<your-resource-name>
AZURE_OPENAI_REALTIME_TRANSLATION_MODEL=gpt-realtime-translate
AZURE_OPENAI_REALTIME_DEPLOYMENT=gpt-realtime-whisper  # Optional: for input transcription
```

Key protocol nuances:
- Requires the `openai-alpha: translation=v1` header during the WebSocket handshake.
- The translation endpoint automatically detects utterance boundaries and turn boundaries, eliminating the need for client-side RMS silence calculation.

### 2. Implementation Code
```python
import asyncio
import base64
import json
import os

import sounddevice as sd
from azure.identity.aio import DefaultAzureCredential
from dotenv import load_dotenv
from websockets.asyncio.client import connect

load_dotenv()
RESOURCE = os.environ["AZURE_OPENAI_RESOURCE_NAME"]
MODEL = os.environ["AZURE_OPENAI_REALTIME_TRANSLATION_MODEL"]
DEPLOYMENT = os.environ.get("AZURE_OPENAI_REALTIME_DEPLOYMENT", "gpt-realtime-whisper")
TARGET_LANGUAGE = "fr"  # Target language (e.g., 'fr', 'es', 'de', 'nl')

URL = f"wss://{RESOURCE}.openai.azure.com/openai/v1/realtime/translations?model={MODEL}"
SAMPLE_RATE = 24000
CHUNK_SAMPLES = 2400

async def main():
    credential = DefaultAzureCredential()
    token = await credential.get_token("https://cognitiveservices.azure.com/.default")

    ws = await connect(
        URL,
        additional_headers={
            "Authorization": f"Bearer {token.token}",
            "openai-alpha": "translation=v1",
        },
        max_size=None,
    )

    # Configure translation session with optional source transcription
    await ws.send(
        json.dumps({
            "type": "session.update",
            "session": {
                "audio": {
                    "input": {
                        "transcription": {"model": DEPLOYMENT},
                    },
                    "output": {
                        "language": TARGET_LANGUAGE,
                    },
                },
            },
        })
    )

    loop = asyncio.get_running_loop()
    mic_queue = asyncio.Queue()

    def on_audio(indata, frames, time, status):
        loop.call_soon_threadsafe(mic_queue.put_nowait, bytes(indata))

    stream = sd.RawInputStream(
        samplerate=SAMPLE_RATE,
        blocksize=CHUNK_SAMPLES,
        channels=1,
        dtype="int16",
        callback=on_audio,
    )
    stream.start()
    print(f"Listening and translating to '{TARGET_LANGUAGE}'... press Ctrl+C to stop.\n")

    async def send_audio():
        while True:
            chunk = await mic_queue.get()
            await ws.send(
                json.dumps({
                    "type": "session.input_audio_buffer.append",
                    "audio": base64.b64encode(chunk).decode("ascii"),
                })
            )

    transcript = []
    pending = ""

    async def receive_translations():
        nonlocal pending
        async for message in ws:
            event = json.loads(message)
            kind = event["type"]

            if kind == "session.output_transcript.delta":
                print(event["delta"], end="", flush=True)
            elif kind in ("session.output_transcript.completed", "session.output_transcript.done"):
                print()
            elif kind == "session.input_transcript.delta":
                pending += event["delta"]
            elif kind in ("session.input_transcript.completed", "session.input_transcript.done"):
                transcript.append(event.get("transcript") or pending)
                pending = ""
            elif kind == "error":
                print(f"\n[error] {event['error']['message']}\n")

    sender = asyncio.create_task(send_audio())
    receiver = asyncio.create_task(receive_translations())

    try:
        await asyncio.gather(sender, receiver)
    finally:
        stream.stop()
        stream.close()
        await ws.close()
        await credential.close()

        if pending:
            transcript.append(pending)

        print("\n\n--- Source Transcript (Original Speech) ---")
        for line in transcript:
            print(line)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
```

---

## Architectural Tradeoffs & Analysis

### Advantages
- **True Realtime Streaming**: Extremely low audio latency suitable for live broadcasting, conference subtitling, and real-time customer service translation.
- **Multilingual Fluidity**: Fluid switching between languages (e.g., English and Dutch) without reconfiguration or pipeline restarts.
- **LLM-Powered Semantic Disambiguation**: Unlike acoustic-only ASR models, the underlying model leverages contextual LLM comprehension to correctly transcribe homophones and technical jargon.

### Limitations & Considerations
- **Resource Footprint**: Overkill for basic, offline, or strictly local single-language transcription (where lightweight models like `nemotron-asr-streaming` or local Whisper models suffice).
- **Manual Turn Detection in Whisper**: `gpt-realtime-whisper` lacks native server-side VAD, necessitating client-side RMS buffer management.
- **Regional Availability**: Preview model availability is currently constrained to specific Azure regions (`france-central`).

## References & Official Documentation
- **Sample Repository**: [https://github.com/aryxenv/azure-gpt-realtime-whisper-translate](https://github.com/aryxenv/azure-gpt-realtime-whisper-translate)
- **OpenAI Voice Intelligence**: [Advancing Voice Intelligence with New Models in the API](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/)
- **Microsoft AI Foundry Technical Blog**: [A New Chapter for Realtime AI](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/4517124)
- **Azure OpenAI Service**: [Realtime Audio Quickstart](https://learn.microsoft.com/azure/ai-foundry/openai/realtime-audio-quickstart)
