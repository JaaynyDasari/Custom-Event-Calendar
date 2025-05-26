import React, { createContext, useState, useEffect, useContext, useMemo } from 'react'; // Add useMemo
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, parse, addDays, addWeeks } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- NEW: Search State ---
  const [searchTerm, setSearchTerm] = useState('');
  // --- END NEW ---

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map(event => ({
        ...event,
        date: new Date(event.date),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // --- NEW: Filtered Events based on search term ---
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return events; // Return all events if search term is empty
    }
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);
  // --- END NEW ---

  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const generateRecurringEvents = (baseEvent) => {
    // ... (keep existing logic)
    const events = [];
    const recurrenceGroup = uuidv4();
    let currentDate = new Date(baseEvent.date);

    for (let i = 0; i < baseEvent.recurrenceOptions.occurrences; i++) {
      const event = {
        ...baseEvent,
        id: i === 0 ? baseEvent.id : uuidv4(),
        date: currentDate,
        recurrenceGroup,
        isRecurring: true,
        recurrenceIndex: i,
      };
      events.push(event);

      switch (baseEvent.recurrence) {
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
    }
    return events;
  };

  const addEvent = (event) => {
    // ... (keep existing logic for adding, it operates on the main 'events' state)
    if (event.recurrence && event.recurrence !== 'none') {
      const recurringEvents = generateRecurringEvents(event);
      setEvents(prevEvents => [...prevEvents, ...recurringEvents]);
    } else {
      const newEvent = {
        id: uuidv4(),
        ...event,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const updateEvent = (updatedEvent) => {
    // ... (keep existing logic, it operates on the main 'events' state)
    if (updatedEvent.recurrence && updatedEvent.recurrence !== 'none' && updatedEvent.updateOption === 'all') {
      const filteredEvents = events.filter(event => 
        !event.recurrenceGroup || event.recurrenceGroup !== updatedEvent.recurrenceGroup
      );
      const newRecurringEvents = generateRecurringEvents(updatedEvent);
      setEvents([...filteredEvents, ...newRecurringEvents]);
    } else {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    }
  };

  const deleteEvent = (eventId, options = {}) => {
    // ... (keep existing logic, it operates on the main 'events' state)
    const eventToDelete = events.find(event => event.id === eventId);
    if (eventToDelete?.recurrenceGroup && options.deleteAll) {
      setEvents(prevEvents =>
        prevEvents.filter(event => event.recurrenceGroup !== eventToDelete.recurrenceGroup)
      );
    } else {
      setEvents(prevEvents =>
        prevEvents.filter(event => event.id !== eventId)
      );
    }
  };

  const checkEventConflicts = (newEvent) => {
    // Check against all events, not just filtered ones
    return events.filter(event => 
      isSameDay(new Date(event.date), new Date(newEvent.date)) &&
      event.id !== newEvent.id &&
      ((newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
       (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime) ||
       (newEvent.startTime <= event.startTime && newEvent.endTime >= event.endTime))
    );
  };

  // --- MODIFIED: Use filteredEvents for display ---
  const getEventsForDay = (day) => {
    return filteredEvents.filter(event => isSameDay(new Date(event.date), day));
  };
  // --- END MODIFIED ---

  const openEventForm = (date, event = null) => {
    setSelectedDate(date);
    setCurrentEvent(event);
    setIsEditing(!!event);
    setShowEventForm(true);
  };

  const closeEventForm = () => {
    setShowEventForm(false);
    setCurrentEvent(null);
    setIsEditing(false);
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const eventId = draggableId;
    const newDate = parse(destination.droppableId, 'yyyy-MM-dd', new Date());
    
    // Find in original 'events' to update, as filteredEvents is derived
    const eventToUpdate = events.find(event => event.id === eventId);
    if (eventToUpdate) {
      const updatedEvent = { ...eventToUpdate, date: newDate };
      
      updateEvent(updatedEvent);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        selectedDate,
        events, 
        filteredEvents, 
        showEventForm,
        currentEvent,
        isEditing,
        isDragging,
        searchTerm, 
        setSearchTerm, 
        setSelectedDate,
        goToNextMonth,
        goToPreviousMonth,
        getDaysInMonth,
        addEvent,
        updateEvent,
        deleteEvent,
        checkEventConflicts,
        getEventsForDay,
        openEventForm,
        closeEventForm,
        handleDragStart,
        handleDragEnd,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);