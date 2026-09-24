import React from 'react';

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-space-xs max-w-sm w-full px-margin pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        const bgClass = isError
          ? 'bg-error text-on-error'
          : isWarning
          ? 'bg-amber-600 text-white'
          : isSuccess
          ? 'bg-emerald-700 text-white'
          : 'bg-on-surface text-surface';

        const iconName = isError
          ? 'error'
          : isWarning
          ? 'warning'
          : isSuccess
          ? 'check_circle'
          : 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-space-sm rounded-xl shadow-lg flex items-center justify-between gap-space-sm text-xs font-semibold ${bgClass}`}
          >
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px]">
                {iconName}
              </span>
              <span>{toast.message}</span>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
