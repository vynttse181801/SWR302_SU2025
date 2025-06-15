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
import AdminPage from './pages/AdminPage';
import { navLinks } from './constants';
import { User } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocation } from 'react-router-dom';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: User['role'];
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-white text-black">
      {!isAdminPage && (
        <Header 
          links={navLinks} 
          isAuthenticated={!!user}
          user={user}
          onLogout={logout}
        />
      )}
      <main className={isAdminPage ? "w-full min-h-screen" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServiceDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/profile" 
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
            path="/test-booking" 
            element={
              <ProtectedRoute>
                <TestBooking />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/quen-mat-khau" element={<div>Quên mật khẩu</div>} />
          <Route path="/test-results" element={<TestResults />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
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