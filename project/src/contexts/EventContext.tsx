import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Registration, EventContextType, EventFilters } from '../types';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';

// Enhanced mock data with more comprehensive event information
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Janmashtami Celebration',
    description: 'Join us for the grand celebration of Lord Krishna\'s appearance day with kirtan, abhishek, and prasadam. Experience the divine atmosphere as we celebrate the birth of the Supreme Personality of Godhead with traditional ceremonies, devotional singing, and spiritual discourse.',
    date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    time: '18:00',
    category: 'Festival',
    location: {
      name: 'ISKCON Temple Delhi',
      address: 'Sant Nagar Main Rd, East of Kailash, New Delhi, Delhi 110065'
    },
    maxAttendees: 500,
    currentAttendees: 245,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Bhagavad Gita Study Circle',
    description: 'Weekly study of the Bhagavad Gita with discussions on practical application of Krishna consciousness in daily life. Learn from experienced devotees and deepen your understanding of spiritual principles.',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    time: '19:00',
    category: 'Study',
    location: {
      name: 'ISKCON Temple Mumbai',
      address: 'Hare Krishna Land, Juhu, Mumbai, Maharashtra 400049'
    },
    maxAttendees: 50,
    currentAttendees: 32,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Govardhan Puja',
    description: 'Celebrate the pastime of Lord Krishna lifting Govardhan Hill with special prayers and offerings. Participate in the traditional Govardhan Hill ceremony and receive blessed prasadam.',
    date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    time: '17:30',
    category: 'Festival',
    location: {
      name: 'ISKCON Temple Bangalore',
      address: 'Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010'
    },
    maxAttendees: 300,
    currentAttendees: 156,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Kirtan Evening',
    description: 'An evening of devotional singing and chanting of the holy names with live musicians. Experience the transcendental vibration of the Hare Krishna mantra in a peaceful temple atmosphere.',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '20:00',
    category: 'Kirtan',
    location: {
      name: 'ISKCON Temple Vrindavan',
      address: 'Krishna Balaram Mandir, Raman Reti, Vrindavan, Uttar Pradesh 281121'
    },
    maxAttendees: 200,
    currentAttendees: 89,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Spiritual Retreat',
    description: 'A weekend retreat focusing on meditation, yoga, and spiritual practices in a serene environment. Disconnect from material distractions and reconnect with your spiritual essence.',
    date: format(addDays(new Date(), 21), 'yyyy-MM-dd'),
    time: '09:00',
    category: 'Retreat',
    location: {
      name: 'ISKCON Eco Village',
      address: 'Galtare, Wada, Palghar, Maharashtra 421303'
    },
    maxAttendees: 100,
    currentAttendees: 67,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Prasadam Cooking Workshop',
    description: 'Learn to prepare delicious Krishna prasadam with traditional recipes and cooking techniques. Discover the spiritual significance of offering food to Krishna and cooking with devotion.',
    date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    time: '15:00',
    category: 'Workshop',
    location: {
      name: 'ISKCON Temple Pune',
      address: 'ISKCON NVCC Campus, Pune-Nagar Road, Pune, Maharashtra 411014'
    },
    maxAttendees: 30,
    currentAttendees: 18,
    createdBy: 'admin@iskcon.org',
    createdAt: new Date().toISOString(),
  },
];

