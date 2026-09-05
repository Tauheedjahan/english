import React from 'react';
import { TabType, ScreenView, UserProfile } from '../types';

interface NavigationProps {
  currentTab: TabType;
  currentScreen: ScreenView;
  user: UserProfile | null;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings?: () => void;
  onLoginWithGoogle: () => void;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  currentScreen,
  user,
  onSelectTab,
  onLoginWithGoogle,
  onSignOut,
}) => {
  return (
    <>
      {/* Top Main Menu Bar - Always visible across all screen sizes */}
      <header className="docked full-width top-0 border-b border-[#E2E8E5] flex justify-between items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 h-16 md:h-20 max-w-[1240px] mx-auto z-40 sticky bg-white/95 backdrop-blur-md">
          <div 
            onClick={() => onSelectTab('home')}
            className="font-serif italic text-[18px] sm:text-[22px] md:text-[24px] tracking-[0.05em] font-medium text-[#111827] flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1B4D3E] inline-block shadow-xs"></span>
            <span>90 Days English</span>
          </div>
          
          <nav className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center h-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectTab('home')}
              className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                currentTab === 'home' || ['listening_practice', 'reading', 'translation'].includes(currentScreen)
                  ? 'text-[#1B4D3E] border-[#1B4D3E] font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] border-transparent font-medium'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                currentTab === 'progress' && currentScreen === 'progress'
                  ? 'text-[#1B4D3E] border-[#1B4D3E] font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] border-transparent font-medium'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => onSelectTab('ai_teacher')}
              className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                currentScreen === 'ai_teacher' || currentTab === 'ai_teacher'
                  ? 'text-[#1B4D3E] border-[#1B4D3E] font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] border-transparent font-medium'
              }`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className={`font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 whitespace-nowrap ${
                currentTab === 'settings' && currentScreen === 'settings'
                  ? 'text-[#1B4D3E] border-[#1B4D3E] font-bold'
                  : 'text-[#4B5563] hover:text-[#111827] border-transparent font-medium'
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Auth / Profile Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAF9] border border-[#E2E8E5] rounded-full">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/30 text-[#1B4D3E] flex items-center justify-center text-[10px] font-bold">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-[#111827] font-medium max-w-[120px] truncate font-sans">
                    {user.full_name}
                  </span>
                  {user.is_admin && (
                    <span className="text-[9px] uppercase tracking-wider text-[#1B4D3E] font-bold bg-[#E8F2EE] px-2 py-0.5 rounded-xs border border-[#1B4D3E]/30">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="text-[#6B7280] hover:text-[#DC2626] transition-colors p-2 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginWithGoogle}
                  className="bg-white hover:bg-[#F9FAFB] border border-[#D1D5DB] text-[#111827] hover:border-[#1B4D3E] text-[11px] font-sans font-medium px-4 py-2 flex items-center gap-2 transition-all cursor-pointer shadow-xs rounded-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Sign in</span>
                </button>
              </div>
            )}
          </div>
        </header>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-[env(safe-area-inset-bottom,12px)] pt-2 h-16 bg-white border-t border-[#E2E8E5] shadow-lg">
          <button
            onClick={() => onSelectTab('home')}
            aria-label="Home"
            className={`flex flex-col items-center justify-center rounded-sm px-3 py-1 transition-all ${
              currentTab === 'home' && !['progress', 'ai_teacher', 'settings', 'admin'].includes(currentScreen)
                ? 'bg-[#E8F2EE] text-[#1B4D3E] font-bold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentTab === 'home' ? 'icon-filled' : ''}`}>
              home
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-medium mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            aria-label="Progress"
            className={`flex flex-col items-center justify-center rounded-sm px-3 py-1 transition-all ${
              currentTab === 'progress'
                ? 'bg-[#E8F2EE] text-[#1B4D3E] font-bold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentTab === 'progress' ? 'icon-filled' : ''}`}>
              leaderboard
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-medium mt-0.5">Progress</span>
          </button>

          <button
            onClick={() => onSelectTab('ai_teacher')}
            aria-label="AI Teacher"
            className={`flex flex-col items-center justify-center rounded-sm px-3 py-1 transition-all ${
              currentTab === 'ai_teacher'
                ? 'bg-[#E8F2EE] text-[#1B4D3E] font-bold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentTab === 'ai_teacher' ? 'icon-filled' : ''}`}>
              psychology
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-medium mt-0.5">AI Tutor</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            aria-label="Settings"
            className={`flex flex-col items-center justify-center rounded-sm px-3 py-1 transition-all ${
              currentTab === 'settings'
                ? 'bg-[#E8F2EE] text-[#1B4D3E] font-bold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentTab === 'settings' ? 'icon-filled' : ''}`}>
              settings
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-medium mt-0.5">Settings</span>
          </button>
        </nav>
    </>
  );
};
