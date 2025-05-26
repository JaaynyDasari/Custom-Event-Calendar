import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EventItem from './EventItem';

const EventList = ({ events, day }) => {
  if (!events || events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="space-y-1">
      {sortedEvents.map((event, index) => (
        <Draggable key={event.id} draggableId={event.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                opacity: snapshot.isDragging ? 0.8 : 1,
              }}
              className={`
                transition-transform duration-200 
                ${snapshot.isDragging ? 'scale-105 shadow-md' : ''}
              `}
            >
              <EventItem event={event} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default EventList;