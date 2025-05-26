import { v4 as uuidv4 } from 'uuid';
import { generateRecurringDates } from './dateUtils';

// Generate recurring events based on an original event
export const generateRecurringEvents = (event, occurrences = 10) => {
  if (!event.recurrence || event.recurrence === 'none') {
    return [event];
  }

  const recurrenceGroup = uuidv4();
  const dates = generateRecurringDates(
    new Date(event.date),
    event.recurrence,
    occurrences
  );

  return dates.map((date, index) => ({
    ...event,
    id: index === 0 ? event.id : uuidv4(),
    date,
    recurrenceGroup,
    isRecurring: true,
    recurrenceIndex: index,
  }));
};

// Check if an event conflicts with existing events
export const checkEventConflicts = (newEvent, existingEvents) => {
  const newEventDate = new Date(newEvent.date);
  const newEventStart = newEvent.startTime;
  const newEventEnd = newEvent.endTime;

  return existingEvents.filter(event => {
    // Skip the event itself when checking for conflicts during an update
    if (event.id === newEvent.id) {
      return false;
    }

    // Check if dates are the same
    const eventDate = new Date(event.date);
    if (eventDate.getDate() !== newEventDate.getDate() ||
        eventDate.getMonth() !== newEventDate.getMonth() ||
        eventDate.getFullYear() !== newEventDate.getFullYear()) {
      return false;
    }

    // Check for time conflicts
    const startTime = event.startTime;
    const endTime = event.endTime;

    // New event starts during existing event
    if (newEventStart >= startTime && newEventStart < endTime) {
      return true;
    }

    // New event ends during existing event
    if (newEventEnd > startTime && newEventEnd <= endTime) {
      return true;
    }

    // New event completely encompasses existing event
    if (newEventStart <= startTime && newEventEnd >= endTime) {
      return true;
    }

    return false;
  });
};

// Sort events by start time
export const sortEventsByTime = (events) => {
  return [...events].sort((a, b) => {
    if (a.startTime === b.startTime) {
      return a.endTime.localeCompare(b.endTime);
    }
    return a.startTime.localeCompare(b.startTime);
  });
};

// Group events by date
export const groupEventsByDate = (events) => {
  const groupedEvents = {};
  
  events.forEach(event => {
    const dateKey = new Date(event.date).toISOString().split('T')[0];
    
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    
    groupedEvents[dateKey].push(event);
  });
  
  // Sort events within each day
  Object.keys(groupedEvents).forEach(date => {
    groupedEvents[date] = sortEventsByTime(groupedEvents[date]);
  });
  
  return groupedEvents;
};