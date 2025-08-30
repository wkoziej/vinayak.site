# Deployment Guide: Google Calendar Integration

## Environment Variables Setup

For the calendar feature to work properly, you need to configure the following environment variables:

### Required Variables

```bash
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=your-google-api-key
```

### Setup Instructions

#### Local Development

1. **Create `.env` file** in project root:
   ```bash
   GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
   GOOGLE_CALENDAR_API_KEY=your-google-api-key
   NODE_ENV=development
   ```

2. **Add to `.gitignore`**:
   ```gitignore
   .env
   .env.local
   .env.production
   ```

#### GitHub Pages Deployment

🚨 **CRITICAL**: Never commit API keys to public repositories!

1. **GitHub Secrets Setup** (REQUIRED):
   - Go to repository Settings > Secrets and Variables > Actions
   - Add secrets:
     - `GOOGLE_CALENDAR_ID`: Your calendar ID (e.g., `abc123@group.calendar.google.com`)
     - `GOOGLE_CALENDAR_API_KEY`: Your Google API key (e.g., `AIzaSyC-1234567890abcdef`)

2. **GitHub Actions Workflow** (already configured):
   ```yaml
   - name: Build
     env:
       GOOGLE_CALENDAR_ID: ${{ secrets.GOOGLE_CALENDAR_ID }}
       GOOGLE_CALENDAR_API_KEY: ${{ secrets.GOOGLE_CALENDAR_API_KEY }}
     run: npm run build
   ```

   ✅ The workflow file `.github/workflows/github-pages.yml` is already updated with these environment variables.

#### Alternative: Direct Configuration

If you prefer not to use environment variables, you can directly edit:

**`src/_data/calendar.js`**:
```javascript
module.exports = {
  calendarId: 'your-actual-calendar-id@group.calendar.google.com',
  apiKey: 'your-actual-api-key',
  // ... rest of config
};
```

**⚠️ Security Warning**: Never commit API keys to git in public repositories.

## Calendar Configuration Values

After completing the Google Calendar setup (see `GOOGLE_CALENDAR_SETUP.md`), you'll have:

### Calendar ID
- Found in Google Calendar > Settings > Integrate Calendar
- Format: `abc123def456@group.calendar.google.com`
- Can be public (used in API calls anyway)

### API Key  
- Generated in Google Cloud Console
- Format: `AIzaSyC-1234567890abcdef`
- Should be restricted to Calendar API and your domain
- **Keep private** - never expose in client-side code

## Deployment Verification

After deployment, verify the calendar works:

1. **Check Console Logs**:
   - Open browser dev tools on `/services/` page
   - Look for "Calendar configuration loaded" message
   - Should show partial calendar ID and API key (first 10 chars)

2. **API Test**:
   ```javascript
   // Run in browser console on your live site
   window.refreshCalendar()
   ```

3. **Visual Check**:
   - Calendar should load within 2-3 seconds
   - Shows 6 months of dates
   - Green = available, Red = unavailable
   - Responsive on mobile

## Troubleshooting

### "Calendar not found" Error
- Verify `GOOGLE_CALENDAR_ID` matches exactly
- Ensure calendar is set to public in Google Calendar settings
- Check Google Cloud Console API is enabled

### "API key invalid" Error  
- Verify `GOOGLE_CALENDAR_API_KEY` is correct
- Check API key restrictions in Google Cloud Console
- Ensure domain is whitelisted in API key settings

### Calendar not loading
- Check browser network tab for API call failures
- Verify CORS settings in Google Cloud Console
- Check rate limits (1M requests/day should be sufficient)

## Security Best Practices

1. **API Key Restrictions**:
   - Restrict to Google Calendar API only
   - Add HTTP referrer restrictions for your domain
   - Monitor usage in Google Cloud Console

2. **Environment Variables**:
   - Never commit to git
   - Use different keys for dev/production if needed
   - Rotate keys every 6-12 months

3. **Calendar Permissions**:
   - Keep calendar read-only for website
   - Only you should have edit access
   - Regular backup of calendar data

## Performance Considerations

- **Caching**: JavaScript caches API responses for 5 minutes
- **Rate Limits**: Google allows 100 requests/minute per user
- **Page Load**: Calendar loads asynchronously, doesn't block page render
- **Fallback**: Graceful error handling if API unavailable

---

*For initial setup instructions, see `GOOGLE_CALENDAR_SETUP.md`*
*For technical implementation details, see `spec.md` and `plan.md`*