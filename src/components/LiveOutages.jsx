import React, { useState } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

const DEFAULT_PIN_POSITIONS = [
  'top-[160px] left-[20%]',
  'top-[120px] left-[55%]',
  'top-[320px] left-[65%]',
  'top-[210px] left-[35%]',
  'top-[270px] left-[45%]',
  'top-[180px] left-[75%]',
];

export function LiveOutages({
  incidents = [],
  isLoading = false,
  error = null,
  onRetry,
  onSelectIncidentDetail,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const activeCount = incidents.filter(
    (i) => i.category !== 'resolved' && i.category !== 'cancelled'
  ).length;
  const investigatingCount = incidents.filter(
    (i) => i.category === 'investigating'
  ).length;
  const progressCount = incidents.filter(
    (i) => i.category === 'progress'
  ).length;

  const filteredIncidents = incidents.filter((incident) => {
    const matchesCategory =
      activeFilter === 'all' || incident.category === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const area = (incident.areaName || '').toLowerCase();
    const code = (incident.incidentId || '').toLowerCase();
    const details = (incident.investigationDetails || incident.title || '').toLowerCase();
    const matchesSearch =
      !query ||
      area.includes(query) ||
      code.includes(query) ||
      details.includes(query);

    return matchesCategory && matchesSearch;
  });

  const selectedIncident = incidents.find((inc) => inc.id === selectedIncidentId);

  return (
    <section
      className="w-full bg-surface-container-low border-y border-outline-variant/30 py-space-2xl px-margin md:px-margin-desktop"
      id="map-monitor"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col gap-space-xxs max-w-[720px]">
          <div className="flex items-center gap-space-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${activeCount > 0 ? 'bg-secondary animate-pulse' : 'bg-outline'}`} />
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              Community Incident Monitor
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Live Outages
          </h2>
          <p className="text-base text-on-surface-variant">
            Community-reported outages currently being monitored
          </p>
        </div>

        {/* Compact Summary Metrics Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-sm flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-lg">
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-sm font-bold text-on-surface">
                {activeCount} Active {activeCount === 1 ? 'Area' : 'Areas'}
              </span>
            </div>
            <div className="w-px h-4 bg-outline-variant/40 hidden sm:block" />
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm font-semibold text-on-surface-variant">
                {investigatingCount} Under Investigation
              </span>
            </div>
            <div className="w-px h-4 bg-outline-variant/40 hidden sm:block" />
            <div className="flex items-center gap-space-xs">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-sm font-semibold text-on-surface-variant">
                {progressCount} Restoration in Progress
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[15px] text-secondary">
              sync
            </span>
            <span>
              {isLoading
                ? 'Connecting to grid...'
                : error
                ? 'Offline'
                : 'Last updated: Just now'}
            </span>
          </div>
        </div>

        {/* Search Field & Status Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
          {/* Location / Area Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area or neighborhood..."
              className="w-full pl-10 pr-space-md py-space-xs text-xs rounded-full bg-surface-container-lowest border border-outline-variant/60 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-[16px]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs md:pb-0 shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-space-md py-space-xs rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
              }`}
            >
              All Outages
            </button>
            <button
              onClick={() => setActiveFilter('investigating')}
              className={`px-space-md py-space-xs rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'investigating'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Under Investigation
            </button>
            <button
              onClick={() => setActiveFilter('progress')}
              className={`px-space-md py-space-xs rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'progress'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Restoration in Progress
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-space-md py-space-xs rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === 'resolved'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Resolved Today
            </button>
          </div>
        </div>

        {/* Split Layout: Interactive Vector Map + Incident Feed Cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start"
          id="live-outages"
        >
          {/* Left: Interactive Vector Map Container */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm">
            <div className="relative w-full h-[480px] md:h-[520px] rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm bg-surface-container-lowest">
              {/* SVG Map Graphic */}
              <div className="absolute inset-0 bg-surface-container-low/40">
                <svg
                  className="w-full h-full opacity-90"
                  viewBox="0 0 800 520"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#c3c6d6"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                        opacity="0.6"
                      />
                    </pattern>
                    <linearGradient id="water-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#d5e3fc" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#e6eeff" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <path
                    d="M-20 380 Q 220 340 380 410 T 820 390 L 820 480 Q 520 490 340 450 T -20 440 Z"
                    fill="url(#water-grad)"
                  />

                  {/* Visual Sector Polygons */}
                  <polygon
                    points="120,90 280,70 330,220 160,250 90,180"
                    fill="#b54000"
                    fillOpacity={activeCount > 0 ? '0.12' : '0.04'}
                    stroke="#8d3000"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  <polygon
                    points="360,60 560,50 620,180 440,210 350,140"
                    fill="#1e60d5"
                    fillOpacity={activeCount > 0 ? '0.12' : '0.04'}
                    stroke="#0048af"
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  <polygon
                    points="420,290 680,270 720,380 460,400"
                    fill="#006c4a"
                    fillOpacity={activeCount > 0 ? '0.12' : '0.04'}
                    stroke="#006c4a"
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  <path
                    d="M 40 210 Q 300 200 480 230 T 780 210"
                    stroke="#c3c6d6"
                    strokeWidth="3"
                    opacity="0.8"
                    fill="none"
                  />
                  <path
                    d="M 260 40 Q 280 240 310 500"
                    stroke="#c3c6d6"
                    strokeWidth="2.5"
                    opacity="0.8"
                    fill="none"
                  />
                  <path
                    d="M 510 30 Q 520 220 530 500"
                    stroke="#c3c6d6"
                    strokeWidth="2"
                    opacity="0.7"
                    fill="none"
                  />

                  <text
                    x="160"
                    y="115"
                    fill="#8d3000"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    WEST OAK SECTOR
                  </text>
                  <text
                    x="410"
                    y="85"
                    fill="#0048af"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    NORTH CRESTVIEW
                  </text>
                  <text
                    x="510"
                    y="325"
                    fill="#006c4a"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    RIVERFRONT MARINA
                  </text>
                </svg>
              </div>

              {/* Map Top Status Pill */}
              <div className="relative z-10 p-space-md flex items-start justify-between gap-space-sm">
                <div className="p-space-sm rounded-xl bg-surface-container-lowest/95 backdrop-blur-sm border border-outline-variant/60 shadow-sm flex items-center gap-space-xs">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeCount > 0 ? 'bg-tertiary animate-pulse' : 'bg-secondary'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      {activeCount > 0
                        ? `${activeCount} Active ${activeCount === 1 ? 'Area' : 'Areas'} Monitored`
                        : 'Municipal Grid Stable — No Active Outages'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clickable Pins for Incidents */}
              {incidents.map((incident, idx) => {
                const isSelected = selectedIncidentId === incident.id;
                const isHiddenByFilter = !filteredIncidents.some(
                  (inc) => inc.id === incident.id
                );
                if (isHiddenByFilter) return null;

                const pinPos =
                  incident.pinPos ||
                  DEFAULT_PIN_POSITIONS[idx % DEFAULT_PIN_POSITIONS.length];
                const label =
                  incident.label ||
                  (incident.areaName && incident.areaName.length > 20
                    ? `${incident.areaName.slice(0, 18)}...`
                    : incident.areaName) ||
                  incident.incidentId;
                const subLabel = incident.subLabel || incident.statusText;
                const pinColor =
                  incident.pinColor ||
                  (incident.category === 'investigating'
                    ? 'bg-tertiary text-on-tertiary'
                    : incident.category === 'progress'
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary text-on-secondary');

                const iconName =
                  incident.category === 'investigating'
                    ? 'bolt'
                    : incident.category === 'progress'
                    ? 'commute'
                    : 'check';

                return (
                  <div
                    key={incident.id}
                    onClick={() =>
                      setSelectedIncidentId(isSelected ? null : incident.id)
                    }
                    className={`absolute ${pinPos} z-10 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 ${
                      isSelected
                        ? 'ring-2 ring-primary rounded-full ring-offset-2 scale-110'
                        : ''
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {incident.category === 'investigating' && (
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-tertiary-fixed-dim opacity-75" />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full ${pinColor} flex items-center justify-center shadow-md border-2 border-surface-container-lowest`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {iconName}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 px-space-xs py-0.5 rounded bg-surface-container-lowest/95 border border-outline-variant/60 text-on-surface text-center shadow-sm">
                      <span className="text-xs font-bold block">{label}</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          incident.noteIconColor || 'text-on-surface-variant'
                        }`}
                      >
                        {subLabel}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Interactive Selected Incident Preview Overlay Card */}
              {selectedIncident && (
                <div className="absolute top-16 left-4 right-4 md:left-auto md:right-4 z-20 max-w-sm w-full p-space-md rounded-xl bg-surface-container-lowest/98 backdrop-blur-md border border-outline-variant shadow-xl flex flex-col gap-space-xs text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-space-xxs border-b border-outline-variant/40">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary-container/30">
                        {selectedIncident.incidentId}
                      </span>
                      <span
                        className={`px-space-xs py-0.5 rounded-full text-[10px] font-bold ${selectedIncident.statusClass}`}
                      >
                        {selectedIncident.statusText}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedIncidentId(null)}
                      className="text-on-surface-variant hover:text-on-surface p-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface">
                      {selectedIncident.areaName}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant pt-0.5">
                      {selectedIncident.investigationDetails}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs py-space-xs border-y border-outline-variant/30 text-[11px]">
                    <div>
                      <span className="text-on-surface-variant block">
                        Community Reports
                      </span>
                      <span className="font-bold text-primary">
                        {selectedIncident.reportsCount != null
                          ? `${selectedIncident.reportsCount} notices`
                          : 'Verified log'}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">
                        Reported Time
                      </span>
                      <span className="font-bold text-on-surface">
                        {selectedIncident.time}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block">
                        Estimated Restoration
                      </span>
                      <span className="font-bold text-on-surface">
                        {selectedIncident.estimatedRestoration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-xxs">
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        verified
                      </span>
                      <span>
                        {selectedIncident.isLive
                          ? 'Live Grid Incident'
                          : 'Incident preview active'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectIncidentDetail) {
                          onSelectIncidentDetail(selectedIncident.id);
                        } else {
                          const cardEl = document.getElementById(
                            `incident-card-${selectedIncident.id}`
                          );
                          if (cardEl) {
                            cardEl.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            });
                          }
                        }
                      }}
                      className="px-space-sm py-1 rounded-md bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>View Incident</span>
                      <span className="material-symbols-outlined text-[12px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Clearly Visible Map Legend */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-space-sm bg-surface-container-lowest/95 backdrop-blur-sm border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-sm text-xs text-on-surface-variant">
                <div className="flex flex-wrap items-center gap-space-md font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-tertiary" />
                    <span className="text-on-surface">Active outage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-on-surface">Restoration in progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-on-surface">Restored</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[15px] text-secondary">
                    sync
                  </span>
                  <span>
                    {isLoading
                      ? 'Updating...'
                      : error
                      ? 'Error'
                      : 'Last updated: Just now'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scannable Incident Feed Cards */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {isLoading ? (
              <LoadingState message="Connecting to municipal grid services..." />
            ) : error ? (
              <ErrorState
                title="Unable to load live outages"
                message={error}
                onRetry={onRetry}
              />
            ) : incidents.length === 0 ? (
              <EmptyState
                icon="bolt"
                title="No active outages reported"
                message="All monitored municipal grid sectors are currently operating normally. No active power disruptions have been reported."
              />
            ) : filteredIncidents.length === 0 ? (
              <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-center text-on-surface-variant text-sm flex flex-col items-center gap-space-xs">
                <span className="material-symbols-outlined text-outline text-3xl">
                  search_off
                </span>
                <p className="font-bold text-on-surface">
                  No matching outages found
                </p>
                <p className="text-xs text-on-surface-variant">
                  Try adjusting your search query or status filter.
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncidentId === incident.id;
                return (
                  <div
                    id={`incident-card-${incident.id}`}
                    key={incident.id}
                    onClick={() =>
                      setSelectedIncidentId(isSelected ? null : incident.id)
                    }
                    className={`p-space-lg rounded-xl bg-surface-container-lowest border shadow-sm flex flex-col gap-space-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-outline-variant/60 hover:border-outline-variant'
                    }`}
                  >
                    {/* Card Header: Incident ID, Area Name & Status Badge */}
                    <div className="flex items-start justify-between gap-space-sm">
                      <div>
                        <div className="flex items-center gap-space-xs mb-space-xxs flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary-container/30">
                            {incident.incidentId}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              incident.dotColor || 'bg-primary'
                            }`}
                          />
                          <span className="text-xs font-bold text-outline">
                            {incident.time}
                          </span>
                          <span className="text-xs text-outline">•</span>
                          <span className="text-xs font-semibold text-primary">
                            {incident.reportsCount != null
                              ? `${incident.reportsCount} community reports`
                              : 'Verified incident log'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-on-surface leading-snug">
                          {incident.areaName}
                        </h4>
                      </div>
                      <span
                        className={`px-space-sm py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${incident.statusClass}`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {incident.statusIcon}
                        </span>
                        {incident.statusText}
                      </span>
                    </div>

                    {/* Investigation/Restoration details */}
                    <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xxs text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant uppercase font-bold">
                          Estimated Restoration
                        </span>
                        <span className="text-on-surface font-bold">
                          {incident.estimatedRestoration}
                        </span>
                      </div>
                      <p className="text-on-surface-variant pt-space-xxs">
                        {incident.investigationDetails}
                      </p>
                      {incident.assignedCrew &&
                        incident.assignedCrew !== 'Unassigned' && (
                          <div className="pt-space-xxs text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-secondary">
                              engineering
                            </span>
                            <span>Assigned Crew: {incident.assignedCrew}</span>
                          </div>
                        )}
                    </div>

                    {/* Card Footer: View Incident Action */}
                    <div className="flex items-center justify-between pt-space-xxs text-xs">
                      <span className="text-on-surface-variant flex items-center gap-space-xxs">
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            incident.noteIconColor || 'text-primary'
                          }`}
                        >
                          {incident.noteIcon || 'verified'}
                        </span>
                        <span>
                          {incident.isLive
                            ? 'Live Grid Incident'
                            : 'Verified incident log'}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectIncidentDetail) {
                            onSelectIncidentDetail(incident.id);
                          } else {
                            setSelectedIncidentId(incident.id);
                          }
                        }}
                        className="text-primary hover:underline font-bold inline-flex items-center gap-space-xxs cursor-pointer"
                      >
                        <span>View incident</span>
                        <span className="material-symbols-outlined text-[14px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
