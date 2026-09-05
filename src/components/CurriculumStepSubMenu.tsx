import React, { useState } from 'react';
import { ScreenView } from '../types';

interface CurriculumStepSubMenuProps {
  currentScreen: ScreenView;
  dayNumber: number;
  topic?: string;
  isListeningDone: boolean;
  isReadingDone: boolean;
  isTranslationDone: boolean;
  isAIDone: boolean;
  completedSentenceCount?: number;
  totalSentenceCount?: number;
  onBackToCurriculum: () => void;
  onNavigateStep: (step: ScreenView) => void;
  onOpenSentenceDirectory?: () => void;
}

export const CurriculumStepSubMenu: React.FC<CurriculumStepSubMenuProps> = ({
  currentScreen,
  dayNumber,
  isListeningDone,
  isReadingDone,
  isTranslationDone,
  isAIDone,
  completedSentenceCount = 0,
  totalSentenceCount = 30,
  onBackToCurriculum,
  onNavigateStep,
  onOpenSentenceDirectory,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const handleStepClick = (
    targetScreen: ScreenView,
    isUnlocked: boolean,
    stepName: string,
    prerequisiteMsg: string
  ) => {
    if (isUnlocked) {
      onNavigateStep(targetScreen);
    } else {
      setLockedNotice(`${stepName} is locked: ${prerequisiteMsg}`);
      setTimeout(() => setLockedNotice(null), 3500);
    }
  };

  const isListeningCurrent = currentScreen === 'listening_practice';
  const isReadingCurrent = currentScreen === 'reading';
  const isTranslationCurrent = currentScreen === 'translation';
  const isAICurrent = currentScreen === 'ai_teacher';

  const isReadingUnlocked = isListeningDone || isReadingCurrent;
  const isTranslationUnlocked = isReadingDone || isTranslationCurrent;
  const isAIUnlocked = isTranslationDone || isAICurrent;

  return (
    <div className="w-full bg-[#F8FAF9] border-b border-[#E2E8E5] sticky top-16 md:top-20 z-30 shadow-xs">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-12 py-2 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Back to Curriculum */}
        <button
          onClick={onBackToCurriculum}
          className="group flex items-center gap-1 sm:gap-1.5 text-[#1B4D3E] hover:text-[#12382c] font-medium transition-colors cursor-pointer py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full bg-white hover:bg-[#E8F2EE] border border-[#E2E8E5] shadow-2xs shrink-0"
          title="Return to Curriculum Overview"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] group-hover:-translate-x-0.5 transition-transform text-[#1B4D3E]">
            arrow_back
          </span>
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold">
            Curriculum
          </span>
          <span className="text-[10px] text-[#6B7280] font-sans font-normal hidden lg:inline">
            (Day {dayNumber})
          </span>
        </button>

        {/* Center: The 4 Curriculum Workflow Steps */}
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] overflow-x-auto no-scrollbar py-0.5">
          {/* Step 1: Listening */}
          <button
            onClick={() => onNavigateStep('listening_practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isListeningCurrent
                ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                : isListeningDone
                ? 'bg-[#E8F2EE] text-[#1B4D3E] hover:bg-[#D9EAE3] font-semibold border border-[#1B4D3E]/20'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-white font-medium border border-transparent hover:border-[#E2E8E5]'
            }`}
            title="Step 1: Video Listening"
          >
            {isListeningCurrent ? (
              <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
            ) : isListeningDone ? (
              <span className="material-symbols-outlined text-[14px]">check</span>
            ) : null}
            <span>1. Listening</span>
          </button>

          <span className="text-[#CBD5E1] shrink-0">→</span>

          {/* Step 2: Reading */}
          <button
            onClick={() =>
              handleStepClick(
                'reading',
                isReadingUnlocked,
                'Step 2 (Reading)',
                'Please complete the video listening session first.'
              )
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isReadingCurrent
                ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                : isReadingDone
                ? 'bg-[#E8F2EE] text-[#1B4D3E] hover:bg-[#D9EAE3] font-semibold border border-[#1B4D3E]/20'
                : isReadingUnlocked
                ? 'text-[#4B5563] hover:text-[#111827] hover:bg-white font-medium border border-transparent hover:border-[#E2E8E5]'
                : 'text-[#9CA3AF] hover:text-[#6B7280]'
            }`}
            title="Step 2: Companion Reading Guide"
          >
            {isReadingCurrent ? (
              <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
            ) : isReadingDone ? (
              <span className="material-symbols-outlined text-[14px]">check</span>
            ) : !isReadingUnlocked ? (
              <span className="material-symbols-outlined text-[13px]">lock</span>
            ) : null}
            <span>2. Reading</span>
          </button>

          <span className="text-[#CBD5E1] shrink-0">→</span>

          {/* Step 3: Translation */}
          <button
            onClick={() =>
              handleStepClick(
                'translation',
                isTranslationUnlocked,
                'Step 3 (Translation)',
                'Please finish reading the companion guide first.'
              )
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isTranslationCurrent
                ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                : isTranslationDone
                ? 'bg-[#E8F2EE] text-[#1B4D3E] hover:bg-[#D9EAE3] font-semibold border border-[#1B4D3E]/20'
                : isTranslationUnlocked
                ? 'text-[#4B5563] hover:text-[#111827] hover:bg-white font-medium border border-transparent hover:border-[#E2E8E5]'
                : 'text-[#9CA3AF] hover:text-[#6B7280]'
            }`}
            title="Step 3: Hindi-English Translation Mastery"
          >
            {isTranslationCurrent ? (
              <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
            ) : isTranslationDone ? (
              <span className="material-symbols-outlined text-[14px]">check</span>
            ) : !isTranslationUnlocked ? (
              <span className="material-symbols-outlined text-[13px]">lock</span>
            ) : null}
            <span>3. Translation</span>
          </button>

          <span className="text-[#CBD5E1] shrink-0">→</span>

          {/* Step 4: AI Conversation */}
          <button
            onClick={() =>
              handleStepClick(
                'ai_teacher',
                isAIUnlocked,
                'Step 4 (AI Conversation)',
                'Please complete reading and translation practice first.'
              )
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isAICurrent
                ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                : isAIDone
                ? 'bg-[#E8F2EE] text-[#1B4D3E] hover:bg-[#D9EAE3] font-semibold border border-[#1B4D3E]/20'
                : isAIUnlocked
                ? 'text-[#4B5563] hover:text-[#111827] hover:bg-white font-medium border border-transparent hover:border-[#E2E8E5]'
                : 'text-[#9CA3AF] hover:text-[#6B7280]'
            }`}
            title="Step 4: Oral Fluency Conversation with AI Teacher"
          >
            {isAICurrent ? (
              <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
            ) : isAIDone ? (
              <span className="material-symbols-outlined text-[14px]">check</span>
            ) : !isAIUnlocked ? (
              <span className="material-symbols-outlined text-[13px]">lock</span>
            ) : null}
            <span>4. AI Conversation</span>
          </button>
        </div>

        {/* Right side helper (e.g. Translation sentence counter if on translation screen) */}
        {isTranslationCurrent && onOpenSentenceDirectory && (
          <button
            onClick={onOpenSentenceDirectory}
            className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] hover:bg-[#E8F2EE] border border-[#1B4D3E]/30 px-3 py-1.5 rounded-full hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer bg-white shadow-xs font-semibold shrink-0"
            title="Open sentence directory"
          >
            <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
            <span>{completedSentenceCount} / {totalSentenceCount}</span>
          </button>
        )}
      </div>

      {/* Temporary locked notice banner if clicked */}
      {lockedNotice && (
        <div className="bg-[#FEF3C7] border-t border-[#FCD34D] text-[#92400E] px-4 py-1.5 text-xs text-center font-medium animate-fade-in flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{lockedNotice}</span>
          <button
            onClick={() => setLockedNotice(null)}
            className="text-[#92400E] hover:text-[#78350F] ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
