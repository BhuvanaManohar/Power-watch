import React, { useRef } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { CitizenNotificationCenter } from './CitizenNotificationCenter';

export function CitizenDashboard({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onViewIncidentDetail,
  onNavigateHome,
  onNavigateReportOutage,
  onNavigateLiveOutages,
}) {
  const notifSectionRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggleNotifications = () => {
    if (notifSectionRef.current) {
      notifSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <DashboardHeader
        portalTitle="Citizen Portal"
        badgeColor="primary"
        onNavigateHome={onNavigateHome}
        unreadNotificationsCount={unreadCount}
        onToggleNotifications={handleToggleNotifications}
      />

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
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">report_problem</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">Report Power Outage</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Submit address, hazard condition, and local outage details directly to community triage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onNavigateReportOutage) {
                  onNavigateReportOutage();
                } else {
                  alert("Demo Mode: Outage report submission flow triggered.");
                }
              }}
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
              onClick={onNavigateLiveOutages}
              className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span>View Outage Map</span>
            </button>
          </div>

        </div>

        {/* Phase 7: Citizen Notification Center Section */}
        <div ref={notifSectionRef} className="scroll-mt-28">
          <CitizenNotificationCenter
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onViewIncidentDetail={onViewIncidentDetail}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Citizen Demo Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
