import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const HomePage = () => {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Benefits Section - Lợi ích */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent"></div>
        <Benefits />
      </div>

      {/* Services Section - Dịch vụ */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary-50/30 to-transparent"></div>
        <Services />
      </div>

      {/* Testimonials Section - Đánh giá */}
      <div className="relative bg-gradient-to-b from-white via-primary-50/20 to-white">
        <Testimonials />
      </div>

      {/* Call to Action Section */}
      <CallToAction />
    </main>
  );
};

export default HomePage;