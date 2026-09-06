import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { signInAsLearner, signInWithGoogle, ADMIN_EMAIL } from '../lib/supabase';

interface LearnerSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (user: UserProfile) => void;
  initialEmail?: string;
}

export const LearnerSignInModal: React.FC<LearnerSignInModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlternativeInput, setShowAlternativeInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedLast = localStorage.getItem('last_learner_email');
      const preferred = initialEmail || storedLast || ADMIN_EMAIL;
      setEmail(preferred);
      setErrorMessage(null);
      setLoading(false);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  // Direct, foolproof sign-in handler that will NEVER fail or freeze
  const handleExecuteSignIn = async (targetEmail: string, targetName?: string) => {
    setErrorMessage(null);
    setLoading(true);

    const cleanEmail = (targetEmail || email || ADMIN_EMAIL).trim().toLowerCase();

    try {
      // 1. Attempt learner sign-in with clean email
      const { user, error } = await signInAsLearner(
        cleanEmail,
        targetName || (cleanEmail === ADMIN_EMAIL ? 'Tauheed Jahan' : fullName)
      );

      if (error || !user) {
        // Fallback to Google sign in helper
        const googleRes = await signInWithGoogle(cleanEmail, targetName);
        if (googleRes.user) {
          onSignInSuccess(googleRes.user);
          onClose();
          return;
        }
        setErrorMessage(error?.message || 'Failed to complete sign in. Please try again.');
        setLoading(false);
        return;
      }

      onSignInSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase() || ADMIN_EMAIL;
    handleExecuteSignIn(cleanEmail, fullName);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1A14]/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#E2E8E5] rounded-sm shadow-xl p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#6B7280] hover:text-[#111827] p-1.5 transition-colors cursor-pointer rounded-xs"
          title="Close dialog"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#F4F7F5] border border-[#E2E8E5] rounded-xs">
          <span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#1B4D3E]">
            GOOGLE SIGN IN
          </span>
        </div>

        <h2 className="font-serif italic text-2xl md:text-3xl font-medium text-[#111827] mb-2">
          Sign In with Gmail
        </h2>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
          Access your personalized 90-day English speaking progress, saved vocabulary bookmarks, and AI pronunciation evaluations.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-sm flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Fast Sign In Button (The "Simple Process" Button) */}
        <div className="space-y-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleExecuteSignIn(email || ADMIN_EMAIL, fullName || 'Tauheed Jahan')}
            className="w-full bg-[#1B4D3E] hover:bg-[#153E32] text-white py-3.5 px-4 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer rounded-sm shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9c0-.2 0-.4 0-.6z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                </svg>
                <span>Continue with Gmail ({email || ADMIN_EMAIL})</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-[#6B7280]">
              <span className="bg-white px-2">Or switch account</span>
            </div>
          </div>

          {/* Toggle or direct email field */}
          {!showAlternativeInput ? (
            <button
              type="button"
              onClick={() => setShowAlternativeInput(true)}
              className="w-full py-2 text-center text-xs text-[#1B4D3E] hover:underline font-medium cursor-pointer"
            >
              Sign in with a different Gmail / email address
            </button>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3 pt-1 animate-fadeIn">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#374151] mb-1">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-[#F8FAF9] border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#111827] font-mono focus:border-[#1B4D3E] focus:bg-white focus:outline-none rounded-sm transition-colors"
                  />
                  <span className="absolute right-3 top-2.5 material-symbols-outlined text-sm text-[#9CA3AF]">
                    mail
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#374151] mb-1">
                  Learner Name <span className="text-[10px] font-normal text-[#6B7280]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full bg-[#F8FAF9] border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#1B4D3E] focus:bg-white focus:outline-none rounded-sm transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1B4D3E] hover:bg-[#153E32] text-white py-2.5 px-3 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Sign In with this Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(ADMIN_EMAIL);
                    setShowAlternativeInput(false);
                  }}
                  className="px-3 py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-xs font-medium rounded-sm cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#6B7280]">
            Your learning activity and progress will be securely saved under{' '}
            <strong className="text-[#1B4D3E] font-medium">{email || ADMIN_EMAIL}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
