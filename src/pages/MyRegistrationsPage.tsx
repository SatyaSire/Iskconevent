import React, { useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/events/EventCard';
import Loader from '../components/common/Loader';

const MyRegistrationsPage: React.FC = () => {
  const { user } = useAuth();
  const { userRegistrations, fetchUserRegistrations, loading } = useEvents();

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user, fetchUserRegistrations]);

  if (loading) {
    return <Loader text="Loading your registrations..." />;
  }

  const activeRegistrations = userRegistrations.filter(reg => reg.status === 'registered');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">My Event Registrations</h1>
        <p className="text-green-100 text-lg">
          Track your upcoming spiritual events and manage your participation
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {activeRegistrations.length}
          </div>
          <div className="text-slate-600">Active Registrations</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">
            {userRegistrations.filter(reg => reg.status === 'cancelled').length}
          </div>
          <div className="text-slate-600">Cancelled</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {userRegistrations.length}
          </div>
          <div className="text-slate-600">Total Events</div>
        </div>
      </div>

      {/* Registered Events */}
      {activeRegistrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-4">
            You haven't registered for any events yet
          </div>
          <p className="text-slate-500 mb-6">
            Explore our upcoming spiritual events and join our community gatherings.
          </p>
          <a
            href="/"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Upcoming Events ({activeRegistrations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Note: In a real app, we would fetch full event details for each registration */}
            {/* This is a simplified version showing registration cards */}
            {activeRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-green-500"
              >
                <div className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 w-fit">
                  ✓ Registered
                </div>
                
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-slate-800">
                    Event ID: {registration.eventId}
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    <strong>Registration Date:</strong> {new Date(registration.registeredAt).toLocaleDateString()}
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    <strong>Status:</strong> 
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {registration.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <a
                    href={`/events/${registration.eventId}`}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                  >
                    View Event Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Spiritual Quote */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 text-center">
        <blockquote className="text-slate-700 italic text-lg leading-relaxed">
          "The Supreme Lord is situated in everyone's heart, O Arjuna, and is directing the wanderings of all living entities."
        </blockquote>
        <footer className="text-amber-700 mt-3 font-medium">
          - Bhagavad Gita 18.61
        </footer>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;