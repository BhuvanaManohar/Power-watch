export const initialIncidentsData = {
  'west-district': {
    id: 'west-district',
    incidentId: 'INC-8921-W',
    category: 'investigating',
    areaName: 'Oak & 8th Avenue Corridor (West District)',
    time: 'Reported 45 mins ago',
    reportsCount: 6,
    statusText: 'Under Investigation',
    statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    statusIcon: 'search',
    dotColor: 'bg-tertiary animate-pulse',
    severityLevel: 'High',
    severity: 'High Priority',
    severityClass: 'bg-error-container text-on-error-container font-bold',
    investigationDetails: 'Area safety perimeter established due to reported downed tree limb.',
    estimatedRestoration: 'Est. 2:30 PM Today (120–150 households affected)',
    reportedTime: 'Today at 1:15 PM (45 mins ago)',
    lastUpdatedTime: 'Today at 1:45 PM (15 mins ago)',
    assignedCrew: 'None',
    timeline: [
      { stage: 'Reported', timestamp: '1:15 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:30 PM', status: 'current' },
      { stage: 'Incident Verified', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Crew Dispatched', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Restoration in Progress', timestamp: 'Pending', status: 'upcoming' },
      { stage: 'Power Restored', timestamp: 'Pending', status: 'upcoming' },
    ],
    departmentUpdates: [
      {
        time: '1:45 PM',
        title: 'Safety Perimeter Established',
        description: 'Field officer confirmed downed tree limb near 8th Ave transformer. Safety perimeter marked.',
        officer: 'Officer M. Sharma (Discom West)'
      },
      {
        time: '1:30 PM',
        title: 'Investigation Unit Assigned',
        description: 'Triage officer assigned investigation ticket following multiple citizen notices.',
        officer: 'Control Room Dispatch'
      }
    ],
    communityReports: [
      { ref: 'REP-8821', time: '1:14 PM', location: 'Oak St & 8th Ave', status: 'Verified' },
      { ref: 'REP-8824', time: '1:18 PM', location: '804 Oak St', status: 'Verified' },
      { ref: 'REP-8830', time: '1:22 PM', location: 'Oak Ave West Park', status: 'Under Review' },
      { ref: 'REP-8835', time: '1:29 PM', location: '812 8th Ave', status: 'Verified' },
    ]
  },
  'north-crestview': {
    id: 'north-crestview',
    incidentId: 'INC-7430-N',
    category: 'progress',
    areaName: 'North Crestview Neighborhood',
    time: 'Reported 20 mins ago',
    reportsCount: 4,
    statusText: 'Restoration in Progress',
    statusClass: 'bg-primary-fixed text-on-primary-fixed',
    statusIcon: 'directions_car',
    dotColor: 'bg-primary',
    severityLevel: 'Medium',
    severity: 'Medium Priority',
    severityClass: 'bg-primary-container text-on-primary-container font-semibold',
    investigationDetails: 'Utility truck crew dispatched to Crestview Ridge feeder line.',
    estimatedRestoration: 'Est. 1:45 PM Today (30–40 households affected)',
    reportedTime: 'Today at 1:40 PM (20 mins ago)',
    lastUpdatedTime: 'Today at 1:55 PM (5 mins ago)',
    assignedCrew: 'Unit #4 Crestview Line Crew',
    timeline: [
      { stage: 'Reported', timestamp: '1:40 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:45 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '1:48 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '1:52 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '1:55 PM', status: 'current' },
      { stage: 'Power Restored', timestamp: 'Pending', status: 'upcoming' },
    ],
    departmentUpdates: [
      {
        time: '1:55 PM',
        title: 'Crew On Site & Feeder Line Work Initiated',
        description: 'Utility Truck #4 arrived at Crestview Ridge feeder line. Fuse replacement underway.',
        officer: 'Line Crew Chief R. Kumar'
      }
    ],
    communityReports: [
      { ref: 'REP-7401', time: '1:39 PM', location: 'Crestview Ridge Rd', status: 'Verified' },
      { ref: 'REP-7405', time: '1:42 PM', location: 'North Crestview Circle', status: 'Verified' },
    ]
  },
  'riverfront': {
    id: 'riverfront',
    incidentId: 'INC-3105-R',
    category: 'resolved',
    areaName: 'Riverfront Commercial & Marina Area',
    time: 'Reported 1 hr ago',
    reportsCount: 14,
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    dotColor: 'bg-secondary',
    severityLevel: 'Low',
    severity: 'Low Priority',
    severityClass: 'bg-surface-container-high text-on-surface-variant font-semibold',
    investigationDetails: 'Substation breaker reset verified online across commercial circuit.',
    estimatedRestoration: 'Restored at 2:15 PM',
    reportedTime: 'Today at 1:00 PM (1 hr ago)',
    lastUpdatedTime: 'Today at 2:15 PM',
    assignedCrew: 'Unit #12 Substation Tech',
    timeline: [
      { stage: 'Reported', timestamp: '1:00 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '1:10 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '1:15 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '1:25 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '1:40 PM', status: 'completed' },
      { stage: 'Power Restored', timestamp: '2:15 PM', status: 'completed' },
    ],
    departmentUpdates: [
      {
        time: '2:15 PM',
        title: 'Circuit Energized & Restoration Verified',
        description: 'Substation breaker reset verified online across Riverfront commercial circuit.',
        officer: 'Senior Engineer A. Verma'
      }
    ],
    communityReports: [
      { ref: 'REP-3101', time: '12:58 PM', location: 'Marina Dock A', status: 'Resolved' },
    ]
  },
  'south-substation': {
    id: 'south-substation',
    incidentId: 'INC-2041-S',
    category: 'resolved',
    areaName: 'South Industrial Grid & Substation 4',
    time: 'Yesterday at 4:30 PM',
    reportsCount: 22,
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    dotColor: 'bg-secondary',
    severityLevel: 'Critical',
    severity: 'Critical Priority',
    severityClass: 'bg-error text-on-error font-bold',
    investigationDetails: 'Primary transformer trip due to lightning strike during storm event.',
    estimatedRestoration: 'Restored Yesterday at 7:45 PM (Duration: 3h 15m)',
    reportedTime: 'Yesterday at 4:30 PM',
    lastUpdatedTime: 'Yesterday at 7:45 PM',
    assignedCrew: 'Unit #8 West District Emergency',
    timeline: [
      { stage: 'Reported', timestamp: '4:30 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '4:40 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '4:50 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '5:05 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '5:30 PM', status: 'completed' },
      { stage: 'Power Restored', timestamp: '7:45 PM', status: 'completed' },
    ],
    departmentUpdates: [
      {
        time: '7:45 PM',
        title: 'Substation Transformer Re-energized',
        description: 'Secondary oil cooling system isolated and primary transformer energization completed safely.',
        officer: 'Operations Lead D. Mehta'
      }
    ],
    communityReports: [
      { ref: 'REP-2001', time: '4:28 PM', location: 'South Gate Industrial Park', status: 'Resolved' },
      { ref: 'REP-2004', time: '4:32 PM', location: 'Substation 4 Complex', status: 'Resolved' }
    ]
  },
  'eastside-heights': {
    id: 'eastside-heights',
    incidentId: 'INC-1108-E',
    category: 'resolved',
    areaName: 'Eastside Heights Residential Sector B',
    time: '2 days ago at 10:15 AM',
    reportsCount: 9,
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    dotColor: 'bg-secondary',
    severityLevel: 'Medium',
    severity: 'Medium Priority',
    severityClass: 'bg-primary-container text-on-primary-container font-semibold',
    investigationDetails: 'Underground feeder cable insulation degradation causing localized short circuit.',
    estimatedRestoration: 'Restored 2 days ago at 12:00 PM (Duration: 1h 45m)',
    reportedTime: '2 days ago at 10:15 AM',
    lastUpdatedTime: '2 days ago at 12:00 PM',
    assignedCrew: 'Unit #15 Underground Cable Squad',
    timeline: [
      { stage: 'Reported', timestamp: '10:15 AM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '10:25 AM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '10:35 AM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '10:45 AM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '11:10 AM', status: 'completed' },
      { stage: 'Power Restored', timestamp: '12:00 PM', status: 'completed' },
    ],
    departmentUpdates: [
      {
        time: '12:00 PM',
        title: 'Cable Splicing & Insulation Completed',
        description: 'Underground cable splice pressure test passed; feeder energized.',
        officer: 'Tech Lead P. Rao'
      }
    ],
    communityReports: [
      { ref: 'REP-1101', time: '10:12 AM', location: 'Heights Blvd & 12th St', status: 'Resolved' }
    ]
  },
  'central-techpark': {
    id: 'central-techpark',
    incidentId: 'INC-9052-C',
    category: 'resolved',
    areaName: 'Central Tech Park & Commercial Zone',
    time: '3 days ago at 6:00 PM',
    reportsCount: 18,
    statusText: 'Power Restored',
    statusClass: 'bg-secondary-container text-on-secondary-container',
    statusIcon: 'check_circle',
    dotColor: 'bg-secondary',
    severityLevel: 'High',
    severity: 'High Priority',
    severityClass: 'bg-error-container text-on-error-container font-bold',
    investigationDetails: 'Feeder breaker trip following sudden load spike at tech campus.',
    estimatedRestoration: 'Restored 3 days ago at 8:30 PM (Duration: 2h 30m)',
    reportedTime: '3 days ago at 6:00 PM',
    lastUpdatedTime: '3 days ago at 8:30 PM',
    assignedCrew: 'Unit #12 Substation Tech',
    timeline: [
      { stage: 'Reported', timestamp: '6:00 PM', status: 'completed' },
      { stage: 'Under Investigation', timestamp: '6:10 PM', status: 'completed' },
      { stage: 'Incident Verified', timestamp: '6:20 PM', status: 'completed' },
      { stage: 'Crew Dispatched', timestamp: '6:35 PM', status: 'completed' },
      { stage: 'Restoration in Progress', timestamp: '7:00 PM', status: 'completed' },
      { stage: 'Power Restored', timestamp: '8:30 PM', status: 'completed' },
    ],
    departmentUpdates: [
      {
        time: '8:30 PM',
        title: 'Feeder Load Rebalanced & Restored',
        description: 'Load rebalanced across grid transformers and commercial feeder online.',
        officer: 'Senior Engineer A. Verma'
      }
    ],
    communityReports: [
      { ref: 'REP-9002', time: '5:58 PM', location: 'Tech Tower Plaza', status: 'Resolved' }
    ]
  }
};

export const initialCrewsData = [
  { id: 'crew-4', name: 'Unit #4 Crestview Line Crew', status: 'Dispatched', assignedIncident: 'INC-7430-N' },
  { id: 'crew-8', name: 'Unit #8 West District Emergency', status: 'Available', assignedIncident: 'None' },
  { id: 'crew-12', name: 'Unit #12 Substation Tech', status: 'Available', assignedIncident: 'None' },
  { id: 'crew-15', name: 'Unit #15 Tree Clearance Squad', status: 'Available', assignedIncident: 'None' },
];

export function computeOutageAnalytics(incidentsData = initialIncidentsData) {
  const incidentsList = Object.values(incidentsData);
  const total = incidentsList.length;
  const resolved = incidentsList.filter(i => i.category === 'resolved');
  const active = incidentsList.filter(i => i.category !== 'resolved');
  
  const totalReports = incidentsList.reduce((sum, i) => sum + (i.reportsCount || 0), 0);
  
  const durationsMinutes = [75, 195, 105, 150];
  const avgRestorationMins = Math.round(durationsMinutes.reduce((a, b) => a + b, 0) / durationsMinutes.length);
  
  const severityCounts = {
    Critical: incidentsList.filter(i => i.severityLevel === 'Critical' || i.severity.includes('Critical')).length,
    High: incidentsList.filter(i => i.severityLevel === 'High' || i.severity.includes('High')).length,
    Medium: incidentsList.filter(i => i.severityLevel === 'Medium' || i.severity.includes('Medium')).length,
    Low: incidentsList.filter(i => i.severityLevel === 'Low' || i.severity.includes('Low')).length,
  };

  return {
    totalIncidents: total,
    resolvedCount: resolved.length,
    activeCount: active.length,
    totalReportsCount: totalReports,
    avgRestorationMins,
    avgRestorationHoursStr: `${Math.floor(avgRestorationMins / 60)}h ${avgRestorationMins % 60}m`,
    severityCounts,
    mostAffectedArea: 'South Industrial Grid (Substation 4)',
  };
}

