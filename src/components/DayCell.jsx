import React from 'react';
import { format } from 'date-fns';
import { Droppable } from 'react-beautiful-dnd';
import { useCalendar } from '../context/CalendarContext';
import EventList from './EventList';

const DayCell = ({ day, isCurrentMonth, isToday, isSelected }) => {
  const { setSelectedDate, openEventForm, getEventsForDay } = useCalendar();
  const dayEvents = getEventsForDay(day);
  
  const dayClasses = `
    relative h-full border border-green-light/50 transition-all duration-200
    ${isCurrentMonth ? 'bg-white' : 'bg-green-light/30'}
    ${isToday ? 'ring-2 ring-green-dark' : ''}
    ${isSelected ? 'bg-green-light' : ''}
    hover:bg-green-light/50
  `;

  return (
    <Droppable droppableId={format(day, 'yyyy-MM-dd')}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`${dayClasses} ${snapshot.isDraggingOver ? 'bg-green-medium/50' : ''}`}
          onClick={() => setSelectedDate(day)}
          onDoubleClick={() => openEventForm(day)}
        >
          {}
          <div className="p-1 flex justify-between items-start">
            <span className={`
              inline-flex justify-center items-center w-6 h-6 text-sm rounded-full
              ${isToday ? 'bg-green-dark text-white' : 'text-green-darker'}
            `}>
              {format(day, 'd')}
            </span>
            
            {}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEventForm(day);
              }}
              className="text-green-dark hover:text-green-darker p-1 rounded transition-colors"
              aria-label={`Add event for ${format(day, 'MMMM d, yyyy')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {}
          <div className="mt-1 px-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 28px)' }}>
            <EventList events={dayEvents} day={day} />
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DayCell;