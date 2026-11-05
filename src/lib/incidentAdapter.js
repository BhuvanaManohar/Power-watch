/**
 * Adapter utility to convert backend IncidentResponse and LocationResponse schemas
 * to the UI view-model format consumed by PowerWatch read views.
 *
 * Adheres to Phase 6 contract:
 * - Pure mapping without inventing fake details or mock numbers
 * - Retains raw backend UUIDs and fields
 * - Accurately differentiates live data from demo data
 */

export function formatDateTime(isoString) {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return null;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return 'Recently';
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs) || diffMs < 0) {
      return formatDateTime(isoString) || 'Recently';
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `Reported ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Reported ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return formatDateTime(isoString) || `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
}

const STATUS_MAP = {
  investigating: {
    category: 'investigating',
    statusText: 'Under Investigation',
    statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    statusIcon: 'search',
    dotColor: 'bg-tertiary animate-pulse',
    noteIcon: 'info',
    noteIconColor: 'text-tertiary',
    pinColor: 'bg-tertiary text-on-tertiary',
  },
  progress: {
    category: 'progress',
    statusText: 'Restoration in Progress',
    statusClass: 'bg-primary-fixed text-on-primary-fixed',
    statusIcon: 'directions_car',
    dotColor: 'bg-primary',
    noteIcon: 'info',
    noteIconColor: 'text-primary',
    pinColor: 'bg-primary text-on-primary',
  },
  resolved: {
    category: 'resolved',
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    dotColor: 'bg-secondary',
    noteIcon: 'verified',
    noteIconColor: 'text-secondary',
    pinColor: 'bg-secondary text-on-secondary',
  },
  cancelled: {
    category: 'cancelled',
    statusText: 'Cancelled',
    statusClass: 'bg-surface-container-high text-on-surface-variant',
    statusIcon: 'cancel',
    dotColor: 'bg-outline',
    noteIcon: 'cancel',
    noteIconColor: 'text-outline',
    pinColor: 'bg-surface-container-high text-on-surface-variant',
  },
};

const SEVERITY_MAP = {
  Critical: {
    severity: 'Critical Priority',
    severityLevel: 'Critical',
    severityClass: 'bg-error text-on-error font-bold',
  },
  High: {
    severity: 'High Priority',
    severityLevel: 'High',
    severityClass: 'bg-error-container text-on-error-container font-bold',
  },
  Medium: {
    severity: 'Medium Priority',
    severityLevel: 'Medium',
    severityClass: 'bg-primary-container text-on-primary-container font-semibold',
  },
  Low: {
    severity: 'Low Priority',
    severityLevel: 'Low',
    severityClass: 'bg-surface-container-high text-on-surface-variant font-semibold',
  },
};

/**
 * Adapt a single backend Incident record and its corresponding Location into the UI view-model.
 */
