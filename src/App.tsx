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
import ConsultationPage from './pages/Consultation';
import TestResults from './pages/TestResults';
import ARVProtocol from './pages/ARVProtocol';
import TestBooking from './pages/TestBooking';
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
            <Route path="/login" element={<LoginPage />} />            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/consultation" element={<ConsultationPage />} /><Route path="/results" element={<TestResults />} />
            <Route path="/arv-protocol" element={<ARVProtocol />} />
            <Route path="/test-booking" element={<TestBooking />} />
            <Route path="/quen-mat-khau" element={<div>Quên mật khẩu</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;