// Enhanced types for future-ready features
export interface Notification {
  id: string;
  userId: string;
  type: 'event_reminder' | 'registration_confirmed' | 'event_cancelled' | 'event_updated' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  eventId?: string;
  actionUrl?: string;
}

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedOut: boolean;
  checkedOutAt?: string;
}

export interface EventRecurrence {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  monthlyType?: 'date' | 'day'; // repeat on same date or same day of month
}

export interface EnhancedEvent extends Event {
  images: string[];
  tags: string[];
  prerequisites?: string[];
  materials?: string[];
  ageGroup?: string;
  language: string;
  price?: number;
  currency?: string;
  capacity: {
    total: number;
    registered: number;
    waitlist: number;
    checkedIn: number;
  };
  recurrence?: EventRecurrence;
  livestreamUrl?: string;
  recordingUrl?: string;
  feedback: EventFeedback[];
  averageRating: number;
  isVirtual: boolean;
  requiresApproval: boolean;
  cancellationPolicy?: string;
  refundPolicy?: string;
  organizer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
  };
  volunteers: {
    userId: string;
    role: string;
    confirmed: boolean;
  }[];
  sponsors?: {
    name: string;
    logo: string;
    website?: string;
    level: 'gold' | 'silver' | 'bronze';
  }[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    signLanguage: boolean;
    audioDescription: boolean;
    largeText: boolean;
  };
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  publishedAt?: string;
  lastModified: string;
  modifiedBy: string;
  analytics: {
    views: number;
    registrations: number;
    cancellations: number;
    noShows: number;
    satisfaction: number;
  };
}

export interface UserProfile extends User {
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      eventReminders: boolean;
      newsletter: boolean;
    };
    interests: string[];
    language: string;
    timezone: string;
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      screenReader: boolean;
    };
  };
  spiritualInfo: {
    initiationDate?: string;
    spiritualName?: string;
    guru?: string;
    serviceAreas: string[];
    chantingRounds: number;
    favoriteBooks: string[];
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  membershipLevel: 'guest' | 'member' | 'life_member' | 'patron';
  joinedAt: string;
  lastActive: string;
  isVerified: boolean;
  badges: string[];
  points: number;
  level: number;
}

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultDuration: number; // in minutes
  defaultCapacity: number;
  requiredFields: string[];
  template: Partial<EnhancedEvent>;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface EventSeries {
  id: string;
  name: string;
  description: string;
  events: string[]; // event IDs
  organizer: string;
  createdAt: string;
  tags: string[];
  image?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  capacity: number;
  amenities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    parking: boolean;
    publicTransport: boolean;
  };
  images: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  pricing?: {
    hourly: number;
    daily: number;
    currency: string;
  };
  availability: {
    [date: string]: {
      available: boolean;
      timeSlots: {
        start: string;
        end: string;
        available: boolean;
      }[];
    };
  };
  rules: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | 'cash';
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  receipt?: string;
}

export interface Donation {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  purpose: 'general' | 'temple_construction' | 'food_distribution' | 'book_distribution' | 'other';
  message?: string;
  anonymous: boolean;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  receipt?: string;
}

export interface VolunteerOpportunity {
  id: string;
  eventId?: string;
  title: string;
  description: string;
  requirements: string[];
  timeCommitment: string;
  location: string;
  contactPerson: {
    name: string;
    email: string;
    phone?: string;
  };
  positions: {
    role: string;
    count: number;
    filled: number;
  }[];
  skills: string[];
  benefits: string[];
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  status: 'open' | 'closed' | 'cancelled';
  createdAt: string;
  applications: {
    userId: string;
    appliedAt: string;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
  }[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'local' | 'interest' | 'age_group' | 'service';
  location?: string;
  members: {
    userId: string;
    role: 'member' | 'moderator' | 'admin';
    joinedAt: string;
  }[];
  isPrivate: boolean;
  rules: string[];
  tags: string[];
  image?: string;
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalPosts: number;
    totalEvents: number;
  };
}

