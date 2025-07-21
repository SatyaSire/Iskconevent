import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Star, ArrowRight, Heart, BookOpen, Music } from 'lucide-react';
import { events } from '../data/events';

export default function HomePage() {
  const featuredEvents = events.slice(0, 3);
  const upcomingEvents = events.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Sacred Events & 
              <span className="block text-yellow-300">Spiritual Gatherings</span>
            </h1>
            <p className="text-xl mb-8 text-orange-100 leading-relaxed">
              Join thousands of devotees in celebrating Krishna consciousness through festivals, 
              lectures, kirtan, and community service. Experience the joy of spiritual community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events" className="btn btn-primary bg-white text-orange-600 hover:bg-orange-50">
                <Calendar size={20} />
                Explore Events
              </Link>
              <Link to="/register" className="btn btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                <Users size={20} />
                Join Community
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 text-6xl opacity-20 animate-pulse">🕉️</div>
        <div className="absolute bottom-20 right-20 text-4xl opacity-30 animate-bounce">🪷</div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Events Organized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Devotees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Temple Centers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss these special spiritual gatherings and festivals happening soon
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="card group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
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
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.location.split(',')[0]}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users size={14} />
                    {event.registered}/{event.capacity} registered
                  </div>
                  <Link 
                    to={`/events/${event.id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/events" className="btn btn-primary">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Event Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore different types of spiritual activities and find what resonates with your heart
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Festivals', icon: '🎉', count: 12, color: 'bg-red-100 text-red-600' },
              { name: 'Lectures', icon: '📚', count: 25, color: 'bg-blue-100 text-blue-600' },
              { name: 'Kirtan', icon: '🎵', count: 18, color: 'bg-purple-100 text-purple-600' },
              { name: 'Service', icon: '🤝', count: 15, color: 'bg-green-100 text-green-600' },
              { name: 'Workshops', icon: '🛠️', count: 8, color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Pilgrimage', icon: '🚶', count: 6, color: 'bg-indigo-100 text-indigo-600' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${category.name.toLowerCase()}`}
                className="card text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} events</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Devotees Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community members about their transformative experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Radha Devi',
                role: 'Regular Attendee',
                image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'The kirtan sessions have brought so much peace and joy to my life. The community here is like a spiritual family.',
                rating: 5
              },
              {
                name: 'Govinda Das',
                role: 'Volunteer Coordinator',
                image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'Organizing events here has deepened my devotion and service to Krishna. Every event is a spiritual journey.',
                rating: 5
              },
              {
                name: 'Gauranga Prabhu',
                role: 'Philosophy Student',
                image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150',
                quote: 'The Bhagavad Gita study circles have transformed my understanding of life and spirituality completely.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Join our vibrant community of devotees and experience the transformative power of Krishna consciousness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-primary bg-white text-orange-600 hover:bg-orange-50">
              <Heart size={20} />
              Join Our Community
            </Link>
            <Link to="/events" className="btn btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
              <Calendar size={20} />
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}