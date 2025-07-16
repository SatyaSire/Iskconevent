import React from 'react';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-auto">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ISKCON Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-amber-400">
              ISKCON Event Management
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connecting devotees worldwide through spiritual events and gatherings. 
              Join us in spreading Krishna consciousness through meaningful events.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-amber-400">
              Connect With Us
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">events@iskcon.org</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Spiritual Quote */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 text-amber-400">
              Daily Inspiration
            </h3>
            <blockquote className="text-slate-300 text-sm italic leading-relaxed">
              "Engage your mind always in thinking of Me, become My devotee, 
              offer obeisances to Me and worship Me."
              <footer className="text-amber-300 mt-2 not-italic">
                - Bhagavad Gita 9.34
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Sacred Mantra Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-pink-200" />
              <span className="text-lg font-semibold text-white">
                Hare Krishna Hare Krishna Krishna Krishna Hare Hare
              </span>
              <Heart className="h-5 w-5 text-pink-200" />
            </div>
            <div className="text-white text-lg font-semibold">
              Hare Rama Hare Rama Rama Rama Hare Hare
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-900 py-3">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-400 text-sm">
            © {new Date().getFullYear()} ISKCON Event Management System. 
            All rights reserved. Made with devotion for Krishna consciousness.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;