import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveOutages } from './components/LiveOutages';
import { HowItWorks } from './components/HowItWorks';
import { CitizensAndTeams } from './components/CitizensAndTeams';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      <Header />
      <main className="w-full pt-20 bg-background flex-1">
        <Hero />
        <LiveOutages />
        <HowItWorks />
        <CitizensAndTeams />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
