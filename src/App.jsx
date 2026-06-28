import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './hooks/useToast';

// Layouts (Default imports since they are default exported)
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Landing Page
import LandingPage from './pages/LandingPage';

// Admin Pages (Using standard default imports)
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EditHomepage from './pages/EditHomepage';
import EditFormFields from './pages/EditFormFields';
import EditStatistics from './pages/EditStatistics';
import ManageProducts from './pages/ManageProducts';
import ManagePartners from './pages/ManagePartners';
import ManageTestimonials from './pages/ManageTestimonials';
import EditContact from './pages/EditContact';
import EditAbout from './pages/EditAbout';
import ManageUsers from './pages/ManageUsers';

// Create a client for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            {/* PUBLIC SINGLE LANDING PAGE */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              }
            />

            {/* PORTAL ADMIN LOGIN */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* PORTAL ADMIN CONTROL PATHS */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/homepage"
              element={
                <AdminLayout>
                  <EditHomepage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/form"
              element={
                <AdminLayout>
                  <EditFormFields />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <AdminLayout>
                  <EditStatistics />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminLayout>
                  <ManageProducts />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/partners"
              element={
                <AdminLayout>
                  <ManagePartners />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <AdminLayout>
                  <ManageTestimonials />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/contact"
              element={
                <AdminLayout>
                  <EditContact />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/about"
              element={
                <AdminLayout>
                  <EditAbout />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminLayout>
                  <ManageUsers />
                </AdminLayout>
              }
            />

            {/* FALLBACK REDIRECTS */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
