import React from 'react';
import { UserProfile } from '../types';

interface AdminAccessBlockedScreenProps {
  currentUser: UserProfile | null;
  onNavigateHome: () => void;
  onNavigateAdminLogin: () => void;
  onSignOut: () => void;
}

export const AdminAccessBlockedScreen: React.FC<AdminAccessBlockedScreenProps> = ({
  currentUser,
  onNavigateHome,
  onNavigateAdminLogin,
  onSignOut,
}) => {
  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-[#E2E8E5] rounded-sm shadow-md p-8 md:p-10 text-center">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-center mx-auto mb-5 text-[#DC2626]">
          <span className="material-symbols-outlined text-3xl">shield_person</span>
        </div>

        {/* 403 Forbidden Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5] text-[11px] font-mono font-bold uppercase tracking-widest rounded-xs mb-3">
          <span>Error 403: Forbidden</span>
        </div>

        <h1 className="font-serif italic text-2xl md:text-3xl font-medium text-[#111827] mb-3">
          Administrator Access Blocked
        </h1>

        <p className="text-sm text-[#4B5563] leading-relaxed mb-6 max-w-md mx-auto">
          The <code className="bg-[#F3F4F6] text-[#111827] px-1.5 py-0.5 rounded-xs font-mono text-xs">/admin</code> section is strictly restricted to authorized curriculum administrators.
        </p>

        {/* Account Info Box */}
        <div className="bg-[#F8FAF9] border border-[#E2E8E5] rounded-sm p-4 mb-6 text-left">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280] mb-1">
            Current Authenticated Session
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#9CA3AF]">person</span>
              <span className="text-xs font-medium text-[#111827]">
                {currentUser?.email || 'Anonymous Guest'}
              </span>
            </div>
            <span className="text-[10px] bg-[#FEF2F2] text-[#991B1B] px-2 py-0.5 font-bold uppercase rounded-xs">
              Learner (Non-Admin)
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-2 border-t border-[#E5E7EB] pt-2">
            Required role: <strong className="text-[#1B4D3E]">Administrator</strong> (<code className="text-xs">tauheedjahan07@gmail.com</code>).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Return to Public App</span>
          </button>

          <button
            onClick={() => {
              onSignOut();
              onNavigateAdminLogin();
            }}
            className="bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#CBD5E1] hover:border-[#1B4D3E] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Sign In with Admin Account</span>
          </button>
        </div>
      </div>
    </main>
  );
};
