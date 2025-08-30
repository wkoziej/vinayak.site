// ABOUTME: Google Calendar integration module for displaying 14-day Panchakarma tour availability
// ABOUTME: Fetches calendar data via API and renders 6-month availability grid with color coding

class AyurvedicCalendar {
  constructor(config) {
    this.calendarId = config.calendarId;
    this.apiKey = config.apiKey;
    this.containerId = config.containerId || 'availability-calendar';
    this.monthsToShow = config.monthsToShow || 6;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    
    // State management
    this.loading = false;
    this.error = null;
    this.unavailableDates = new Set();
    
    // Bind methods to maintain context
    this.init = this.init.bind(this);
    this.fetchCalendarData = this.fetchCalendarData.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
  }

  /**
   * Initialize the calendar widget
   */
  async init() {
    try {
      this.showLoading();
      await this.fetchCalendarData();
      this.renderCalendar();
    } catch (error) {
      console.error('Calendar initialization failed:', error);
      this.showError('Unable to load calendar. Please try again later.');
    }
  }

  /**
   * Fetch calendar events from Google Calendar API
   */
  async fetchCalendarData() {
    const cacheKey = 'calendar-data';
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      this.unavailableDates = cached.data;
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + (this.monthsToShow * 30 * 24 * 60 * 60 * 1000)).toISOString();
      
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events` +
        `?key=${this.apiKey}` +
        `&timeMin=${timeMin}` +
        `&timeMax=${timeMax}` +
        `&singleEvents=true` +
        `&orderBy=startTime` +
        `&fields=items(start,end,summary)`;

      console.log('Fetching calendar data from:', url.replace(this.apiKey, '[API_KEY_HIDDEN]'));

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Calendar API response:', data);

      // Process events to extract unavailable dates
      const unavailableDates = new Set();
      
      if (data.items) {
        data.items.forEach(event => {
          const startDate = this.parseEventDate(event.start);
          const endDate = this.parseEventDate(event.end);
          
          // Add all dates in the event range
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            unavailableDates.add(this.formatDateKey(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
      }

      this.unavailableDates = unavailableDates;
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: unavailableDates,
        timestamp: Date.now()
      });

      console.log('Processed unavailable dates:', Array.from(unavailableDates));

    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Parse event date handling both date-time and all-day events
   */
  parseEventDate(eventDate) {
    if (eventDate.date) {
      // All-day event
      return new Date(eventDate.date + 'T00:00:00');
    } else if (eventDate.dateTime) {
      // Timed event
      return new Date(eventDate.dateTime);
    }
    throw new Error('Invalid event date format');
  }

  /**
   * Format date as YYYY-MM-DD for consistent key generation
   */
  formatDateKey(date) {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
  }

  /**
   * Generate calendar months data for rendering
   */
  generateMonthsData() {
    const months = [];
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (let i = 0; i < this.monthsToShow; i++) {
      const monthDate = new Date(currentMonth);
      monthDate.setMonth(currentMonth.getMonth() + i);
      
      months.push(this.generateMonthData(monthDate));
    }

    return months;
  }

  /**
   * Generate single month data with day availability
   */
  generateMonthData(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ empty: true });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = this.formatDateKey(date);
      const isToday = this.isSameDay(date, new Date());
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isUnavailable = this.unavailableDates.has(dateKey);
      
      days.push({
        day,
        date: dateKey,
        isToday,
        isPast,
        isAvailable: !isUnavailable && !isPast,
        isUnavailable: isUnavailable || isPast
      });
    }
    
    return {
      name: monthName,
      days,
      year,
      month
    };
  }

  /**
   * Check if two dates are the same day
   */
  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * Render the complete calendar widget
   */
  renderCalendar() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Calendar container #${this.containerId} not found`);
      return;
    }

    const months = this.generateMonthsData();
    
    container.innerHTML = `
      <div class="availability-calendar">
        <div class="calendar-header">
          <h3>Available dates</h3>
          <div class="calendar-legend">
            <div class="legend-item">
              <span class="legend-color available"></span>
              <span>Available</span>
            </div>
            <div class="legend-item">
              <span class="legend-color unavailable"></span>
              <span>Unavailable</span>
            </div>
          </div>
        </div>
        
        <div class="calendar-grid">
          ${months.map(month => this.renderMonth(month)).join('')}
        </div>
        
        <div class="calendar-footer">
          <p class="calendar-note">
            <small>
              Green days are available for 14-day tour departure. 
              <a href="#contact" class="text-decoration-none">Contact us</a> to book your journey.
            </small>
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Render a single month
   */
  renderMonth(month) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return `
      <div class="month-container">
        <h4 class="month-title">${month.name}</h4>
        <div class="month-grid">
          <div class="weekday-header">
            ${weekdays.map(day => `<div class="weekday">${day}</div>`).join('')}
          </div>
          <div class="days-grid">
            ${month.days.map(day => this.renderDay(day)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render a single day cell
   */
  renderDay(day) {
    if (day.empty) {
      return '<div class="day-cell empty"></div>';
    }

    const classes = ['day-cell'];
    if (day.isToday) classes.push('today');
    if (day.isAvailable) classes.push('available');
    if (day.isUnavailable) classes.push('unavailable');
    if (day.isPast) classes.push('past');

    return `
      <div class="${classes.join(' ')}" 
           data-date="${day.date}" 
           title="${day.isAvailable ? 'Available for departure' : 'Not available'}">
        ${day.day}
      </div>
    `;
  }

  /**
   * Show loading state
   */
  showLoading() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = `
        <div class="calendar-loading text-center p-4">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading availability...</span>
          </div>
          <p class="mt-2 text-muted">Loading tour availability...</p>
        </div>
      `;
    }
  }

  /**
   * Show error state
   */
  showError(message) {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = `
        <div class="calendar-error alert alert-warning" role="alert">
          <h5 class="alert-heading">Calendar Unavailable</h5>
          <p>${message}</p>
          <p class="mb-0">
            <small>Please <a href="#contact" class="alert-link">contact us directly</a> 
            to check availability for your preferred dates.</small>
          </p>
        </div>
      `;
    }
  }

  /**
   * Refresh calendar data and re-render
   */
  async refresh() {
    this.cache.clear();
    await this.init();
  }
}

// Export for use in templates
window.AyurvedicCalendar = AyurvedicCalendar;

// Auto-initialize if configuration is available
document.addEventListener('DOMContentLoaded', function() {
  // Configuration should be provided by the template
  if (window.CALENDAR_CONFIG) {
    console.log('Auto-initializing Ayurvedic Calendar');
    const calendar = new AyurvedicCalendar(window.CALENDAR_CONFIG);
    calendar.init().catch(error => {
      console.error('Calendar auto-initialization failed:', error);
    });
    
    // Store reference for manual refresh if needed
    window.ayurvedicCalendar = calendar;
  }
});