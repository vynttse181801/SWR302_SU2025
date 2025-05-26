import React from 'react';
import Hero from '../components/Hero';
import SystemAccess from '../components/SystemAccess';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const HomePage = () => {
  return (
    <>
      <Hero />
      <SystemAccess />
      <Benefits />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;