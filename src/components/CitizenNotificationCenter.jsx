import React, { useState } from 'react';

export function CitizenNotificationCenter({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onViewIncidentDetail,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Status Update':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/30';
      case 'Restoration Update':
        return 'bg-primary-fixed text-on-primary-fixed border-primary/30';
      case 'ETR Update':
        return 'bg-primary-container text-on-primary-container border-primary-container/40';
      case 'Crew Update':
        return 'bg-secondary-fixed text-on-secondary-fixed border-secondary/30';
      case 'Resolution Update':
        return 'bg-secondary-container text-on-secondary-container border-secondary-container/40';
      default:
        return 'bg-surface-container-high text-on-surface-variant border-outline-variant/40';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Status Update':
        return 'info';
      case 'Restoration Update':
        return 'build';
      case 'ETR Update':
        return 'schedule';
      case 'Crew Update':
        return 'engineering';
      case 'Resolution Update':
        return 'check_circle';
      default:
        return 'notifications';
    }
  };

  return (
    <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
      {/* Header & Quick Actions */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm flex-wrap gap-space-xs">
        <div className="flex items-center gap-space-xs">
          <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface flex items-center gap-space-xs">
              <span>Citizen Notification Center</span>
            </h3>
            <p className="text-xs text-on-surface-variant">Real-time alerts & official DISCOM department updates.</p>
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          {/* Filter toggle */}
          <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/40 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                filter === 'all'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                filter === 'unread'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All as Read button */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-space-xs py-1 rounded-lg border border-outline-variant/60 hover:bg-surface-container-high text-xs font-bold text-secondary transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-space-xs">
        {filteredNotifications.length === 0 ? (
          <div className="p-space-lg text-center rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center gap-1 text-xs">
            <span className="material-symbols-outlined text-[28px] text-on-surface-variant/50">notifications_off</span>
            <span className="font-semibold text-on-surface">No Notifications Found</span>
            <span className="text-on-surface-variant text-[11px]">
              {filter === 'unread' ? 'You have read all active notifications.' : 'Department updates will appear here.'}
            </span>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`p-space-md rounded-xl border transition-all flex flex-col gap-space-xxs ${
                  !notif.isRead
                    ? 'bg-primary-container/10 border-primary-container/60 shadow-xs'
                    : 'bg-surface-container-low/60 border-outline-variant/30 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" title="Unread" />
                    )}
                    <span className="font-bold text-xs text-on-surface">{notif.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getCategoryBadge(
                        notif.category
                      )}`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {getCategoryIcon(notif.category)}
                      </span>
                      {notif.category}
                    </span>
                    {notif.relatedId && (
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container-high text-primary">
                        {notif.relatedId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-space-xs shrink-0">
                    <span className="font-mono text-[10px] text-on-surface-variant">{notif.time}</span>
                    {!notif.isRead && onMarkAsRead && (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(notif.id)}
                        title="Mark as read"
                        className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed pl-space-xs">{notif.message}</p>

                {notif.relatedId && notif.relatedId.startsWith('INC-') && onViewIncidentDetail && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onViewIncidentDetail(notif.relatedId)}
                      className="text-[11px] font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Incident Record</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
