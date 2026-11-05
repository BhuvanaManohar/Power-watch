import React, { useState, useEffect } from 'react';
import { locationsApi, reportsApi } from '../lib/apiClient';

const OUTAGE_TYPES = {
  complete: 'Complete Power Outage',
  partial: 'Partial / Low Voltage Outage',
  hazard: 'Sparks / Line Down Hazard',
};

export function ReportOutageScreen({
  onBack,
  onReportSubmitted,
  session,
  userProfile,
  onNavigateSignIn,
}) {
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'tracking'
  const [formData, setFormData] = useState({
    locationId: '',
    outageType: 'complete', // 'complete' | 'partial' | 'hazard'
    description: '',
  });

  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState(null);
  const [locationsRetryCount, setLocationsRetryCount] = useState(0);

  const [submittedReport, setSubmittedReport] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isAuthenticated = Boolean(session?.user);

  useEffect(() => {
    let isMounted = true;

    locationsApi
      .getLocations()
      .then((data) => {
        if (isMounted) {
          setLocations(Array.isArray(data) ? data : []);
          setLocationsError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLocationsError(err.message || 'Failed to load municipal sectors');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingLocations(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locationsRetryCount]);

  const selectedLocation = locations.find((l) => l.id === formData.locationId);
  const locationDisplayText = selectedLocation
    ? `${selectedLocation.name}${selectedLocation.address ? ` (${selectedLocation.address})` : ''}`
    : '';

  const getOutageTypeLabel = (type) => OUTAGE_TYPES[type] || 'Complete Power Outage';

  const handleNextReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setValidationError('Please sign in before submitting an outage report.');
      return;
    }
    if (locations.length === 0) {
      setValidationError('No registered municipal locations available. Reports cannot be filed until locations are configured.');
      return;
    }
    if (!formData.locationId) {
      setValidationError('Please select an affected municipal location.');
      return;
    }
    setValidationError('');
    setSubmitError(null);
    setStep('review');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!isAuthenticated) {
      setSubmitError('Authentication required. Please sign in to submit.');
      return;
    }

    if (!formData.locationId) {
      setSubmitError('Please select a valid location before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        location_id: formData.locationId,
        outage_type: getOutageTypeLabel(formData.outageType),
        description: formData.description.trim() || 'Citizen outage report lodged via PowerWatch',
        photo_url: null,
      };

      const response = await reportsApi.createReport(payload);
      setSubmittedReport(response);
      setStep('tracking');
      if (onReportSubmitted) {
        onReportSubmitted(response);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit outage report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = !isAuthenticated || locations.length === 0 || isLoadingLocations;

  const trackingStages = [
    { stage: 'Submitted', key: 'Submitted' },
    { stage: 'Under Review', key: 'Under Review' },
    { stage: 'Linked to Incident', key: 'Linked to Incident' },
    { stage: 'Resolved', key: 'Resolved' },
  ];

  const getStageStatus = (stageKey) => {
    if (!submittedReport) return 'upcoming';
    const status = submittedReport.status;

    if (status === 'Rejected') {
      if (stageKey === 'Submitted') return 'completed';
      if (stageKey === 'Under Review') return 'completed';
      return 'rejected';
    }
    if (status === 'Resolved') {
      return 'completed';
    }
    if (status === 'Linked to Incident') {
      if (stageKey === 'Submitted' || stageKey === 'Under Review') return 'completed';
      if (stageKey === 'Linked to Incident') return 'current';
      return 'upcoming';
    }
    if (status === 'Under Review') {
      if (stageKey === 'Submitted') return 'completed';
      if (stageKey === 'Under Review') return 'current';
      return 'upcoming';
    }
    if (status === 'Submitted') {
      if (stageKey === 'Submitted') return 'completed';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-space-xs text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded">
            Citizen Outage Reporter
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-margin md:px-margin-desktop pt-28 pb-space-2xl flex flex-col gap-space-lg">
        {/* Step Indicator */}
        <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 'form' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px]">1</span>
            <span>Outage Details</span>
          </div>
          <span className="text-outline-variant">•</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'review' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px]">2</span>
            <span>Review Report</span>
          </div>
          <span className="text-outline-variant">•</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'tracking' ? 'text-secondary' : 'text-on-surface-variant'}`}>
            <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[11px]">3</span>
            <span>Report Status</span>
          </div>
        </div>

        {/* STEP 1: FORM ENTRY */}
        {step === 'form' && (
          <form onSubmit={handleNextReview} className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                Report a Power Outage
              </h1>
              <p className="text-xs text-on-surface-variant pt-1">
                {userProfile?.full_name
                  ? `Logged in as ${userProfile.full_name}. Provide your location and outage type to alert dispatch.`
                  : 'Provide your location and outage type to alert the community and utility dispatch team.'}
              </p>
            </div>

            {/* Authentication Notice Banner */}
            {!isAuthenticated && (
              <div className="p-space-md rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-space-sm text-xs">
                <div className="flex items-center gap-space-xs text-amber-800 dark:text-amber-300 font-medium">
                  <span className="material-symbols-outlined text-[20px] text-amber-600">lock</span>
                  <span>
                    <strong>Sign-in required:</strong> You must be signed in with a citizen account to lodge an official report.
                  </span>
                </div>
                {onNavigateSignIn && (
                  <button
                    type="button"
                    onClick={onNavigateSignIn}
                    className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
                  >
                    Sign In to Report
                  </button>
                )}
              </div>
            )}

            {validationError && (
              <div className="p-space-sm rounded-lg bg-error-container/20 border border-error-container/50 text-error text-xs font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* Location Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="outage-location-select" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Outage Location / Sector <span className="text-error">*</span>
              </label>

              {isLoadingLocations ? (
                <div className="flex items-center gap-space-xs p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] animate-spin text-primary">progress_activity</span>
                  <span>Loading registered municipal locations...</span>
                </div>
              ) : locationsError ? (
                <div className="p-space-sm rounded-xl bg-error-container/20 border border-error-container/40 text-xs text-error flex items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    <span>{locationsError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoadingLocations(true);
                      setLocationsRetryCount((c) => c + 1);
                    }}
                    className="text-xs font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : locations.length === 0 ? (
                <div className="p-space-md rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-space-xs text-on-surface font-bold">
                    <span className="material-symbols-outlined text-[18px] text-amber-500">location_off</span>
                    <span>No Registered Locations Available</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    No registered municipal grid sectors are currently active in the database. Sectors must be configured before outage reports can be submitted.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
                    location_on
                  </span>
                  <select
                    id="outage-location-select"
                    value={formData.locationId}
                    onChange={(e) => {
                      setFormData({ ...formData, locationId: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    className="w-full pl-10 pr-space-md py-2.5 text-xs rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select registered sector / location...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}{loc.address ? ` — ${loc.address}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Outage Type Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Outage Type <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, outageType: 'complete' })}
                  className={`p-space-sm rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-colors ${
                    formData.outageType === 'complete'
                      ? 'border-primary bg-primary-container/20 text-primary font-bold'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">power_off</span>
                  <span className="text-xs font-bold">Complete Blackout</span>
                  <span className="text-[10px] text-on-surface-variant">Entire home/building out</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, outageType: 'partial' })}
                  className={`p-space-sm rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-colors ${
                    formData.outageType === 'partial'
                      ? 'border-primary bg-primary-container/20 text-primary font-bold'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">wb_incandescent</span>
                  <span className="text-xs font-bold">Partial Outage</span>
                  <span className="text-[10px] text-on-surface-variant">Low voltage / flickering</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, outageType: 'hazard' })}
                  className={`p-space-sm rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-colors ${
                    formData.outageType === 'hazard'
                      ? 'border-primary bg-primary-container/20 text-primary font-bold'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span className="text-xs font-bold">Sparks / Line Down</span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Safety hazard</span>
                </button>
              </div>
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Description & Notes
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide additional context (e.g. loud bang heard near transformer, tree branch on wire)..."
                className="w-full p-space-md text-xs rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {/* Photo / Evidence Upload (Clearly Disabled for Phase 8) */}
            <div className="flex flex-col gap-1 opacity-75">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Photo Evidence
                </label>
                <span className="text-[10px] text-on-surface-variant font-medium bg-surface-container-high px-1.5 py-0.5 rounded">
                  Feature Disabled
                </span>
              </div>
              <div className="p-space-md rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low/60 flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[22px] text-outline">no_photography</span>
                  <div>
                    <p className="font-bold text-on-surface text-xs">Photo Upload Unavailable</p>
                    <p className="text-[10px] text-on-surface-variant">
                      Cloud storage integration is not active in this phase. Reports submit metadata only.
                    </p>
                  </div>
                </div>
                <span className="px-space-sm py-1 rounded bg-surface-container-high text-[10px] font-bold text-on-surface-variant border border-outline-variant/40 shrink-0">
                  Disabled
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={onBack}
                className="px-space-md py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isFormDisabled}
                className="px-space-lg py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {!isAuthenticated
                    ? 'Sign In Required'
                    : locations.length === 0
                    ? 'No Locations Available'
                    : 'Next: Review Report'}
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW REPORT */}
        {step === 'review' && (
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-md">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Review Outage Notice</h2>
              <p className="text-xs text-on-surface-variant pt-0.5">
                Verify your report details before submitting to the community dispatch queue.
              </p>
            </div>

            {submitError && (
              <div className="p-space-sm rounded-lg bg-error-container/20 border border-error-container/50 text-error text-xs font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{submitError}</span>
              </div>
            )}

            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-xs text-xs">
              <div className="flex items-center justify-between pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Location</span>
                <span className="font-bold text-on-surface">{locationDisplayText || formData.locationId}</span>
              </div>

              <div className="flex items-center justify-between pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Outage Type</span>
                <span className="font-bold text-primary">{getOutageTypeLabel(formData.outageType)}</span>
              </div>

              <div className="flex flex-col gap-0.5 pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Description</span>
                <p className="text-on-surface leading-relaxed">
                  {formData.description.trim() || 'No additional notes provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Photo Evidence</span>
                <span className="font-semibold text-on-surface-variant text-[11px]">None (feature disabled)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="px-space-md py-2 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
              >
                Edit Information
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-space-lg py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit Outage Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION CONFIRMATION & TRACKING */}
        {step === 'tracking' && submittedReport && (
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-lg">
            {/* Status Banner */}
            {submittedReport.status === 'Rejected' ? (
              <div className="p-space-md rounded-xl bg-error-container/20 border border-error-container/50 flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-error text-3xl">cancel</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Outage Report Closed / Rejected</h3>
                  <p className="text-xs text-on-surface-variant pt-0.5">
                    This report was reviewed and marked as rejected by operations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/50 flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Outage Report Submitted Successfully</h3>
                  <p className="text-xs text-on-surface-variant pt-0.5">
                    Your report has been logged and queued for department verification. Keep your Report ID for tracking.
                  </p>
                </div>
              </div>
            )}

            {/* Summary Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Report ID</span>
                <span className="font-mono font-bold text-primary text-xs break-all">{submittedReport.id}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Submitted Time</span>
                <span className="font-bold text-on-surface">
                  {new Date(submittedReport.created_at).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Reported Location</span>
                <span className="font-bold text-on-surface truncate block">
                  {locationDisplayText || submittedReport.location_id}
                </span>
              </div>
            </div>

            {/* Report Lifecycle Tracker */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Report Status Lifecycle Tracker
                </h4>
                <span
                  className={`px-space-xs py-0.5 rounded-full text-[10px] font-bold ${
                    submittedReport.status === 'Rejected'
                      ? 'bg-error-container/40 text-error border border-error-container/60'
                      : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  {submittedReport.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-space-xs pt-space-xs text-center relative">
                {trackingStages.map((st, idx) => {
                  const stageStatus = getStageStatus(st.key);
                  const isDone = stageStatus === 'completed';
                  const isCurrent = stageStatus === 'current';
                  const isRejected = stageStatus === 'rejected';

                  const badgeClass = isRejected
                    ? 'bg-error-container/40 text-error border border-error-container/60'
                    : isDone
                    ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                    : isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                    : 'bg-surface-container-high border border-outline-variant text-outline';

                  const statusSubtext = isRejected
                    ? 'Closed'
                    : isDone
                    ? 'Completed'
                    : isCurrent
                    ? 'Active'
                    : 'Pending';

                  return (
                    <div key={st.stage} className="flex flex-col items-center gap-1 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${badgeClass}`}>
                        {isRejected ? (
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        ) : isDone ? (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-bold ${
                          isRejected
                            ? 'text-error'
                            : isCurrent
                            ? 'text-primary'
                            : isDone
                            ? 'text-on-surface'
                            : 'text-on-surface-variant/60'
                        }`}
                      >
                        {st.stage}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {statusSubtext}
                      </span>
                    </div>
                  );
                })}
              </div>

              {submittedReport.status === 'Rejected' && (
                <div className="p-space-xs px-space-sm rounded-lg bg-error-container/15 border border-error-container/30 text-[11px] text-error flex items-center gap-1.5 font-medium mt-1">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>Review concluded: This report was marked as rejected by operations.</span>
                </div>
              )}
            </div>

            {/* Final Actions */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => {
                  setFormData({ locationId: '', outageType: 'complete', description: '' });
                  setSubmittedReport(null);
                  setStep('form');
                }}
                className="px-space-md py-2 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Report Another Outage
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-space-lg py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
