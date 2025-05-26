import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../context/CalendarContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search as SearchIcon } from 'lucide-react'; // Added SearchIcon

const Header = () => {
  const { 
    currentDate, 
    goToPreviousMonth, 
    goToNextMonth,
    searchTerm,     
    setSearchTerm   
  } = useCalendar();

  return (
    <header className="bg-green-darker text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <CalendarIcon size={24} />
        <h1 className="text-2xl font-bold">Event Calendar</h1>
      </div>
      
      {}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-green-darkest text-white placeholder-gray-400 text-sm rounded-lg focus:ring-green-default focus:border-green-default block w-full pl-10 p-2.5"
          />
        </div>

        {}
        <div className="flex items-center">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-green-darkest rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold px-4 text-center min-w-[150px]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={goToNextMonth}
            className="p-2 hover:bg-green-darkest rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;