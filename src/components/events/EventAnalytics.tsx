import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Eye, Star } from 'lucide-react';
import { Event } from '../../types';

interface EventAnalyticsProps {
  events: Event[];
}

const EventAnalytics: React.FC<EventAnalyticsProps> = ({ events }) => {
  // Calculate analytics data
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const averageAttendance = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
  
  // Category distribution
  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly distribution (mock data for demo)
  const monthlyData = [
    { month: 'Jan', events: 8, registrations: 245 },
    { month: 'Feb', events: 12, registrations: 389 },
    { month: 'Mar', events: 15, registrations: 456 },
    { month: 'Apr', events: 10, registrations: 312 },
    { month: 'May', events: 18, registrations: 567 },
    { month: 'Jun', events: 14, registrations: 423 }
  ];

  // Top performing events
  const topEvents = [...events]
    .sort((a, b) => b.currentAttendees - a.currentAttendees)
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Festival': 'bg-red-500',
      'Kirtan': 'bg-blue-500',
      'Lecture': 'bg-green-500',
      'Workshop': 'bg-purple-500',
      'Retreat': 'bg-orange-500',
      'Community Service': 'bg-pink-500',
      'Youth Program': 'bg-indigo-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center mb-2">
          <BarChart3 className="h-6 w-6 mr-2" />
          Event Analytics Dashboard
        </h2>
        <p className="text-blue-100">
          Insights and statistics about ISKCON events and community engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Events</p>
              <p className="text-3xl font-bold text-slate-900">{totalEvents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-slate-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Registrations</p>
              <p className="text-3xl font-bold text-slate-900">{totalRegistrations}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+8%</span>
            <span className="text-slate-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg. Attendance</p>
              <p className="text-3xl font-bold text-slate-900">{averageAttendance}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+5%</span>
            <span className="text-slate-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Upcoming Events</p>
              <p className="text-3xl font-bold text-slate-900">{upcomingEvents}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">Next 30 days</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Events by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => {
              const percentage = Math.round((count / totalEvents) * 100);
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                    <span className="text-sm font-medium text-slate-700">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(category)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(month.events / 20) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 w-8">{month.events}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-600 w-16 text-right">
                  {month.registrations} reg
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Events</h3>
        <div className="space-y-4">
          {topEvents.map((event, index) => (
            <div key={event.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-slate-400'
                }`}>
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{event.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                  <span>{event.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)} text-white`}>
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{event.currentAttendees}</div>
                <div className="text-sm text-slate-600">registrations</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Growth Rate</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">+15%</p>
          <p className="text-sm text-slate-600">Monthly event registrations</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Community Size</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">2,847</p>
          <p className="text-sm text-slate-600">Active community members</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Satisfaction</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">4.8/5</p>
          <p className="text-sm text-slate-600">Average event rating</p>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;