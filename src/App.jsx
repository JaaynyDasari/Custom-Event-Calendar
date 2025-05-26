// src/App.jsx
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import Calendar from './components/Calendar';

function App() {
  return (
    <CalendarProvider>
      <div className="min-h-screen bg-green-light">
        <Calendar />
      </div>
    </CalendarProvider>
  );
}

export default App;