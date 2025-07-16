import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import AuthGuard from './components/auth/AuthGuard';
import Toast from './components/common/Toast';

// Pages
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <Routes>
            {/* Public Auth Routes - Redirect to home if already authenticated */}
            <Route
              path="/login"
              element={
                <AuthGuard requireAuth={false}>
                  <LoginPage />
                </AuthGuard>
              }
            />
            <Route
              path="/register"
              element={
                <AuthGuard requireAuth={false}>
                  <RegisterPage />
                </AuthGuard>
              }
            />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <EventDetailsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/my-registrations"
              element={
                <PrivateRoute>
                  <Layout>
                    <MyRegistrationsPage />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Layout>
                    <NotFoundPage />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
          <Toast />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;