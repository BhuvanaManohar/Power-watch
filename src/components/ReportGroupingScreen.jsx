import React, { useState } from 'react';

const initialMockReports = [
  {
    reportId: 'REP-8821',
    submittedTime: '1:14 PM (45 mins ago)',
    area: 'Oak St & 8th Ave',
    outageType: 'Complete Blackout',
    status: 'Under Review',
  },
  {
    reportId: 'REP-8824',
    submittedTime: '1:18 PM (41 mins ago)',
    area: '804 Oak St',
    outageType: 'Complete Blackout',
    status: 'Under Review',
  },
  {
    reportId: 'REP-8830',
    submittedTime: '1:22 PM (37 mins ago)',
    area: 'Oak Ave West Park',
    outageType: 'Sparks / Line Down',
    status: 'Under Review',
  },
  {
    reportId: 'REP-8835',
    submittedTime: '1:29 PM (30 mins ago)',
    area: '812 8th Ave',
    outageType: 'Complete Blackout',
    status: 'Under Review',
  },
];

const mockProposedMatch = {
  incidentId: 'INC-8921-W',
  targetId: 'west-district',
  areaName: 'Oak & 8th Avenue Corridor (West District)',
  statusText: 'Under Investigation',
  statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  relatedCount: 4,
};

export function ReportGroupingScreen({ onBack, onViewIncident }) {
  const [reports, setReports] = useState(initialMockReports);
  const [isLinked, setIsLinked] = useState(false);
  const [matchStatus, setMatchStatus] = useState('pending'); // 'pending' | 'linked' | 'dismissed'

  const handleConfirmLink = () => {
    setIsLinked(true);
    setMatchStatus('linked');
    setReports((prev) =>
      prev.map((rep) => ({
        ...rep,
        status: `Linked to ${mockProposedMatch.incidentId}`,
      }))
    );
  };

  const handleNotRelated = () => {
    setMatchStatus('dismissed');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-space-xs text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Department Portal</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded">
            Report Grouping & Incident Triage
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin md:px-margin-desktop pt-28 pb-space-2xl flex flex-col gap-space-xl">
        
        {/* Header Title */}
        <div className="flex flex-col gap-space-xxs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">layers</span>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              Automated Grouping Assistant
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
            Citizen Notice Triage & Incident Linking
          </h1>
          <p className="text-xs text-on-surface-variant">
            Group related citizen notices from adjacent geographic clusters and link them to active DISCOM incident records.
          </p>
        </div>

        {/* 2-Column Layout: Possible Incident Match Card + Unlinked Reports Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          
          {/* Left Column: Proposed Incident Match Card */}
          <div className="lg:col-span-5 p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                <span>Possible Incident Match</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                High Confidence Cluster
              </span>
            </div>

            {matchStatus === 'dismissed' ? (
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/40 text-center text-xs text-on-surface-variant flex flex-col items-center gap-space-xs">
                <span className="material-symbols-outlined text-outline text-3xl">do_not_disturb_on</span>
                <p className="font-bold text-on-surface">Match Dismissed</p>
                <p className="text-[11px]">These citizen reports were marked as not related to {mockProposedMatch.incidentId}.</p>
                <button
                  type="button"
                  onClick={() => setMatchStatus('pending')}
                  className="mt-space-xs px-space-md py-1 rounded bg-surface-container-high border border-outline-variant/60 text-on-surface font-bold text-[11px] cursor-pointer"
                >
                  Re-evaluate Match
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-xs text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-container/30">
                      {mockProposedMatch.incidentId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${mockProposedMatch.statusClass}`}>
                      {mockProposedMatch.statusText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-on-surface pt-1">{mockProposedMatch.areaName}</h3>
                    <p className="text-[11px] text-on-surface-variant pt-0.5">
                      Geographic overlap detected for 4 citizen reports in Oak St & 8th Ave sector.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30 text-[11px]">
                    <span className="text-on-surface-variant font-semibold">Cluster Size</span>
                    <span className="font-bold text-primary">{mockProposedMatch.relatedCount} Related Reports</span>
                  </div>
                </div>

                {isLinked ? (
                  <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/50 flex flex-col gap-space-xs text-xs">
                    <div className="flex items-center gap-space-xs text-secondary font-bold">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Reports Successfully Linked</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      All 4 citizen notices are now linked to Incident {mockProposedMatch.incidentId}.
                    </p>
                    <button
                      type="button"
                      onClick={() => onViewIncident(mockProposedMatch.targetId)}
                      className="mt-space-xs px-space-md py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-space-xs"
                    >
                      <span>View Incident</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-space-xs pt-space-xs">
                    <button
                      type="button"
                      onClick={handleNotRelated}
                      className="flex-1 py-2 px-space-sm rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      Not Related
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmLink}
                      className="flex-1 py-2 px-space-sm rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-space-xxs shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">link</span>
                      <span>Confirm & Link Reports</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Citizen Reports Table */}
          <div className="lg:col-span-7 p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">assignment</span>
                <span>Citizen Outage Reports Queue</span>
              </h2>
              <span className="text-xs font-bold text-on-surface-variant">{reports.length} Reports</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 text-on-surface-variant font-bold text-[10px] uppercase">
                    <th className="py-2.5 px-2">Report ID</th>
                    <th className="py-2.5 px-2">Reported</th>
                    <th className="py-2.5 px-2">Area / Sub-Area</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((rep) => (
                    <tr key={rep.reportId} className="border-b border-outline-variant/20 hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-2 font-mono font-bold text-primary">{rep.reportId}</td>
                      <td className="py-2.5 px-2 text-on-surface-variant">{rep.submittedTime}</td>
                      <td className="py-2.5 px-2 font-semibold text-on-surface">{rep.area}</td>
                      <td className="py-2.5 px-2 text-on-surface-variant">{rep.outageType}</td>
                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.status.startsWith('Linked')
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-primary-container text-on-primary-container'
                          }`}
                        >
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
      </main>
    </div>
  );
}