export interface ForumPost {
  id: string;
  communityId?: string;
  authorId: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement' | 'sharing';
  tags: string[];
  attachments?: {
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    name: string;
  }[];
  likes: string[]; // user IDs
  replies: {
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
    likes: string[];
    parentReplyId?: string;
  }[];
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface LiveStream {
  id: string;
  eventId?: string;
  title: string;
  description: string;
  streamUrl: string;
  chatEnabled: boolean;
  isLive: boolean;
  startTime: string;
  endTime?: string;
  viewers: {
    current: number;
    peak: number;
    total: number;
  };
  quality: '720p' | '1080p' | '4K';
  language: string;
  recordingUrl?: string;
  thumbnail?: string;
  createdBy: string;
  createdAt: string;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'health' | 'family' | 'spiritual' | 'financial' | 'other';
  isAnonymous: boolean;
  isUrgent: boolean;
  prayerCount: number;
  supportMessages: {
    userId: string;
    message: string;
    createdAt: string;
  }[];
  status: 'active' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  source: string;
  category: 'bhagavad_gita' | 'srimad_bhagavatam' | 'prabhupada' | 'other';
  date: string;
  likes: string[];
  shares: number;
  language: string;
}

export interface BookLibrary {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'scripture' | 'philosophy' | 'biography' | 'children' | 'other';
  language: string;
  format: 'pdf' | 'epub' | 'audiobook' | 'physical';
  url?: string;
  coverImage: string;
  pages?: number;
  duration?: number; // for audiobooks in minutes
  isbn?: string;
  publisher: string;
  publishedDate: string;
  downloads: number;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  isAvailable: boolean;
  price?: number;
  currency?: string;
  tags: string[];
  addedAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    optional?: boolean;
  }[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'prasadam' | 'festival' | 'daily' | 'special';
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  images: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tips: string[];
  variations: string[];
  createdBy: string;
  createdAt: string;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
  }[];
  tags: string[];
  isApproved: boolean;
}

export interface Calendar {
  id: string;
  name: string;
  type: 'vaishnava' | 'gregorian' | 'lunar';
  events: {
    date: string;
    title: string;
    description: string;
    type: 'festival' | 'ekadashi' | 'appearance' | 'disappearance' | 'other';
    significance: string;
    observances: string[];
    fasting?: {
      type: 'full' | 'partial' | 'grains' | 'none';
      instructions: string;
    };
  }[];
  year: number;
  location?: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Merchandise {
  id: string;
  name: string;
  description: string;
  category: 'books' | 'clothing' | 'accessories' | 'art' | 'music' | 'other';
  images: string[];
  price: number;
  currency: string;
  variants?: {
    name: string;
    options: string[];
    priceModifier: number;
  }[];
  inventory: {
    total: number;
    available: number;
    reserved: number;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit: string;
  };
  shipping: {
    domestic: number;
    international: number;
    freeShippingThreshold?: number;
  };
  tags: string[];
  isDigital: boolean;
  downloadUrl?: string;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
    verified: boolean;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    merchandiseId: string;
    quantity: number;
    variant?: string;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  paymentGateways: {
    stripe: {
      enabled: boolean;
      publicKey: string;
      secretKey: string;
    };
    paypal: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
    };
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  features: {
    donations: boolean;
    merchandise: boolean;
    livestream: boolean;
    forum: boolean;
    volunteers: boolean;
    recipes: boolean;
    library: boolean;
    calendar: boolean;
    multiLanguage: boolean;
    darkMode: boolean;
  };
  maintenance: {
    enabled: boolean;
    message: string;
    allowedUsers: string[];
  };
  analytics: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt: string;
  updatedBy: string;
}

export interface Analytics {
  id: string;
  type: 'event' | 'user' | 'system';
  entityId: string;
  action: string;
  metadata: Record<string, any>;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  processed: boolean;
}

export interface BackupData {
  id: string;
  type: 'full' | 'incremental';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  size: number;
  location: string;
  checksum: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
  restorable: boolean;
  expiresAt: string;
}