export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'festival' | 'lecture' | 'kirtan' | 'service' | 'workshop' | 'pilgrimage';
  image: string;
  organizer: string;
  capacity: number;
  registered: number;
  price: number;
  tags: string[];
  requirements?: string[];
  benefits?: string[];
  isRecurring?: boolean;
  recurrencePattern?: string;
  accessibility?: string[];
  dietaryInfo?: string[];
  ageGroup?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  materials?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  spiritualName?: string;
  initiationDate?: string;
  favoriteDeity?: string;
  preferences?: {
    categories: string[];
    notifications: boolean;
    emailUpdates: boolean;
  };
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  emergencyContact?: string;
  dietaryRestrictions?: string[];
}

export interface Donation {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'card' | 'bank' | 'crypto';
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  eventId?: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  contactPerson: string;
  skills: string[];
  benefits: string[];
}