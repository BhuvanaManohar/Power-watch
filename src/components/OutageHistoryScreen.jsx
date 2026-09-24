import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { computeOutageAnalytics } from '../data/mockIncidentsStore';

export function OutageHistoryScreen({
  incidentsData = {},
  onNavigateHome,
  onNavigateLiveOutages,
  onNavigateSignIn,
  onNavigateReportOutage,
  onViewIncidentDetail,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const incidentsList = Object.values(incidentsData);
  const analytics = computeOutageAnalytics(incidentsData);

  // Filter logic
  const filteredIncidents = incidentsList.filter((inc) => {
    // Area filter
    if (selectedArea !== 'all') {
      const incArea = inc.areaName.toLowerCase();
      if (selectedArea === 'west' && !incArea.includes('west')) return false;
      if (selectedArea === 'north' && !incArea.includes('north')) return false;
      if (selectedArea === 'riverfront' && !incArea.includes('riverfront')) return false;
      if (selectedArea === 'south' && !incArea.includes('south')) return false;
      if (selectedArea === 'eastside' && !incArea.includes('eastside')) return false;
      if (selectedArea === 'central' && !incArea.includes('central')) return false;
    }

    // Severity filter
    if (selectedSeverity !== 'all') {
      const incSev = (inc.severityLevel || inc.severity || '').toLowerCase();
      if (incSev !== selectedSeverity.toLowerCase()) return false;
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'resolved' && inc.category !== 'resolved') return false;
      if (selectedStatus === 'active' && inc.category === 'resolved') return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSelectedPeriod('all');
    setSelectedArea('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      <Header
        onNavigateSignIn={onNavigateSignIn}
        onNavigateReportOutage={onNavigateReportOutage}
        onNavigateOutageHistory={() => {}}
        onNavigateHome={onNavigateHome}
        onNavigateLiveOutages={onNavigateLiveOutages}
        currentScreen="outage-history"
      />

      <main className="w-full pt-28 pb-space-2xl flex-1 max-w-[1440px] mx-auto px-margin md:px-margin-desktop flex flex-col gap-space-xl">
        
        {/* Page Header */}
        <div className="flex flex-col gap-space-xs border-b border-outline-variant/30 pb-space-md">
          <div className="flex items-center gap-space-xs text-xs text-primary font-bold">
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>PUBLIC OUTAGE RECORDS & TRANSPARENCY DATA</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Outage History & Performance Analytics
          </h1>
          <p className="text-sm text-on-surface-variant max-w-3xl">
            Explore historical grid outage events, track restoration efficiency, analyze severity distribution, and verify public utility performance metrics across all municipal discom sectors.
          </p>
        </div>

        {/* CITIZEN ANALYTICS & VISUAL SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          
          {/* Card 1: Total Incidents */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Total Logged Incidents</span>
              <span className="material-symbols-outlined text-primary text-[20px]">electric_bolt</span>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="text-3xl font-extrabold text-on-surface">{analytics.totalIncidents}</span>
              <span className="text-xs font-semibold text-secondary">({analytics.resolvedCount} Resolved)</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Across all 6 municipal power sectors logged in system.
            </p>
          </div>

          {/* Card 2: Avg Restoration Time */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Avg Restoration Time</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">timer</span>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="text-3xl font-extrabold text-on-surface">{analytics.avgRestorationHoursStr}</span>
              <span className="text-xs font-semibold text-tertiary">({analytics.avgRestorationMins} mins avg)</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Calculated from verified power restoration timestamps.
            </p>
          </div>

          {/* Card 3: Community Report Volume */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Community Notices</span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">mark_email_unread</span>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="text-3xl font-extrabold text-on-surface">{analytics.totalReportsCount}</span>
              <span className="text-xs font-semibold text-on-surface-variant">verified reports</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Linked to historical & active incident dispatches.
            </p>
          </div>

          {/* Card 4: Most Affected Area */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Most Impacted Zone</span>
              <span className="material-symbols-outlined text-error text-[20px]">domain_disabled</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-on-surface truncate">{analytics.mostAffectedArea}</span>
              <span className="text-xs font-semibold text-error">22 Community Reports</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Substation 4 primary transformer weather trip.
            </p>
          </div>
        </div>

        {/* VISUAL ANALYTICS - SEVERITY DISTRIBUTION & STATUS BREAKDOWN */}
        <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
              <span>Incident Severity & Resolution Distribution</span>
            </h3>
            <span className="text-xs font-semibold text-on-surface-variant">System Records Breakdown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            
            {/* Critical */}
            <div className="flex flex-col gap-1 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-error flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Critical Priority
                </span>
                <span>{analytics.severityCounts.Critical}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden mt-1">
                <div
                  className="bg-error h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analytics.severityCounts.Critical / analytics.totalIncidents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* High */}
            <div className="flex flex-col gap-1 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-tertiary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span> High Priority
                </span>
                <span>{analytics.severityCounts.High}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden mt-1">
                <div
                  className="bg-tertiary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analytics.severityCounts.High / analytics.totalIncidents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Medium */}
            <div className="flex flex-col gap-1 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Medium Priority
                </span>
                <span>{analytics.severityCounts.Medium}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden mt-1">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analytics.severityCounts.Medium / analytics.totalIncidents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Low */}
            <div className="flex flex-col gap-1 p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> Low Priority
                </span>
                <span>{analytics.severityCounts.Low}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden mt-1">
                <div
                  className="bg-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analytics.severityCounts.Low / analytics.totalIncidents) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* FILTER CONTROLS BAR */}
        <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="text-xs font-bold text-on-surface-variant uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>Filter Records:</span>
            </span>

            {/* Period */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-space-sm py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Time / Any Date</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Past 7 Days</option>
            </select>

            {/* Area */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-space-sm py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Sectors / Zones</option>
              <option value="west">West District Corridor</option>
              <option value="north">North Crestview</option>
              <option value="riverfront">Riverfront Commercial</option>
              <option value="south">South Industrial Grid</option>
              <option value="eastside">Eastside Heights</option>
              <option value="central">Central Tech Park</option>
            </select>

            {/* Severity */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-space-sm py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Severity Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-space-sm py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Statuses (Active & Resolved)</option>
              <option value="resolved">Power Restored (Resolved)</option>
              <option value="active">Active Outages</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            <span>Reset Filters</span>
          </button>
        </div>

        {/* OUTAGE HISTORY TABLE */}
        <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
            <h3 className="text-base font-bold text-on-surface">Historical Outage Records</h3>
            <span className="text-xs font-semibold text-on-surface-variant">Showing {filteredIncidents.length} of {incidentsList.length} incidents</span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="py-space-2xl text-center flex flex-col items-center justify-center gap-space-xs">
              <span className="material-symbols-outlined text-outline text-[40px]">find_in_page</span>
              <p className="text-sm font-bold text-on-surface">No incident records matching current filter criteria.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-on-surface-variant font-bold text-[10px] uppercase">
                    <th className="py-3 px-3">Incident ID</th>
                    <th className="py-3 px-3">Sector / Affected Area</th>
                    <th className="py-3 px-3">Severity</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Reported Time</th>
                    <th className="py-3 px-3">Restoration Details</th>
                    <th className="py-3 px-3 text-center">Reports</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map((inc) => (
                    <tr key={inc.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-primary">{inc.incidentId}</td>
                      <td className="py-3.5 px-3 font-semibold text-on-surface max-w-[220px] truncate">{inc.areaName}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.severityClass}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.statusClass}`}>
                          {inc.statusText}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-on-surface-variant font-medium">{inc.reportedTime || inc.time}</td>
                      <td className="py-3.5 px-3 text-on-surface font-medium">{inc.estimatedRestoration}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-on-surface-variant">{inc.reportsCount}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onViewIncidentDetail(inc.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      <Footer onNavigateSignIn={onNavigateSignIn} />
    </div>
  );
}
