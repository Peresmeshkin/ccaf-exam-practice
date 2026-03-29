# CCAF Exam Practice App — Claude Code Instructions

## Project Overview
Build a locally-served web application for practising the **Claude Certified Architect — Foundations (CCAF)** certification exam. The app uses the Anthropic API to generate fresh scenario-based questions dynamically.

## Why a Server is Required
The app calls the Anthropic API from the browser. Opening an HTML file directly via `file://` causes CORS errors — the browser blocks requests from null origins. The solution is a lightweight local HTTP server that serves the frontend over `http://localhost`.

---

## Tech Stack
- **Backend**: Node.js + Express (serves static files and proxies API calls)
- **Frontend**: Vanilla HTML/CSS/JS (single page, no framework needed)
- **API**: Anthropic Messages API (`claude-sonnet-4-20250514`)
- **Config**: `.env` file for the API key

Do NOT use React, Vue, or any frontend framework. Keep it simple — one HTML file served by Express.

---

## Project Structure to Create

```
ccaf-exam-practice/
├── CLAUDE.md              ← this file (already exists)
├── README.md              ← already exists
├── .env                   ← create this (see below)
├── .gitignore             ← create this
├── package.json           ← create this
├── server.js              ← create this (Express server)
└── public/
    └── index.html         ← create this (full frontend app)
```

---

## Step-by-Step Build Instructions

### Step 1 — Initialise the project
```bash
npm init -y
npm install express dotenv
```

### Step 2 — Create `.gitignore`
```
node_modules/
.env
```

### Step 3 — Create `.env`
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```
After creating `.env`, tell the user: "Add your Anthropic API key to the `.env` file before starting the server."

### Step 4 — Create `server.js`

The server must:
- Load `.env` with `dotenv`
- Serve everything in `public/` as static files
- Expose one POST endpoint: `/api/ask` that proxies requests to the Anthropic API
- The proxy endpoint receives `{ domain, previousTopics }` from the frontend and returns the generated question JSON
- Never expose the API key to the frontend
- Handle errors gracefully and return `{ error: message }` with appropriate HTTP status

```javascript
// server.js skeleton
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/ask', async (req, res) => {
  // Build the Anthropic API request using req.body.domain and req.body.previousTopics
  // Forward to https://api.anthropic.com/v1/messages
  // Use process.env.ANTHROPIC_API_KEY in the x-api-key header
  // Return the parsed question JSON to the frontend
});

app.listen(PORT, () => console.log(`CCAF Practice running at http://localhost:${PORT}`));
```

### Step 5 — Create `public/index.html`

This is the full single-page application. Build it with the following requirements:

#### Visual Design
- Dark theme: deep navy/charcoal background (`#0d1117`), slightly lighter surfaces
- Monospace font for code elements, labels, scores: IBM Plex Mono or similar from Google Fonts
- Sans-serif for body text: IBM Plex Sans or similar
- Accent colour: amber/gold (`#f0b429`) for highlights, active states, progress
- Green (`#3fb950`) for correct answers, red (`#f85149`) for wrong answers, blue (`#58a6ff`) for selected state
- Use CSS custom properties (variables) for all colours
- No external CSS frameworks — pure CSS only

#### Layout
- Sticky header: app name left, live score + timer right
- Two-column layout: 240px sidebar left, main content right
- Sidebar: domain list with live % scores, progress bar, question map dots
- Main: renders start screen / loading / question / results depending on state

#### Start Screen
- Title, subtitle
- Info cards: Questions (configurable), Format (MCQ), Passing Score (72%)
- Domain list with weight bars (D1=27%, D2=18%, D3=20%, D4=20%, D5=15%)
- Dropdowns: focus domain (All / D1 / D2 / D3 / D4 / D5), question count (5 / 10 / 20)
- "Begin Practice Exam →" button

#### Question Screen
- Question number + domain tag (colour-coded per domain) + difficulty label
- Scenario box (amber left border) — shown only when scenario exists
- Question text (larger, prominent)
- Four option buttons (A/B/C/D) — each with letter badge + text
- On selection: correct option turns green, wrong selection turns red, others dim
- Feedback box slides in below options showing: correct/wrong verdict, full explanation, "Mental Model" callout box
- "Next Question →" and "Skip" buttons

#### Loading Screen
- Centered spinner + rotating loading messages

#### Results Screen
- Score circle (green if ≥72%, red if below) with percentage and PASS/FAIL verdict
- Stats: correct, wrong, skipped, time taken
- Domain breakdown: bar chart per domain with colour-coded performance
- Knowledge gaps section: lists weak domains with specific study advice
- Buttons: "New Session →" and "Retry Wrong Answers"

#### Frontend API Integration
The frontend must call `/api/ask` (local server endpoint) instead of the Anthropic API directly:

```javascript
async function generateQuestion(domainKey, previousTopics) {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain: domainKey, previousTopics })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Server error');
  }
  return response.json(); // already parsed question object
}
```

---

## Anthropic API Prompt — Use Exactly This

