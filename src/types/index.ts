export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  location: {
    name: string;
    address: string;
  };
  maxAttendees?: number;
  currentAttendees: number;
  createdBy: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'cancelled';
  registeredAt: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
}

export interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  filters: EventFilters;
  searchQuery: string;
  userRegistrations: Registration[];
  fetchEvents: () => Promise<void>;
  fetchUserRegistrations: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: EventFilters) => void;
  setSearchQuery: (query: string) => void;
  registerForEvent: (eventId: string) => Promise<void>;
  cancelRegistration: (eventId: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export interface EventFilters {
  date?: string;
  category?: string;
  location?: string;
}