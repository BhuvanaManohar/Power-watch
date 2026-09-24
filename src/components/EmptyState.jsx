import React from 'react';

export function EmptyState({
  icon = 'inbox',
  title = 'No reports found',
  message = 'There are currently no outage incidents or reports matching this criteria.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="p-space-xl rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col items-center justify-center text-center gap-space-xs max-w-lg mx-auto my-space-md">
      <span className="material-symbols-outlined text-outline text-4xl mb-space-xs">
        {icon}
      </span>
      <h3 className="text-base font-bold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant leading-relaxed max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-space-sm px-space-md py-space-xs rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
