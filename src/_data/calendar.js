// ABOUTME: Configuration data for Google Calendar integration
// ABOUTME: Provides calendar settings for Nunjucks templates with environment variable support

module.exports = {
  // Google Calendar configuration
  // These values should be set via environment variables in production
  calendarId: process.env.GOOGLE_CALENDAR_ID || '1c8de7e41f6ce53a824e650cc15261a6748161e86b5f0fa2a5b9ad345d328a50@group.calendar.google.com',
  apiKey: process.env.GOOGLE_CALENDAR_API_KEY || 'AIzaSyC3zG_Xm4t42m7C1B9Ur1bn2UCMvTdBDXY',
  
  // Display configuration
  monthsToShow: 6,
  containerId: 'availability-calendar',
  
  // Feature flags
  enabled: true,
  debugMode: process.env.NODE_ENV !== 'production'
};