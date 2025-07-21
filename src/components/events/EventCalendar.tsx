import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Event } from '../../types';

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      festival: 'bg-red-500',
      lecture: 'bg-blue-500',
      kirtan: 'bg-purple-500',
      service: 'bg-green-500',
      workshop: 'bg-yellow-500',
      pilgrimage: 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-orange-500" />
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
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
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      p-2 min-h-[80px] border border-gray-100 rounded-lg text-left hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-orange-100 border-orange-300' : ''}
                      ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                      ${!isSameMonth(day, currentDate) ? 'text-gray-300' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded text-white truncate ${getCategoryColor(event.category)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
              </h3>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`}></div>
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {event.category}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.time}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events on this date</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click on a date to see events</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Event Categories</h4>
              <div className="space-y-2">
                {[
                  { category: 'festival', label: 'Festivals' },
                  { category: 'lecture', label: 'Lectures' },
                  { category: 'kirtan', label: 'Kirtan' },
                  { category: 'service', label: 'Service' },
                  { category: 'workshop', label: 'Workshops' },
                  { category: 'pilgrimage', label: 'Pilgrimage' }
                ].map(({ category, label }) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}