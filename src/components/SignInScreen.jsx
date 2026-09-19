import React, { useState } from 'react';

export function SignInScreen({
  onNavigateHome,
  onNavigateSignUp,
  onNavigateCitizenDemo,
  onNavigateDepartmentDemo
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('citizen'); // 'citizen' | 'utility'

  // Officer Verification State
  const [employeeId, setEmployeeId] = useState('EMP-84920');
  const [officerEmail, setOfficerEmail] = useState('officer.demo@powerwatch.app');
  const [organization, setOrganization] = useState('Metro Power DISCOM');
  const [division, setDivision] = useState('West Sector Division');
  
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerifyOfficer = (e) => {
    e.preventDefault();
    if (!employeeId.trim() || !officerEmail.trim() || !organization.trim() || !division.trim()) {
      alert('Please fill in all 4 officer verification details.');
      return;
    }
    setVerificationResult({
      status: 'Officer Verified',
      name: 'Officer Rajesh Kumar',
      employeeId: employeeId,
      designation: 'Assistant Executive Engineer (Grid Operations)',
      organization: organization,
      division: division,
      employmentStatus: 'Active Employee'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI mock only - if citizen submit, go to citizen demo; if utility, go to department demo
    if (accountType === 'citizen' && onNavigateCitizenDemo) {
      onNavigateCitizenDemo();
    } else if (accountType === 'utility' && onNavigateDepartmentDemo) {
      onNavigateDepartmentDemo();
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans">
      {/* Top Header Navigation bar */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-space-sm group cursor-pointer focus:outline-none"
          >
            <span className="material-symbols-outlined text-primary text-[28px]">electric_bolt</span>
            <span className="text-xl text-primary tracking-tight font-bold font-sans">
              PowerWatch
            </span>
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-space-xxs text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Sign In Form Card Container */}
      <main className="flex-1 flex items-center justify-center p-margin md:p-margin-desktop my-space-lg">
        <div className="w-full max-w-[480px] rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-space-xl md:p-space-2xl flex flex-col gap-space-lg">
          
          {/* Header & Subtitle */}
          <div className="flex flex-col gap-space-xxs text-center">
            <div className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/40 mx-auto mb-space-xs">
              <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Secure Access Portal
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Sign in to PowerWatch
            </h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Access community outage management, incident verification, and restoration tracking.
            </p>
          </div>

          {/* Account Type Selector (Citizen / Utility Team) */}
          <div className="grid grid-cols-2 gap-space-xs p-1 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <button
              type="button"
              onClick={() => {
                setAccountType('citizen');
                setVerificationResult(null);
              }}
              className={`py-space-xs px-space-sm rounded-lg text-xs font-semibold transition-all ${
                accountType === 'citizen'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Citizen Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountType('utility');
                setVerificationResult(null);
              }}
              className={`py-space-xs px-space-sm rounded-lg text-xs font-semibold transition-all ${
                accountType === 'utility'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Utility / Department
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Email Field */}
            <div className="flex flex-col gap-space-xxs">
              <label className="text-xs font-bold text-on-surface">
                {accountType === 'citizen' ? 'Email Address' : 'Official Department Email'}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder={accountType === 'citizen' ? 'you@example.com' : 'officer.demo@powerwatch.app'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-space-xxs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface">
                  Password
                </label>
                <a
                  href="#forgot-password"
                  onClick={(e) => { e.preventDefault(); }}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  key
                </span>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full mt-space-xs py-space-sm px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-space-xs cursor-pointer active:scale-98"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* OFFICER VERIFICATION SECTION (Utility/Department Only) */}
          {accountType === 'utility' && (
            <div className="pt-space-md border-t border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xxs">
                <div className="flex items-center gap-space-xs text-secondary font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Officer Identity Verification</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  These details are used to verify official department credentials before authorizing incident triage & crew dispatch access.
                </p>
              </div>

              {/* 4 Verification Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs">
                {/* 1. Employee ID */}
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-semibold text-on-surface">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-84920"
                    className="w-full px-space-sm py-space-xs rounded border border-outline-variant/70 text-on-surface text-xs bg-transparent outline-none focus:border-primary"
                  />
                </div>

                {/* 2. Official Department Email */}
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-semibold text-on-surface">Official Dept. Email</label>
                  <input
                    type="email"
                    value={officerEmail}
                    onChange={(e) => setOfficerEmail(e.target.value)}
                    placeholder="officer.demo@powerwatch.app"
                    className="w-full px-space-sm py-space-xs rounded border border-outline-variant/70 text-on-surface text-xs bg-transparent outline-none focus:border-primary"
                  />
                </div>

                {/* 3. Organization / DISCOM */}
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-semibold text-on-surface">Organization / DISCOM</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Metro Power DISCOM"
                    className="w-full px-space-sm py-space-xs rounded border border-outline-variant/70 text-on-surface text-xs bg-transparent outline-none focus:border-primary"
                  />
                </div>

                {/* 4. Office / Division */}
                <div className="flex flex-col gap-space-xxs">
                  <label className="font-semibold text-on-surface">Office / Division</label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="e.g. West Sector Division"
                    className="w-full px-space-sm py-space-xs rounded border border-outline-variant/70 text-on-surface text-xs bg-transparent outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Verify Officer Action Button */}
              <button
                type="button"
                onClick={handleVerifyOfficer}
                className="w-full py-space-xs px-space-md rounded-lg bg-surface-container-high border border-outline-variant/60 hover:bg-surface-container-highest text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span>Verify Officer</span>
              </button>

              {/* Demo Verification Result Card */}
              {verificationResult && (
                <div className="p-space-md rounded-xl bg-secondary-container/20 border border-secondary-container/40 flex flex-col gap-space-xs text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-space-xs py-0.5 rounded bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      {verificationResult.status}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">
                      Demo Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs pt-space-xxs text-on-surface">
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Officer Name</span>
                      <strong className="text-xs">{verificationResult.name}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Employee ID</span>
                      <strong className="text-xs">{verificationResult.employeeId}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block text-[10px]">Designation</span>
                      <span className="text-xs font-medium">{verificationResult.designation}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Organization / DISCOM</span>
                      <span className="text-xs font-semibold">{verificationResult.organization}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Office / Division</span>
                      <span className="text-xs font-semibold">{verificationResult.division}</span>
                    </div>
                  </div>

                  <div className="pt-space-xxs border-t border-secondary-container/30 flex items-center justify-between text-[11px] text-secondary font-bold">
                    <span>Employment Status:</span>
                    <span>{verificationResult.employmentStatus}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Workflow Action Buttons */}
          <div className="pt-space-sm border-t border-outline-variant/20 flex flex-col gap-space-xs">
            {accountType === 'citizen' ? (
              <button
                type="button"
                onClick={() => {
                  console.log('[PowerWatch] Try Citizen Demo button clicked');
                  if (onNavigateCitizenDemo) onNavigateCitizenDemo();
                }}
                className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/50 text-primary font-bold text-xs transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Try Citizen Demo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  console.log('[PowerWatch] Try Department Demo button clicked');
                  if (onNavigateDepartmentDemo) onNavigateDepartmentDemo();
                }}
                className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/50 text-secondary font-bold text-xs transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Try Department Demo</span>
              </button>
            )}
          </div>

          {/* Footer Card Link: Create an Account */}
          <div className="pt-space-xs text-center text-xs text-on-surface-variant">
            <span>Don't have an account yet? </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('[Step 1] Create Account clicked in SignInScreen');
                if (onNavigateSignUp) {
                  onNavigateSignUp();
                }
              }}
              className="text-primary font-bold hover:underline cursor-pointer focus:outline-none"
            >
              Create an account
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Civic Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
