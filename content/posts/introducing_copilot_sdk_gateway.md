---
title:
  "Introducing copilot-sdk-gateway: Bridging GitHub Copilot and Your Automation
  Workflows"
date: 2026-03-05
tags:
  - "ai"
  - "llm"
  - "python"
---

Like many developers, I've become hooked on AI powered automation.
[N8N](https://n8n.io/) has been my go-to platform for orchestrating daily tasks
from summarizing articles to processing notifications. But there's been one
persistent friction point: **getting diverse LLM providers to play nicely with
existing workflows.**

Most workflow tools expect the OpenAI API format (or its close cousin, the
Ollama API spec). GitHub Copilot, with its incredibly compelling pricing model,
didn't speak that language. Until now. 🚀

<!--more-->

## What is copilot-sdk?

Before diving into the gateway, let's talk about GitHub's
[copilot-sdk](https://github.com/github/copilot-sdk). Think of it as **Copilot's
engine for developers** the same production tested agent runtime behind the
Copilot CLI, now available as a programmable SDK for Python, TypeScript, Go, and
.NET.

Here's how it works:

```goat
+--------------------+
|  Your Application  |
+--------------------+
          |
          v
+--------------------+
|    SDK Client      |
+--------------------+
          |
      JSON-RPC
          |
          v
+--------------------+
|   Copilot CLI      |
|  (Server Mode)     |
+--------------------+
```

The SDK manages the Copilot CLI process lifecycle automatically. You define
agent behavior, and Copilot handles the heavy lifting: planning, tool
invocation, file edits, and orchestration. It's like having an AI assistant with
a Swiss Army knife of capabilities file system operations, Git operations, web
requests all available programmatically.

It's powerful. It's elegant. But there's a catch.

## The Problem: API Incompatibility

The copilot-sdk speaks its own dialect of JSON-RPC. Meanwhile, the automation
ecosystem tools like N8N, Open WebUI, etc expect the
[OpenAI/Ollama API specification](https://github.com/ollama/ollama/blob/main/docs/api.md).
These are fundamentally different protocols.

For someone with multiple N8N workflows already in production, rewriting
integrations wasn't practical. I needed a **translation layer** something that
could accept requests in OpenAI format and forward them to Copilot.

That's where
[copilot-sdk-gateway](https://github.com/anshulpatel25/copilot-sdk-gateway)
comes in.

## Enter copilot-sdk-gateway

The gateway is a FastAPI based HTTP proxy that sits between
OpenAI-API-compatible clients and the GitHub Copilot backend. Here's the
architecture:

```goat
+------------------------------------------+
|  OpenAI-compatible client                |
|  (e.g., N8N)            |
+------------------------------------------+
                  |
                  v
    HTTP (Ollama wire format, port 11434)
                  |
                  v
+------------------------------------------+
|       copilot-sdk-gateway                |
+------------------------------------------+
                  |
                  v
      github-copilot-sdk (Python)
                  |
                  v
+------------------------------------------+
|  Copilot CLI (spawned per request)       |
+------------------------------------------+
                  |
                  v
+------------------------------------------+
|  GitHub Copilot / LLM backend            |
+------------------------------------------+
```

The design philosophy is straightforward:

- **Per-request isolation** - Every HTTP request creates its own `CopilotClient`
  session. No shared mutable state between concurrent calls.
- **Streaming emulation** - The SDK fetches the full response, then chunks it
  into word level pieces delivered as NDJSON.
- **Model ID normalization** - Any `:tag` suffix (like `:latest`) is stripped
  before forwarding to the SDK.
- **12-factor config** - All configuration from environment variables. No
  hardcoded secrets.

## Why GitHub Copilot?

You might be wondering: **Why go through all this trouble when there are dozens
of LLM providers?**

The answer is GitHub Copilot's
[**unique pricing model**](https://docs.github.com/en/copilot/get-started/plans).

Most LLM aggregators (e.g. OpenRouter) charge per token. GitHub Copilot, on the
other hand, offers **unlimited requests** for certain models, with a concept of
"premium requests" for frontier models.

For my use case running dozens of automated workflows daily this is a
game-changer.

## The Tradeoff: Inference Latency

There's no free lunch. The gateway introduces **higher inference latency**
compared to direct API calls to providers like OpenAI or Anthropic. This is
because:

1. Requests go through the Copilot CLI subprocess
2. The SDK adds orchestration overhead
3. The gateway itself introduces a translation layer

For real-time applications or chatbots, this might be a dealbreaker. But for my
use case**background automation workflows** latency is a non-issue. Whether a
summary takes 2 seconds or 5 seconds doesn't impact my daily routine.

## Getting Started

Want to try it yourself? The setup is straightforward:

```bash
# Clone and enter the repo
git clone https://github.com/anshulpatel25/copilot-sdk-gateway
cd copilot-sdk-gateway

# Install dependencies (uses uv)
uv sync

# Configure (optional defaults work for local dev)
export GITHUB_TOKEN="ghp_..."   # or rely on `copilot auth login`

# Run the gateway
uv run python -m copilot_sdk_gateway.main
# → Listening on http://0.0.0.0:11434
```

Point any OpenAI-API-compatible client at `http://localhost:11434`, and you're
off to the races.

The gateway exposes three main endpoints:

- `GET /api/version` - Returns gateway version
- `GET /api/tags` - Lists available Copilot models in Ollama format
- `POST /api/chat` - Multi-turn chat completion
- `POST /api/generate` - Single-turn text generation

Both `/chat` and `/generate` support streaming (`"stream": true`).

## Observability Built-In

One feature I'm particularly proud of: **Prometheus metrics out of the box**.
The gateway exposes `/metrics` with business critical telemetry:

- `completions_total` Successful inferences by model and endpoint
- `prompt_length_chars` / `response_length_chars` Histogram of prompt/response
  sizes
- Standard HTTP metrics (request duration, status codes, etc.)

This makes it trivial to monitor your LLM usage and debug performance issues.
