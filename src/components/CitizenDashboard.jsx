import React, { useRef, useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { CitizenNotificationCenter } from './CitizenNotificationCenter';
import { reportsApi, locationsApi } from '../lib/apiClient';

const ACTIVE_REPORT_STATUSES = new Set(['Submitted', 'Under Review', 'Linked to Incident']);

export function CitizenDashboard({
  session,
  userProfile,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onViewIncidentDetail,
  onNavigateHome,
  onNavigateSignIn,
  onNavigateReportOutage,
  onNavigateLiveOutages,
}) {
  const notifSectionRef = useRef(null);

  // fetchedData is strictly scoped to the userId it was fetched for
  const [fetchedData, setFetchedData] = useState({ userId: null, reports: [], locations: {} });
  const [isFetchingReports, setIsFetchingReports] = useState(false);
  const [errorState, setErrorState] = useState({ userId: null, error: null });
  const [reportsRetryCount, setReportsRetryCount] = useState(0);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Session state detection
  const isSessionLoading = session === undefined;
  const isAuthenticated = Boolean(session?.user);
  const currentUserId = session?.user?.id || null;

  // Error is strictly scoped to active user
  const reportsError = errorState.userId === currentUserId ? errorState.error : null;

  // Immediately clear previous user's data and show loading state if user changed or session is loading
  const isUserMismatch = isAuthenticated && fetchedData.userId !== currentUserId;
  const isLoadingReports = isSessionLoading || (isAuthenticated && (isFetchingReports || (isUserMismatch && !reportsError)));

  // Reports and locations are isolated to current authenticated user only
  const myReports = (!isAuthenticated || isUserMismatch) ? [] : fetchedData.reports;
  const locationsMap = (!isAuthenticated || isUserMismatch) ? {} : fetchedData.locations;

  // Calculate active report counts and status
  const activeReports = myReports.filter((r) => ACTIVE_REPORT_STATUSES.has(r.status));
  const activeCount = activeReports.length;

  const activeStatusLabel = activeReports.some((r) => r.status === 'Submitted')
    ? 'Submitted'
    : activeReports.some((r) => r.status === 'Under Review')
    ? 'Under Review'
    : activeReports.some((r) => r.status === 'Linked to Incident')
    ? 'Linked to Incident'
    : null;

  useEffect(() => {
    let isMounted = true;

    if (!session?.user) {
      return;
    }

    const userId = session.user.id;

    Promise.all([
      reportsApi.getMyReports(),
      locationsApi.getLocations().catch((err) => {
        console.warn('[CitizenDashboard] Could not fetch locations for mapping:', err);
        return [];
      }),
    ])
      .then(([reportsData, locationsData]) => {
        if (!isMounted) return;

        const locMap = {};
        if (Array.isArray(locationsData)) {
          locationsData.forEach((loc) => {
            if (loc?.id) locMap[loc.id] = loc;
          });
        }
        setFetchedData({
          userId,
          reports: Array.isArray(reportsData) ? reportsData : [],
          locations: locMap,
        });
        setErrorState({ userId: null, error: null });
      })
      .catch((err) => {
        if (!isMounted) return;
        setFetchedData({
          userId,
          reports: [],
          locations: {},
        });
        setErrorState({
          userId,
          error: err.message || 'Failed to load your submitted reports.',
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsFetchingReports(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [session?.user, reportsRetryCount]);

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
        {/* Portal Authentication Banner */}
        <div className="p-space-md rounded-xl bg-primary-container/20 border border-primary-container/40 flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {isAuthenticated ? 'verified_user' : 'info'}
            </span>
            <div>
              <p className="text-sm font-bold text-on-surface">
                {isAuthenticated
                  ? `Citizen Portal — Signed in as ${userProfile?.full_name || session?.user?.email || 'Citizen'}`
                  : 'You are currently in Citizen Demo Mode'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {isAuthenticated
                  ? 'Manage your lodged outage reports, view live triage progress, and monitor neighborhood power alerts.'
                  : 'Explore reporting local power outages, checking report status, and tracking community restoration.'}
              </p>
            </div>
          </div>
          <span className="px-space-sm py-1 rounded bg-primary text-on-primary text-xs font-bold uppercase">
            {isAuthenticated ? 'Authenticated' : 'Demo Mode Active'}
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
                Submit registered sector, outage type, and local notes directly to municipal dispatch triage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onNavigateReportOutage) {
                  onNavigateReportOutage();
                }
              }}
              className="w-full py-space-sm px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Submit Report</span>
            </button>
          </div>

          {/* Card 2: Active Reports (Counts only Submitted, Under Review, Linked to Incident) */}
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
            {isLoadingReports ? (
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center gap-space-xs text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] animate-spin text-primary">progress_activity</span>
                <span>Loading active reports...</span>
              </div>
            ) : reportsError ? (
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-error-container/40 flex items-center justify-between text-xs text-error">
                <span className="font-semibold">Unable to load active reports</span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorState({ userId: currentUserId, error: null });
                    setIsFetchingReports(true);
                    setReportsRetryCount((c) => c + 1);
                  }}
                  className="font-bold underline hover:opacity-80 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : !isAuthenticated ? (
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface-variant">Sign in to track reports</span>
                {onNavigateSignIn && (
                  <button
                    type="button"
                    onClick={onNavigateSignIn}
                    className="text-primary font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            ) : activeCount === 0 ? (
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface-variant">0 Active Reports</span>
                <span className="text-on-surface-variant font-medium">None Active</span>
              </div>
            ) : (
              <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface">
                  {activeCount} Active {activeCount === 1 ? 'Report' : 'Reports'}
                </span>
                <span className="text-secondary font-bold">
                  {activeStatusLabel}
                </span>
              </div>
            )}
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

        {/* Your Outage Reports Section */}
        <section className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between flex-wrap gap-space-xs border-b border-outline-variant/40 pb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
              <div>
                <h2 className="text-base md:text-lg font-bold text-on-surface">
                  Your Submitted Outage Reports
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Live triage, review, and incident linking updates for reports lodged under your account.
                </p>
              </div>
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setErrorState({ userId: currentUserId, error: null });
                  setIsFetchingReports(true);
                  setReportsRetryCount((c) => c + 1);
                }}
                disabled={isLoadingReports}
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer px-space-xs py-1 rounded bg-surface-container-low border border-outline-variant/40"
                title="Refresh submitted reports"
              >
                <span className={`material-symbols-outlined text-[16px] ${isLoadingReports ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Refresh</span>
              </button>
            )}
          </div>

          {/* LOADING STATE */}
          {isLoadingReports ? (
            <div className="p-space-xl rounded-xl bg-surface-container-low/40 border border-outline-variant/30 flex flex-col items-center justify-center gap-space-sm py-10 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
              <span className="text-xs font-medium">Loading your outage reports from service...</span>
            </div>
          ) : !isAuthenticated ? (
            /* SIGNED-OUT STATE */
            <div className="p-space-xl rounded-xl bg-surface-container-low/60 border border-outline-variant/40 flex flex-col items-center justify-center text-center gap-space-sm py-10">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-on-surface">Sign In to View Your Reports</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  You are currently browsing the Citizen Portal in demo mode. Sign in to your citizen account to submit reports, track live dispatch status, and receive notifications.
                </p>
              </div>
              {onNavigateSignIn && (
                <button
                  type="button"
                  onClick={onNavigateSignIn}
                  className="mt-2 px-space-lg py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  <span>Sign In to Account</span>
                </button>
              )}
            </div>
          ) : reportsError ? (
            /* ERROR STATE */
            <div className="p-space-md rounded-xl bg-error-container/20 border border-error-container/40 flex items-center justify-between gap-space-sm text-xs text-error">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{reportsError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorState({ userId: currentUserId, error: null });
                  setIsFetchingReports(true);
                  setReportsRetryCount((c) => c + 1);
                }}
                className="px-space-md py-1 rounded-lg bg-surface-container-lowest border border-error-container/60 font-bold hover:bg-error-container/30 cursor-pointer text-error"
              >
                Retry
              </button>
            </div>
          ) : myReports.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-space-xl rounded-xl bg-surface-container-low/60 border border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center gap-space-sm py-10">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-2xl">assignment_late</span>
              </div>
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-on-surface">No Outage Reports Submitted Yet</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  You haven&apos;t logged any outage reports yet. If your area is facing a blackout, flickering, or hazardous lines, submit a report to alert municipal teams.
                </p>
              </div>
              {onNavigateReportOutage && (
                <button
                  type="button"
                  onClick={onNavigateReportOutage}
                  className="mt-2 px-space-lg py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Submit an Outage Report</span>
                </button>
              )}
            </div>
          ) : (
            /* REPORTS LIST */
            <div className="flex flex-col gap-space-xs">
              {myReports.map((report) => {
                const loc = locationsMap[report.location_id];
                const locationName = loc ? `${loc.name}${loc.address ? ` (${loc.address})` : ''}` : report.location_id;
                const formattedDate = new Date(report.created_at).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                let badgeColor = 'bg-primary-container text-on-primary-container';
                if (report.status === 'Submitted') {
                  badgeColor = 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30';
                } else if (report.status === 'Under Review') {
                  badgeColor = 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30';
                } else if (report.status === 'Linked to Incident') {
                  badgeColor = 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/30';
                } else if (report.status === 'Resolved') {
                  badgeColor = 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30';
                } else if (report.status === 'Rejected') {
                  badgeColor = 'bg-error-container/40 text-error border border-error-container/60';
                }

                return (
                  <div
                    key={report.id}
                    className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-xs"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span className="font-bold text-on-surface text-sm">
                          {report.outage_type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                          {report.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-space-xs text-[11px] text-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span className="font-medium text-on-surface truncate">{locationName}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono">{formattedDate}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-on-surface-variant/80">ID: {report.id}</span>
                      </div>

                      {report.description && (
                        <p className="text-[11px] text-on-surface-variant pt-0.5 line-clamp-2">
                          {report.description}
                        </p>
                      )}
                    </div>

                    {report.incident_id && onViewIncidentDetail && (
                      <button
                        type="button"
                        onClick={() => onViewIncidentDetail(report.incident_id)}
                        className="self-start sm:self-center px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-primary font-bold text-xs transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                      >
                        <span>View Incident</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

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
        <span>© 2026 PowerWatch Citizen Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
