import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useCalendar } from '../context/CalendarContext';
import Header from './Header';
import MonthView from './MonthView';
import EventForm from './EventForm';

const Calendar = () => {
  const { handleDragStart, handleDragEnd, showEventForm } = useCalendar();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-screen flex flex-col">
      <DragDropContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col animate-fade-in">
          <Header />
          <MonthView />
        </div>
      </DragDropContext>
      
      {showEventForm && <EventForm />}
    </div>
  );
};

export default Calendar;