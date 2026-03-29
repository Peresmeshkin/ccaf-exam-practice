# Monitoring Your API Usage

## Real-Time Dashboard

### Check Usage Anytime

1. Go to [console.anthropic.com/account/usage](https://console.anthropic.com/account/usage)
2. View today's, week's, and month's usage
3. See costs broken down by model

---

## Setting Budget Alerts

### Anthropic Console

1. Go to [console.anthropic.com/account/billing/overview](https://console.anthropic.com/account/billing/overview)
2. Click **"Billing alerts"**
3. Set threshold (e.g., $10/month)
4. You'll get email if you exceed it

### Email Notifications

- Sent when you hit your alert threshold
- Daily digest of usage
- Billing receipts at month-end

---

## Understanding Your Costs

### Token Breakdown

Each question generation costs:

```
System prompt:    ~600 tokens
User request:     ~200 tokens
Claude response:  ~700 tokens
─────────────────────────
Total:           ~1,500 tokens per question
```

### Price Per Session

**Claude Sonnet 4:**
- Input: $3/M tokens
- Output: $15/M tokens

**10-question session:**
- Input: ~8,000 tokens = $0.024
- Output: ~7,000 tokens = $0.105
- **Total: ~$0.13 per session**

---

## Monitoring Commands

### Check Server Logs (Local)

The server logs every API call:

```bash
# Server output will show:
# [INFO] POST /api/ask — 1,432 tokens
# [INFO] Claude response: 703 tokens
```

### Count Your Questions

1 session = number of questions × cost per question

Example:
- 5 questions = $0.065
- 10 questions = $0.13
- 20 questions = $0.26

---

## Regular Check-In Schedule

### Daily (During Intensive Study)

```
Morning: Check usage dashboard
Evening: Review API calls
Night: Verify rate limits weren't hit
```

### Weekly

```
Monday: Review last week's spend
Friday: Plan usage for next week
```

### Monthly

```
1st: Check Anthropic invoice
15th: Mid-month review
30th: Plan budget for next month
```

---

## Warning Signs

⚠️ **Investigate if you see:**

- Sudden spike in question generation
- Rate limit errors (30 limit exceeded)
- Unexpected increase in token usage
- API errors (5xx status codes)

### Quick Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Rate limit hit | Generated too many questions | Wait 15 min or increase limit |
| High token count | Malformed questions | Check server logs |
| API errors | Network issue | Restart server |
| Unauthorized | Wrong API key | Verify `.env` file |

---

## Cost Forecasting

### Budget Planning

```
Monthly usage = (sessions/month) × (questions/session) × $0.013/question

Example:
- 20 sessions/month
- 10 questions/session
- 20 × 10 × $0.013 = $2.60/month
```

### Adjust Question Count to Save Money

| Questions | Cost/Session |
|-----------|--------------|
| 5 | $0.065 |
| 10 | $0.13 |
| 20 | $0.26 |

---

## API Key Rotation

If you think your key was compromised:

1. **Deactivate** old key in Anthropic console
2. **Create** new API key
3. **Update** `.env` with new key
4. **Restart** server
5. **Monitor** usage closely for 48 hours

---

## Advanced Monitoring (Optional)

### Log to File

Modify `server.js` to log costs:

```javascript
const fs = require('fs');

// After generating each question:
const cost = (tokens * 0.003 / 1000000);
fs.appendFileSync('usage.log', `${new Date().toISOString()},${tokens},${cost}\n`);
```

Then analyze with:
```bash
awk -F, '{sum+=$3} END {print "Total cost: $" sum}' usage.log
```

### Track With Spreadsheet

Copy from dashboard monthly and track in Google Sheets:
- Date
- Questions
- Tokens
- Cost
- Session notes

---

## Questions?

- **Check rates**: [anthropic.com/pricing](https://anthropic.com/pricing)
- **View usage**: [console.anthropic.com/account/usage](https://console.anthropic.com/account/usage)
- **Account settings**: [console.anthropic.com/account/billing](https://console.anthropic.com/account/billing)
