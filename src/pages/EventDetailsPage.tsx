import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Tag, Star, Heart, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import { events } from '../data/events';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <Link to="/events" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!user) {
      addNotification({
        title: 'Login Required',
        message: 'Please login to register for events',
        type: 'warning',
        icon: '⚠️'
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRegistered(true);
    setIsLoading(false);
    
    addNotification({
      title: 'Registration Successful! 🎉',
      message: `You've successfully registered for ${event.title}`,
      type: 'success',
      icon: '✅'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification({
        title: 'Link Copied',
        message: 'Event link copied to clipboard',
        type: 'success',
        icon: '📋'
      });
    }
  };

  const occupancyRate = (event.registered / event.capacity) * 100;
  const spotsLeft = event.capacity - event.registered;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/events" className="text-white/80 hover:text-white flex items-center gap-1">
                <ArrowLeft size={20} />
                Back to Events
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {event.category}
              </span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.price === 0 ? 'Free Event' : `₹${event.price}`}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl">{event.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Date</p>
                    <p className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Capacity</p>
                    <p className="text-gray-600">{event.registered}/{event.capacity} registered</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                  <span className="text-sm text-gray-500">{occupancyRate.toFixed(1)}% full</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Event is full'}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Organizer */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Organized by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🕉️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{event.organizer}</p>
                    <p className="text-sm text-gray-600">Spiritual Organization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(event.requirements || event.benefits || event.materials) && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
                
                <div className="space-y-6">
                  {event.requirements && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {event.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.benefits && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">What You'll Gain</h3>
                      <ul className="space-y-2">
                        {event.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <Star size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.materials && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">What to Bring</h3>
                      <ul className="space-y-2">
                        {event.materials.map((material, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600">
                            <Tag size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Registration Card */}
              <div className="card">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {event.price === 0 ? 'Free' : `₹${event.price}`}
                  </div>
                  {event.price > 0 && (
                    <p className="text-sm text-gray-600">Registration fee</p>
                  )}
                </div>

                {isRegistered ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">You're Registered!</h3>
                    <p className="text-sm text-green-600 mb-4">
                      We'll send you event updates and reminders
                    </p>
                    <button className="btn btn-secondary w-full">
                      View Registration Details
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={handleRegister}
                      disabled={isLoading || spotsLeft === 0}
                      className={`btn w-full mb-4 ${
                        spotsLeft === 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'btn-primary'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registering...
                        </div>
                      ) : spotsLeft === 0 ? (
                        'Event Full'
                      ) : (
                        'Register Now'
                      )}
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleShare}
                        className="btn btn-secondary flex-1"
                      >
                        <Share2 size={16} />
                        Share
                      </button>
                      <button className="btn btn-secondary">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Event Information</h3>
                <div className="space-y-3 text-sm">
                  {event.ageGroup && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Age Group</span>
                      <span className="font-medium text-gray-800">{event.ageGroup}</span>
                    </div>
                  )}
                  {event.difficulty && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <span className={`font-medium capitalize ${
                        event.difficulty === 'beginner' ? 'text-green-600' :
                        event.difficulty === 'intermediate' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {event.difficulty}
                      </span>
                    </div>
                  )}
                  {event.isRecurring && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Recurring</span>
                      <span className="font-medium text-gray-800">Yes</span>
                    </div>
                  )}
                  {event.accessibility && event.accessibility.length > 0 && (
                    <div>
                      <span className="text-gray-600 block mb-2">Accessibility</span>
                      <div className="space-y-1">
                        {event.accessibility.map((feature, index) => (
                          <div key={index} className="text-green-600 text-xs">
                            ✓ {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Events */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Similar Events</h3>
                <div className="space-y-3">
                  {events
                    .filter(e => e.id !== event.id && e.category === event.category)
                    .slice(0, 3)
                    .map((similarEvent) => (
                      <Link
                        key={similarEvent.id}
                        to={`/events/${similarEvent.id}`}
                        className="block p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                      >
                        <h4 className="font-medium text-gray-800 text-sm mb-1">
                          {similarEvent.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {new Date(similarEvent.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {similarEvent.location.split(',')[0]}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}