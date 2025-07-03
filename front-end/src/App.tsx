import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import ServiceDetails from './pages/Services';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import ConsultationPage from './pages/Consultation';
import TestResults from './pages/TestResults';
import ARVProtocol from './pages/ARVProtocol';
import TestBooking from './pages/TestBooking';
import ProfilePage from './pages/profile/PatientProfile';
import DoctorProfile from './pages/profile/DoctorProfile';
import DoctorsPage from './pages/Doctors';
import AdminPage from './pages/profile/AdminPage';
import AdminLayout from './components/AdminLayout';
import StaffPage from './pages/profile/StaffPage';
import StaffLayout from './components/StaffLayout';
import { navLinks } from './constants';
import { User } from './types/index';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import DoctorManagementPage from './pages/DoctorPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import AppointmentBooking from './pages/AppointmentBooking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: User['role']['roleName'] | User['role']['roleName'][];
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRole = user?.role?.roleName;
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!userRole || !rolesArray.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Admin-only route component
const AdminOnlyRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is ADMIN, allow access to admin pages
  if (user?.role?.roleName === 'ROLE_ADMIN') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // If user is not ADMIN, redirect to appropriate page based on role
  if (user?.role?.roleName === 'ROLE_DOCTOR') {
    return <Navigate to="/doctor-profile" replace />;
  } else if (user?.role?.roleName === 'ROLE_PATIENT') {
    return <Navigate to="/profile" replace />;
  } else if (user?.role?.roleName === 'ROLE_STAFF') {
    return <Navigate to="/staff" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

// Staff-only route component
const StaffOnlyRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is STAFF, allow access to staff pages
  if (user?.role?.roleName === 'ROLE_STAFF') {
    return <StaffLayout>{children}</StaffLayout>;
  }

  // If user is not STAFF, redirect to appropriate page based on role
  if (user?.role?.roleName === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role?.roleName === 'ROLE_DOCTOR') {
    return <Navigate to="/doctor-profile" replace />;
  } else if (user?.role?.roleName === 'ROLE_PATIENT') {
    return <Navigate to="/profile" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

// Public route component that redirects ADMIN users
const PublicRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // If user is ADMIN and trying to access public pages, redirect to admin
  if (isAuthenticated && user?.role?.roleName === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  // If user is STAFF and trying to access public pages, redirect to staff
  if (isAuthenticated && user?.role?.roleName === 'ROLE_STAFF') {
    return <Navigate to="/staff" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Check if current route is admin or staff route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Only show Header and Footer for non-admin and non-staff routes */}
      {!isAdminRoute && !isStaffRoute && (
        <>
          <Header 
            links={navLinks} 
            isAuthenticated={!!user}
            user={user}
            onLogout={logout}
          />
          <main>
            <Routes>
              {/* Public routes that redirect ADMIN and STAFF users */}
              <Route path="/" element={
                <PublicRoute>
                  {user?.role?.roleName === 'ROLE_DOCTOR' ? <Navigate to="/doctor-profile" replace /> : <HomePage />}
                </PublicRoute>
              } />
              <Route path="/services" element={
                <PublicRoute>
                  <ServiceDetails />
                </PublicRoute>
              } />
              <Route path="/about" element={
                <PublicRoute>
                  <AboutPage />
                </PublicRoute>
              } />
              <Route path="/contact" element={
                <PublicRoute>
                  <ContactPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/doctors" element={
                <PublicRoute>
                  <DoctorsPage />
                </PublicRoute>
              } />
              <Route path="/quen-mat-khau" element={
                <PublicRoute>
                  <div>Quên mật khẩu</div>
                </PublicRoute>
              } />

              {/* Protected routes for non-ADMIN and non-STAFF users */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor-profile" 
                element={
                  <ProtectedRoute>
                    <DoctorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/consultation" 
                element={
                  <ProtectedRoute>
                    <ConsultationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute>
                    <TestResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/arv-protocol" 
                element={
                  <ProtectedRoute>
                    <ARVProtocol />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-bookings" 
                element={
                  <ProtectedRoute>
                    <TestBooking />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/doctors-management"
                element={
                  <ProtectedRoute requiredRole={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                    <DoctorManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-schedules-management"
                element={
                  <ProtectedRoute requiredRole={['ROLE_ADMIN', 'ROLE_DOCTOR']}>
                    <DoctorSchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/test-results" element={
                <ProtectedRoute>
                  <TestResults />
                </ProtectedRoute>
              } />
              <Route path="/book-appointment" element={
                <ProtectedRoute>
                  <AppointmentBooking />
                </ProtectedRoute>
              } />

              {/* Catch all route - redirect based on user role */}
              <Route path="*" element={
                <Navigate to={
                  user?.role?.roleName === 'ROLE_ADMIN' ? '/admin' : 
                  user?.role?.roleName === 'ROLE_STAFF' ? '/staff' : '/'
                } replace />
              } />
            </Routes>
          </main>
          {user?.role?.roleName !== 'ROLE_DOCTOR' && <Footer />}
        </>
      )}

      {/* Admin routes */}
      {isAdminRoute && (
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminOnlyRoute>
                <AdminPage />
              </AdminOnlyRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      )}

      {/* Staff routes */}
      {isStaffRoute && (
        <Routes>
          <Route
            path="/staff"
            element={
              <StaffOnlyRoute>
                <StaffPage />
              </StaffOnlyRoute>
            }
          />
          <Route path="*" element={<Navigate to="/staff" replace />} />
        </Routes>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;