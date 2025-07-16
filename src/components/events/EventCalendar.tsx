import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Event } from '../../types';

interface EventCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateSelect: (date: Date) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onEventClick,
  onDateSelect
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date) && 
        (filteredCategories.length === 0 || filteredCategories.includes(event.category));
    });
  };

  // Get all unique categories
  const categories = Array.from(new Set(events.map(event => event.category)));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const toggleCategoryFilter = (category: string) => {
    setFilteredCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Festival': 'bg-red-500',
      'Kirtan': 'bg-blue-500',
      'Lecture': 'bg-green-500',
      'Workshop': 'bg-purple-500',
      'Retreat': 'bg-orange-500',
      'Community Service': 'bg-pink-500',
      'Youth Program': 'bg-indigo-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Event Calendar
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-semibold text-white min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            
            <button
              onClick={handleNextMonth}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-white text-sm font-medium mr-2">Filter:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategoryFilter(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filteredCategories.includes(category) || filteredCategories.length === 0
                  ? 'bg-white text-amber-600'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`min-h-[100px] p-2 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors ${
                  isSelected ? 'bg-amber-100 border-amber-300' : ''
                } ${
                  isToday ? 'bg-blue-50 border-blue-300' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isSameMonth(day, currentDate) ? 'text-slate-900' : 'text-slate-400'
                } ${
                  isToday ? 'text-blue-600 font-bold' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(event.category)}`}
                      title={event.title}
                    >
                      <div className="truncate font-medium">
                        {event.title}
                      </div>
                      <div className="truncate opacity-90">
                        {event.time}
                      </div>
                    </div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-slate-500 font-medium">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="border-t border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">
            Events on {format(selectedDate, 'PPPP')}
          </h4>
          
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-slate-500">No events scheduled for this date.</p>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`} />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{event.title}</div>
                    <div className="text-sm text-slate-600">
                      {event.time} • {event.location.name}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)} text-white`}>
                    {event.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;