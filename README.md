# Launcher

An AI-powered startup analysis platform. Input a business idea and get back market validation, a lean business model, competitor positioning, and a 10-slide investor pitch deck generated through a 4-step LLM reasoning pipeline backed by a RAG system.

Live: https://launcher-frontend.onrender.com

---

## What it does

Launcher runs a structured analysis pipeline on any startup idea:

1. Market categorization - identifies industry, market size, and target customers
2. SWOT analysis - conditioned on step 1 output
3. Competitor and positioning analysis - conditioned on steps 1 and 2
4. Pitch narrative synthesis - investor hook, recommendations, value proposition

Each step feeds into the next. Past analyses are stored as vector embeddings in ChromaDB and retrieved via cosine similarity to provide context for new queries.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Python, Flask, Gunicorn |
| LLM | Llama 3.3 70B (via Groq) |
| RAG | ChromaDB (persistent vector store, cosine similarity) |
| Auth | JWT (PyJWT) |
| Database | SQLAlchemy, PostgreSQL (SQLite for tests) |
| CI/CD | GitHub Actions |
| Deployment | Render |

---

## API endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /api/validate-idea | POST | yes | Full 4-step pipeline - market validation |
| /api/generate-plan | POST | yes | Business plan generation |
| /api/generate-business-model | POST | yes | Lean Canvas generation |
| /api/generate-pitch | POST | yes | 10-slide investor pitch deck |
| /api/analyze-market | POST | no | Market analysis via Google Trends + Census |
| /api/rag-stats | GET | no | ChromaDB vector store stats |
| /api/health | GET | no | Health check |

---

## Architecture

Every analysis endpoint uses a 3-tier fallback:

    Groq LLM pipeline -> hardcoded business mappings -> web scraper

If the LLM pipeline returns a valid category, that result is used. If the HF API is down or returns garbage, it falls back to curated mappings (55KB of structured business data). The scraper is last resort.

RAG context is injected into Step 1 of the pipeline. Completed analyses are embedded and stored in ChromaDB so future similar queries benefit from past results.

---

## Running locally

Backend:

    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py

Frontend:

    cd frontend
    npm install
    npm run dev

Set GROQ_API_KEY and SECRET_KEY as environment variables before starting the backend.

---

## Tests

    cd backend
    source venv/bin/activate
    pytest tests/test_api.py -v

10 tests covering auth, protected routes, and all major endpoints. 8 pass in CI (2 require a live Groq API key and are expected to skip in the GitHub Actions environment).

---

## Author

Vishak Baddur - https://github.com/VishakBaddur
