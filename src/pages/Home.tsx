import React from 'react';
import Hero from '../components/Hero';
import SystemAccess from '../components/SystemAccess';
import Services from '../components/Services';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const HomePage = () => {
  return (
    <>
      <Hero />
      <SystemAccess />
      <Services />
      <Benefits />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;