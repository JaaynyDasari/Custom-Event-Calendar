import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';

const EventForm = () => {
  const { 
    selectedDate, 
    currentEvent, 
    isEditing, 
    closeEventForm, 
    addEvent, 
    updateEvent,
    deleteEvent,
    checkEventConflicts
  } = useCalendar();

  const [formData, setFormData] = useState({
    title: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    category: 'default',
    recurrence: 'none',
    recurrenceOptions: {
      frequency: 'weekly',
      interval: 1,
      weekdays: [],
      endDate: '',
      occurrences: 10,
    },
  });

  const [errors, setErrors] = useState({});
  const [conflictWarning, setConflictWarning] = useState(null);
  const [recurrenceOption, setRecurrenceOption] = useState('none');
  const [updateOption, setUpdateOption] = useState('this');

  useEffect(() => {
    if (currentEvent) {
      setFormData({
        ...currentEvent,
        date: format(new Date(currentEvent.date), 'yyyy-MM-dd'),
      });
      
      if (currentEvent.recurrence) {
        setRecurrenceOption(currentEvent.recurrence);
      }
    } else {
      setFormData({
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
  }, [currentEvent, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.startTime >= formData.endTime) {
      newErrors.time = 'End time must be after start time';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const eventData = {
      ...formData,
      date: new Date(formData.date),
      recurrence: recurrenceOption,
      recurrenceOptions: {
        ...formData.recurrenceOptions,
        occurrences: parseInt(formData.recurrenceOptions.occurrences),
      },
    };
    
    const conflicts = checkEventConflicts(eventData);
    if (conflicts.length > 0) {
      setConflictWarning({
        message: `This event conflicts with ${conflicts.length} existing event(s).`,
        conflictingEvents: conflicts,
      });
      return;
    }
    
    if (isEditing) {
      updateEvent({
        ...eventData,
        id: currentEvent.id,
        updateOption,
      });
    } else {
      addEvent(eventData);
    }
    
    closeEventForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleRecurrenceChange = (e) => {
    setRecurrenceOption(e.target.value);
    setFormData({
      ...formData,
      recurrence: e.target.value,
    });
  };

  const handleDelete = () => {
    const deleteAll = updateOption === 'all';
    deleteEvent(currentEvent.id, { deleteAll });
    closeEventForm();
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push(
          <option key={time} value={time}>
            {hour === 0 && minute === 0 ? 'Midnight' : 
             hour === 12 && minute === 0 ? 'Noon' : 
             `${hour % 12 || 12}:${formattedMinute} ${hour < 12 ? 'AM' : 'PM'}`}
          </option>
        );
      }
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button
              onClick={closeEventForm}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close form"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Event Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border ${errors.title ? 'border-accent-red' : 'border-white/30'} rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="Enter event title"
                autoFocus
              />
              {errors.title && <p className="mt-1 text-accent-yellow">{errors.title}</p>}
            </div>
            
            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.date ? 'border-accent-red' : 'border-white/30'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50`}
                />
                {errors.date && <p className="mt-1 text-accent-yellow">{errors.date}</p>}
              </div>
              
              <div>
                <label className="block text-white mb-2 font-medium">
                  Start Time
                </label>
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {generateTimeOptions()}
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2 font-medium">
                  End Time
                </label>
                <select
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${errors.time ? 'border-accent-red' : 'border-white/30'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50`}
                >
                  {generateTimeOptions()}
                </select>
                {errors.time && <p className="mt-1 text-accent-yellow">{errors.time}</p>}
              </div>
            </div>
            
            {}
            <div>
              <label className="block text-white mb-2 font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter event description (optional)"
              />
            </div>
            
            {}
            <div>
              <label className="block text-white mb-2 font-medium">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="default"
                    checked={formData.category === 'default'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${formData.category === 'default' ? 'ring-2 ring-white bg-green-medium' : 'bg-green-medium/50'}`}></span>
                  <span>Default</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="work"
                    checked={formData.category === 'work'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${formData.category === 'work' ? 'ring-2 ring-white bg-green-default' : 'bg-green-default/50'}`}></span>
                  <span>Work</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="personal"
                    checked={formData.category === 'personal'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${formData.category === 'personal' ? 'ring-2 ring-white bg-accent-blue' : 'bg-accent-blue/50'}`}></span>
                  <span>Personal</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="important"
                    checked={formData.category === 'important'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${formData.category === 'important' ? 'ring-2 ring-white bg-accent-red' : 'bg-accent-red/50'}`}></span>
                  <span>Important</span>
                </label>
              </div>
            </div>
            
            {}
            <div>
              <label className="block text-white mb-2 font-medium">
                Recurrence
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value="none"
                    checked={recurrenceOption === 'none'}
                    onChange={handleRecurrenceChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${recurrenceOption === 'none' ? 'ring-2 ring-white bg-white' : 'bg-white/50'}`}></span>
                  <span>None</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value="daily"
                    checked={recurrenceOption === 'daily'}
                    onChange={handleRecurrenceChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${recurrenceOption === 'daily' ? 'ring-2 ring-white bg-white' : 'bg-white/50'}`}></span>
                  <span>Daily</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value="weekly"
                    checked={recurrenceOption === 'weekly'}
                    onChange={handleRecurrenceChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${recurrenceOption === 'weekly' ? 'ring-2 ring-white bg-white' : 'bg-white/50'}`}></span>
                  <span>Weekly</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value="monthly"
                    checked={recurrenceOption === 'monthly'}
                    onChange={handleRecurrenceChange}
                    className="sr-only"
                  />
                  <span className={`w-4 h-4 rounded-full ${recurrenceOption === 'monthly' ? 'ring-2 ring-white bg-white' : 'bg-white/50'}`}></span>
                  <span>Monthly</span>
                </label>
              </div>
              
              {}
              {recurrenceOption !== 'none' && (
                <div className="p-4 bg-white/10 rounded-lg space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-white mb-2 font-medium">
                      End After
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        name="occurrences"
                        value={formData.recurrenceOptions.occurrences}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurrenceOptions: {
                            ...formData.recurrenceOptions,
                            occurrences: e.target.value,
                          },
                        })}
                        min="1"
                        max="100"
                        className="w-20 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <span>occurrences</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {}
            {conflictWarning && (
              <div className="p-4 bg-accent-red/30 border border-accent-red rounded-lg animate-slide-up">
                <p className="font-medium">{conflictWarning.message}</p>
                <div className="mt-2">
                  <p>Conflicting events:</p>
                  <ul className="list-disc list-inside">
                    {conflictWarning.conflictingEvents.map((event) => (
                      <li key={event.id}>
                        {event.title} ({event.startTime} - {event.endTime})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setConflictWarning(null)}
                    className="px-4 py-2 bg-white text-green-darker rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      setConflictWarning(null);
                      handleSubmit(new Event('submit'));
                    }}
                    className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Schedule Anyway
                  </button>
                </div>
              </div>
            )}
            
            {}
            <div className="flex justify-between">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg transition-colors"
                >
                  Delete Event
                </button>
              ) : (
                <div></div>
              )}
              
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={closeEventForm}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-green-darker font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {isEditing ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm