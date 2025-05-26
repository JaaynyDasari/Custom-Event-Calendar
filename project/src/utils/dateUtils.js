import { 
  addDays, 
  addWeeks, 
  addMonths, 
  format, 
  parse, 
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay
} from 'date-fns';

// Format date to display format
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(date, formatStr);
};

// Parse string to date
export const parseDate = (dateStr, formatStr = 'yyyy-MM-dd') => {
  return parse(dateStr, formatStr, new Date());
};

// Get all days in a month
export const getDaysInMonth = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

// Get day of week (0-6, 0 is Sunday)
export const getDayOfWeek = (date) => {
  return getDay(date);
};

// Generate dates for recurring events
export const generateRecurringDates = (startDate, recurrencePattern, occurrences) => {
  const dates = [startDate];
  let currentDate = startDate;

  for (let i = 1; i < occurrences; i++) {
    switch (recurrencePattern) {
      case 'daily':
        currentDate = addDays(currentDate, 1);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, 1);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      default:
        break;
    }
    dates.push(currentDate);
  }

  return dates;
};

// Check if two dates are the same day
export const isSameDayCheck = (date1, date2) => {
  return isSameDay(date1, date2);
};