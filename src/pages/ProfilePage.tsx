import React, { useState } from 'react';
import { User, Mail, Calendar, Heart, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    spiritualName: user?.spiritualName || '',
    favoriteDeity: user?.favoriteDeity || '',
    initiationDate: user?.initiationDate || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      spiritualName: user?.spiritualName || '',
      favoriteDeity: user?.favoriteDeity || '',
      initiationDate: user?.initiationDate || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and spiritual information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card text-center">
                <div className="mb-6">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                      <User size={32} className="text-white" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h2>
                {user.spiritualName && (
                  <p className="text-orange-600 font-medium mb-2">({user.spiritualName})</p>
                )}
                <p className="text-gray-600 text-sm mb-4">{user.email}</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Community Member'}
                  </span>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-primary w-full"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              </div>

              {/* Spiritual Info */}
              <div className="card mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Spiritual Information</h3>
                <div className="space-y-3 text-sm">
                  {user.favoriteDeity && (
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-red-500" />
                      <span className="text-gray-600">Favorite Deity:</span>
                      <span className="font-medium text-gray-800">{user.favoriteDeity}</span>
                    </div>
                  )}
                  {user.initiationDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      <span className="text-gray-600">Initiation Date:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(user.initiationDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Edit Form */}
              {isEditing && (
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={handleSave} className="btn btn-primary">
                        <Save size={16} />
                        Save
                      </button>
                      <button onClick={handleCancel} className="btn btn-secondary">
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spiritual Name
                      </label>
                      <input
                        type="text"
                        value={formData.spiritualName}
                        onChange={(e) => setFormData(prev => ({ ...prev, spiritualName: e.target.value }))}
                        className="input"
                        placeholder="e.g., Govinda Das"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favorite Deity
                      </label>
                      <select
                        value={formData.favoriteDeity}
                        onChange={(e) => setFormData(prev => ({ ...prev, favoriteDeity: e.target.value }))}
                        className="input"
                      >
                        <option value="">Select deity</option>
                        <option value="Krishna">Krishna</option>
                        <option value="Radha Krishna">Radha Krishna</option>
                        <option value="Rama">Rama</option>
                        <option value="Narasimha">Narasimha</option>
                        <option value="Gauranga">Gauranga</option>
                        <option value="Jagannath">Jagannath</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initiation Date
                      </label>
                      <input
                        type="date"
                        value={formData.initiationDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, initiationDate: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* My Events */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">My Registered Events</h3>
                <div className="space-y-4">
                  {/* Mock registered events */}
                  {[
                    {
                      id: '1',
                      title: 'Janmashtami Festival 2024',
                      date: '2024-08-26',
                      status: 'confirmed',
                      image: 'https://images.pexels.com/photos/8828786/pexels-photo-8828786.jpeg?auto=compress&cs=tinysrgb&w=100'
                    },
                    {
                      id: '2',
                      title: 'Bhagavad Gita Study Circle',
                      date: '2024-07-20',
                      status: 'confirmed',
                      image: 'https://images.pexels.com/photos/8923962/pexels-photo-8923962.jpeg?auto=compress&cs=tinysrgb&w=100'
                    }
                  ].map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Settings */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about events and activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Reminders</h4>
                      <p className="text-sm text-gray-600">Get text reminders for upcoming events</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Public Profile</h4>
                      <p className="text-sm text-gray-600">Allow others to see your spiritual information</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}