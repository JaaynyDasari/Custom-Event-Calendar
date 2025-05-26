import React from 'react';
import { useCalendar } from '../context/CalendarContext';

const EventItem = ({ event }) => {
  const { openEventForm } = useCalendar();
  
  const getEventColor = () => {
    switch (event.category) {
      case 'work':
        return 'bg-green-default text-white';
      case 'personal':
        return 'bg-accent-blue text-white';
      case 'important':
        return 'bg-accent-red text-white';
      default:
        return 'bg-green-medium text-green-darkest';
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        openEventForm(new Date(event.date), event);
      }}
      className={`
        ${getEventColor()}
        p-1 rounded text-xs truncate cursor-pointer
        hover:ring-2 hover:ring-white transition-all duration-200
        animate-scale-in
      `}
      title={event.title}
    >
      <div className="flex items-center">
        <span className="w-2 h-2 inline-block rounded-full bg-white mr-1 opacity-80"></span>
        <span className="truncate">{event.title}</span>
      </div>
      {event.startTime && (
        <div className="text-xs opacity-90">
          {event.startTime}
        </div>
      )}
    </div>
  );
};

export default EventItem;