const mockRegistrations: Registration[] = [
  {
    id: '1',
    eventId: '1',
    userId: 'user1',
    status: 'registered',
    registeredAt: new Date().toISOString(),
  },
  {
    id: '2',
    eventId: '3',
    userId: 'user1',
    status: 'registered',
    registeredAt: new Date().toISOString(),
  },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

const EVENTS_PER_PAGE = 5;

// Validation functions
const validateEventData = (eventData: Omit<Event, 'id' | 'createdAt' | 'createdBy'>): string[] => {
  const errors: string[] = [];

  if (!eventData.title?.trim()) {
    errors.push('Event title is required');
  } else if (eventData.title.trim().length < 3) {
    errors.push('Event title must be at least 3 characters long');
  } else if (eventData.title.trim().length > 100) {
    errors.push('Event title must be less than 100 characters');
  }

  if (!eventData.description?.trim()) {
    errors.push('Event description is required');
  } else if (eventData.description.trim().length < 10) {
    errors.push('Event description must be at least 10 characters long');
  } else if (eventData.description.trim().length > 1000) {
    errors.push('Event description must be less than 1000 characters');
  }

  if (!eventData.date) {
    errors.push('Event date is required');
  } else {
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(eventDate.getTime())) {
      errors.push('Invalid event date format');
    } else if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }

  if (!eventData.time?.trim()) {
    errors.push('Event time is required');
  } else {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(eventData.time)) {
      errors.push('Invalid time format (use HH:MM)');
    }
  }

  if (!eventData.category?.trim()) {
    errors.push('Event category is required');
  }

  if (!eventData.location?.name?.trim()) {
    errors.push('Location name is required');
  } else if (eventData.location.name.trim().length < 2) {
    errors.push('Location name must be at least 2 characters long');
  }

  if (!eventData.location?.address?.trim()) {
    errors.push('Location address is required');
  } else if (eventData.location.address.trim().length < 10) {
    errors.push('Location address must be at least 10 characters long');
  }

  if (eventData.maxAttendees && (eventData.maxAttendees < 1 || eventData.maxAttendees > 10000)) {
    errors.push('Maximum attendees must be between 1 and 10,000');
  }

  return errors;
};

