import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Globe, Clock } from 'lucide-react';
import { Event } from '../../types';

interface EventMapProps {
  events: Event[];
  selectedEvent?: Event | null;
  onEventSelect: (event: Event) => void;
}

// Mock coordinates for demo purposes
const getCoordinates = (address: string) => {
  const mockCoordinates: Record<string, { lat: number; lng: number }> = {
    'Sant Nagar Main Rd, East of Kailash, New Delhi, Delhi 110065': { lat: 28.5355, lng: 77.2431 },
    'Hare Krishna Land, Juhu, Mumbai, Maharashtra 400049': { lat: 19.1075, lng: 72.8263 },
    'Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010': { lat: 12.9716, lng: 77.5946 },
    'Krishna Balaram Mandir, Raman Reti, Vrindavan, Uttar Pradesh 281121': { lat: 27.5706, lng: 77.7000 },
    'Galtare, Wada, Palghar, Maharashtra 421303': { lat: 19.7515, lng: 73.0760 },
    'ISKCON NVCC Campus, Pune-Nagar Road, Pune, Maharashtra 411014': { lat: 18.5204, lng: 73.8567 }
  };
  
  return mockCoordinates[address] || { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
};

const EventMap: React.FC<EventMapProps> = ({
  events,
  selectedEvent,
  onEventSelect
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirectionsUrl = (event: Event) => {
    const coords = getCoordinates(event.location.address);
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
  };

  const eventsWithCoordinates = events.map(event => ({
    ...event,
    coordinates: getCoordinates(event.location.address),
    distance: userLocation ? calculateDistance(
      userLocation.lat,
      userLocation.lng,
      getCoordinates(event.location.address).lat,
      getCoordinates(event.location.address).lng
    ) : null
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MapPin className="h-6 w-6 mr-2" />
          Event Locations
        </h2>
        <p className="text-green-100 mt-2">
          Find ISKCON events near you and get directions
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Interactive Map</p>
          <p className="text-sm text-slate-500">
            In a real implementation, this would show an interactive map
          </p>
        </div>
        
        {/* Mock map pins */}
        <div className="absolute inset-0 overflow-hidden">
          {eventsWithCoordinates.slice(0, 3).map((event, index) => (
            <div
              key={event.id}
              className={`absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${
                selectedEvent?.id === event.id ? 'bg-amber-500 scale-125' : ''
              }`}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 15}%`
              }}
              onClick={() => onEventSelect(event)}
              title={event.title}
            />
          ))}
        </div>
      </div>

      {/* Event List */}
      <div className="p-6">
        <div className="space-y-4">
          {eventsWithCoordinates.map(event => (
            <div
              key={event.id}
              onClick={() => onEventSelect(event)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedEvent?.id === event.id 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{event.location.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    
                    {event.distance && (
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-4 w-4 text-purple-500" />
                        <span>{event.distance.toFixed(1)} km away</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Directions</span>
                  </a>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/events/${event.id}`, '_blank');
                    }}
                    className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full hover:bg-amber-600 transition-colors"
                  >
                    View Event
                  </button>
                </div>
              </div>
              
              {selectedEvent?.id === event.id && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">
                    {event.description.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{event.currentAttendees} registered</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.location.address.includes('phone') && (
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Phone className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <Globe className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location Permission */}
      {!userLocation && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Navigation className="h-5 w-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">
                Enable location for better experience
              </p>
              <p className="text-xs text-slate-600">
                Get distances and directions to events near you
              </p>
            </div>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      });
                    }
                  );
                }
              }}
              className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full hover:bg-amber-600 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMap;