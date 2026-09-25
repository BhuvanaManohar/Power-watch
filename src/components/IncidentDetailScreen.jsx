import React from 'react';

const mockIncidentDetailsData = {
  'west-district': {
    incidentId: 'INC-8921-W',
    areaName: 'Oak & 8th Avenue Corridor (West District)',
    statusText: 'Under Investigation',
    statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    statusIcon: 'search',
    severity: 'High Severity',
    severityClass: 'bg-error-container text-on-error-container',
    reportsCount: 6,
    reportedTime: 'Today at 1:15 PM (45 mins ago)',
    lastUpdatedTime: 'Today at 1:45 PM (15 mins ago)',
    estimatedRestoration: 'Est. 2:30 PM Today',
    affectedHouseholds: '120–150 Households',
    timeline: [
      { stage: 'Reported', timestamp: '1:15 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:30 PM', status: 'current' },
      { stage: 'Incident Verified', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Crew Dispatched', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Restoration in Progress', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Power Restored', timestamp: 'Pending', status: 'upcoming' },
    ],
    departmentUpdates: [
      {
        time: '1:45 PM',
        title: 'Safety Perimeter Established',
        description: 'Field officer confirmed downed tree limb near 8th Ave transformer. Safety perimeter marked; awaiting specialized tree clearance unit.',
        officer: 'Officer M. Sharma (Discom West)'
      },
      {
        time: '1:30 PM',
        title: 'Investigation Unit Assigned',
        description: 'Triage officer assigned investigation ticket following multiple citizen notices in sector 8.',
        officer: 'Control Room Dispatch'
      }
    ],
    communityReports: [
      { ref: 'REP-8821', time: '1:14 PM', location: 'Oak St & 8th Ave', status: 'Verified' },
      { ref: 'REP-8824', time: '1:18 PM', location: '804 Oak St', status: 'Verified' },
      { ref: 'REP-8830', time: '1:22 PM', location: 'Oak Ave West Park', status: 'Under Review' },
      { ref: 'REP-8835', time: '1:29 PM', location: '812 8th Ave', status: 'Verified' },
    ]
  },
  'north-crestview': {
    incidentId: 'INC-7430-N',
    areaName: 'North Crestview Neighborhood',
    statusText: 'Restoration in Progress',
    statusClass: 'bg-primary-fixed text-on-primary-fixed',
    statusIcon: 'directions_car',
    severity: 'Moderate Severity',
    severityClass: 'bg-primary-container text-on-primary-container',
    reportsCount: 4,
    reportedTime: 'Today at 1:40 PM (20 mins ago)',
    lastUpdatedTime: 'Today at 1:55 PM (5 mins ago)',
    estimatedRestoration: 'Est. 1:45 PM Today',
    affectedHouseholds: '30–40 Households',
    timeline: [
      { stage: 'Reported', timestamp: '1:40 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:45 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '1:48 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '1:52 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '1:55 PM', status: 'current' },
      { stage: 'Power Restored', timestamp: 'Pending', status: 'upcoming' },
    ],
    departmentUpdates: [
      {
        time: '1:55 PM',
        title: 'Crew On Site & Feeder Line Work Initiated',
        description: 'Utility Truck #4 arrived at Crestview Ridge feeder line. Fuse replacement currently underway.',
        officer: 'Line Crew Chief R. Kumar'
      },
      {
        time: '1:52 PM',
        title: 'Crew Dispatched',
        description: 'Utility Service Vehicle dispatched from Central Substation.',
        officer: 'Control Room Dispatch'
      }
    ],
    communityReports: [
      { ref: 'REP-7401', time: '1:39 PM', location: 'Crestview Ridge Rd', status: 'Verified' },
      { ref: 'REP-7405', time: '1:42 PM', location: 'North Crestview Circle', status: 'Verified' },
      { ref: 'REP-7412', time: '1:44 PM', location: '14 Crestview Heights', status: 'Verified' },
    ]
  },
  'riverfront': {
    incidentId: 'INC-3105-R',
    areaName: 'Riverfront Commercial & Marina Area',
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    severity: 'Resolved',
    severityClass: 'bg-secondary-fixed text-on-secondary-fixed',
    reportsCount: 14,
    reportedTime: 'Today at 1:00 PM (1 hr ago)',
    lastUpdatedTime: 'Today at 2:15 PM',
    estimatedRestoration: 'Restored at 2:15 PM',
    affectedHouseholds: 'Commercial Circuit (22 businesses)',
    timeline: [
      { stage: 'Reported', timestamp: '1:00 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:10 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '1:15 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '1:25 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '1:40 PM', status: 'completed' },
      { stage: 'Power Restored', timestamp: '2:15 PM', status: 'completed' },
    ],
    departmentUpdates: [
      {
        time: '2:15 PM',
        title: 'Circuit Energized & Restoration Verified',
        description: 'Substation breaker reset verified online across Riverfront commercial circuit. Voltage levels stable.',
        officer: 'Senior Engineer A. Verma'
      },
      {
        time: '1:40 PM',
        title: 'Substation Breaker Reset Commenced',
        description: 'Substation team isolating tripped switchgear segment.',
        officer: 'Substation Team'
      }
    ],
    communityReports: [
      { ref: 'REP-3101', time: '12:58 PM', location: 'Marina Dock A', status: 'Resolved' },
      { ref: 'REP-3109', time: '1:02 PM', location: 'Riverfront Plaza #4', status: 'Resolved' },
      { ref: 'REP-3115', time: '1:08 PM', location: 'Commercial Way', status: 'Resolved' },
    ]
  }
};

export function IncidentDetailScreen({
  incidentId = 'west-district',
  incidentsData,
  onBack,
  onBackToDepartmentPortal,
  onBackToCitizenPortal,
  onBackToOutageHistory,
}) {
  const dataset = incidentsData || mockIncidentDetailsData;
  const targetKey = Object.keys(dataset).find(
    (key) => key === incidentId || dataset[key].incidentId === incidentId
  );
  const incident = dataset[targetKey || incidentId] || dataset['west-district'] || mockIncidentDetailsData['west-district'];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-space-sm sm:gap-space-md flex-wrap">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-space-xs text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Live Outages</span>
            </button>

            {onBackToOutageHistory && (
              <button
                type="button"
                onClick={onBackToOutageHistory}
                className="flex items-center gap-space-xs text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer border-l border-outline-variant/40 pl-space-sm sm:pl-space-md"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>Back to Outage History</span>
              </button>
            )}

            {onBackToCitizenPortal && (
              <button
                type="button"
                onClick={onBackToCitizenPortal}
                className="flex items-center gap-space-xs text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer border-l border-outline-variant/40 pl-space-sm sm:pl-space-md"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Back to Citizen Portal</span>
              </button>
            )}

            {onBackToDepartmentPortal && (
              <button
                type="button"
                onClick={onBackToDepartmentPortal}
                className="flex items-center gap-space-xs text-xs font-bold text-secondary hover:text-secondary/80 transition-colors cursor-pointer border-l border-outline-variant/40 pl-space-sm sm:pl-space-md"
              >
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>Back to Department Portal</span>
              </button>
            )}
          </div>

          <span className="font-mono text-xs font-bold text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded">
            {incident.incidentId}
          </span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin md:px-margin-desktop pt-28 pb-space-2xl flex flex-col gap-space-xl">
        
        {/* Incident Header Card */}
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-wrap items-start justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs mb-space-xxs flex-wrap">
                <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-container/30">
                  {incident.incidentId}
                </span>
                <span className={`px-space-xs py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${incident.statusClass}`}>
                  <span className="material-symbols-outlined text-[14px]">{incident.statusIcon}</span>
                  {incident.statusText}
                </span>
                <span className={`px-space-xs py-0.5 rounded-full text-xs font-bold ${incident.severityClass}`}>
                  {incident.severity}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight leading-snug">
                {incident.areaName}
              </h1>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="px-space-md py-space-xs rounded-lg border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer self-start"
            >
              Close Details
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter pt-space-xs border-t border-outline-variant/40 text-xs">
            <div>
              <span className="text-on-surface-variant block uppercase font-bold text-[10px]">Community Notices</span>
              <span className="font-bold text-primary text-sm">{incident.reportsCount} Verified Reports</span>
            </div>
            <div>
              <span className="text-on-surface-variant block uppercase font-bold text-[10px]">Reported Time</span>
              <span className="font-bold text-on-surface text-sm">{incident.reportedTime}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block uppercase font-bold text-[10px]">Last Status Update</span>
              <span className="font-bold text-on-surface text-sm">{incident.lastUpdatedTime}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block uppercase font-bold text-[10px]">Estimated Restoration</span>
              <span className="font-bold text-on-surface text-sm">{incident.estimatedRestoration}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Main Section: Timeline + Operational Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          
          {/* Left Column: Lifecycle Timeline */}
          <div className="lg:col-span-6 p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                <span>Incident Lifecycle Timeline</span>
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">Stage Progress</span>
            </div>

            <div className="flex flex-col gap-space-md relative pl-space-sm">
              {incident.timeline.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                const dotStyle = isCompleted
                  ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                  : isCurrent
                  ? 'bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                  : 'bg-surface-container-high border border-outline-variant text-outline';

                return (
                  <div key={step.stage} className="flex items-start gap-space-md relative">
                    {/* Connecting line */}
                    {idx < incident.timeline.length - 1 && (
                      <div
                        className={`absolute left-[11px] top-[24px] w-0.5 h-[calc(100%+8px)] ${
                          isCompleted ? 'bg-secondary' : 'bg-outline-variant/40'
                        }`}
                      />
                    )}

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold z-10 shrink-0 ${dotStyle}`}>
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-space-sm pb-space-xs">
                      <div>
                        <p className={`text-xs font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant/70'}`}>
                          {step.stage}
                        </p>
                        {isCurrent && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary-container text-on-primary-container">
                            Current Active Phase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-on-surface-variant shrink-0">
                        {step.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Latest Operational Updates & Community Reports */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            
            {/* Latest Department Update & Citizen Notifications */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                  <span>Official Department Updates & Incident Alerts</span>
                </h3>
                <span className="text-xs text-primary font-bold">{incident.departmentUpdates?.length || 0} Published</span>
              </div>

              <div className="flex flex-col gap-space-sm pt-space-xs">
                {(!incident.departmentUpdates || incident.departmentUpdates.length === 0) ? (
                  <p className="text-xs text-on-surface-variant p-space-sm rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 text-center">
                    No official department updates published for this incident yet.
                  </p>
                ) : (
                  incident.departmentUpdates.map((update, i) => {
                    const category = update.category || (update.title.includes('Crew') ? 'Crew Update' : update.title.includes('Restoration') || update.title.includes('ETR') ? 'ETR Update' : update.title.includes('Resolved') || update.title.includes('Restored') ? 'Resolution Update' : 'Status Update');
                    return (
                      <div key={i} className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-xxs text-xs">
                        <div className="flex items-center justify-between flex-wrap gap-space-xxs">
                          <div className="flex items-center gap-space-xs">
                            <span className="font-bold text-on-surface">{update.title}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/40 text-on-primary-container border border-primary-container/60">
                              {category}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-on-surface-variant">{update.time}</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed pt-0.5">{update.description}</p>
                        <span className="text-[10px] font-semibold text-primary pt-1">
                          Logged by: {update.officer}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Related Community Reports */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
                  <span>Related Community Reports</span>
                </h3>
                <span className="text-xs text-primary font-bold">{incident.communityReports.length} Notices</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/40 text-on-surface-variant font-bold text-[10px] uppercase">
                      <th className="py-2 px-2">Report Ref</th>
                      <th className="py-2 px-2">Reported</th>
                      <th className="py-2 px-2">Sub-Area</th>
                      <th className="py-2 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incident.communityReports.map((rep) => (
                      <tr key={rep.ref} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50">
                        <td className="py-2 px-2 font-mono font-bold text-primary">{rep.ref}</td>
                        <td className="py-2 px-2 text-on-surface-variant">{rep.time}</td>
                        <td className="py-2 px-2 font-semibold text-on-surface">{rep.location}</td>
                        <td className="py-2 px-2 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
