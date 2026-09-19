import React from 'react';

export function CitizenDashboard({ onNavigateHome }) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-space-sm group cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined text-primary text-[28px]">electric_bolt</span>
              <span className="text-xl text-primary tracking-tight font-bold font-sans">
                PowerWatch
              </span>
            </button>
            <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider">
              Citizen Portal
            </span>
          </div>

          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-space-xxs text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Exit Demo Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin md:px-margin-desktop pt-28 pb-space-2xl flex flex-col gap-space-xl">
        
        {/* Demo Mode Banner */}
        <div className="p-space-md rounded-xl bg-primary-container/20 border border-primary-container/40 flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">info</span>
            <div>
              <p className="text-sm font-bold text-on-surface">You are currently in Citizen Demo Mode</p>
              <p className="text-xs text-on-surface-variant">Explore reporting local power outages, checking report status, and tracking community restoration.</p>
            </div>
          </div>
          <span className="px-space-sm py-1 rounded bg-primary text-on-primary text-xs font-bold uppercase">
            Demo Mode Active
          </span>
        </div>

        {/* Dashboard Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
          
          {/* Card 1: Report Outage */}
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">edit_location_alt</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Report Power Outage</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Submit address, hazard condition, and local outage details directly to community triage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert("Demo Mode: Outage report submission flow triggered.")}
              className="w-full py-space-sm px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Submit Report</span>
            </button>
          </div>

          {/* Card 2: Active Reports */}
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">assignment</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Your Active Reports</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                View status of reported outages and track review progress by local utility teams.
              </p>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">1 Report Logged</span>
              <span className="text-secondary font-bold">Under Review</span>
            </div>
          </div>

          {/* Card 3: Neighborhood Map */}
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between gap-space-lg">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Neighborhood Outage Map</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Explore nearby community outages, crew en route statuses, and estimated restoration times.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span>View Outage Map</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Citizen Demo Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
