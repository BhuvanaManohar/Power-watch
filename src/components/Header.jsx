import React, { useState, useEffect } from 'react';

export function Header({ onNavigateSignIn, onNavigateReportOutage }) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      const liveOutagesEl = document.getElementById('map-monitor');
      const howItWorksEl = document.getElementById('how-it-works');
      const citizensEl = document.getElementById('citizens-and-teams');

      if (citizensEl && scrollPos >= citizensEl.offsetTop) {
        setActiveSection('citizens');
      } else if (howItWorksEl && scrollPos >= howItWorksEl.offsetTop) {
        setActiveSection('how-it-works');
      } else if (liveOutagesEl && scrollPos >= liveOutagesEl.offsetTop) {
        setActiveSection('live-outages');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1440px] mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Logo & Brand */}
        <div className="flex items-center gap-space-lg shrink-0">
          <a href="#" className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">electric_bolt</span>
            <span className="text-xl text-primary tracking-tight font-bold font-sans">
              PowerWatch
            </span>
          </a>
          
          {/* Main Nav */}
          <nav className="hidden xl:flex items-center gap-space-lg font-body font-semibold text-body-md text-on-surface-variant">
            <a
              href="#"
              className={`transition-colors hover:text-on-surface ${
                activeSection === 'home' ? 'text-primary font-bold border-b-2 border-primary py-1' : ''
              }`}
            >
              Home
            </a>
            <a
              href="#map-monitor"
              className={`transition-colors hover:text-on-surface ${
                activeSection === 'live-outages' ? 'text-primary font-bold border-b-2 border-primary py-1' : ''
              }`}
            >
              Live Outages
            </a>
            <a
              href="#outage-history"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-on-surface transition-colors cursor-pointer"
              title="Outage History (Coming soon)"
            >
              Outage History
            </a>
            <a
              href="#how-it-works"
              className={`transition-colors hover:text-on-surface ${
                activeSection === 'how-it-works' ? 'text-primary font-bold border-b-2 border-primary py-1' : ''
              }`}
            >
              How It Works
            </a>
            <a
              href="#citizens-and-teams"
              className={`transition-colors hover:text-on-surface ${
                activeSection === 'citizens' ? 'text-primary font-bold border-b-2 border-primary py-1' : ''
              }`}
            >
              Citizens & Utility Teams
            </a>
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-space-md shrink-0">
          {/* Sign In Link */}
          <button
            type="button"
            onClick={onNavigateSignIn}
            className="hidden sm:inline-flex text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer focus:outline-none"
          >
            Sign In
          </button>

          {/* Report Outage Action Button */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateReportOutage) {
                onNavigateReportOutage();
              } else {
                const el = document.getElementById('live-outages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
          >
            Report Outage Now
          </button>
        </div>
      </div>
    </header>
  );
}
