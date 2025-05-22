import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import ServiceDetails from './pages/Services';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import AppointmentPage from './pages/Appointment';
import BookingPage from './pages/Booking';
import { navLinks } from './constants';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black">
        <Header links={navLinks} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServiceDetails />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/quen-mat-khau" element={<div>Quên mật khẩu</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App