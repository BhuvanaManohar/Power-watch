import React, { useState } from 'react';

export function IncidentManagementModal({ incident, crews, onClose, onUpdateIncident, onAssignCrew, onPublishNotification }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'severity' | 'crew' | 'etr' | 'log'
  const [selectedCrew, setSelectedCrew] = useState('');
  const [etrInput, setEtrInput] = useState(incident.estimatedRestoration);
  const [logTitle, setLogTitle] = useState('');
  const [logDesc, setLogDesc] = useState('');
  const [updateCategory, setUpdateCategory] = useState('Status Update'); // 'Status Update' | 'Restoration Update' | 'ETR Update' | 'Crew Update' | 'Resolution Update'
  const [selectedSeverity, setSelectedSeverity] = useState(
    incident.severityLevel || (incident.severity.includes('Critical') ? 'Critical' : incident.severity.includes('High') ? 'High' : incident.severity.includes('Medium') || incident.severity.includes('Moderate') ? 'Medium' : 'Low')
  );
  const [officerName, setOfficerName] = useState('Officer M. Sharma');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!incident) return null;

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleUpdateSeveritySubmit = (levelToSet) => {
    const targetLevel = levelToSet || selectedSeverity;
    let severityClass = 'bg-surface-container-high text-on-surface-variant font-semibold';
    if (targetLevel === 'Critical') {
      severityClass = 'bg-error text-on-error font-bold';
    } else if (targetLevel === 'High') {
      severityClass = 'bg-error-container text-on-error-container font-bold';
    } else if (targetLevel === 'Medium') {
      severityClass = 'bg-primary-container text-on-primary-container font-semibold';
    } else if (targetLevel === 'Low') {
      severityClass = 'bg-surface-container-high text-on-surface-variant font-semibold';
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = `Today at ${timeStr}`;

    onUpdateIncident({
      ...incident,
      severity: `${targetLevel} Priority`,
      severityLevel: targetLevel,
      severityClass: severityClass,
      lastUpdatedTime: formattedTime,
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: `Priority Updated: ${targetLevel}`,
        message: `Incident ${incident.incidentId} (${incident.areaName}) priority level updated to ${targetLevel} Priority.`,
        relatedId: incident.incidentId,
        category: 'Status Update',
        time: formattedTime,
        isRead: false,
      });
    }

    showFeedback(`Incident severity updated to: ${targetLevel}`);
  };

  const handleAdvanceStatus = (newStage) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let category = incident.category;
    let statusText = newStage;
    let statusClass = incident.statusClass;
    let statusIcon = incident.statusIcon;
    let dotColor = incident.dotColor;

    if (newStage === 'Under Investigation') {
      category = 'investigating';
      statusClass = 'bg-tertiary-fixed text-on-tertiary-fixed';
      statusIcon = 'search';
      dotColor = 'bg-tertiary animate-pulse';
    } else if (newStage === 'Incident Verified') {
      category = 'investigating';
      statusClass = 'bg-tertiary-container text-on-tertiary-container';
      statusIcon = 'verified';
    } else if (newStage === 'Crew Dispatched') {
      category = 'progress';
      statusClass = 'bg-primary-container text-on-primary-container';
      statusIcon = 'commute';
      dotColor = 'bg-primary';
    } else if (newStage === 'Restoration in Progress') {
      category = 'progress';
      statusClass = 'bg-primary-fixed text-on-primary-fixed';
      statusIcon = 'build';
      dotColor = 'bg-primary';
    } else if (newStage === 'Power Restored') {
      category = 'resolved';
      statusText = 'Power Restored';
      statusClass = 'bg-secondary-container text-on-secondary-container';
      statusIcon = 'check_circle';
      dotColor = 'bg-secondary';
    }

    const updatedTimeline = incident.timeline.map((step) => {
      if (step.stage === newStage) {
        return { ...step, timestamp: timeStr, status: 'current' };
      }
      const stageOrder = ['Reported', 'Under Investigation', 'Incident Verified', 'Crew Dispatched', 'Restoration in Progress', 'Power Restored'];
      if (stageOrder.indexOf(step.stage) < stageOrder.indexOf(newStage)) {
        return { ...step, status: 'completed' };
      }
      return { ...step, status: 'upcoming' };
    });

    const notifCategory = newStage === 'Power Restored' ? 'Resolution Update' : newStage.includes('Crew') ? 'Crew Update' : newStage.includes('Restoration') ? 'Restoration Update' : 'Status Update';

    onUpdateIncident({
      ...incident,
      category,
      statusText,
      statusClass,
      statusIcon,
      dotColor,
      lastUpdatedTime: `Today at ${timeStr}`,
      timeline: updatedTimeline,
      severity: newStage === 'Power Restored' ? 'Resolved' : incident.severity,
      severityClass: newStage === 'Power Restored' ? 'bg-secondary-fixed text-on-secondary-fixed' : incident.severityClass,
      departmentUpdates: [
        {
          time: timeStr,
          title: `Incident Lifecycle Updated: ${newStage}`,
          description: `Department officer updated incident operational stage to "${newStage}".`,
          officer: officerName,
          category: notifCategory,
        },
        ...incident.departmentUpdates,
      ],
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}`,
        title: `Incident Stage: ${newStage}`,
        message: `${incident.incidentId} (${incident.areaName}) stage advanced to ${newStage}.`,
        relatedId: incident.incidentId,
        category: notifCategory,
        time: `Today at ${timeStr}`,
        isRead: false,
      });
    }

    showFeedback(`Incident status updated to: ${newStage}`);
  };

  const handleAssignCrewSubmit = () => {
    if (!selectedCrew) return;
    const crewObj = crews.find((c) => c.id === selectedCrew);
    const crewName = crewObj ? crewObj.name : selectedCrew;

    onAssignCrew(incident.id, selectedCrew);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onUpdateIncident({
      ...incident,
      assignedCrew: crewName,
      lastUpdatedTime: `Today at ${timeStr}`,
      departmentUpdates: [
        {
          time: timeStr,
          title: `Field Crew Assigned: ${crewName}`,
          description: `Dispatched ${crewName} to sector. Crew on route to location.`,
          officer: officerName,
          category: 'Crew Update',
        },
        ...incident.departmentUpdates,
      ],
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}`,
        title: `Field Crew Dispatched`,
        message: `${crewName} assigned and dispatched to ${incident.incidentId} (${incident.areaName}).`,
        relatedId: incident.incidentId,
        category: 'Crew Update',
        time: `Today at ${timeStr}`,
        isRead: false,
      });
    }

    showFeedback(`Crew "${crewName}" assigned to ${incident.incidentId}`);
  };

  const handleUpdateETRSubmit = () => {
    if (!etrInput.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onUpdateIncident({
      ...incident,
      estimatedRestoration: etrInput,
      lastUpdatedTime: `Today at ${timeStr}`,
      departmentUpdates: [
        {
          time: timeStr,
          title: `Estimated Restoration Updated`,
          description: `Target restoration time updated to: ${etrInput}`,
          officer: officerName,
          category: 'ETR Update',
        },
        ...incident.departmentUpdates,
      ],
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}`,
        title: `Estimated Restoration Time Updated`,
        message: `ETR for ${incident.incidentId} (${incident.areaName}) updated to: ${etrInput}`,
        relatedId: incident.incidentId,
        category: 'ETR Update',
        time: `Today at ${timeStr}`,
        isRead: false,
      });
    }

    showFeedback(`Estimated Restoration Time updated to "${etrInput}"`);
  };

  const handlePublishLogSubmit = (e) => {
    e.preventDefault();
    if (!logTitle.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = `Today at ${timeStr}`;
    const updateMsg = logDesc.trim() || logTitle.trim();
    const category = updateCategory || 'Status Update';

    const newUpdate = {
      time: timeStr,
      title: logTitle.trim(),
      description: updateMsg,
      officer: officerName.trim() || 'Officer M. Sharma',
      category: category,
    };

    onUpdateIncident({
      ...incident,
      lastUpdatedTime: formattedTime,
      departmentUpdates: [newUpdate, ...(incident.departmentUpdates || [])],
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: logTitle.trim(),
        message: updateMsg,
        relatedId: incident.incidentId,
        category: category,
        time: formattedTime,
        isRead: false,
      });
    }

    setLogTitle('');
    setLogDesc('');
    showFeedback(`Citizen update published successfully!`);
  };

  const handleResolveIncident = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    handleAdvanceStatus('Power Restored');
    onUpdateIncident({
      ...incident,
      category: 'resolved',
      statusText: 'Power Restored',
      statusClass: 'bg-secondary-container text-on-secondary-container',
      statusIcon: 'check_circle',
      dotColor: 'bg-secondary',
      severity: 'Resolved',
      severityClass: 'bg-secondary-fixed text-on-secondary-fixed',
      estimatedRestoration: `Restored at ${timeStr}`,
      lastUpdatedTime: `Today at ${timeStr}`,
      departmentUpdates: [
        {
          time: timeStr,
          title: 'Incident Resolved & Power Restored',
          description: 'Restoration verified online across circuit. Circuit energized and normal power restored.',
          officer: officerName,
          category: 'Resolution Update',
        },
        ...incident.departmentUpdates,
      ],
    });

    if (onPublishNotification) {
      onPublishNotification({
        id: `notif-${Date.now()}`,
        title: 'Power Restored',
        message: `Power restored for ${incident.incidentId} (${incident.areaName}). Circuit online.`,
        relatedId: incident.incidentId,
        category: 'Resolution Update',
        time: `Today at ${timeStr}`,
        isRead: false,
      });
    }

    showFeedback(`Incident ${incident.incidentId} marked as Power Restored!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-margin">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-space-md bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-container/30">
              {incident.incidentId}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${incident.statusClass}`}>
              {incident.statusText}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${incident.severityClass}`}>
              {incident.severity}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-space-md border-b border-outline-variant/30 bg-surface-container-lowest flex flex-col gap-space-xs">
          <h2 className="text-base font-bold text-on-surface">{incident.areaName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs text-xs">
            <div>
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Assigned Crew</span>
              <span className="font-semibold text-on-surface">{incident.assignedCrew || 'None'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Current ETR</span>
              <span className="font-semibold text-primary">{incident.estimatedRestoration}</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Notices</span>
              <span className="font-semibold text-on-surface">{incident.reportsCount} Reports</span>
            </div>
            <div>
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">Last Updated</span>
              <span className="font-semibold text-on-surface">{incident.lastUpdatedTime}</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mx-space-md mt-space-sm p-space-sm rounded-xl bg-secondary-container/30 border border-secondary-container text-secondary text-xs font-bold flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Action Tabs */}
        <div className="flex items-center gap-space-xs px-space-md pt-space-xs border-b border-outline-variant/30 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-space-sm border-b-2 cursor-pointer ${activeTab === 'overview' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
          >
            Lifecycle Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('severity')}
            className={`py-2 px-space-sm border-b-2 cursor-pointer ${activeTab === 'severity' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
          >
            Set Severity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crew')}
            className={`py-2 px-space-sm border-b-2 cursor-pointer ${activeTab === 'crew' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
          >
            Assign Crew
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('etr')}
            className={`py-2 px-space-sm border-b-2 cursor-pointer ${activeTab === 'etr' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
          >
            Update ETR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('log')}
            className={`py-2 px-space-sm border-b-2 cursor-pointer ${activeTab === 'log' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'}`}
          >
            Publish Citizen Update
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-space-md flex-1 overflow-y-auto flex flex-col gap-space-md text-xs">
          
          {/* TAB 1: LIFECYCLE FLOW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-space-md">
              <h3 className="font-bold text-on-surface uppercase text-[11px] tracking-wider">
                Advance Operational Lifecycle Stage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Under Investigation')}
                  className="p-space-sm rounded-xl border border-outline-variant/60 bg-surface-container-low text-left hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="font-bold text-on-surface block">1. Under Investigation</span>
                  <span className="text-[10px] text-on-surface-variant">Confirm hazard triage & perimeter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Incident Verified')}
                  className="p-space-sm rounded-xl border border-outline-variant/60 bg-surface-container-low text-left hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="font-bold text-on-surface block">2. Incident Verified</span>
                  <span className="text-[10px] text-on-surface-variant">Verify outage cause & scope</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Crew Dispatched')}
                  className="p-space-sm rounded-xl border border-outline-variant/60 bg-surface-container-low text-left hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="font-bold text-on-surface block">3. Crew Dispatched</span>
                  <span className="text-[10px] text-on-surface-variant">Dispatch utility service vehicle</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceStatus('Restoration in Progress')}
                  className="p-space-sm rounded-xl border border-outline-variant/60 bg-surface-container-low text-left hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="font-bold text-on-surface block">4. Restoration in Progress</span>
                  <span className="text-[10px] text-on-surface-variant">Line/substation repair active</span>
                </button>
              </div>

              <div className="p-space-md rounded-xl bg-secondary-container/10 border border-secondary-container/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">Mark Incident Resolved</span>
                  <span className="text-[10px] text-on-surface-variant">Set status to Power Restored across public map & details</span>
                </div>
                <button
                  type="button"
                  onClick={handleResolveIncident}
                  className="px-space-md py-1.5 rounded-xl bg-secondary text-on-secondary font-bold hover:bg-secondary/90 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                >
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Power Restored</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SET SEVERITY */}
          {activeTab === 'severity' && (
            <div className="flex flex-col gap-space-md">
              <h3 className="font-bold text-on-surface uppercase text-[11px] tracking-wider">
                Select Incident Severity & Priority Level
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Choose the operational severity level for this incident. This priority is displayed in the Department Operations Center and Incident Details.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                {/* Low Severity */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeverity('Low');
                    handleUpdateSeveritySubmit('Low');
                  }}
                  className={`p-space-sm rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    (incident.severityLevel === 'Low' || incident.severity.includes('Low'))
                      ? 'border-outline-variant bg-surface-container-high ring-2 ring-outline-variant/40'
                      : 'border-outline-variant/60 bg-surface-container-low hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-xs">Low Severity</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-on-surface-variant">
                      Low
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-normal">
                    Standard operational triage. Single household or non-urgent line condition.
                  </p>
                </button>

                {/* Medium Severity */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeverity('Medium');
                    handleUpdateSeveritySubmit('Medium');
                  }}
                  className={`p-space-sm rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    (incident.severityLevel === 'Medium' || incident.severity.includes('Medium') || incident.severity.includes('Moderate'))
                      ? 'border-primary-container bg-primary-container/20 ring-2 ring-primary/30'
                      : 'border-outline-variant/60 bg-surface-container-low hover:border-primary-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-xs">Medium Severity</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-container text-on-primary-container">
                      Medium
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-normal">
                    Moderate priority. Neighborhood feeder line or multi-home outage circuit.
                  </p>
                </button>

                {/* High Severity */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeverity('High');
                    handleUpdateSeveritySubmit('High');
                  }}
                  className={`p-space-sm rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    (incident.severityLevel === 'High' || incident.severity.includes('High'))
                      ? 'border-error-container bg-error-container/20 ring-2 ring-error/30'
                      : 'border-outline-variant/60 bg-surface-container-low hover:border-error-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-xs">High Severity</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container">
                      High
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-normal">
                    High priority dispatch. Major residential corridor or hazardous tree limb down.
                  </p>
                </button>

                {/* Critical Severity */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeverity('Critical');
                    handleUpdateSeveritySubmit('Critical');
                  }}
                  className={`p-space-sm rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    (incident.severityLevel === 'Critical' || incident.severity.includes('Critical'))
                      ? 'border-error bg-error/15 ring-2 ring-error/50'
                      : 'border-outline-variant/60 bg-surface-container-low hover:border-error'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-error text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Critical Severity
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-error text-on-error">
                      Critical
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-normal">
                    Emergency priority. Substation breaker failure or critical public facility affected.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CREW ASSIGNMENT */}
          {activeTab === 'crew' && (
            <div className="flex flex-col gap-space-md">
              <h3 className="font-bold text-on-surface uppercase text-[11px] tracking-wider">
                Assign Available DISCOM Field Crew
              </h3>
              <div className="flex flex-col gap-space-xs">
                {crews.map((crew) => (
                  <label
                    key={crew.id}
                    className={`p-space-sm rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCrew === crew.id
                        ? 'border-primary bg-primary-container/20 font-bold'
                        : 'border-outline-variant/60 bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-space-xs">
                      <input
                        type="radio"
                        name="crew-select"
                        value={crew.id}
                        checked={selectedCrew === crew.id}
                        onChange={() => setSelectedCrew(crew.id)}
                      />
                      <div>
                        <span className="text-xs text-on-surface block">{crew.name}</span>
                        <span className="text-[10px] text-on-surface-variant">
                          Status: {crew.status} {crew.assignedIncident !== 'None' ? `(${crew.assignedIncident})` : ''}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${crew.status === 'Available' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {crew.status}
                    </span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAssignCrewSubmit}
                disabled={!selectedCrew}
                className="mt-space-xs py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Confirm Crew Dispatch
              </button>
            </div>
          )}

          {/* TAB 3: ETR UPDATE */}
          {activeTab === 'etr' && (
            <div className="flex flex-col gap-space-md">
              <h3 className="font-bold text-on-surface uppercase text-[11px] tracking-wider">
                Update Estimated Restoration Time (ETR)
              </h3>
              <div className="flex flex-col gap-space-xs">
                <label className="text-[11px] font-semibold text-on-surface-variant">Estimated Restoration Text</label>
                <input
                  type="text"
                  value={etrInput}
                  onChange={(e) => setEtrInput(e.target.value)}
                  placeholder="e.g. Est. 3:00 PM Today (120 households affected)"
                  className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-bold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-wrap gap-space-xs">
                <button
                  type="button"
                  onClick={() => setEtrInput('Est. 2:30 PM Today')}
                  className="px-2 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-[10px] font-semibold"
                >
                  Est. 2:30 PM
                </button>
                <button
                  type="button"
                  onClick={() => setEtrInput('Est. 3:45 PM Today')}
                  className="px-2 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-[10px] font-semibold"
                >
                  Est. 3:45 PM
                </button>
                <button
                  type="button"
                  onClick={() => setEtrInput('Est. 6:00 PM Today')}
                  className="px-2 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-[10px] font-semibold"
                >
                  Est. 6:00 PM
                </button>
              </div>
              <button
                type="button"
                onClick={handleUpdateETRSubmit}
                className="mt-space-xs py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Save & Publish Updated ETR
              </button>
            </div>
          )}

          {/* TAB 4: PUBLISH CITIZEN UPDATE */}
          {activeTab === 'log' && (
            <form onSubmit={handlePublishLogSubmit} className="flex flex-col gap-space-md">
              <h3 className="font-bold text-on-surface uppercase text-[11px] tracking-wider flex items-center justify-between">
                <span>Publish Citizen-Facing Incident Update</span>
                <span className="font-mono text-[10px] text-primary">{incident.incidentId}</span>
              </h3>

              <div className="flex flex-col gap-space-xs">
                <label className="text-[11px] font-semibold text-on-surface-variant">Update Category / Type</label>
                <select
                  value={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.value)}
                  className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Status Update">Status Update</option>
                  <option value="Restoration Update">Restoration Update</option>
                  <option value="ETR Update">ETR Update</option>
                  <option value="Crew Update">Crew Update</option>
                  <option value="Resolution Update">Resolution Update</option>
                </select>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="text-[11px] font-semibold text-on-surface-variant">Update Title</label>
                <input
                  type="text"
                  required
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  placeholder="e.g. Feeder line isolated & replacement transformer en route"
                  className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="text-[11px] font-semibold text-on-surface-variant">Citizen Message / Details</label>
                <textarea
                  rows={3}
                  value={logDesc}
                  onChange={(e) => setLogDesc(e.target.value)}
                  placeholder="Provide short clear details for affected citizens regarding repairs, safety, or expected restoration..."
                  className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="text-[11px] font-semibold text-on-surface-variant">Publishing Officer</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="p-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface"
                />
              </div>

              <button
                type="submit"
                className="mt-space-xs py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Publish Citizen-Facing Update</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-space-lg py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
