require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Validate API key on startup
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY not set in .env file');
  process.exit(1);
}

app.use(express.json());
app.use(express.static('public'));

// Rate limiting: 30 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  skipSuccessfulRequests: false,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: '⚠️ Too many questions requested. Rate limit: 30 questions per 15 minutes. Please wait before requesting more.',
});

// Domain metadata
const DOMAINS = {
  d1: { name: 'Agentic Architecture & Orchestration', weight: 27 },
  d2: { name: 'Tool Design & MCP Integration', weight: 18 },
  d3: { name: 'Claude Code Configuration', weight: 20 },
  d4: { name: 'Prompt Engineering & Structured Output', weight: 20 },
  d5: { name: 'Context Management & Reliability', weight: 15 },
};

// Proxy endpoint for question generation
app.post('/api/ask', limiter, async (req, res) => {
  const { domain, previousTopics = [] } = req.body;

  if (!domain || !DOMAINS[domain]) {
    return res.status(400).json({ error: 'Invalid domain' });
  }

  const domainName = DOMAINS[domain].name;
  const avoidStr = previousTopics.length
    ? `Avoid these topics already covered: ${previousTopics.join(', ')}.`
    : '';

  const systemPrompt = `You are an expert exam question writer for the Claude Certified Architect — Foundations (CCAF) certification by Anthropic. Generate realistic, scenario-based multiple-choice questions exactly as they appear on the real exam.

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
}`;

  const userMessage = `Generate one exam question for domain: ${domainName}. ${avoidStr}
Make it scenario-based with plausible distractors representing real engineering mistakes.
Mix up which letter (A/B/C/D) is correct — do not always make B or C correct.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic API error:', err);
      return res.status(502).json({ error: err.error?.message || 'Anthropic API error' });
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();

    try {
      const question = JSON.parse(clean);
      res.json(question);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      res.status(500).json({ error: 'Invalid response format from AI' });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ CCAF Practice running at http://localhost:${PORT}`);
  console.log(`📚 Open http://localhost:${PORT} in your browser to begin`);
});
