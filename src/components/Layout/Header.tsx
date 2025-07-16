import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg relative overflow-hidden">
      {/* Decorative lotus pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white rounded-full -translate-x-20 translate-y-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-amber-100 transition-colors">
            <Calendar className="h-8 w-8" />
            <div className="font-bold text-xl hidden sm:block">
              ISKCON Events
            </div>
            <div className="font-bold text-lg sm:hidden">
              IEMS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-amber-100 transition-colors font-medium"
            >
              Events
            </Link>
            {user && (
              <Link
                to="/my-registrations"
                className="text-white hover:text-amber-100 transition-colors font-medium"
              >
                My Registrations
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-white hover:text-amber-100 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-amber-100 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-400">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-amber-100 transition-colors font-medium"
              >
                Events
              </Link>
              {user && (
                <Link
                  to="/my-registrations"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  My Registrations
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  Admin
                </Link>
              )}
              
              {user ? (
                <div className="pt-3 border-t border-amber-400">
                  <div className="flex items-center space-x-2 text-white mb-3">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-amber-400 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:text-amber-100 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
            
            {/* Mobile Notification Center */}
            {user && (
              <div className="pt-3 border-t border-amber-400">
                <NotificationCenter />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;