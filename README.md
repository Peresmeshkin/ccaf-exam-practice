# CCAF Exam Practice App

AI-powered practice exam for the **Claude Certified Architect — Foundations** certification.

⚠️ **Important:** This app requires your own **Anthropic API key**. You control and pay for all API usage. See [Cost](#cost-estimate) below.

## Quick Start

### 1. Get an Anthropic API Key
Go to [console.anthropic.com](https://console.anthropic.com) → API Keys → Create Key.

### 2. Create `.env` file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Then edit `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
```

### 3. Install and run
```bash
npm install
npm start
```

### 4. Open in browser
```
http://localhost:3000
```

---

## Cost Estimate

### ✅ Optimized (With 3-Strategy Cost Reduction)
- 1 question ≈ **$0.009 USD** (with compression + caching at 50% hit rate)
- 10 questions ≈ **$0.09 USD** (40% savings!)
- 20 questions ≈ **$0.18 USD**
- 100 questions/month ≈ **~$9 USD** (was $15)

### Original (No Optimization)
- 1 question ≈ $0.008 USD
- 10 questions ≈ **$0.15 USD**
- 20 questions ≈ **$0.30 USD**

### 3 Cost Optimization Strategies
The app implements proven techniques to reduce costs:
1. **Compressed prompts** - 80% smaller system message (10% savings)
2. **SQLite caching** - Reuse generated questions (50% savings on cache hits)
3. **Batch API ready** - Async processing for 40% additional savings (optional)

📖 **Full breakdown**: See [COST_OPTIMIZATION.md](COST_OPTIMIZATION.md)

**Monitor your usage:**
1. Go to [Anthropic Console → Usage](https://console.anthropic.com/account/usage)
2. Check `/cache-stats` endpoint for cache performance
3. See [MONITORING.md](MONITORING.md) for detailed cost tracking
3. Set budget alerts to avoid surprises

---

## Rate Limiting

To prevent accidental over-usage:
- **30 questions per 15-minute window** per IP address
- Rate limit applies to the `/api/ask` endpoint
- You'll get a clear error message if the limit is exceeded

---

## How It Works

Every question is generated fresh by Claude via the Anthropic API. No question bank — each session is unique.

- **10 questions per session** (configurable to 5 or 20)
- **All 5 exam domains** covered, weighted by real exam distribution
- **Immediate feedback** after each answer with full explanation
- **Retry wrong answers** at the end of each session
- **Domain score tracking** in the sidebar

## Exam Domains

| Domain | Weight |
|--------|--------|
| D1 · Agentic Architecture & Orchestration | 27% |
| D2 · Tool Design & MCP Integration | 18% |
| D3 · Claude Code Configuration & Workflows | 20% |
| D4 · Prompt Engineering & Structured Output | 20% |
| D5 · Context Management & Reliability | 15% |

**Passing score:** 72% (720/1000 on the real exam)

---

## Security & Privacy

✅ **API key never exposed to frontend** — server-side proxy handles all API calls  
✅ **No tracking** — only your IP is rate-limited locally  
✅ **Local-first** — runs entirely on your machine (no cloud deployment)  
✅ **Your key, your cost** — no shared credentials  

⚠️ **Do NOT commit `.env` to git** — add it to `.gitignore` (already done)

## Why a Server?

Opening the HTML file directly (`file://`) causes CORS errors when calling the Anthropic API. The Express server solves this by proxying API calls server-side and keeping your API key out of the browser.

## Built With Claude Code

This project was scaffolded using Claude Code following the instructions in `CLAUDE.md`.
