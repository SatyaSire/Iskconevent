import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Event, Registration } from '../../types';

interface EventCardProps {
  event: Event;
  userRegistrations?: Registration[];
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  userRegistrations = [], 
  showActions = false,
  onEdit,
  onDelete
}) => {
  const isRegistered = userRegistrations.some(
    reg => reg.eventId === event.id && reg.status === 'registered'
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 ${
      isRegistered ? 'border-l-green-500 bg-green-50' : 'border-l-amber-500'
    }`}>
      {isRegistered && (
        <div className="bg-green-500 text-white text-xs font-medium px-3 py-1">
          ✓ Registered
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800 leading-tight">
            {event.title}
          </h3>
          {showActions && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit?.(event)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(event.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>{formatDate(event.date)} at {event.time || 'TBD'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-amber-500" />
            <span>{event.location.name}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Tag className="h-4 w-4 text-amber-500" />
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
          
          {event.maxAttendees && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <User className="h-4 w-4 text-amber-500" />
              <span>
                {event.currentAttendees}/{event.maxAttendees} attendees
                {event.currentAttendees >= event.maxAttendees && (
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Full
                  </span>
                )}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span className="h-4 w-4 text-amber-500">👤</span>
            <span>Created by {event.createdBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link
            to={`/events/${event.id}`}
            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
          
          <Link
            to={`/events/${event.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              event.maxAttendees && event.currentAttendees >= event.maxAttendees
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isRegistered 
              ? 'Manage Registration' 
              : event.maxAttendees && event.currentAttendees >= event.maxAttendees
              ? 'Event Full'
              : 'Register Now'
            }
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;