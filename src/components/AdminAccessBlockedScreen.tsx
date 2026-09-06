import React from 'react';
import { UserProfile } from '../types';

interface AdminAccessBlockedScreenProps {
  currentUser: UserProfile | null;
  onNavigateHome: () => void;
  onNavigateAdminLogin: () => void;
  onSignOut: () => void;
}

export const AdminAccessBlockedScreen: React.FC<AdminAccessBlockedScreenProps> = ({
  onNavigateHome,
  onNavigateAdminLogin,
  onSignOut,
}) => {
  return (
    <main className="min-h-screen bg-[#F4F7F5] flex flex-col justify-center items-center px-4 py-12">
      {/* Top Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#1B4D3E] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Return to Public App</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white border border-[#E2E8E5] rounded-sm shadow-sm p-8 text-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#F4F7F5] border border-[#E2E8E5] rounded-xs">
          <span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
          
        </div>

        <h1 className="font-serif italic text-2xl md:text-3xl font-medium text-[#111827] mb-3">
          Administrator Sign In Required
        </h1>

        <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
          Access to curriculum administration is restricted exclusively to authorized administrators. Please authenticate with your administrator credentials to access this dashboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onSignOut();
              onNavigateAdminLogin();
            }}
            className="w-full bg-[#1B4D3E] hover:bg-[#153E32] text-white py-3 font-sans text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Sign In as Administrator</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="w-full bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#CBD5E1] hover:border-[#1B4D3E] py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer rounded-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </main>
  );
};
