import React from 'react';

export function ErrorState({
  title = 'Unable to load outage details',
  message = 'A network or system error occurred while fetching information. Please try again.',
  onRetry,
}) {
  return (
    <div className="p-space-lg rounded-xl bg-error-container/20 border border-error-container/50 flex flex-col items-center justify-center text-center gap-space-xs max-w-lg mx-auto my-space-md">
      <span className="material-symbols-outlined text-error text-3xl">
        error_outline
      </span>
      <h3 className="text-sm font-bold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-space-xs px-space-md py-1.5 rounded-lg bg-error text-on-error text-xs font-bold hover:bg-error/90 transition-colors cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}
