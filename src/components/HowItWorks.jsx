import React from 'react';

export function HowItWorks() {
  return (
    <section className="w-full px-margin md:px-margin-desktop py-space-2xl bg-surface" id="how-it-works">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto flex flex-col gap-space-xs">
          <div className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/40 mx-auto">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              3-Step Practical Process
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mt-space-xs">
            How PowerWatch Works
          </h2>
          <p className="text-base text-on-surface-variant">
            A simple, transparent process connecting neighborhood reports with clear status updates.
          </p>
        </div>

        {/* 3 Step Card Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-outline-variant/40 -z-10" />

          {/* Step 1 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-space-xl rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm transition-all hover:border-primary">
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed border border-primary-fixed-dim/50 flex items-center justify-center text-primary mb-space-md shadow-sm">
              <span className="material-symbols-outlined text-[26px]">edit_location_alt</span>
            </div>
            <span className="text-xs text-primary uppercase tracking-wider font-bold mb-space-xxs">
              01 — Report
            </span>
            <h3 className="text-lg font-bold text-on-surface mb-space-sm">
              1. Report an Outage
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Tell us where the outage is by sharing basic location and incident details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-space-xl rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm transition-all hover:border-primary">
            <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/40 border border-secondary-fixed-dim/60 flex items-center justify-center text-secondary mb-space-md shadow-sm">
              <span className="material-symbols-outlined text-[26px]">hub</span>
            </div>
            <span className="text-xs text-secondary uppercase tracking-wider font-bold mb-space-xxs">
              02 — Review & Group
            </span>
            <h3 className="text-lg font-bold text-on-surface mb-space-sm">
              2. Review & Group Reports
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Related community reports are reviewed and grouped into neighborhood incidents.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left p-space-xl rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm transition-all hover:border-primary">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-tertiary mb-space-md shadow-sm">
              <span className="material-symbols-outlined text-[26px]">notifications_active</span>
            </div>
            <span className="text-xs text-tertiary uppercase tracking-wider font-bold mb-space-xxs">
              03 — Track Updates
            </span>
            <h3 className="text-lg font-bold text-on-surface mb-space-sm">
              3. Track Status & Restoration
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Follow investigation and restoration updates across affected neighborhoods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
