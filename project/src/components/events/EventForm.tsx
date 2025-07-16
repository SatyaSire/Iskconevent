import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Event } from '../../types';

interface EventFormProps {
  event?: Event | null;
  onSubmit: (eventData: Omit<Event, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: '',
    maxAttendees: 100,
    location: {
      name: '',
      address: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Festival',
    'Kirtan',
    'Lecture',
    'Workshop',
    'Retreat',
    'Community Service',
    'Youth Program',
    'Other'
  ];

  const locations = [
    'Temple Main Hall',
    'Community Center',
    'Outdoor Garden',
    'Online/Virtual',
    'Devotee Home',
    'Other'
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time || '',
        category: event.category,
        maxAttendees: event.maxAttendees || 100,
        location: event.location,
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    } else {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.time)) {
        newErrors.time = 'Invalid time format (use HH:MM)';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.name.trim()) {
      newErrors.locationName = 'Location name is required';
    }

    if (!formData.location.address.trim()) {
      newErrors.locationAddress = 'Location address is required';
    } else if (formData.location.address.trim().length < 10) {
      newErrors.locationAddress = 'Address must be at least 10 characters';
    }

    if (formData.maxAttendees && (formData.maxAttendees < 1 || formData.maxAttendees > 10000)) {
      newErrors.maxAttendees = 'Maximum attendees must be between 1 and 10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        currentAttendees: event?.currentAttendees || 0,
      } as Omit<Event, 'id' | 'createdAt' | 'createdBy'>);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else if (field === 'maxAttendees') {
      setFormData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 bg-white">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          disabled={loading}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Enter event title"
              disabled={loading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors resize-none ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Enter event description"
              disabled={loading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Date, Time, and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.date ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                disabled={loading}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.time ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                disabled={loading}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.category ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Max Attendees */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Maximum Attendees
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={formData.maxAttendees}
              onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                errors.maxAttendees ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Enter maximum number of attendees"
              disabled={loading}
            />
            {errors.maxAttendees && (
              <p className="mt-1 text-sm text-red-600">{errors.maxAttendees}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location Name *
              </label>
              <select
                value={formData.location.name}
                onChange={(e) => handleInputChange('location.name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.locationName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                disabled={loading}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.locationName && (
                <p className="mt-1 text-sm text-red-600">{errors.locationName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location Address *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.locationAddress ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="Enter full address"
                disabled={loading}
              />
              {errors.locationAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.locationAddress}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 md:p-6 border-t border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {event ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            event ? 'Update Event' : 'Create Event'
          )}
        </button>
      </div>
    </div>
  );
};

export default EventForm;