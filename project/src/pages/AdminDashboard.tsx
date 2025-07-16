import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Settings, TrendingUp } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { Event } from '../types';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';

const AdminDashboard: React.FC = () => {
  const {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    userRegistrations,
    fetchUserRegistrations,
  } = useEvents();

  const [activeTab, setActiveTab] = useState<'events' | 'create' | 'registrations'>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId: string; eventTitle: string }>({
    isOpen: false,
    eventId: '',
    eventTitle: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize dashboard data once
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!isInitialized) {
        try {
          await Promise.all([
            fetchEvents(),
            fetchUserRegistrations()
          ]);
        } catch (error) {
          console.error('Error initializing dashboard:', error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeDashboard();
  }, [fetchEvents, fetchUserRegistrations, isInitialized]);

  // Calculate real statistics - memoized to prevent recalculation
  const statistics = React.useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
    const totalRegistrations = events.reduce((total, event) => total + event.currentAttendees, 0);
    const activeRegistrations = userRegistrations.filter(reg => reg.status === 'registered').length;
    const cancelledRegistrations = userRegistrations.filter(reg => reg.status === 'cancelled').length;
    const totalUserRegistrations = userRegistrations.length;

    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      activeRegistrations,
      cancelledRegistrations,
      totalUserRegistrations,
    };
  }, [events, userRegistrations]);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      setActionLoading(true);
      await createEvent(eventData);
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!editingEvent) return;
    
    try {
      setActionLoading(true);
      await updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setActionLoading(true);
      await deleteEvent(deleteConfirm.eventId);
      setDeleteConfirm({ isOpen: false, eventId: '', eventTitle: '' });
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteConfirm = (eventId: string, eventTitle: string) => {
    setDeleteConfirm({ isOpen: true, eventId, eventTitle });
  };

  const openEditForm = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const closeForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const tabs = [
    { 
      id: 'events' as const, 
      label: 'Manage Events', 
      icon: Calendar, 
      shortLabel: 'Events',
      count: statistics.totalEvents
    },
    { 
      id: 'create' as const, 
      label: 'Quick Create', 
      icon: Plus, 
      shortLabel: 'Create',
      count: null
    },
    { 
      id: 'registrations' as const, 
      label: 'Registrations', 
      icon: Users, 
      shortLabel: 'Registrations',
      count: statistics.activeRegistrations
    },
  ];

  // Show initial loading screen only when not initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">
            Admin Dashboard
          </h1>
          <p className="text-blue-100 text-sm md:text-lg">
            Manage ISKCON events, registrations, and community activities
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-6 text-center">
          <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
            {statistics.totalEvents}
          </div>
          <div className="text-slate-600 text-xs md:text-base">Total Events</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 md:p-6 text-center">
          <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">
            {statistics.upcomingEvents}
          </div>
          <div className="text-slate-600 text-xs md:text-base">Upcoming</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-3 md:p-6 text-center">
          <div className="text-xl md:text-3xl font-bold text-amber-600 mb-1 md:mb-2">
            {statistics.totalRegistrations}
          </div>
          <div className="text-slate-600 text-xs md:text-base">Total Registrations</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 md:p-6 text-center">
          <div className="text-xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">
            {statistics.activeRegistrations}
          </div>
          <div className="text-slate-600 text-xs md:text-base">Active</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Mobile Tab Navigation - Horizontal Scrollable */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600 bg-amber-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.shortLabel}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab.id 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 md:p-6">
          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800">
                  All Events ({statistics.totalEvents})
                </h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>

              {/* Events List - Fixed height container to prevent flickering */}
              <div className="min-h-[400px]">
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 md:h-16 w-12 md:w-16 text-slate-300 mx-auto mb-4" />
                    <div className="text-slate-400 text-base md:text-lg mb-4">No events created yet</div>
                    <button
                      onClick={() => setShowEventForm(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors"
                    >
                      Create Your First Event
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        showActions={true}
                        onEdit={openEditForm}
                        onDelete={(eventId) => openDeleteConfirm(eventId, event.title)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Create Tab */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 md:mb-6">Create New Event</h2>
              <div className="bg-slate-50 rounded-lg p-4 md:p-6">
                <button
                  onClick={() => setShowEventForm(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 md:py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Open Event Creation Form</span>
                </button>
              </div>
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800">
                Event Registrations ({statistics.activeRegistrations} Active)
              </h2>
              
              {/* Registration Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-green-50 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
                    {statistics.activeRegistrations}
                  </div>
                  <div className="text-green-700 text-sm md:text-base">Active Registrations</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
                    {statistics.cancelledRegistrations}
                  </div>
                  <div className="text-red-700 text-sm md:text-base">Cancelled</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                    {statistics.totalUserRegistrations}
                  </div>
                  <div className="text-blue-700 text-sm md:text-base">Total Registrations</div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-slate-50 rounded-lg p-4 md:p-8 text-center">
                <TrendingUp className="h-12 md:h-16 w-12 md:w-16 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-400 text-base md:text-lg mb-2">Registration Analytics</div>
                <p className="text-slate-500 text-sm md:text-base mb-4">
                  Track event popularity and attendance patterns across all events.
                </p>
                <div className="text-sm text-slate-600">
                  <p>Average attendance per event: {statistics.totalEvents > 0 ? Math.round(statistics.totalRegistrations / statistics.totalEvents) : 0}</p>
                  <p>Registration rate: {statistics.totalEvents > 0 ? Math.round((statistics.activeRegistrations / statistics.totalEvents) * 100) : 0}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <EventForm
              event={editingEvent}
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              onCancel={closeForm}
              loading={actionLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteConfirm.eventTitle}"? This action cannot be undone and will cancel all registrations.`}
        confirmText="Delete Event"
        onConfirm={handleDeleteEvent}
        onCancel={() => setDeleteConfirm({ isOpen: false, eventId: '', eventTitle: '' })}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;