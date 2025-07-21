import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, DollarSign, Award, Target } from 'lucide-react';
import { Event } from '../../types';

interface EventAnalyticsProps {
  events: Event[];
}

export default function EventAnalytics({ events }: EventAnalyticsProps) {
  // Calculate analytics data
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const averageAttendance = totalRegistrations / totalEvents;
  const occupancyRate = (totalRegistrations / totalCapacity) * 100;

  // Category distribution
  const categoryData = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    percentage: ((count / totalEvents) * 100).toFixed(1)
  }));

  // Monthly trend (mock data)
  const monthlyData = [
    { month: 'Jan', events: 12, registrations: 450 },
    { month: 'Feb', events: 15, registrations: 580 },
    { month: 'Mar', events: 18, registrations: 720 },
    { month: 'Apr', events: 22, registrations: 890 },
    { month: 'May', events: 25, registrations: 1050 },
    { month: 'Jun', events: 20, registrations: 850 },
  ];

  // Top performing events
  const topEvents = [...events]
    .sort((a, b) => (b.registered / b.capacity) - (a.registered / a.capacity))
    .slice(0, 5)
    .map(event => ({
      name: event.title.length > 30 ? event.title.substring(0, 30) + '...' : event.title,
      occupancy: ((event.registered / event.capacity) * 100).toFixed(1),
      registered: event.registered,
      capacity: event.capacity
    }));

  const COLORS = ['#ff6b35', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-800">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-800">{totalRegistrations.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-600">+18% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Attendance</p>
              <p className="text-2xl font-bold text-gray-800">{averageAttendance.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-800">{occupancyRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm text-green-600">+5% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#ff6b35" 
                  strokeWidth={2}
                  name="Events"
                />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Registrations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Events</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'occupancy' ? `${value}%` : value,
                  name === 'occupancy' ? 'Occupancy Rate' : name
                ]}
              />
              <Bar dataKey="occupancy" fill="#ff6b35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-3">Event Types</h4>
          <div className="space-y-2">
            {Object.entries(categoryData).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{category}</span>
                <span className="font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-3">Pricing Analysis</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Free Events</span>
              <span className="font-medium text-gray-800">
                {events.filter(e => e.price === 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid Events</span>
              <span className="font-medium text-gray-800">
                {events.filter(e => e.price > 0).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Price</span>
              <span className="font-medium text-gray-800">
                ₹{(events.reduce((sum, e) => sum + e.price, 0) / events.length).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-3">Capacity Utilization</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Demand (>80%)</span>
              <span className="font-medium text-gray-800">
                {events.filter(e => (e.registered / e.capacity) > 0.8).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium Demand (50-80%)</span>
              <span className="font-medium text-gray-800">
                {events.filter(e => {
                  const rate = e.registered / e.capacity;
                  return rate >= 0.5 && rate <= 0.8;
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Demand (50%)</span>
              <span className="font-medium text-gray-800">
                {events.filter(e => (e.registered / e.capacity) < 0.5).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}