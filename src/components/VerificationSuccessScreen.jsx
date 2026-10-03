import React from 'react';

export function VerificationSuccessScreen({
  isSuccess = true,
  errorMessage = '',
  onNavigateSignIn,
  onNavigateSignUp
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between font-sans">
      {/* Top Header Navigation bar */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-space-md px-margin md:px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[28px]">electric_bolt</span>
            <span className="text-xl text-primary tracking-tight font-bold font-sans">
              PowerWatch
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateSignIn}
            className="inline-flex items-center gap-space-xxs text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Main Verification Card Container */}
      <main className="flex-1 flex items-center justify-center p-margin md:p-margin-desktop my-space-lg">
        <div className="w-full max-w-[460px] rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm p-space-xl md:p-space-2xl flex flex-col gap-space-lg text-center">
          
          {isSuccess ? (
            <>
              {/* Icon & Badge */}
              <div className="w-16 h-16 rounded-full bg-secondary-container/40 border border-secondary-container text-secondary flex items-center justify-center mx-auto mb-space-xs">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-space-xxs">
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                  Email Verified Successfully
                </h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your PowerWatch account is now verified. You can now sign in with your account to report outages and access community updates.
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onNavigateSignIn}
                className="w-full mt-space-sm py-space-sm px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-space-xs cursor-pointer active:scale-98"
              >
                <span>Continue to Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className="w-16 h-16 rounded-full bg-error-container/40 border border-error-container text-error flex items-center justify-center mx-auto mb-space-xs">
                <span className="material-symbols-outlined text-[36px]">gpp_bad</span>
              </div>

              {/* Error Title & Description */}
              <div className="flex flex-col gap-space-xxs">
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                  Verification Link Invalid or Expired
                </h1>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {errorMessage || 'The verification link may have expired or already been used. Please try signing in or request a new link.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-space-xs mt-space-sm">
                <button
                  type="button"
                  onClick={onNavigateSignIn}
                  className="w-full py-space-sm px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-space-xs cursor-pointer active:scale-98"
                >
                  <span>Go to Sign In</span>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </button>

                {onNavigateSignUp && (
                  <button
                    type="button"
                    onClick={onNavigateSignUp}
                    className="w-full py-space-sm px-space-lg rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-sm transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
                  >
                    <span>Return to Sign Up</span>
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/20 py-space-md px-margin text-center text-xs text-on-surface-variant bg-surface-container-lowest">
        <span>© 2026 PowerWatch Civic Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
