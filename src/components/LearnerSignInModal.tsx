import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { signInAsLearner, signInWithGoogle } from '../lib/supabase';

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
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedLast = localStorage.getItem('last_learner_email') || '';
      setLastEmail(storedLast || null);
      setEmail(initialEmail || storedLast || '');
      setErrorMessage(null);
      setLoading(false);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleExecuteSignIn = async (targetEmail: string, targetName?: string) => {
    let cleanEmail = (targetEmail || email).trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your Gmail address to continue.');
      return;
    }

    // Friendly auto-formatting if learner only typed their username
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
      setEmail(cleanEmail);
    }

    // Basic format check
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Sign in as learner with their personal Gmail
      const { user, error } = await signInAsLearner(cleanEmail, targetName || fullName);

      if (error || !user) {
        // Fallback to Google sign in helper
        const googleRes = await signInWithGoogle(cleanEmail, targetName || fullName);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSignIn(email, fullName);
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
            LEARNER SIGN IN
          </span>
        </div>

        <h2 className="font-serif italic text-2xl md:text-3xl font-medium text-[#111827] mb-2">
          Sign In with Gmail
        </h2>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
          Sign in once with your Gmail address to securely save and restore your 90-day learning progress, translation scores, and pronunciation feedback across sessions.
        </p>

        {errorMessage && (
          <div className="mb-5 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-sm flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <span className="flex-1 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Quick Continue Button if returning learner */}
        {lastEmail && lastEmail !== email && (
          <div className="mb-5 p-3 bg-[#F4F7F5] border border-[#E2E8E5] rounded-sm flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">
                Saved Account
              </div>
              <div className="text-xs font-mono text-[#111827] truncate font-medium">
                {lastEmail}
              </div>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail(lastEmail);
                handleExecuteSignIn(lastEmail);
              }}
              className="shrink-0 text-xs text-[#1B4D3E] hover:text-[#153E32] font-semibold underline cursor-pointer"
            >
              Continue with this
            </button>
          </div>
        )}

        {/* Main Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#374151]">
                Your Gmail Address
              </label>
              {!email.includes('@') && email.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEmail(`${email}@gmail.com`)}
                  className="text-[10px] text-[#1B4D3E] hover:underline font-mono cursor-pointer"
                >
                  + @gmail.com
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full bg-[#F8FAF9] border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#111827] font-mono focus:border-[#1B4D3E] focus:bg-white focus:outline-none rounded-sm transition-colors pr-10"
              />
              <span className="absolute right-3 top-2.5 material-symbols-outlined text-sm text-[#9CA3AF]">
                mail
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#374151] mb-1.5">
              Full Name <span className="text-[10px] font-normal text-[#6B7280]">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full bg-[#F8FAF9] border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#1B4D3E] focus:bg-white focus:outline-none rounded-sm transition-colors"
              />
              <span className="absolute right-3 top-2.5 material-symbols-outlined text-sm text-[#9CA3AF]">
                person
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B4D3E] hover:bg-[#153E32] text-white py-3.5 px-4 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer rounded-sm shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Connecting Account...</span>
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
                <span>Continue with Gmail</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Each learner account has its own independent 90-day curriculum progress, bookmark collection, and AI speech scores.
          </p>
        </div>
      </div>
    </div>
  );
};
