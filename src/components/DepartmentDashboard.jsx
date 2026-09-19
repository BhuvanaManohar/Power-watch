import React from 'react';

export function DepartmentDashboard({ onNavigateHome }) {
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
            <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
              Utility / Department Officer Portal
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
        <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
            <div>
              <p className="text-sm font-bold text-on-surface">You are currently in Department Officer Demo Mode</p>
              <p className="text-xs text-on-surface-variant">Manage community reports, group duplicate notices, dispatch field crews, and publish restoration milestones.</p>
            </div>
          </div>
          <span className="px-space-sm py-1 rounded bg-secondary text-on-secondary text-xs font-bold uppercase">
            Officer Demo Active
          </span>
        </div>

        {/* Department Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Incoming Citizen Notices</span>
            <span className="text-2xl font-bold text-on-surface">14</span>
            <span className="text-xs text-secondary font-semibold">Requires triage & grouping</span>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Active Grouped Incidents</span>
            <span className="text-2xl font-bold text-on-surface">3</span>
            <span className="text-xs text-tertiary font-semibold">2 Investigating, 1 In Progress</span>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Field Crews Dispatched</span>
            <span className="text-2xl font-bold text-on-surface">2</span>
            <span className="text-xs text-primary font-semibold">Units #4 & #8 on route</span>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Restorations Completed</span>
            <span className="text-2xl font-bold text-on-surface">8</span>
            <span className="text-xs text-secondary font-semibold">Resolved today</span>
          </div>
        </div>

        {/* Incident Management Operations */}
        <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Incident Management Queue</h3>
              <p className="text-xs text-on-surface-variant">Review citizen reports, assign crews, and update public restoration milestones.</p>
            </div>
            <button
              type="button"
              onClick={() => alert("Demo Mode: Create new incident modal triggered.")}
              className="px-space-md py-space-xs rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Incident</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between flex-wrap gap-space-sm">
              <div className="flex flex-col gap-space-xxs">
                <span className="text-xs text-tertiary font-bold">West Oak Sector (Active Outage)</span>
                <span className="text-sm font-semibold text-on-surface">Oak & 8th Avenue Corridor • 120-150 Households</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="px-space-sm py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                  Under Investigation
                </span>
                <button
                  type="button"
                  onClick={() => alert("Demo Mode: Field crew dispatch triggered for West Oak.")}
                  className="px-space-sm py-space-xs rounded bg-surface-container-lowest border border-outline-variant/60 text-xs font-bold text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Dispatch Crew
                </button>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between flex-wrap gap-space-sm">
              <div className="flex flex-col gap-space-xxs">
                <span className="text-xs text-primary font-bold">North Crestview Neighborhood</span>
                <span className="text-sm font-semibold text-on-surface">Crestview Ridge Feeder Line • 30-40 Households</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="px-space-sm py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                  Crew On Route (Unit #4)
                </span>
                <button
                  type="button"
                  onClick={() => alert("Demo Mode: Restoration status update published.")}
                  className="px-space-sm py-space-xs rounded bg-surface-container-lowest border border-outline-variant/60 text-xs font-bold text-secondary hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Publish Status
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Department Officer Portal Demo. All rights reserved.</span>
      </footer>
    </div>
  );
}
