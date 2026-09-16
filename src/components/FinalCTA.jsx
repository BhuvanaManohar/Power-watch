import React from 'react';

export function FinalCTA() {
  return (
    <section className="w-full px-margin md:px-margin-desktop py-space-2xl bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="max-w-[760px] mx-auto text-center flex flex-col items-center gap-space-md py-space-lg">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-[16px]">electric_bolt</span>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Take Action</span>
        </div>

        {/* Heading & Copy */}
        <div className="flex flex-col gap-space-xs">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Help keep your community informed during an outage
          </h2>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto">
            Submit an outage report in seconds or explore verified neighborhood restoration milestones and status updates.
          </p>
        </div>

      </div>
    </section>
  );
}
