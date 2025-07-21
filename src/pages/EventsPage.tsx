import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, Grid, List, Map, BarChart3 } from 'lucide-react';
import { events } from '../data/events';
import EventCalendar from '../components/events/EventCalendar';
import EventMap from '../components/events/EventMap';
import EventAnalytics from '../components/events/EventAnalytics';
import { useAuth } from '../contexts/AuthContext';

type ViewMode = 'grid' | 'list' | 'calendar' | 'map' | 'analytics';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { user } = useAuth();

  const categories = ['all', 'festival', 'lecture', 'kirtan', 'service', 'workshop', 'pilgrimage'];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popularity':
          return b.registered - a.registered;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy]);

  const renderViewModeButtons = () => (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="Grid View"
      >
        <Grid size={18} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="List View"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => setViewMode('calendar')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'calendar' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="Calendar View"
      >
        <Calendar size={18} />
      </button>
      <button
        onClick={() => setViewMode('map')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'map' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-800'
        }`}
        title="Map View"
      >
        <Map size={18} />
      </button>
      {user?.role === 'admin' && (
        <button
          onClick={() => setViewMode('analytics')}
          className={`p-2 rounded-md transition-colors ${
            viewMode === 'analytics' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-800'
          }`}
          title="Analytics View"
        >
          <BarChart3 size={18} />
        </button>
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedEvents.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`} className="card group">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                {event.category}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              {event.registered}/{event.capacity} registered
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              by {event.organizer}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredAndSortedEvents.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`} className="card group">
          <div className="flex gap-6">
            <div className="relative overflow-hidden rounded-lg w-48 h-32 flex-shrink-0">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-xl group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <span className="text-lg font-bold text-orange-600">
                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {event.location.split(',')[0]}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  {event.registered}/{event.capacity}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">by {event.organizer}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Spiritual Events & Gatherings</h1>
          <p className="text-gray-600">Discover and join meaningful spiritual experiences in your community</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, locations, or organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="price">Sort by Price</option>
              </select>

              {renderViewModeButtons()}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedEvents.length} of {events.length} events
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {viewMode === 'calendar' && <EventCalendar events={filteredAndSortedEvents} />}
        {viewMode === 'map' && <EventMap events={filteredAndSortedEvents} />}
        {viewMode === 'analytics' && user?.role === 'admin' && <EventAnalytics events={events} />}
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'list' && renderListView()}

        {filteredAndSortedEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all events</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}