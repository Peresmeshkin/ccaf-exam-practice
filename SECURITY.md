# Security & Responsible Usage

## API Key Security

### ✅ How Your Key is Protected

1. **Server-side proxy**: All API calls go through your local Express server
2. **Never exposed to frontend**: The browser never sees your API key
3. **Environment variable**: Key is loaded from `.env`, never hardcoded
4. **Not logged**: API key is never printed to console or logs

### ❌ What NOT to Do

- **Never commit `.env` to git** — it's in `.gitignore` for a reason
- **Never share your API key** — treat it like a password
- **Never use it in the browser** (this app doesn't, but some do)
- **Never deploy with a shared key** — each user needs their own

---

## Cost Management

### Monitor Usage

Check your Anthropic account daily:
1. Go to [console.anthropic.com/account/usage](https://console.anthropic.com/account/usage)
2. View real-time API calls and costs
3. Set up billing alerts

### Budget Safeguards

- **Rate limit**: 30 questions per 15 minutes (prevents runaway costs)
- **Question cost**: ~$0.15 per 10-question session
- **Worst case**: Running 24/7 at rate limit = ~$52/month

### Tips to Save Money

1. **Take fewer sessions** — quality over quantity
2. **Don't spam retry mode** — each question costs money
3. **Adjust question count** — fewer questions = less cost
4. **Set up billing alerts** in your Anthropic account

---

## Rate Limiting Details

### Default Limits

```
30 requests per 15-minute window per IP address
```

### Why This Matters

- Prevents accidental abuse
- Protects your quota
- Stops bots if you share the link

### To Adjust

Edit `server.js` line ~20:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Change this (milliseconds)
  max: 30,                     // Change this (number of requests)
  ...
});
```

Examples:
- `max: 100` for 100 questions per 15 min
- `windowMs: 60 * 60 * 1000` for hourly window

---

## Self-Hosting Guidelines

If you deploy this to a public server:

1. **Use environment variables** for API key (never hardcode)
2. **Enable rate limiting** (this is critical)
3. **Add authentication** so only you can access it
4. **Monitor usage** constantly
5. **Set cost alerts** in Anthropic console
6. **Consider usage quotas** via Anthropic dashboard

### Example with Authentication

```javascript
// Add basic auth middleware
const basicAuth = require('basic-auth');

app.use((req, res, next) => {
  const auth = basicAuth(req);
  if (!auth || auth.pass !== process.env.AUTH_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

---

## Server Safety Checklist

Before publishing to GitHub:

- ✅ `.env` is in `.gitignore`
- ✅ `.env.example` exists with placeholders
- ✅ Rate limiting is enabled
- ✅ No API key in code or logs
- ✅ README clearly states "user pays"
- ✅ README has cost estimate
- ✅ SECURITY.md included (this file)

---

## What to Monitor

### Weekly

- Check Anthropic usage dashboard
- Review token costs
- Verify billing alerts are set

### Monthly

- Total API spend
- Question generation trends
- Rate limit hit frequency (should be 0)

### Immediately

- If you share the link publicly
- If you get an unexpected bill
- If rate limit errors appear frequently

---

## Incident Response

If something goes wrong:

1. **Stop the server** immediately: `Ctrl+C`
2. **Check Anthropic usage** at console.anthropic.com
3. **Verify API key is correct** in `.env`
4. **Review rate limiting** — maybe someone found your public URL
5. **Check server logs** for errors

If costs spike unexpectedly:
1. Stop the server
2. Disable the API key temporarily in Anthropic console
3. Investigate logs to find the cause
4. Re-enable with a new key if compromised

---

## Questions?

- **API pricing**: [anthropic.com/pricing](https://anthropic.com/pricing)
- **Console**: [console.anthropic.com](https://console.anthropic.com)
- **Docs**: [docs.anthropic.com](https://docs.anthropic.com)