The server must send this to the Anthropic API when `/api/ask` is called:

### System Prompt
```
You are an expert exam question writer for the Claude Certified Architect — Foundations (CCAF) certification by Anthropic. Generate realistic, scenario-based multiple-choice questions exactly as they appear on the real exam.

EXAM FACTS:
- Domain 1 (27%): Agentic Architecture & Orchestration — hub-and-spoke patterns, coordinator/subagent design, task decomposition, the Task tool, stop_reason values, parallel vs sequential subagent invocation, workflow enforcement spectrum (prompt vs programmatic), agentic loop design, root cause tracing in multi-agent failures.
- Domain 2 (18%): Tool Design & MCP Integration — MCP primitives (tools/resources/prompts), tool boundary design, structured error responses, tool scoping, MCP server/client config, Python/TypeScript transports, preventing tool misuse.
- Domain 3 (20%): Claude Code Configuration — CLAUDE.md hierarchy, .mcp.json (project-level), ~/.claude.json (user-level), -p/--print flag for non-interactive CI/CD, --output-format json, --json-schema, plan mode, Agent Skills, context:fork, VCS-committed config.
- Domain 4 (20%): Prompt Engineering & Structured Output — few-shot techniques, JSON schema enforcement via API, validation+retry loops, explicit criteria design, stop_sequences, system prompt structure, handling format drift, self-correction patterns.
- Domain 5 (15%): Context Management & Reliability — context window saturation, chunking strategies, re-injection of critical context, escalation patterns, error propagation in multi-agent systems, prompt caching, Batch API cost optimisation, context dilution over long pipelines.

KEY EXAM PATTERNS the correct answer always reflects:
1. Deterministic > probabilistic for high-stakes decisions
2. Programmatic enforcement > prompt instructions for critical business logic
3. Root cause tracing to the origin (coordinator not subagent for scope gaps)
4. Tool scoping — expose minimum tools needed
5. Code/config > prompt for immutable rules
6. Never "bigger model" as an architectural fix
7. Never "higher temperature" for reliability

DISTRACTOR PATTERNS used in wrong answers:
- Prompt-based fix when programmatic is needed
- Bigger/better model as the fix
- Temperature adjustment for non-randomness problems
- Monitoring instead of prevention
- Wrong component blamed (subagent instead of coordinator)
- Infrastructure fix for a logic problem

RESPONSE FORMAT — return ONLY valid JSON, no markdown, no preamble:
{
  "domain": "D1|D2|D3|D4|D5",
  "topic": "short topic name",
  "difficulty": "medium|hard",
  "scenario": "realistic production scenario 2-4 sentences OR empty string",
  "question": "the exam question",
  "options": {
    "A": "option text",
    "B": "option text",
    "C": "option text",
    "D": "option text"
  },
  "correct": "A|B|C|D",
  "explanation": "2-3 sentences explaining why the correct answer is right",
  "why_wrong": {
    "A": "why wrong (only for incorrect options)",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "mental_model": "one memorable rule capturing the key insight"
}
```

### User Message (build dynamically from request body)
```
Generate one exam question for domain: {domain.name}. {avoidStr}
Make it scenario-based with plausible distractors representing real engineering mistakes.
Mix up which letter (A/B/C/D) is correct — do not always make B or C correct.
```

---

## Domain Metadata (use in both server and frontend)

```javascript
const DOMAINS = {
  d1: { name: 'Agentic Architecture & Orchestration', short: 'Agentic Architecture', weight: 27 },
  d2: { name: 'Tool Design & MCP Integration',        short: 'Tool Design & MCP',   weight: 18 },
  d3: { name: 'Claude Code Configuration',            short: 'Claude Code',         weight: 20 },
  d4: { name: 'Prompt Engineering & Structured Output', short: 'Prompt Engineering', weight: 20 },
  d5: { name: 'Context Management & Reliability',     short: 'Context & Reliability', weight: 15 },
};
```

Domain selection when "All Domains" is chosen: pick randomly weighted by the `weight` values above.

---

## Error Handling Requirements

- If the Anthropic API returns a non-200 response, the server logs the error and returns `{ error: "message" }` with status 502
- If JSON parsing of the API response fails, return `{ error: "Invalid response format from AI" }` with status 500
- The frontend shows a styled error box (red border) with the error message and keeps the Skip button visible so the user can move past a failed question
- Never crash the server on a bad API response

---

## npm Scripts to Add to package.json

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js"
}
```

---

## How to Run (tell the user at the end)

```bash
# 1. Add your API key to .env
# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
# http://localhost:3000
```

---

## Coding Standards
- Use `async/await` throughout, no raw `.then()` chains
- Validate that `ANTHROPIC_API_KEY` exists on startup — if missing, log a clear error and exit
- Keep `server.js` under 100 lines — it should only serve files and proxy the API
- Keep all frontend logic in `public/index.html` — no separate JS or CSS files
- Comment any non-obvious logic
- No TypeScript — plain JavaScript only
