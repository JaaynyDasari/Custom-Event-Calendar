import React from 'react';
import { format, startOfWeek, addDays, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import DayCell from './DayCell';

const MonthView = () => {
  const { currentDate, selectedDate, getDaysInMonth, setSelectedDate, openEventForm } = useCalendar();
  
  const daysInMonth = getDaysInMonth();
  
  const weekStartDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(addDays(weekStartDate, i), 'EEE')
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {}
      <div className="grid grid-cols-7 bg-green-medium">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="p-2 text-center font-semibold text-green-darkest"
          >
            {day}
          </div>
        ))}
      </div>
      
      {}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white overflow-auto">
        {}
        {Array.from({ length: daysInMonth[0].getDay() }, (_, index) => (
          <div key={`empty-start-${index}`} className="border border-green-light/50"></div>
        ))}
        
        {}
        {daysInMonth.map((day) => (
          <DayCell 
            key={format(day, 'yyyy-MM-dd')} 
            day={day} 
            isCurrentMonth={isSameMonth(day, currentDate)}
            isToday={isToday(day)}
            isSelected={isSameDay(day, selectedDate)}
          />
        ))}
        
        {}
        {Array.from({ length: 6 - daysInMonth[daysInMonth.length - 1].getDay() }, (_, index) => (
          <div key={`empty-end-${index}`} className="border border-green-light/50"></div>
        ))}
      </div>
      
      {}
      <button
        onClick={() => openEventForm(new Date())}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-dark hover:bg-green-darker text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Add event"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default MonthView;