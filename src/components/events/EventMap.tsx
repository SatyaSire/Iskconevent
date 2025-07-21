import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Search } from 'lucide-react';
import { Event } from '../../types';

interface EventMapProps {
  events: Event[];
}

export default function EventMap({ events }: EventMapProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(50); // km
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          // Default to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    }
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredEvents = events.filter(event => {
    if (!event.coordinates) return false;
    
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    
    if (!userLocation) return matchesCategory;
    
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      event.coordinates.lat, event.coordinates.lng
    );
    
    return matchesCategory && distance <= searchRadius;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      festival: '#ef4444',
      lecture: '#3b82f6',
      kirtan: '#8b5cf6',
      service: '#10b981',
      workshop: '#f59e0b',
      pilgrimage: '#6366f1'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="text-orange-500" />
            Event Locations
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input text-sm"
              >
                <option value="all">All Categories</option>
                <option value="festival">Festivals</option>
                <option value="lecture">Lectures</option>
                <option value="kirtan">Kirtan</option>
                <option value="service">Service</option>
                <option value="workshop">Workshops</option>
                <option value="pilgrimage">Pilgrimage</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-gray-500" />
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="input text-sm"
              >
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Within 100 km</option>
                <option value={500}>Within 500 km</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area (Mock) */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Map integration would show event locations with interactive pins and directions
                </p>
              </div>
              
              {/* Mock Map Pins */}
              <div className="absolute top-20 left-20 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                F
              </div>
              <div className="absolute top-32 right-32 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                L
              </div>
              <div className="absolute bottom-24 left-32 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                K
              </div>
              <div className="absolute bottom-32 right-24 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                S
              </div>
            </div>
          </div>

          {/* Event List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-gray-800 mb-4">
                Nearby Events ({filteredEvents.length})
              </h3>
              
              {filteredEvents.length > 0 ? (
                <div className="space-y-3">
                  {filteredEvents.map(event => {
                    const distance = userLocation && event.coordinates 
                      ? calculateDistance(
                          userLocation.lat, userLocation.lng,
                          event.coordinates.lat, event.coordinates.lng
                        )
                      : null;

                    return (
                      <div
                        key={event.id}
                        className={`bg-white rounded-lg p-3 border cursor-pointer transition-all ${
                          selectedEvent?.id === event.id 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(event.category) }}
                          ></div>
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {event.category}
                          </span>
                          {distance && (
                            <span className="text-xs text-gray-400 ml-auto">
                              {distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800 mb-1 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{event.time}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                        
                        {selectedEvent?.id === event.id && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {event.registered}/{event.capacity} registered
                              </span>
                              <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                                Get Directions
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events found in this area</p>
                  <p className="text-xs">Try increasing the search radius</p>
                </div>
              )}
            </div>

            {/* Location Info */}
            {userLocation && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Navigation size={16} />
                  Your Location
                </h4>
                <p className="text-sm text-blue-600">
                  Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  Showing events within {searchRadius} km radius
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Map Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { category: 'festival', label: 'Festivals', icon: 'F' },
              { category: 'lecture', label: 'Lectures', icon: 'L' },
              { category: 'kirtan', label: 'Kirtan', icon: 'K' },
              { category: 'service', label: 'Service', icon: 'S' },
              { category: 'workshop', label: 'Workshops', icon: 'W' },
              { category: 'pilgrimage', label: 'Pilgrimage', icon: 'P' }
            ].map(({ category, label, icon }) => (
              <div key={category} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getCategoryColor(category) }}
                >
                  {icon}
                </div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}