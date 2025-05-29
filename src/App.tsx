import React, { useState } from 'react';
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
import ProfilePage from './pages/Profile';
import { navLinks } from './constants';
import { User } from './types';

// Protected Route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  isAuthenticated: boolean;
}> = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <Header 
          links={navLinks} 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServiceDetails />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consultation" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ConsultationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TestResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/arv-protocol" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ARVProtocol />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-booking" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TestBooking />
                </ProtectedRoute>
              } 
            />
            <Route path="/quen-mat-khau" element={<div>Quên mật khẩu</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;