import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { signInWithGoogle, GoogleAccountProfile } from '../lib/supabase';

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOtherAccountInput, setShowOtherAccountInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  // Determine active default Google account
  const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('last_learner_email') : null;
  const defaultGoogleAccount: GoogleAccountProfile = {
    email: initialEmail || storedEmail || 'tauheedjahan07@gmail.com',
    name:
      initialEmail || storedEmail
        ? (initialEmail || storedEmail || '').split('@')[0].replace(/[._-]/g, ' ')
        : 'Tauheed Jahan',
    avatar:
      (initialEmail || storedEmail || 'tauheedjahan07@gmail.com') === 'tauheedjahan07@gmail.com'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        : '',
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setLoading(false);
      setShowOtherAccountInput(false);
      setCustomEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Direct Google OAuth flow - triggers Google sign-in directly without asking for email/name
  const handleDirectGoogleSignIn = async (account?: GoogleAccountProfile) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const targetAccount = account || defaultGoogleAccount;
      const { user, error } = await signInWithGoogle(targetAccount);

      if (error && error.message !== 'POPUP_CLOSED') {
        setErrorMessage(error.message || 'Unable to connect to Google account. Please try again.');
        setLoading(false);
        return;
      }

      if (user) {
        onSignInSuccess(user);
        onClose();
        return;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during Google sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let email = customEmail.trim().toLowerCase();
    if (!email) return;
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    handleDirectGoogleSignIn({ email, name });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1A14]/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white border border-[#E2E8E5] rounded-lg shadow-2xl p-6 md:p-8 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#111827] p-1.5 transition-colors cursor-pointer rounded-full hover:bg-[#F3F4F6]"
          title="Close dialog"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Google Branding Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 mb-3 flex items-center justify-center rounded-full bg-white shadow-xs border border-[#E5E7EB]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9c0-.2 0-.4 0-.6z"
              />
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-medium text-[#111827] tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Choose an account to continue to Spoken English 90-Day
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-md flex items-start gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <span className="flex-1 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Direct Account Card (Google Single Sign-On Chooser) */}
        {!showOtherAccountInput ? (
          <div className="space-y-3">
            <div
              onClick={() => !loading && handleDirectGoogleSignIn(defaultGoogleAccount)}
              className={`p-3.5 border rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-all ${
                loading
                  ? 'opacity-60 bg-[#F9FAFB] border-[#E5E7EB]'
                  : 'bg-white hover:bg-[#F8FAF9] border-[#D1D5DB] hover:border-[#1B4D3E] hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {defaultGoogleAccount.avatar ? (
                  <img
                    src={defaultGoogleAccount.avatar}
                    alt={defaultGoogleAccount.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#E5E7EB]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1B4D3E] text-white font-medium flex items-center justify-center text-sm shrink-0 uppercase">
                    {defaultGoogleAccount.email.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <div className="text-xs font-semibold text-[#111827] truncate">
                    {defaultGoogleAccount.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#4B5563] truncate">
                    {defaultGoogleAccount.email}
                  </div>
                </div>
              </div>

              <span className="material-symbols-outlined text-sm text-[#9CA3AF] shrink-0">
                chevron_right
              </span>
            </div>

            {/* Direct Continue With Gmail Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDirectGoogleSignIn(defaultGoogleAccount)}
              className="w-full bg-[#1B4D3E] hover:bg-[#153E32] text-white py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer rounded-md shadow-xs disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Signing in with Google...</span>
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

            {/* Use Another Google Account Toggle */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowOtherAccountInput(true)}
                className="text-xs text-[#1B4D3E] hover:underline font-medium cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">switch_account</span>
                <span>Use another Google account</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomAccountSubmit} className="space-y-4">
            <div className="text-left">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#374151]">
                  Google Account Email
                </label>
                {!customEmail.includes('@') && customEmail.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomEmail(`${customEmail}@gmail.com`)}
                    className="text-[10px] text-[#1B4D3E] hover:underline font-mono"
                  >
                    + @gmail.com
                  </button>
                )}
              </div>
              <input
                type="text"
                autoFocus
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-[#F8FAF9] border border-[#CBD5E1] px-3.5 py-2.5 text-xs text-[#111827] font-mono focus:border-[#1B4D3E] focus:bg-white focus:outline-none rounded-md transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowOtherAccountInput(false)}
                className="flex-1 border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6] py-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1B4D3E] hover:bg-[#153E32] text-white py-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? 'Connecting...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-center">
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            Your 90-day curriculum progress, sentence scores, and audio practice will be automatically saved to your Google account.
          </p>
        </div>
      </div>
    </div>
  );
};
