import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveOutages } from './components/LiveOutages';
import { HowItWorks } from './components/HowItWorks';
import { CitizensAndTeams } from './components/CitizensAndTeams';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SignInScreen } from './components/SignInScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { CitizenDashboard } from './components/CitizenDashboard';
import { DepartmentDashboard } from './components/DepartmentDashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'signin' | 'signup' | 'citizen-demo' | 'department-demo'

  console.log('[PowerWatch App] Rendering screen:', currentScreen);

  if (currentScreen === 'signin') {
    return (
      <SignInScreen
        onNavigateHome={() => setCurrentScreen('landing')}
        onNavigateSignUp={() => setCurrentScreen('signup')}
        onNavigateCitizenDemo={() => setCurrentScreen('citizen-demo')}
        onNavigateDepartmentDemo={() => setCurrentScreen('department-demo')}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen
        onNavigateHome={() => setCurrentScreen('landing')}
        onNavigateSignIn={() => setCurrentScreen('signin')}
      />
    );
  }

  if (currentScreen === 'citizen-demo') {
    return <CitizenDashboard onNavigateHome={() => setCurrentScreen('signin')} />;
  }

  if (currentScreen === 'department-demo') {
    return <DepartmentDashboard onNavigateHome={() => setCurrentScreen('signin')} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      <Header onNavigateSignIn={() => setCurrentScreen('signin')} />
      <main className="w-full pt-20 bg-background flex-1">
        <Hero />
        <LiveOutages />
        <HowItWorks />
        <CitizensAndTeams />
        <FinalCTA />
      </main>
      <Footer onNavigateSignIn={() => setCurrentScreen('signin')} />
    </div>
  );
}
