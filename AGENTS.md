# AGENTS.md

This file provides guidance to Coding Agents when working with code in this repository.

## Project

This is a futur IA Agent App, a coding-agent framework built on **LangGraph** + **Deep Agents** (`deepagents.create_deep_agent`). It runs as a LangGraph app: each thread spawns its own isolated cloud sandbox, and the agent is invoked from Slack, Linear, or GitHub (PR comments, plus auto-review on opened / ready-for-review).

A separate **reviewer** graph runs read-only code reviews on PRs, and a **review-style analyzer** graph learns per-repo review style from historical PRs.

## Commands

Dependencies are managed with **uv**. Tests use pytest (`asyncio_mode = "auto"`). Lint/format is **ruff** (line-length 100, target py311). `requires-python = ">=3.11"`; `langgraph.json` pins the runtime to 3.12.

```bash
make install            # uv pip install -e .
make dev                # uv run langgraph dev — serves all three graphs + the FastAPI app from langgraph.json
make run                # uvicorn agent.webapp:app --reload --port 8000 (FastAPI only, no LangGraph runtime)
make test               # uv run pytest -vvv tests/
make test TEST_FILE=tests/test_open_pr_middleware.py    # single test file
uv run pytest -vvv tests/test_open_pr_middleware.py::test_name  # single test
make lint               # ruff check + ruff format --diff
make format             # ruff format + ruff check --fix
```