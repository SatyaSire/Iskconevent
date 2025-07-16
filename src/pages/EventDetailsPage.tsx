import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { Event } from '../types';
import Loader from '../components/common/Loader';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    userRegistrations, 
    registerForEvent, 
    cancelRegistration, 
    fetchUserRegistrations,
    loading 
  } = useEvents();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock events data (same as in EventContext)
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Janmashtami Celebration',
      description: 'Join us for the grand celebration of Lord Krishna\'s appearance day with kirtan, abhishek, and prasadam. Experience the divine atmosphere as we celebrate the birth of the Supreme Personality of Godhead with traditional ceremonies, devotional singing, and spiritual discourse.',
      date: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
      date: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
      date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
      date: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
      date: format(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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
      date: format(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
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

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      
      try {
        setPageLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find event in mock data
        const foundEvent = mockEvents.find(event => event.id === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          console.error('Event not found with ID:', id);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/');
      } finally {
        setPageLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user, fetchUserRegistrations]);

  const isRegistered = userRegistrations.some(
    reg => reg.eventId === id && reg.status === 'registered'
  );

  const handleRegistration = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!id) return;

    try {
      setActionLoading(true);
      if (isRegistered) {
        await cancelRegistration(id);
      } else {
        await registerForEvent(id);
      }
      
      // Update the local event state to reflect the new attendee count
      if (event) {
        const updatedEvent = { ...event };
        if (isRegistered) {
          updatedEvent.currentAttendees = Math.max(0, updatedEvent.currentAttendees - 1);
        } else {
          updatedEvent.currentAttendees = updatedEvent.currentAttendees + 1;
        }
        setEvent(updatedEvent);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPPP');
    } catch (error) {
      return dateString;
    }
  };

  if (pageLoading) {
    return <Loader text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Event Not Found</h1>
        <p className="text-slate-600 mb-6">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Events</span>
      </button>

      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Registration Status Banner */}
        {user && isRegistered && (
          <div className="bg-green-500 text-white px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="font-medium">✓ You are registered for this event</span>
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            {event.title}
          </h1>

          {/* Event Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium text-slate-800">Date & Time</div>
                  <div className="text-slate-600">
                    {formatDate(event.date)} at {event.time || 'Time TBD'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium text-slate-800">Category</div>
                  <div className="text-slate-600">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>

              {event.maxAttendees && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-amber-500" />
                  <div>
                    <div className="font-medium text-slate-800">Capacity</div>
                    <div className="text-slate-600">
                      {event.currentAttendees} / {event.maxAttendees} registered
                      {event.currentAttendees >= event.maxAttendees && (
                        <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Event Full
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 mt-1" />
                <div>
                  <div className="font-medium text-slate-800">Location</div>
                  <div className="text-slate-600">
                    <div className="font-medium">{event.location.name}</div>
                    <div className="text-sm">{event.location.address}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium text-slate-800">Organized by</div>
                  <div className="text-slate-600">{event.createdBy}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">About This Event</h2>
            <div className="prose max-w-none text-slate-600 leading-relaxed">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Registration Section */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Event Registration
                </h3>
                <p className="text-slate-600">
                  {isRegistered
                    ? 'You are currently registered for this event.'
                    : 'Join us for this spiritual gathering.'
                  }
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {!user ? (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      Login to Register
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Sign Up & Register
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRegistration}
                    disabled={actionLoading || (event.maxAttendees && event.currentAttendees >= event.maxAttendees && !isRegistered)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRegistered
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                        ? 'bg-slate-400 text-white cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {actionLoading
                      ? 'Processing...'
                      : isRegistered
                      ? 'Cancel Registration'
                      : event.maxAttendees && event.currentAttendees >= event.maxAttendees
                      ? 'Event Full'
                      : 'Register for Event'
                    }
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Quote */}
      <div className="mt-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 text-center">
        <blockquote className="text-slate-700 italic text-lg leading-relaxed">
          "In the company of pure devotees, discussion of the pastimes and activities of the Supreme Personality of Godhead is very pleasing and satisfying to the ear and the heart."
        </blockquote>
        <footer className="text-amber-700 mt-3 font-medium">
          - Srimad Bhagavatam 1.1.19
        </footer>
      </div>
    </div>
  );
};

export default EventDetailsPage;