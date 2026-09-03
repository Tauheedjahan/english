import React from 'react';
import { TabType, ScreenView } from '../types';

interface NavigationProps {
  currentTab: TabType;
  currentScreen: ScreenView;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  currentScreen,
  onSelectTab,
}) => {
  // Hide global navigation on distraction-free task screens (like Listening Practice or Reading)
  const isTaskFocusedScreen = currentScreen === 'listening_practice' || currentScreen === 'reading';

  return (
    <>
      {/* Desktop TopAppBar */}
      {!isTaskFocusedScreen && (
        <header className="docked full-width top-0 border-b border-[#333333] hidden md:flex justify-between items-center w-full px-8 lg:px-12 h-20 max-w-[1200px] mx-auto z-40 sticky bg-[#111111]/95 backdrop-blur-md">
          <div 
            onClick={() => onSelectTab('home')}
            className="font-serif italic text-[24px] tracking-[0.1em] font-light text-[#EFEFEF] flex items-center gap-2 cursor-pointer select-none group"
          >
            <span className="w-2.5 h-2.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 inline-block group-hover:bg-[#D4AF37] transition-all"></span>
            90 Days English
          </div>
          
          <nav className="flex gap-10 items-center h-full">
            <button
              onClick={() => onSelectTab('home')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 ${
                currentTab === 'home' && !['progress', 'ai_teacher', 'settings'].includes(currentScreen)
                  ? 'text-[#D4AF37] border-[#D4AF37] font-semibold'
                  : 'text-[#888888] hover:text-[#EFEFEF] border-transparent font-normal'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => onSelectTab('progress')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 ${
                currentTab === 'progress'
                  ? 'text-[#D4AF37] border-[#D4AF37] font-semibold'
                  : 'text-[#888888] hover:text-[#EFEFEF] border-transparent font-normal'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => onSelectTab('ai_teacher')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 ${
                currentTab === 'ai_teacher'
                  ? 'text-[#D4AF37] border-[#D4AF37] font-semibold'
                  : 'text-[#888888] hover:text-[#EFEFEF] border-transparent font-normal'
              }`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className={`font-sans text-[11px] uppercase tracking-[0.25em] cursor-pointer transition-all duration-200 h-full flex items-center px-1 border-b-2 ${
                currentTab === 'settings'
                  ? 'text-[#D4AF37] border-[#D4AF37] font-semibold'
                  : 'text-[#888888] hover:text-[#EFEFEF] border-transparent font-normal'
              }`}
            >
              Settings
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('settings')}
              aria-label="Account Settings" 
              className="text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer p-2 rounded-full hover:bg-[#1A1A1A] border border-transparent hover:border-[#333333]"
            >
              <span className="material-symbols-outlined text-[22px]">account_circle</span>
            </button>
          </div>
        </header>
      )}

      {/* Bottom Navigation for Mobile */}
      {!isTaskFocusedScreen && (
        <nav className="fixed md:hidden bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 pb-[env(safe-area-inset-bottom,12px)] pt-2 h-16 bg-[#141414] border-t border-[#333333]">
          <button
            onClick={() => onSelectTab('home')}
            aria-label="Home"
            className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
              currentTab === 'home' && !['progress', 'ai_teacher', 'settings'].includes(currentScreen)
                ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'text-[#888888] hover:text-[#EFEFEF]'
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
            className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
              currentTab === 'progress'
                ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'text-[#888888] hover:text-[#EFEFEF]'
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
            className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
              currentTab === 'ai_teacher'
                ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'text-[#888888] hover:text-[#EFEFEF]'
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
            className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 transition-all ${
              currentTab === 'settings'
                ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37]/30'
                : 'text-[#888888] hover:text-[#EFEFEF]'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${currentTab === 'settings' ? 'icon-filled' : ''}`}>
              settings
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-medium mt-0.5">Settings</span>
          </button>
        </nav>
      )}
    </>
  );
};
