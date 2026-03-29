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

### ✅ Optimized (With 4-Strategy Cost Reduction)
- 1 question ≈ **$0.0024 USD** (Haiku + compressed prompt + caching)
- 10 questions ≈ **$0.024 USD** (87% savings!)
- 20 questions ≈ **$0.048 USD**
- 100 questions/month ≈ **~$2.40 USD** (was $15.90)

### Original (Sonnet 4)
- 1 question ≈ $0.008 USD
- 10 questions ≈ **$0.15 USD**
- 20 questions ≈ **$0.30 USD**

### Cost Optimization Details
The app implements **4 strategies** for dramatic cost reduction:
1. **Claude Haiku** instead of Sonnet 4 (73% cheaper model)
2. **Compressed prompts** (80% smaller system prompt)
3. **SQLite caching** (50% questions reused from cache)
4. **Batch API ready** (40% additional savings when enabled)

📖 **Full breakdown**: See [COST_OPTIMIZATION.md](COST_OPTIMIZATION.md)

**Monitor your usage:**
1. Go to [Anthropic Console → Usage](https://console.anthropic.com/account/usage)
2. Check `/cache-stats` endpoint for cache performance
3. Expected monthly costs: See [MONITORING.md](MONITORING.md)
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
