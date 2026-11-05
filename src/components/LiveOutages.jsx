import React, { useState } from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { LiveOutageMap } from './LiveOutageMap';
import { hasValidCoordinates } from '../lib/incidentAdapter';

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
          {/* Left: Real Interactive Leaflet Outage Map */}
          <div className="lg:col-span-7 flex flex-col gap-space-sm">
            <LiveOutageMap
              incidents={filteredIncidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onViewIncidentDetail={onSelectIncidentDetail}
              activeCount={activeCount}
              isLoading={isLoading}
              error={error}
            />
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
                    onClick={() => {
                      setSelectedIncidentId(incident.id);
                      if (onSelectIncidentDetail) {
                        onSelectIncidentDetail(incident.id);
                      }
                    }}
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

                    {/* Geographic mapping status */}
                    {!hasValidCoordinates(incident) ? (
                      <div className="px-space-sm py-1 rounded bg-surface-container-high/60 border border-outline-variant/30 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-outline">location_off</span>
                        <span>Coordinates pending — cannot be plotted on live map</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-outline">
                        <span className="material-symbols-outlined text-[13px] text-primary">pin_drop</span>
                        <span>Mapped coordinates: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</span>
                      </div>
                    )}

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
