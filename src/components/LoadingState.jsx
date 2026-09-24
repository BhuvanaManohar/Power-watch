import React from 'react';

export function LoadingState({ message = 'Loading outage data...', variant = 'spinner' }) {
  if (variant === 'skeleton') {
    return (
      <div className="w-full p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/60 animate-pulse flex flex-col gap-space-sm">
        <div className="h-4 bg-outline-variant/30 rounded w-1/3"></div>
        <div className="h-8 bg-outline-variant/20 rounded w-1/2"></div>
        <div className="h-3 bg-outline-variant/20 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col items-center justify-center gap-space-sm text-center">
      <span className="material-symbols-outlined text-primary text-3xl animate-spin">
        sync
      </span>
      <p className="text-sm font-medium text-on-surface-variant">{message}</p>
    </div>
  );
}
