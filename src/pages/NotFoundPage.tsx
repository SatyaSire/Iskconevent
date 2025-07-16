import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-amber-200 mb-4">404</div>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-4xl">🕉️</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Page Not Found</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Events</span>
          </button>
        </div>

        {/* Spiritual Quote */}
        <div className="mt-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 max-w-2xl mx-auto">
          <blockquote className="text-slate-700 italic text-lg leading-relaxed">
            "Even a lost soul can find the right path through devotion and guidance."
          </blockquote>
          <footer className="text-amber-700 mt-3 font-medium">
            - Spiritual Wisdom
          </footer>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;