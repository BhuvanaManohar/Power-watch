import React from 'react';

export function DashboardHeader({
  portalTitle,
  badgeColor = 'primary',
  onNavigateHome,
  unreadNotificationsCount,
  onToggleNotifications,
}) {
  const badgeStyle =
    badgeColor === 'secondary'
      ? 'bg-secondary-fixed text-on-secondary-fixed'
      : 'bg-primary-fixed text-on-primary-fixed';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-space-xs sm:gap-space-sm group cursor-pointer focus:outline-none"
          >
            <span className="material-symbols-outlined text-primary text-[26px] sm:text-[28px]">electric_bolt</span>
            <span className="text-lg sm:text-xl text-primary tracking-tight font-bold font-sans">
              PowerWatch
            </span>
          </button>
          <span className={`px-space-xs py-0.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider ${badgeStyle}`}>
            {portalTitle}
          </span>
        </div>

        <div className="flex items-center gap-space-sm md:gap-space-md">
          {unreadNotificationsCount !== undefined && (
            <button
              type="button"
              onClick={onToggleNotifications}
              className="relative p-1.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Citizen Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="hidden sm:inline">Alerts</span>
              {unreadNotificationsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-error text-on-error text-[10px] font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-space-xxs text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Exit Demo Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
