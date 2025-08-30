# Google Calendar Setup Guide

## Overview
This guide walks you through setting up Google Calendar and API access for the 14-day Himalayan Panchakarma Tour availability calendar.

## Step 1: Create Dedicated Google Calendar

1. **Go to Google Calendar**
   - Visit [calendar.google.com](https://calendar.google.com)
   - Sign in with your Google account

2. **Create New Calendar**
   - On the left sidebar, click the "+" next to "Other calendars"
   - Select "Create new calendar"
   - **Name**: "Himalayan Tours Availability"
   - **Description**: "Calendar for tracking 14-day Panchakarma tour availability periods"
   - **Time zone**: Select your local timezone
   - Click "Create calendar"

3. **Configure Calendar Settings**
   - Find your new calendar in the left sidebar
   - Click the three dots (⋮) next to the calendar name
   - Select "Settings and sharing"
   
4. **Make Calendar Public**
   - Scroll to "Access permissions for events"
   - Check "Make available to public"
   - Set to "See only free/busy (hide details)"
   - This allows the website to read availability without showing private details

5. **Get Calendar ID**
   - In the same settings page, scroll to "Integrate calendar"
   - Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com`)
   - **SAVE THIS ID** - you'll need it for the website configuration

## Step 2: Set Up Google Cloud API

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with the same Google account

2. **Create or Select Project**
   - If you don't have a project, click "Create Project"
   - Name it "Ayurvedic Journey Website" or similar
   - Note the Project ID for reference

3. **Enable Calendar API**
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on "Google Calendar API v3"
   - Click "Enable"

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key and **SAVE IT SECURELY**
   - Click "Restrict Key" to configure security

5. **Restrict API Key (Security)**
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Calendar API" only
   - Under "Website restrictions", add your domain:
     - `https://ayurvedajourney.in/*`
     - `https://wkoziej.github.io/*` (GitHub Pages backup)
   - Click "Save"

## Step 3: Test Setup

1. **Test Calendar Access**
   - Replace `YOUR_CALENDAR_ID` and `YOUR_API_KEY` in this URL:
   ```
   https://www.googleapis.com/calendar/v3/calendars/YOUR_CALENDAR_ID/events?key=YOUR_API_KEY&timeMin=2024-01-01T00:00:00Z&timeMax=2024-12-31T23:59:59Z
   ```
   - Paste the URL in your browser
   - You should see JSON response (even if empty)
   - If you see an error, double-check the Calendar ID and API key

2. **Add Test Events**
   - Go back to Google Calendar
   - In your "Himalayan Tours Availability" calendar, add some test events
   - Title them "Unavailable" or "Booked" for days you want to mark as red
   - These events will make those days show as unavailable on the website

## Step 4: Managing Availability

### How It Works
- **Green days** = No events in calendar = Available for tour start
- **Red days** = Has events in calendar = Unavailable

### To Make Days Unavailable
1. Go to Google Calendar
2. Click on the date you want to block
3. Create an event titled "Unavailable" or "Booked"
4. Set it as "All day" event
5. For multi-day blocks, extend the event duration

### To Make Days Available Again
1. Find the "Unavailable" event in Google Calendar
2. Click and delete it
3. The day will automatically show as green on the website

## Configuration Values Needed

After completing the setup, provide these values for website configuration:

```javascript
// Add these to your website configuration
const CALENDAR_CONFIG = {
  calendarId: 'your-calendar-id@group.calendar.google.com',  // From Step 1.5
  apiKey: 'your-google-api-key',                             // From Step 2.4
  projectId: 'your-google-cloud-project-id'                 // From Step 2.2
};
```

## Security Notes

- ✅ **Safe**: Calendar ID can be public (it's in the URL anyway)
- ✅ **Safe**: API key is restricted to Calendar API only and your domain
- ⚠️ **Important**: Never commit the API key to git - use environment variables
- 🔒 **Best Practice**: Rotate API keys every 6-12 months

## Troubleshooting

### "Calendar not found" error
- Verify calendar ID is correct
- Ensure calendar is set to public
- Check you're using the right Google account

### "API key invalid" error  
- Verify API key was copied correctly
- Check API key restrictions include Calendar API
- Ensure website domain is in allowed referrers

### Events not showing
- Wait 5-10 minutes for changes to propagate
- Clear browser cache
- Verify events are in the correct calendar

## Next Steps

Once you have the Calendar ID and API key, the developer can:
1. Configure the website code with these values
2. Test the calendar integration
3. Deploy the availability calendar to your site

---

*Setup estimated time: 15-20 minutes*
*Technical difficulty: Beginner-friendly*