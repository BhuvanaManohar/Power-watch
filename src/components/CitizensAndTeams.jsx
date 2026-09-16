import React from 'react';

export function CitizensAndTeams() {
  return (
    <section className="w-full bg-surface-container-low border-y border-outline-variant/30 py-space-2xl px-margin md:px-margin-desktop" id="citizens-and-teams">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
        {/* Header */}
        <div className="max-w-[760px] flex flex-col gap-space-xs">
          <span className="text-xs text-primary uppercase tracking-widest font-bold">
            Collaborative Platform
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Built for Citizens and Utility Teams
          </h2>
          <p className="text-base text-on-surface-variant">
            PowerWatch bridges the gap between residents experiencing blackouts and municipal teams coordinating restoration.
          </p>
        </div>

        {/* 2 Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg">
          {/* Column 1: For Residents */}
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>For Residents</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface">
                Clear, reliable neighborhood visibility when power goes out.
              </h3>
              <div className="flex flex-col gap-space-md pt-space-xs">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    edit_location_alt
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Quick Outage Reporting</h4>
                    <p className="text-xs text-on-surface-variant">
                      Submit disrupted addresses and basic incident details in under a minute.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                    map
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Incident Tracking</h4>
                    <p className="text-xs text-on-surface-variant">
                      Follow neighborhood outage status and see verified reports on an interactive map.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    notifications_active
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Clear Restoration Updates</h4>
                    <p className="text-xs text-on-surface-variant">
                      Receive verified milestone updates as repair crews make progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-space-lg mt-space-lg border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <a href="#live-outages" className="text-primary hover:underline flex items-center gap-space-xxs font-semibold">
                <span>Submit Neighborhood Outage</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
              <span className="text-outline">100% Free Public Service</span>
            </div>
          </div>

          {/* Column 2: For Utility Teams */}
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">engineering</span>
                  <span>For Utility Teams</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-on-surface">
                Structured community intelligence to help focus response efforts.
              </h3>
              <div className="flex flex-col gap-space-md pt-space-xs">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                    hub
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Consolidated Community Reports</h4>
                    <p className="text-xs text-on-surface-variant">
                      Cluster duplicate citizen notices by reviewing and grouping related community inputs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    assignment
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Incident Management</h4>
                    <p className="text-xs text-on-surface-variant">
                      Prioritize and organize reports by neighborhood impact without call center overload.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                    share
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">Transparent Status Communication</h4>
                    <p className="text-xs text-on-surface-variant">
                      Publish verified repair milestones and estimated timelines directly to affected communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-space-lg mt-space-lg border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <a href="#how-it-works" className="text-primary hover:underline flex items-center gap-space-xxs font-semibold">
                <span>Explore the Department Workflow</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
