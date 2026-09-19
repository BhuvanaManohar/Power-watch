import React, { useState } from 'react';

export function SignUpScreen({ onNavigateHome, onNavigateSignIn }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('citizen'); // 'citizen' | 'utility'

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation 1: Required fields check
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Validation 2: Password match check
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    // Validation 3: Basic password length check
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // All fields valid - show UI mock success state
    setSuccessMessage(
      'Account details submitted successfully. Account creation will be enabled when authentication is connected.'
    );
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

      {/* Main Sign Up Form Card Container */}
      <main className="flex-1 flex items-center justify-center p-margin md:p-margin-desktop my-space-lg">
        <div className="w-full max-w-[460px] rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-space-xl md:p-space-2xl flex flex-col gap-space-lg">
          
          {/* Header & Subtitle */}
          <div className="flex flex-col gap-space-xxs text-center">
            <div className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/40 mx-auto mb-space-xs">
              <span className="material-symbols-outlined text-primary text-[16px]">person_add</span>
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Account Registration
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              Create a PowerWatch Account
            </h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Register to report outages, track neighborhood restoration, and receive verified updates.
            </p>
          </div>

          {/* Account Type Selector (Citizen / Utility Team) */}
          <div className="grid grid-cols-2 gap-space-xs p-1 rounded-xl bg-surface-container-low border border-outline-variant/40">
            <button
              type="button"
              onClick={() => {
                setAccountType('citizen');
                setErrorMessage('');
                setSuccessMessage('');
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
                setErrorMessage('');
                setSuccessMessage('');
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

          {/* Inline Feedback Messages */}
          {errorMessage && (
            <div className="p-space-sm rounded-lg bg-error-container/30 border border-error-container text-on-error-container text-xs flex items-center gap-space-xs font-medium">
              <span className="material-symbols-outlined text-[16px] text-error shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-space-sm rounded-lg bg-secondary-container/30 border border-secondary-container text-on-secondary-container text-xs flex items-start gap-space-xs font-medium">
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">check_circle</span>
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Full Name Field */}
            <div className="flex flex-col gap-space-xxs">
              <label className="text-xs font-bold text-on-surface">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="flex flex-col gap-space-xxs">
              <label className="text-xs font-bold text-on-surface">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  placeholder={accountType === 'citizen' ? 'you@example.com' : 'official@utility.gov'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-space-xxs">
              <label className="text-xs font-bold text-on-surface">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  key
                </span>
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-space-xxs">
              <label className="text-xs font-bold text-on-surface">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
                  lock_reset
                </span>
                <input
                  type="password"
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-space-md py-space-sm rounded-lg border border-outline-variant/70 text-on-surface placeholder:text-outline text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-transparent"
                />
              </div>
            </div>

            {/* Primary Create Account Button */}
            <button
              type="submit"
              className="w-full mt-space-xs py-space-sm px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-space-xs cursor-pointer active:scale-98"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Footer Card Link: Already have an account? Sign In */}
          <div className="pt-space-md border-t border-outline-variant/20 text-center text-xs text-on-surface-variant">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('[PowerWatch] Already have an account button clicked in SignUpScreen');
                if (onNavigateSignIn) {
                  onNavigateSignIn();
                }
              }}
              className="text-primary font-bold hover:underline cursor-pointer focus:outline-none"
            >
              Sign In
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
