import React, { useState } from 'react';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchStatus({
        type: 'success',
        message: `Grid Normal: No active outages reported for "${searchQuery}".`,
      });
    }
  };

  return (
    <section className="relative w-full px-margin md:px-margin-desktop py-space-2xl md:py-space-2xl overflow-hidden bg-background">
      {/* Background radial blurs */}
      <div className="absolute -top-32 right-[-8%] w-[520px] h-[520px] rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-[-12%] w-[420px] h-[420px] rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
          {/* Civic Utility Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold">
              Civic Utility & Grid Incident Tracking Platform
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="flex flex-col gap-space-sm max-w-[680px]">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface leading-tight">
              Community Power Outage Reporting & Tracking
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              An open community platform to report outages, track grid restoration in real time, and stay informed with verified neighborhood incident updates.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto pt-space-xs">
            <a
              href="#live-outages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">bolt</span>
              <span>Report an Outage</span>
            </a>
            <a
              href="#map-monitor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-space-lg py-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">my_location</span>
              <span>View Live Outages</span>
            </a>
          </div>

          {/* Instant Address Search Form */}
          <div className="w-full max-w-[640px] pt-space-sm">
            <form onSubmit={handleSearch} className="p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col sm:flex-row gap-space-sm items-center">
              <div className="flex items-center gap-space-xs w-full px-space-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  placeholder="Enter street address or postal code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-on-surface placeholder:text-outline text-sm py-space-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-space-lg py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors"
              >
                Check Status
              </button>
            </form>

            {/* Instant Search Feedback */}
            {searchStatus && (
              <div className="pt-space-xs px-space-xs flex items-center justify-between text-on-surface-variant">
                <span className="text-xs text-secondary font-semibold flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  {searchStatus.message}
                </span>
                <a href="#live-outages" className="text-xs text-primary hover:underline font-semibold">
                  Still without power? Report here
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Telemetry Snapshot Card */}
        <div className="lg:col-span-5 flex flex-col gap-space-md mt-space-lg lg:mt-0">
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/50 p-space-lg shadow-sm relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-t-xl" />
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">grid_view</span>
                <div>
                  <h3 className="text-base font-semibold text-on-surface">Community Outage Status</h3>
                  <span className="text-xs text-on-surface-variant">Verified Community Reports</span>
                </div>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-md py-space-md border-b border-outline-variant/20">
              <div className="p-space-sm rounded-lg bg-surface-container-low border-l-4 border-l-secondary">
                <span className="text-xs text-on-surface-variant block uppercase font-bold">Active Community Reports</span>
                <span className="text-2xl font-bold text-on-surface">14</span>
                <span className="text-xs text-secondary flex items-center gap-space-xxs mt-space-xxs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 8 resolved today
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low border-l-4 border-l-tertiary">
                <span className="text-xs text-on-surface-variant block uppercase font-bold">Verified Incidents</span>
                <span className="text-2xl font-bold text-on-surface tnum">3</span>
                <span className="text-xs text-on-surface-variant block mt-space-xxs">Under community review</span>
              </div>
            </div>

            {/* Visual Status Highlight */}
            <div className="pt-space-md">
              <div className="p-space-md rounded-lg bg-primary-container/10 border border-primary-container/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase font-bold block">Regional Status</span>
                  <p className="text-sm font-semibold text-on-surface">Active Response in West End Area</p>
                </div>
                <span className="px-space-xs py-1 rounded bg-primary text-on-primary text-xs font-semibold">
                  Crews Staged
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Trust Metrics Bar */}
      <div className="max-w-[1440px] mx-auto mt-space-2xl pt-space-lg border-t border-outline-variant/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          <div className="flex flex-col gap-space-xxs">
            <div className="flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="text-xl font-bold text-on-surface">Verified</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">Community Verified</span>
            <span className="text-xs text-on-surface-variant">Resident reports cross-checked</span>
          </div>

          <div className="flex flex-col gap-space-xxs">
            <div className="flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">speed</span>
              <span className="text-xl font-bold text-on-surface">&lt; 1 min</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">Instant Submission</span>
            <span className="text-xs text-on-surface-variant">Quick Reporting</span>
          </div>

          <div className="flex flex-col gap-space-xxs">
            <div className="flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">location_city</span>
              <span className="text-xl font-bold text-on-surface">Open Data</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">Public Transparency</span>
            <span className="text-xs text-on-surface-variant">Equal neighborhood access</span>
          </div>

          <div className="flex flex-col gap-space-xxs">
            <div className="flex items-center gap-space-xs text-secondary font-bold">
              <span className="material-symbols-outlined text-[20px]">sensors</span>
              <span className="text-xl font-bold text-on-surface">Live</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">Real-Time Updates</span>
            <span className="text-xs text-on-surface-variant">Community-powered tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
