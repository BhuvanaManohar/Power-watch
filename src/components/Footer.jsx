import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-space-xl px-margin md:px-margin-desktop">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-space-lg">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
          <div className="max-w-md flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[24px]">electric_bolt</span>
              <span className="text-lg font-bold text-primary tracking-tight">PowerWatch</span>
              <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
                Civic Utility
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              PowerWatch is an open civic platform helping residents report outages and stay informed with verified neighborhood status updates.
            </p>
          </div>

          {/* Navigation Links matching Header */}
          <nav className="flex flex-wrap items-center gap-space-lg text-xs font-semibold text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">
              Home
            </a>
            <a href="#map-monitor" className="hover:text-primary transition-colors">
              Live Outages
            </a>
            <a
              href="#outage-history"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Outage History
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#citizens-and-teams" className="hover:text-primary transition-colors">
              Citizens & Utility Teams
            </a>
            <a
              href="#sign-in"
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Sign In
            </a>
          </nav>
        </div>

        {/* Bottom Rights Row */}
        <div className="pt-space-md border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-xs text-on-surface-variant">
          <span>© 2026 PowerWatch. All rights reserved.</span>
          <div className="flex items-center gap-space-md">
            <a href="#" className="hover:text-on-surface transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-on-surface transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
