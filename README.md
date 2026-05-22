# 🚀 Launcher - AI-Powered Startup CoFounder

Launcher is an end-to-end AI-powered SaaS platform that accelerates the startup lifecycle by automating:

- 📈 Business idea validation
- 🧠 Market research & sentiment analysis
- 🏢 Competitor discovery
- 📊 Business model generation
- 🎤 Investor-ready pitch deck creation

[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-Python-yellow.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/API-Flask-black.svg)](https://flask.palletsprojects.com/)
[![Render](https://img.shields.io/badge/Hosted%20On-Render-purple.svg)](https://render.com/)

---

## 🌐 Live Demo

🚀 Try Launcher here:
https://launcher-frontend.onrender.com

---

# 🎯 Project Overview

Launcher acts as an AI-powered startup cofounder assisting entrepreneurs through the early stages of company formation.

The system analyzes startup ideas and generates:

- 📈 Market validation reports
- 🧠 Competitor intelligence
- 📰 Market sentiment analysis
- 📊 Lean business model structures
- 🎤 AI-generated pitch deck content (10 investor-ready slides)
- ⚡ Real-time dashboard visualizations

---

# 🏗️ System Architecture

```text
+----------------------+
|      User Browser    |
|   (React Frontend)   |
+----------+-----------+
           |
           | HTTPS Requests
           |
+----------v-----------+
|    Flask API Server  |
|  (Business Logic)    |
+----------+-----------+
           |
           | AI Orchestration Layer
           |
+----------v-----------+
|    Validation Engine |
|  Market & Sentiment  |
+----------+-----------+
           |
  +--------+--------+----------------+
  |                 |                |
+v------+    +------v------+   +-----v------+
| Market|    | Competitor  |   | Sentiment  |
| Data  |    | Extraction  |   | Analysis   |
|Scraper|    |  Services   |   |  Engine    |
+---+---+    +------+------+   +------+------+
    |                 |                 |
    +-----------------+-----------------+
                      |
          +-----------v-----------+
          | Business Model Engine |
          |  Lean Canvas Builder  |
          +-----------+-----------+
                      |
          +-----------v-----------+
          | Pitch Deck Generator  |
          | 10-Slide Investor Deck|
          +-----------+-----------+
                      |
          +-----------v-----------+
          | Structured JSON APIs  |
          | Charts & Insights     |
          +-----------+-----------+
                      |
          +-----------v-----------+
          | React Dashboard UI    |
          | Reports & Visuals     |
          +-----------------------+
```

---

# 🛠️ Core Features

## ✅ Automated Startup Validation
Analyze startup viability using AI-driven market and trend analysis.

## ✅ Competitive Landscape Discovery
Extracts direct competitors, adjacent startups, and market positioning signals.

## ✅ Market Sentiment Analysis
Processes external trends to estimate market readiness, audience demand, and growth momentum.

## ✅ AI Business Model Generation
Converts startup concepts into structured Lean Canvas business frameworks.

## ✅ Pitch Deck Generation
Generates a 10-slide investor-ready pitch deck including Problem, Solution, Market Opportunity, Traction, Competition, Business Model, Team, Financials, and The Ask.

---

# 🚀 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/validate-idea` | `POST` | Executes AI startup validation workflow |
| `/api/generate-plan` | `POST` | Generates structured business plan |
| `/api/generate-business-model` | `POST` | Generates Lean Canvas business model |
| `/api/generate-pitch` | `POST` | Produces 10-slide investor pitch deck |
| `/api/analyze-market` | `POST` | Runs market analysis on a startup idea |
| `/api/health` | `GET` | Health check |

---

# 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, Tailwind CSS |
| Backend | Python, Flask, Gunicorn |
| AI/Data Layer | Hugging Face Zephyr-7b, BeautifulSoup, Selenium, TextBlob, pytrends |
| Database | SQLAlchemy, PostgreSQL |
| Infrastructure | Render |
| API Format | REST + JSON |

---

# 🛡️ Robustness & Stability

The platform uses a **Resilient Data Contract Architecture** to guarantee frontend stability under incomplete or async AI responses.

**Backend** enforces strict schema defaults:
```json
{ "competitors": [], "news": [], "market_trends": [] }
```

**Frontend** uses optional chaining (`?.`) and null coalescing (`|| []`) to eliminate UI crashes.

---

# 📚 Engineering Highlights

- Built a full-stack AI SaaS platform integrating React and Flask
- Designed resilient API contracts for safe frontend rendering
- Implemented modular AI orchestration pipelines for startup analysis
- Integrated Hugging Face LLM (Zephyr-7b-beta) for AI-powered research workflows
- Engineered defensive frontend rendering for asynchronous AI data
- Deployed production infrastructure on Render with continuous deployment

---

# 🤝 Contributing

```bash
git checkout -b feature/AmazingFeature
git commit -m "Add AmazingFeature"
git push origin feature/AmazingFeature
```

Then open a Pull Request.

---

# 🔗 Connect With Me

- GitHub: [@VishakBaddur](https://github.com/VishakBaddur)
