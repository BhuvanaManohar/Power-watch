import React, { useState } from 'react';

export function ReportOutageScreen({ onBack, onReportSubmitted }) {
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'tracking'
  const [formData, setFormData] = useState({
    location: '',
    outageType: 'complete', // 'complete' | 'partial' | 'hazard'
    description: '',
    photoName: '',
  });
  const [submittedReport, setSubmittedReport] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleNextReview = (e) => {
    e.preventDefault();
    if (!formData.location.trim()) {
      setValidationError('Please enter your location or address.');
      return;
    }
    setValidationError('');
    setStep('review');
  };

  const handleSubmit = () => {
    const randomId = `REP-${Math.floor(1000 + Math.random() * 9000)}-DEMO`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReport = {
      reportId: randomId,
      submittedTime: `Today at ${timeStr}`,
      location: formData.location,
      outageType:
        formData.outageType === 'complete'
          ? 'Complete Power Outage'
          : formData.outageType === 'partial'
          ? 'Partial / Low Voltage Outage'
          : 'Sparks / Line Down Hazard',
      description: formData.description || 'No additional notes provided.',
      photoAttached: formData.photoName ? true : false,
      photoName: formData.photoName,
      status: 'Under Review',
      trackingStages: [
        { stage: 'Submitted', timestamp: timeStr, status: 'completed' },
        { stage: 'Under Review', timestamp: 'In Progress', status: 'current' },
        { stage: 'Linked to Incident', timestamp: 'Pending', status: 'upcoming' },
        { stage: 'Resolved', timestamp: 'Pending', status: 'upcoming' },
      ],
    };

    setSubmittedReport(newReport);
    setStep('tracking');
    if (onReportSubmitted) {
      onReportSubmitted(newReport);
    }
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
            <span>Back to Main Page</span>
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
                Provide your location and outage type to alert the community and utility dispatch team.
              </p>
            </div>

            {validationError && (
              <div className="p-space-sm rounded-lg bg-error-container/20 border border-error-container/50 text-error text-xs font-bold flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* Location Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Outage Location / Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  location_on
                </span>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. 804 Oak Street, West District"
                  className="w-full pl-10 pr-space-md py-2.5 text-xs rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
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

            {/* Photo / Evidence Upload Mock */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Photo Evidence (Optional)
              </label>
              <div className="p-space-md rounded-xl border border-dashed border-outline-variant/80 bg-surface-container-low flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[22px] text-primary">add_a_photo</span>
                  <div>
                    <p className="font-bold text-on-surface">
                      {formData.photoName || 'Attach Photo of Meter or Hazard'}
                    </p>
                    <p className="text-[10px]">PNG, JPG up to 5MB (Demo Preview)</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, photoName: file.name });
                    }
                  }}
                />
                <label
                  htmlFor="photo-upload"
                  className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
                >
                  {formData.photoName ? 'Change File' : 'Browse File'}
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={onBack}
                className="px-space-md py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-lg py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Next: Review Report</span>
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

            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-xs text-xs">
              <div className="flex items-center justify-between pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Location</span>
                <span className="font-bold text-on-surface">{formData.location}</span>
              </div>

              <div className="flex items-center justify-between pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Outage Type</span>
                <span className="font-bold text-primary">
                  {formData.outageType === 'complete'
                    ? 'Complete Power Outage'
                    : formData.outageType === 'partial'
                    ? 'Partial / Low Voltage Outage'
                    : 'Sparks / Line Down Hazard'}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 pb-space-xxs border-b border-outline-variant/30">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Description</span>
                <p className="text-on-surface leading-relaxed">
                  {formData.description || 'No additional notes provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-bold uppercase text-[10px]">Photo Evidence</span>
                <span className="font-semibold text-on-surface">
                  {formData.photoName ? `Attached: ${formData.photoName}` : 'None provided'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-space-md py-2 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Edit Information
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-space-lg py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Submit Outage Report</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION CONFIRMATION & TRACKING */}
        {step === 'tracking' && submittedReport && (
          <div className="p-space-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col gap-space-lg">
            
            {/* Success Banner */}
            <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/50 flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
              <div>
                <h3 className="text-base font-bold text-on-surface">Outage Report Submitted Successfully</h3>
                <p className="text-xs text-on-surface-variant pt-0.5">
                  Your report has been logged and queued for department verification. Keep your Demo Report ID for tracking.
                </p>
              </div>
            </div>

            {/* Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Demo Report ID</span>
                <span className="font-mono font-bold text-primary text-sm">{submittedReport.reportId}</span>
              </div>
              <div>
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Submitted Time</span>
                <span className="font-bold text-on-surface">{submittedReport.submittedTime}</span>
              </div>
              <div className="col-span-2">
                <span className="text-on-surface-variant uppercase font-bold text-[10px] block">Reported Location</span>
                <span className="font-bold text-on-surface truncate block">{submittedReport.location}</span>
              </div>
            </div>

            {/* Report Lifecycle Tracker */}
            <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Report Status Lifecycle Tracker
                </h4>
                <span className="px-space-xs py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                  {submittedReport.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-space-xs pt-space-xs text-center relative">
                {submittedReport.trackingStages.map((st, idx) => {
                  const isDone = st.status === 'completed';
                  const isCurrent = st.status === 'current';

                  const badgeClass = isDone
                    ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                    : isCurrent
                    ? 'bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse'
                    : 'bg-surface-container-high border border-outline-variant text-outline';

                  return (
                    <div key={st.stage} className="flex flex-col items-center gap-1 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${badgeClass}`}>
                        {isDone ? <span className="material-symbols-outlined text-[14px]">check</span> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-primary' : isDone ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>
                        {st.stage}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{st.timestamp}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/40">
              <button
                type="button"
                onClick={() => {
                  setFormData({ location: '', outageType: 'complete', description: '', photoName: '' });
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
                Back to Home Page
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
