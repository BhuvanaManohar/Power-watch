import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { IncidentManagementModal } from './IncidentManagementModal';
import { computeOutageAnalytics } from '../data/mockIncidentsStore';

export function DepartmentDashboard({
  incidentsData = {},
  crewsData = [],
  onUpdateIncident,
  onAssignCrew,
  onPublishNotification,
  onNavigateHome,
  onNavigateLiveOutages,
  onNavigateReportGrouping,
  onViewIncidentDetail,
}) {
  const [selectedIncidentForManagement, setSelectedIncidentForManagement] = useState(null);

  const incidentsList = Object.values(incidentsData);
  const activeIncidents = incidentsList.filter((inc) => inc.category !== 'resolved');
  const restorationInProgressCount = incidentsList.filter((inc) => inc.category === 'progress').length;
  const highPriorityCount = incidentsList.filter(
    (inc) =>
      (inc.severity.includes('High') ||
        inc.severity.includes('Critical') ||
        inc.severityLevel === 'High' ||
        inc.severityLevel === 'Critical') &&
      inc.category !== 'resolved'
  ).length;

  const analytics = computeOutageAnalytics(incidentsData);

  const activeManagementIncident = selectedIncidentForManagement
    ? incidentsData[selectedIncidentForManagement.id] || selectedIncidentForManagement
    : null;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <DashboardHeader
        portalTitle="Utility / Department Officer Portal"
        badgeColor="secondary"
        onNavigateHome={onNavigateHome}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin md:px-margin-desktop pt-28 pb-space-2xl flex flex-col gap-space-xl">
        
        {/* Demo Mode Banner */}
        <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
            <div>
              <h1 className="text-sm font-bold text-on-surface">You are currently in Department Officer Operations Center</h1>
              <p className="text-xs text-on-surface-variant">Review incoming citizen notices, dispatch field crews, update ETRs, and publish restoration updates.</p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={onNavigateLiveOutages}
              className="px-space-sm py-1 rounded bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:text-primary text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">map</span>
              <span>View Outage Map</span>
            </button>
            <span className="px-space-sm py-1 rounded bg-secondary text-on-secondary text-xs font-bold uppercase">
              Officer Operations Active
            </span>
          </div>
        </div>

        {/* 1. OPERATIONAL OVERVIEW METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Active Incidents</span>
            <span className="text-2xl font-bold text-on-surface">{activeIncidents.length}</span>
            <span className="text-xs text-tertiary font-semibold">Under active DISCOM triage</span>
          </div>

          <div
            onClick={onNavigateReportGrouping}
            className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs cursor-pointer hover:border-secondary transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase">Pending Citizen Reports</span>
              <span className="material-symbols-outlined text-secondary text-[16px]">arrow_forward</span>
            </div>
            <span className="text-2xl font-bold text-on-surface">14</span>
            <span className="text-xs text-secondary font-bold">Requires triage & grouping →</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">Restoration In Progress</span>
            <span className="text-2xl font-bold text-on-surface">{restorationInProgressCount}</span>
            <span className="text-xs text-primary font-semibold">Line crews on site</span>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-xxs">
            <span className="text-xs font-bold text-on-surface-variant uppercase">High/Critical Priority</span>
            <span className="text-2xl font-bold text-on-surface">{highPriorityCount}</span>
            <span className="text-xs text-error font-semibold">Priority dispatch</span>
          </div>
        </div>

        {/* HISTORICAL ANALYTICS OVERVIEW FOR DEPARTMENT OFFICERS */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex items-center justify-between flex-wrap gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="p- space.sm rounded-lg bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Historical System Performance Summary</h4>
              <p className="text-xs text-on-surface-variant">
                Total Logged: <strong className="text-on-surface">{analytics.totalIncidents}</strong> | Resolved: <strong className="text-secondary">{analytics.resolvedCount}</strong> | Avg Restoration: <strong className="text-tertiary">{analytics.avgRestorationHoursStr}</strong> | High/Critical: <strong className="text-error">{analytics.severityCounts.Critical + analytics.severityCounts.High}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant">
            DISCOM Historical Metrics Active
          </span>
        </div>

        {/* 2-COLUMN MAIN OPERATIONS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          
          {/* LEFT: INCIDENT OPERATIONS QUEUE */}
          <div className="lg:col-span-8 p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm flex-wrap gap-space-xs">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Incident Operations Queue</h3>
                <p className="text-xs text-on-surface-variant">Manage active incidents, update status, assign crews, and publish ETRs.</p>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  onClick={onNavigateReportGrouping}
                  className="px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-space-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">layers</span>
                  <span>Group Notices</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-on-surface-variant font-bold text-[10px] uppercase">
                    <th className="py-2.5 px-2">Incident ID</th>
                    <th className="py-2.5 px-2">Area / Sector</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Priority</th>
                    <th className="py-2.5 px-2">Crew</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentsList.map((inc) => (
                    <tr key={inc.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-primary">{inc.incidentId}</td>
                      <td className="py-3 px-2 font-semibold text-on-surface">{inc.areaName}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.statusClass}`}>
                          {inc.statusText}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.severityClass}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-on-surface-variant font-medium">{inc.assignedCrew || 'Unassigned'}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-space-xs">
                          {onViewIncidentDetail && (
                            <button
                              type="button"
                              onClick={() => onViewIncidentDetail(inc.id)}
                              className="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-container text-on-surface text-[11px] font-bold cursor-pointer"
                            >
                              Review
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedIncidentForManagement(inc)}
                            className="px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary/90 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">tune</span>
                            <span>Manage</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: FIELD CREW ASSIGNMENT PANEL */}
          <div className="lg:col-span-4 p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">engineering</span>
                <span>DISCOM Field Crews</span>
              </h3>
              <span className="text-xs font-bold text-on-surface-variant">{crewsData.length} Units</span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {crewsData.map((crew) => (
                <div key={crew.id} className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{crew.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${crew.status === 'Available' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-container text-on-primary-container'}`}>
                      {crew.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Assigned: {crew.assignedIncident || 'None'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Incident Management Modal */}
      {selectedIncidentForManagement && (
        <IncidentManagementModal
          incident={activeManagementIncident}
          crews={crewsData}
          onClose={() => setSelectedIncidentForManagement(null)}
          onUpdateIncident={(updated) => {
            if (onUpdateIncident) onUpdateIncident(updated);
          }}
          onAssignCrew={(incidentId, crewId) => {
            if (onAssignCrew) onAssignCrew(incidentId, crewId);
          }}
          onPublishNotification={onPublishNotification}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Department Officer Operations Center Demo. All rights reserved.</span>
      </footer>
    </div>
  );
}

