---
title:
  "Simple AI Agent Sandbox: Ephemeral Docker Isolation for Every AI Session"
date: 2026-05-26
tags:
  - ai
  - llm
  - docker
  - langgraph
  - python
  - opensource
  - agentic
---

AI agents are exciting. Give a capable LLM the ability to run code, write files,
and execute shell commands, and suddenly you have a system that can actually
_do_ things rather than just talk about them. But that power comes with a sharp
edge: **an agent that can run arbitrary shell commands can do a lot of damage if
it goes sideways.**

The typical response is to add guardrails at the prompt level: _"don't delete
files"_, _"only modify files in this directory"_. This works until it doesn't.
Prompts are soft constraints. A Docker container is a hard one.

That's the idea behind
[**simple-ai-agent-sandbox**](https://github.com/anshulpatel25/simple-ai-agent-sandbox):
_every agent session gets its own fresh, ephemeral Ubuntu container_. When the
session ends, the container is destroyed. Clean slate, every time.

<!--more-->

<!-- markdownlint-disable-file MD013 -->

## 🗺️ The Architecture at a Glance

The design is intentionally minimal. Three pieces working together:

```goat
+----------------------------------------------------------+
|                      Host Machine                        |
|                                                          |
|  +--------------+   docker run    +------------------+   |
|  |   cli.py     | --------------> |  ubuntu:latest   |   |
|  |   (REPL)     |                 |  (per session)   |   |
|  |              | <-- stdout/err--+------------------+   |
|  +------+-------+                                        |
|         |                                                |
|         v                                                |
|  +--------------+                                        |
|  |  LangGraph   |  agent -> tools -> agent loop          |
|  |  ReAct Graph |                                        |
|  +------+-------+                                        |
|         |                                                |
|         v                                                |
|  +--------------+                                        |
|  |  LM Studio   |  OpenAI-compatible local API           |
|  |  (localhost) |  http://localhost:1234/v1              |
|  +--------------+                                        |
+----------------------------------------------------------+
```

The **REPL** (`cli.py`) is what you interact with. You type a prompt, it
assembles the conversation, and hands it off to the **LangGraph ReAct loop**.
The agent reasons, decides to act, and routes tool calls to the **Docker
container manager** which executes them inside the ephemeral container. Results
flow back, the agent reasons again, and this continues until it signals that
it's done.

The **LLM backbone** is [LM Studio](https://lmstudio.ai/) running locally,
exposed on an OpenAI-compatible endpoint. No cloud API keys needed. The whole
system runs on your machine, air-gapped if you want it to be.

---

## 🧱 The Isolation Problem (And Why Prompts Don't Solve It)

Before getting into implementation, let's be precise about _what_ we're
isolating and _why_ it matters.

An agentic loop with shell access can:

- Modify or delete host filesystem files
- Install packages that pollute the host environment
- Leak secrets between sessions (residual files, history, environment variables)
- Consume unbounded disk space or CPU on the host

A prompt that says _"clean up after yourself"_ is a polite request. A Docker
container with `--rm` is a guarantee. When the container exits, it's gone. No
residue. No cross-session state bleed. The host machine stays clean.

This matters even more when you imagine running **multiple concurrent agent
sessions** - something you'd absolutely want in any production or
semi-production agentic setup. Without container isolation, sessions can step on
each other. With it, they're completely oblivious to each other's existence.

---

## ⚙️ How the Container Manager Works

The heart of the sandbox is `agent/container/manager.py`, the
`DockerContainerManager`. Its lifecycle is simple and deliberate:

### 1. Session Start: Spin Up a Fresh Container

When a new REPL session begins, the manager calls `docker run` with
`ubuntu:latest` (or whatever base image is configured). The key flags:

- **`--rm`**: container is automatically removed when it stops
- **`detach=True`**: runs in the background; the host process isn't blocked
- **`stdin_open=True` / `tty=True`**: keeps the container alive so the agent can
  `exec` commands into it repeatedly without spawning a new container per
  command

The container is running and waiting. Nothing has happened yet.

### 2. During the Session: Execute Commands via `exec`

When the agent invokes `BashSkill`, the manager calls `docker exec` on the
running container. The command runs inside the container's filesystem and
process namespace. stdout and stderr come back to the host. The container's
state persists across multiple `exec` calls within a session (so you can `cd`
into a directory and the next command remembers it), but that state is
**isolated to this session's container.**

### 3. Session End: Guaranteed Destruction

The manager registers a **`atexit` handler** and a **`SIGINT`/`SIGTERM` signal
handler** at startup. Whether the session exits cleanly, crashes with an
unhandled exception, or gets interrupted with `Ctrl-C`, the container is
destroyed. This is the guarantee that makes the sandbox trustworthy.

```
Normal exit   → atexit handler fires → container.stop() + container.remove()
Ctrl-C        → SIGINT handler fires → container.stop() + container.remove()
Crash         → atexit handler fires → container.stop() + container.remove()
```

Ephemeral really means ephemeral.

---

## 🤖 The Agentic Loop: LangGraph ReAct

The agent logic uses [LangGraph](https://github.com/langchain-ai/langgraph) to
implement a **ReAct (Reason + Act)** loop, the standard pattern for tool-using
agents.

The graph has two nodes:

| Node    | What it does                                                                                             |
| ------- | -------------------------------------------------------------------------------------------------------- |
| `agent` | Sends the conversation to the LLM; receives a response that either includes tool calls or a final answer |
| `tools` | Executes the tool calls the agent requested; feeds results back into the conversation                    |

The `should_continue` edge function decides what comes next: if the LLM's last
message contains tool calls, route to `tools`. If it's a final answer, end the
loop.

```goat
          START
            |
            v
     +-----------+
     |   agent   | <---------+
     +-----------+           |
            |                |
    tool_calls?              |
       |        |            |
      YES       NO           |
       |        |            |
       v        v            |
   +-------+  END            |
   | tools |                 |
   +-------+                 |
       |                     |
       +---------------------+
         (results fed back)
```

The graph is built in `build_graph()`, a pure factory function that accepts the
LLM client and skill registry as arguments. This makes it fully testable in
isolation: no Docker daemon, no LM Studio, no side effects required to unit test
the reasoning logic.

---

## 🧩 Skills: Extensibility by Design

The agent's capabilities are modelled as **Skills**. Each skill is a concrete
implementation of the `Skill` ABC defined in `agent/skills/base.py`:

```python
class Skill(ABC):
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    def description(self) -> str: ...

    @abstractmethod
    def execute(self, **kwargs) -> str: ...
```

The `SkillRegistry` holds all registered skills and exposes them to LangGraph as
tool definitions. The LLM sees the skill names and descriptions; when it decides
to act, the registry dispatches the call to the right skill.

The only skill shipped today is `BashSkill`, which runs arbitrary shell commands
inside the container and returns the combined stdout/stderr. That single skill
is surprisingly capable: install packages, write scripts, fetch URLs with
`curl`, run Python, compile code, process files. A bash shell is a remarkably
expressive primitive.

Adding a new skill requires **zero changes to existing code**. Write a new
class, register it, and the LLM can use it on the next run. The architecture
genuinely earns the word _extensible_.

---

## 🚀 Getting Started

The setup is intentionally minimal. You need Python 3.12+, Docker, and
[LM Studio](https://lmstudio.ai/) running with a model loaded.

```bash
# 1. Install uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Clone and install dependencies
git clone https://github.com/anshulpatel25/simple-ai-agent-sandbox
cd simple-ai-agent-sandbox
uv sync

# 3. Configure environment
cp .envrc.example .envrc
# Edit .envrc: set LLM_MODEL to the model name shown in LM Studio

# 4. Start LM Studio → load a model → enable "Start Server"

# 5. Run the agent
uv run main.py
```

And you're in a REPL session, with a fresh Ubuntu container waiting for your
first prompt.

---

## 🏁 Why This Architecture Matters

Sandboxing isn't just a safety feature, it's an **architectural primitive** that
unlocks a whole class of agentic workloads you'd be nervous to run otherwise.

With per-session container isolation you can:

- **Experiment freely**: ask the agent to try multiple approaches, install
  conflicting packages, delete and recreate files. Nothing leaks to the host.
- **Run concurrent sessions safely**: spin up ten agent sessions in parallel.
  Each is oblivious to the others.
- **Reproduce sessions deterministically**: start with the same base image every
  time, and the agent always begins from a known clean state.
- **Limit blast radius**: even if the agent does something unexpected, the worst
  case is a corrupted container that gets cleaned up on exit.

The combination of LangGraph's structured agentic loop, the Docker-backed
sandbox, and the skill extensibility model makes `simple-ai-agent-sandbox` a
solid foundation to build more capable, more trusted agentic systems on top of.

The code is clean, the architecture is explained, and the constraints are
deliberate. If you're exploring local AI agents and care about **doing it
safely**, this is a great place to start. 🚀

Check out the project on
[GitHub](https://github.com/anshulpatel25/simple-ai-agent-sandbox), and if you
build something interesting on top of it, I'd love to hear about it.

Happy building! 🛠️
