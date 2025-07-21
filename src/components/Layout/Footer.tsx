import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🕉️</span>
              </div>
              <span className="font-bold text-lg">ISKCON Events</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting devotees worldwide through spiritual events, festivals, and community gatherings. 
              Spreading Krishna consciousness through organized spiritual activities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/events" className="text-gray-400 hover:text-orange-400 transition-colors">Upcoming Events</a></li>
              <li><a href="/festivals" className="text-gray-400 hover:text-orange-400 transition-colors">Festivals</a></li>
              <li><a href="/lectures" className="text-gray-400 hover:text-orange-400 transition-colors">Spiritual Lectures</a></li>
              <li><a href="/volunteer" className="text-gray-400 hover:text-orange-400 transition-colors">Volunteer</a></li>
              <li><a href="/donate" className="text-gray-400 hover:text-orange-400 transition-colors">Donate</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Spiritual Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/bhagavad-gita" className="text-gray-400 hover:text-orange-400 transition-colors">Bhagavad Gita</a></li>
              <li><a href="/srimad-bhagavatam" className="text-gray-400 hover:text-orange-400 transition-colors">Srimad Bhagavatam</a></li>
              <li><a href="/chanting" className="text-gray-400 hover:text-orange-400 transition-colors">Chanting Guide</a></li>
              <li><a href="/recipes" className="text-gray-400 hover:text-orange-400 transition-colors">Prasadam Recipes</a></li>
              <li><a href="/philosophy" className="text-gray-400 hover:text-orange-400 transition-colors">Philosophy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>events@iskcon.org</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>ISKCON Mayapur, West Bengal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 ISKCON Event Management. Made with <Heart size={16} className="inline text-red-500" /> for Krishna consciousness.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="/support" className="text-gray-400 hover:text-orange-400 transition-colors">Support</a>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm italic">
              "Hare Krishna Hare Krishna Krishna Krishna Hare Hare<br />
              Hare Rama Hare Rama Rama Rama Hare Hare"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}