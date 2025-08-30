// ABOUTME: Configuration data for Google Calendar integration
// ABOUTME: Provides calendar settings for Nunjucks templates with environment variable support

module.exports = {
  // Google Calendar configuration
  // These values should be set via environment variables in production
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'YOUR_CALENDAR_ID@group.calendar.google.com',
  apiKey: process.env.GOOGLE_CALENDAR_API_KEY || 'YOUR_GOOGLE_API_KEY',
  
  // Display configuration
  monthsToShow: 6,
  containerId: 'availability-calendar',
  
  // Feature flags
  enabled: true,
  debugMode: process.env.NODE_ENV !== 'production'
};