# Calendar Integration Specification

## Project Overview
Add a read-only availability calendar for 14-day Himalayan Panchakarma Tours to the existing Ayurvedic Journey website using Google Calendar API.

## Requirements

### Functional Requirements
- **Display Type**: Read-only calendar showing availability for 14-day tours
- **Time Range**: 6 months forward from current date
- **Visual Indicators**: 
  - Green days = Available for tour start
  - Red days = Unavailable 
- **Location**: Bottom section of `/services/#himalayan-tour` page
- **Section Title**: "Available dates"
- **User Interaction**: None - purely informational display
- **Contact Flow**: Users check availability, then navigate to existing contact page

### Technical Requirements
- **Platform**: Eleventy static site on GitHub Pages
- **Integration**: Google Calendar API
- **Frontend**: JavaScript widget with Bootstrap 5.3.2 styling
- **Data Source**: Google Calendar managed by site owner
- **Update Frequency**: Real-time via API calls

## Google Calendar Implementation

### Calendar Setup
1. Create dedicated Google Calendar for tour availability
2. Use calendar events to mark unavailable periods
3. Available days = no events, Unavailable days = has events
4. Set calendar visibility to public (read-only)

### API Integration
- **Service**: Google Calendar API v3
- **Authentication**: API Key (public calendar, read-only)
- **Endpoint**: `https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- **Rate Limits**: 1,000,000 queries/day (sufficient for static site)

### JavaScript Implementation
```javascript
// Fetch calendar data
const CALENDAR_ID = 'your-calendar-id@gmail.com';
const API_KEY = 'your-google-api-key';
const timeMin = new Date().toISOString();
const timeMax = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(); // 6 months

// API call to get events
fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`)
```

### Calendar Widget Specifications
- **Layout**: 6-month grid view (2 columns × 3 rows on desktop)
- **Mobile**: Single column, scrollable months
- **Styling**: Bootstrap card components with custom CSS
- **Colors**: 
  - Available: `#28a745` (Bootstrap success green)
  - Unavailable: `#dc3545` (Bootstrap danger red)
  - Today: Highlighted border
- **Legend**: Clear color coding explanation

### Data Management Workflow
1. **Owner manages availability**:
   - Open Google Calendar
   - Add "Unavailable" events for blocked periods
   - Remove events to make dates available again

2. **Website displays**:
   - JavaScript fetches events via API
   - Renders calendar with color coding
   - Updates automatically on page load

## File Structure Changes
```
src/
├── assets/
│   ├── js/
│   │   └── calendar.js          # New: Calendar widget logic
│   └── css/
│       └── calendar.css         # New: Calendar styling
└── _includes/
    └── partials/
        └── availability-calendar.njk  # New: Calendar template
```

## Implementation Steps
1. Set up Google Calendar and API credentials
2. Create calendar JavaScript module
3. Design and style calendar widget
4. Create Nunjucks template component
5. Integrate into services page
6. Test across devices and browsers
7. Deploy and verify

## Success Criteria
- ✅ Calendar displays 6 months of availability
- ✅ Green/red color coding works correctly
- ✅ Responsive design on all devices
- ✅ Fast loading times (<2s)
- ✅ Owner can easily update availability
- ✅ No user interaction required

## Maintenance
- **Content Updates**: Owner manages via Google Calendar interface
- **Technical Updates**: Minimal - API key refresh if needed
- **Monitoring**: Check API quota usage monthly

---

*Generated for Ayurvedic Journey website - 14-day Himalayan Panchakarma Tour availability display*