const logOperation = (operation: string, data?: any, error?: any) => {
  const timestamp = new Date().toISOString();
  if (error) {
    console.error(`[${timestamp}] CRUD Error - ${operation}:`, error, data);
  } else {
    console.log(`[${timestamp}] CRUD Success - ${operation}:`, data);
  }
};

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);

  const fetchEvents = async () => {
    try {
      logOperation('FETCH_EVENTS_START', { filters, searchQuery, currentPage });
      
      // Set loading only for initial load
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get all events from mock data
      let filtered = [...mockEvents];
      
      // Apply filters
      if (filters.date) {
        filtered = filtered.filter(event => event.date === filters.date);
        logOperation('FILTER_BY_DATE', { date: filters.date, resultCount: filtered.length });
      }
      
      if (filters.category) {
        filtered = filtered.filter(event => 
          event.category.toLowerCase() === filters.category!.toLowerCase()
        );
        logOperation('FILTER_BY_CATEGORY', { category: filters.category, resultCount: filtered.length });
      }
      
      if (filters.location) {
        filtered = filtered.filter(event => 
          event.location.name.toLowerCase().includes(filters.location!.toLowerCase()) ||
          event.location.address.toLowerCase().includes(filters.location!.toLowerCase())
        );
        logOperation('FILTER_BY_LOCATION', { location: filters.location, resultCount: filtered.length });
      }
      
      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.location.name.toLowerCase().includes(query)
        );
        logOperation('SEARCH_FILTER', { query: searchQuery, resultCount: filtered.length });
      }
      
      // Sort by date (upcoming events first)
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Pagination
      const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
      const endIndex = startIndex + EVENTS_PER_PAGE;
      const paginatedEvents = filtered.slice(startIndex, endIndex);
      const pages = Math.ceil(filtered.length / EVENTS_PER_PAGE);
      
      setEvents(paginatedEvents);
      setFilteredEvents(paginatedEvents);
      setTotalPages(pages);
      
      logOperation('FETCH_EVENTS_SUCCESS', {
        totalEvents: filtered.length,
        currentPage,
        totalPages: pages,
        eventsOnPage: paginatedEvents.length
      });
      
    } catch (error) {
      logOperation('FETCH_EVENTS_ERROR', { filters, searchQuery, currentPage }, error);
      toast.error('Failed to load events. Please try again.');
      setEvents([]);
      setFilteredEvents([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      logOperation('FETCH_USER_REGISTRATIONS_START');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUserRegistrations([...mockRegistrations]);
      
      logOperation('FETCH_USER_REGISTRATIONS_SUCCESS', {
        registrationCount: mockRegistrations.length
      });
      
    } catch (error) {
      logOperation('FETCH_USER_REGISTRATIONS_ERROR', {}, error);
      toast.error('Failed to load registrations.');
      setUserRegistrations([]);
    }
  };

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      logOperation('SET_PAGE_ERROR', { page, totalPages }, 'Invalid page number');
      toast.error('Invalid page number');
      return;
    }
    
    logOperation('SET_PAGE', { from: currentPage, to: page });
    setCurrentPage(page);
  };

  const handleSetFilters = (newFilters: EventFilters) => {
    logOperation('SET_FILTERS', { from: filters, to: newFilters });
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSetSearchQuery = (query: string) => {
    logOperation('SET_SEARCH_QUERY', { from: searchQuery, to: query });
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const registerForEvent = async (eventId: string) => {
    try {
      logOperation('REGISTER_FOR_EVENT_START', { eventId });
      
      // Validate event exists
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Check if already registered
      const existingRegistration = userRegistrations.find(
        reg => reg.eventId === eventId && reg.status === 'registered'
      );
      
      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }
      
      // Check capacity
      if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
        throw new Error('Event is full. Registration not available.');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new registration
      const newRegistration: Registration = {
        id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        userId: 'user1',
        status: 'registered',
        registeredAt: new Date().toISOString(),
      };
      
      // Update registrations
      const updatedRegistrations = [...userRegistrations, newRegistration];
      setUserRegistrations(updatedRegistrations);
      
      // Update event attendee count
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        mockEvents[eventIndex].currentAttendees += 1;
      }
      
      logOperation('REGISTER_FOR_EVENT_SUCCESS', {
        eventId,
        registrationId: newRegistration.id,
        newAttendeeCount: mockEvents[eventIndex]?.currentAttendees
      });
      
      toast.success(`Successfully registered for "${event.title}"!`);
      
      // Refresh events to show updated attendee count
      await fetchEvents();
      
    } catch (error: any) {
      logOperation('REGISTER_FOR_EVENT_ERROR', { eventId }, error);
      toast.error(error.message || 'Failed to register for event. Please try again.');
      throw error;
    }
  };

  const cancelRegistration = async (eventId: string) => {
    try {
      logOperation('CANCEL_REGISTRATION_START', { eventId });
      
      // Find existing registration
      const existingRegistration = userRegistrations.find(
        reg => reg.eventId === eventId && reg.status === 'registered'
      );
      
      if (!existingRegistration) {
        throw new Error('No active registration found for this event');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update registration status
      const updatedRegistrations = userRegistrations.map(reg =>
        reg.id === existingRegistration.id
          ? { ...reg, status: 'cancelled' as const }
          : reg
      );
      
      setUserRegistrations(updatedRegistrations);
      
      // Update event attendee count
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1 && mockEvents[eventIndex].currentAttendees > 0) {
        mockEvents[eventIndex].currentAttendees -= 1;
      }
      
      const event = mockEvents[eventIndex];
      
      logOperation('CANCEL_REGISTRATION_SUCCESS', {
        eventId,
        registrationId: existingRegistration.id,
        newAttendeeCount: event?.currentAttendees
      });
      
      toast.success(`Registration cancelled for "${event?.title}"`);
      
      // Refresh events to show updated attendee count
      await fetchEvents();
      
    } catch (error: any) {
      logOperation('CANCEL_REGISTRATION_ERROR', { eventId }, error);
      toast.error(error.message || 'Failed to cancel registration. Please try again.');
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      logOperation('CREATE_EVENT_START', eventData);
      
      // Validate event data
      const validationErrors = validateEventData(eventData);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Check for duplicate event (same title and date)
      const duplicateEvent = mockEvents.find(
        event => event.title.toLowerCase() === eventData.title.toLowerCase() && 
                 event.date === eventData.date
      );
      
      if (duplicateEvent) {
        throw new Error('An event with the same title and date already exists');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Create new event
      const newEvent: Event = {
        ...eventData,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        createdBy: 'admin@iskcon.org',
        currentAttendees: 0,
        maxAttendees: eventData.maxAttendees || 100,
      };
      
      // Add to mock data
      mockEvents.unshift(newEvent);
      
      logOperation('CREATE_EVENT_SUCCESS', {
        eventId: newEvent.id,
        title: newEvent.title,
        date: newEvent.date
      });
      
      toast.success(`Event "${newEvent.title}" created successfully!`);
      
      // Refresh events list
      await fetchEvents();
      
    } catch (error: any) {
      logOperation('CREATE_EVENT_ERROR', eventData, error);
      toast.error(error.message || 'Failed to create event. Please try again.');
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      logOperation('UPDATE_EVENT_START', { id, eventData });
      
      // Find event
      const eventIndex = mockEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const existingEvent = mockEvents[eventIndex];
      
      // Merge data for validation
      const mergedData = {
        ...existingEvent,
        ...eventData,
      };
      
      // Validate updated event data
      const validationErrors = validateEventData(mergedData);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        throw new Error(`Validation failed: ${errorMessage}`);
      }
      
      // Check for duplicate event (excluding current event)
      if (eventData.title || eventData.date) {
        const duplicateEvent = mockEvents.find(
          event => event.id !== id &&
                   event.title.toLowerCase() === (eventData.title || existingEvent.title).toLowerCase() && 
                   event.date === (eventData.date || existingEvent.date)
        );
        
        if (duplicateEvent) {
          throw new Error('An event with the same title and date already exists');
        }
      }
      
      // Validate attendee constraints
      if (eventData.maxAttendees !== undefined) {
        if (eventData.maxAttendees < existingEvent.currentAttendees) {
          throw new Error(`Cannot set max attendees below current attendee count (${existingEvent.currentAttendees})`);
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update event
      mockEvents[eventIndex] = {
        ...existingEvent,
        ...eventData,
      };
      
      logOperation('UPDATE_EVENT_SUCCESS', {
        eventId: id,
        updatedFields: Object.keys(eventData),
        title: mockEvents[eventIndex].title
      });
      
      toast.success(`Event "${mockEvents[eventIndex].title}" updated successfully!`);
      
      // Refresh events list
      await fetchEvents();
      
    } catch (error: any) {
      logOperation('UPDATE_EVENT_ERROR', { id, eventData }, error);
      toast.error(error.message || 'Failed to update event. Please try again.');
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      logOperation('DELETE_EVENT_START', { id });
      
      // Find event
      const eventIndex = mockEvents.findIndex(event => event.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      const eventToDelete = mockEvents[eventIndex];
      
      // Check if event has registrations
      const eventRegistrations = userRegistrations.filter(
        reg => reg.eventId === id && reg.status === 'registered'
      );
      
      if (eventRegistrations.length > 0) {
        logOperation('DELETE_EVENT_WARNING', {
          eventId: id,
          activeRegistrations: eventRegistrations.length
        });
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove event
      mockEvents.splice(eventIndex, 1);
      
      // Cancel all registrations for this event
      const updatedRegistrations = userRegistrations.map(reg =>
        reg.eventId === id ? { ...reg, status: 'cancelled' as const } : reg
      );
      setUserRegistrations(updatedRegistrations);
      
      logOperation('DELETE_EVENT_SUCCESS', {
        eventId: id,
        title: eventToDelete.title,
        cancelledRegistrations: eventRegistrations.length
      });
      
      toast.success(`Event "${eventToDelete.title}" deleted successfully.`);
      
      if (eventRegistrations.length > 0) {
        toast.success(`${eventRegistrations.length} registration(s) have been cancelled.`);
      }
      
      // Refresh events list
      await fetchEvents();
      
    } catch (error: any) {
      logOperation('DELETE_EVENT_ERROR', { id }, error);
      toast.error(error.message || 'Failed to delete event. Please try again.');
      throw error;
    }
  };

  // Effect to fetch events when dependencies change
  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters, searchQuery]);

  // Effect to log context initialization
  useEffect(() => {
    logOperation('EVENT_CONTEXT_INITIALIZED', {
      totalMockEvents: mockEvents.length,
      totalMockRegistrations: mockRegistrations.length
    });
  }, []);

  const value: EventContextType = {
    events,
    filteredEvents,
    currentPage,
    totalPages,
    loading,
    filters,
    searchQuery,
    userRegistrations,
    fetchEvents,
    fetchUserRegistrations,
    setPage,
    setFilters: handleSetFilters,
    setSearchQuery: handleSetSearchQuery,
    registerForEvent,
    cancelRegistration,
    createEvent,
    updateEvent,
    deleteEvent,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};