export function adaptIncident(backendIncident, backendLocation = null) {
  if (!backendIncident) return null;

  const id = backendIncident.id;
  const shortId = id && typeof id === 'string' && id.length >= 8
    ? `INC-${id.slice(0, 8).toUpperCase()}`
    : `INC-${id}`;

  const statusConfig = STATUS_MAP[backendIncident.status] || {
    category: backendIncident.status || 'investigating',
    statusText: backendIncident.status || 'Under Investigation',
    statusClass: 'bg-surface-container-high text-on-surface',
    statusIcon: 'help_outline',
    dotColor: 'bg-outline',
    noteIcon: 'info',
    noteIconColor: 'text-outline',
    pinColor: 'bg-surface-container-high text-on-surface',
  };

  const severityConfig = SEVERITY_MAP[backendIncident.severity] || {
    severity: backendIncident.severity ? `${backendIncident.severity} Priority` : 'Standard Priority',
    severityLevel: backendIncident.severity || 'Medium',
    severityClass: 'bg-surface-container-high text-on-surface-variant font-semibold',
  };

  const locationName = backendLocation?.name || '';
  const locationAddress = backendLocation?.address || '';
  let areaName = backendIncident.title || 'Municipal Grid Sector';
  if (locationName && locationAddress) {
    areaName = `${locationName} (${locationAddress})`;
  } else if (locationName) {
    areaName = locationName;
  } else if (locationAddress) {
    areaName = locationAddress;
  }

  const reportedFormatted = formatDateTime(backendIncident.created_at);
  const updatedFormatted = formatDateTime(backendIncident.updated_at);
  const estimatedFormatted = formatDateTime(backendIncident.estimated_restoration);
  const actualFormatted = formatDateTime(backendIncident.actual_restoration);

  let estimatedRestorationStr = 'Pending estimation';
  if (backendIncident.status === 'resolved' && actualFormatted) {
    estimatedRestorationStr = `Restored at ${actualFormatted}`;
  } else if (estimatedFormatted) {
    estimatedRestorationStr = `Est. ${estimatedFormatted}`;
    if (backendIncident.affected_households != null) {
      estimatedRestorationStr += ` (${backendIncident.affected_households.toLocaleString()} households affected)`;
    }
  } else if (backendIncident.affected_households != null) {
    estimatedRestorationStr = `Pending estimation (${backendIncident.affected_households.toLocaleString()} households affected)`;
  }

  // Construct truthful lifecycle timeline from real timestamps and status
  const isInvestigating = backendIncident.status === 'investigating';
  const isProgress = backendIncident.status === 'progress';
  const isResolved = backendIncident.status === 'resolved';

  const timeline = [
    {
      stage: 'Reported',
      timestamp: reportedFormatted || 'Recorded',
      status: 'completed',
    },
    {
      stage: 'Under Investigation',
      timestamp: isInvestigating ? (updatedFormatted || 'In progress') : isProgress || isResolved ? (updatedFormatted || 'Completed') : 'Pending',
      status: isInvestigating ? 'current' : isProgress || isResolved ? 'completed' : 'upcoming',
    },
    {
      stage: 'Restoration in Progress',
      timestamp: isProgress ? (updatedFormatted || 'Active') : isResolved ? (updatedFormatted || 'Completed') : 'Pending',
      status: isProgress ? 'current' : isResolved ? 'completed' : 'upcoming',
    },
    {
      stage: 'Power Restored',
      timestamp: isResolved ? (actualFormatted || updatedFormatted || 'Restored') : estimatedFormatted ? `Est. ${estimatedFormatted}` : 'Pending',
      status: isResolved ? 'completed' : 'upcoming',
    },
  ];

  return {
    id,
    incidentId: shortId,
    backendId: id,
    title: backendIncident.title,
    areaName,
    locationId: backendIncident.location_id,
    location: backendLocation || null,
    // Status mappings
    category: statusConfig.category,
    statusText: statusConfig.statusText,
    statusClass: statusConfig.statusClass,
    statusIcon: statusConfig.statusIcon,
    dotColor: statusConfig.dotColor,
    noteIcon: statusConfig.noteIcon,
    noteIconColor: statusConfig.noteIconColor,
    pinColor: statusConfig.pinColor,
    // Severity mappings
    severity: severityConfig.severity,
    severityLevel: severityConfig.severityLevel,
    severityClass: severityConfig.severityClass,
    // Details
    outageType: backendIncident.outage_type,
    investigationDetails: `${backendIncident.title} — Outage category: ${backendIncident.outage_type}`,
    affectedHouseholds: backendIncident.affected_households != null
      ? `${backendIncident.affected_households.toLocaleString()} Households`
      : 'Unspecified',
    affectedHouseholdsCount: backendIncident.affected_households,
    assignedCrew: backendIncident.assigned_crew || 'Unassigned',
    reportsCount: null, // Not present in backend incident schema; not invented
    // Timestamps
    time: formatRelativeTime(backendIncident.created_at),
    reportedTime: reportedFormatted ? `Logged at ${reportedFormatted}` : 'Recorded recently',
    lastUpdatedTime: updatedFormatted ? `Updated at ${updatedFormatted}` : 'Recently',
    estimatedRestoration: estimatedRestorationStr,
    actualRestoration: actualFormatted,
    // Timelines and updates
    timeline,
    departmentUpdates: [], // Backend operational updates table not yet in Phase 6 scope
    communityReports: [], // Real report linking belongs to later phases
    // Meta flags
    isLive: true,
    isDemo: false,
    // Raw backend fields preserved for future features
    raw: {
      ...backendIncident,
      location: backendLocation || null,
    },
  };
}

/**
 * Adapt arrays of backend incidents and locations into a list and a dictionary.
 */
export function adaptIncidentsList(incidents = [], locations = []) {
  const locationsMap = new Map();
  if (Array.isArray(locations)) {
    locations.forEach((loc) => {
      if (loc && loc.id) {
        locationsMap.set(loc.id, loc);
      }
    });
  }

  const list = [];
  const map = {};

  if (Array.isArray(incidents)) {
    incidents.forEach((inc) => {
      if (inc && inc.id) {
        const loc = locationsMap.get(inc.location_id) || null;
        const adapted = adaptIncident(inc, loc);
        if (adapted) {
          list.push(adapted);
          map[adapted.id] = adapted;
        }
      }
    });
  }

  return { list, map, locationsMap };
}
