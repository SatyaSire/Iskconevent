import React, { useEffect } from 'react';
import { useState } from 'react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/events/EventCard';
import FilterPanel from '../components/events/FilterPanel';
import EventCalendar from '../components/events/EventCalendar';
import EventMap from '../components/events/EventMap';
import EventAnalytics from '../components/events/EventAnalytics';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import { Calendar, Map, BarChart3, Grid } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const {
    events,
    currentPage,
    totalPages,
    loading,
    filters,
    searchQuery,
    userRegistrations,
    setPage,
    setFilters,
    setSearchQuery,
    fetchUserRegistrations,
  } = useEvents();

  const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'map' | 'analytics'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user, fetchUserRegistrations]);

  if (loading && events.length === 0) {
    return <Loader text="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to ISKCON Events
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Join us in celebrating Krishna consciousness through spiritual gatherings, 
            festivals, and community events. Register for upcoming events and be part 
            of our devotional community.
          </p>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Grid View</span>
          </button>
          
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar' 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>
          
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'map' 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Map View</span>
          </button>
          
          {user?.role === 'admin' && (
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-amber-500 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          )}
        </div>
      </div>
      {/* Filter Panel */}
      {viewMode === 'grid' && (
        <FilterPanel
          filters={filters}
          searchQuery={searchQuery}
          onFiltersChange={setFilters}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Content based on view mode */}
      {loading ? (
        <Loader text="Updating events..." />
      ) : viewMode === 'calendar' ? (
        <EventCalendar
          events={events}
          onEventClick={(event) => {
            setSelectedEvent(event);
            window.open(`/events/${event.id}`, '_blank');
          }}
          onDateSelect={(date) => {
            setFilters({ ...filters, date: date.toISOString().split('T')[0] });
          }}
        />
      ) : viewMode === 'map' ? (
        <EventMap
          events={events}
          selectedEvent={selectedEvent}
          onEventSelect={setSelectedEvent}
        />
      ) : viewMode === 'analytics' ? (
        <EventAnalytics events={events} />
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-4">
            No events found matching your criteria
          </div>
          <p className="text-slate-500">
            Try adjusting your filters or search terms to find more events.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userRegistrations={userRegistrations}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Call to Action */}
      {!user && viewMode === 'grid' && (
        <div className="bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Join Our Spiritual Community
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Create an account to register for events, track your participation, 
            and stay connected with the ISKCON community.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="/register"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Join Now
            </a>
            <a
              href="/login"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;