import React from 'react';
import { DayProgress } from '../types';

interface HomeScreenProps {
  day1Completed: boolean;
  dayProgress?: DayProgress;
  score?: number;
  onStartDay: (day: number) => void;
  onToggleDemoState?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  day1Completed,
  dayProgress,
  score = 94,
  onStartDay,
  onToggleDemoState,
}) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-12 py-8 md:py-12 w-full max-w-[1200px] mx-auto min-h-[calc(100vh-160px)]">
      {/* State Toggle for demo/reviewing both states */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={onToggleDemoState}
          className="text-[10px] uppercase tracking-[0.25em] text-[#AAAAAA] hover:text-[#D4AF37] bg-[#1A1A1A] hover:bg-[#222222] px-4 py-2 rounded-full border border-[#333333] hover:border-[#D4AF37]/50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">swap_horiz</span>
          Switch View: {day1Completed ? 'Initial Day 1' : 'Completed Day 1'}
        </button>
      </div>

      {!day1Completed ? (
        /* SCREEN 1: Day 1 Initial State */
        <section className="w-full max-w-2xl text-center flex flex-col items-center justify-center gap-8 animate-fade-in">
          <div className="space-y-3 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.45em] text-[#888888] font-light">
              Curriculum 01 // 90-Day Fluency
            </div>
            <h1 className="font-serif italic text-[36px] md:text-[50px] md:leading-[1.1] font-light text-[#EFEFEF] max-w-xl mx-auto">
              The Path to Spoken Fluency
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37] my-1"></div>
            <p className="font-sans text-[15px] md:text-[16px] leading-relaxed text-[#AAAAAA] max-w-md mx-auto">
              Master English through our sequential 4-step workflow: Video, Reading, 41 Translations, and Spoken AI Conversation.
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] p-8 md:p-10 w-full shadow-[0px_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] uppercase tracking-[0.35em] font-medium px-3.5 py-1 rounded-full bg-[#D4AF37]/5">
                Current Active Phase
              </span>
              <h2 className="font-serif italic text-[32px] md:text-[38px] leading-tight font-light text-[#EFEFEF]">
                Day 01
              </h2>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#888888]">
                Theme: Morning Routines & Atomic Habits
              </span>
            </div>

            {/* Workflow steps breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-2 text-[10px] uppercase tracking-[0.15em]">
              <div className="p-2.5 bg-[#141414] border border-[#262626] flex flex-col items-center gap-1 text-[#CCCCCC]">
                <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">play_circle</span>
                <span>1. Listening</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#262626] flex flex-col items-center gap-1 text-[#CCCCCC]">
                <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">picture_as_pdf</span>
                <span>2. Reading</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#262626] flex flex-col items-center gap-1 text-[#CCCCCC]">
                <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">translate</span>
                <span>3. 41 Sentences</span>
              </div>
              <div className="p-2.5 bg-[#141414] border border-[#262626] flex flex-col items-center gap-1 text-[#CCCCCC]">
                <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">forum</span>
                <span>4. AI Chat</span>
              </div>
            </div>

            {/* Begin Day 1 Button (Opens Listening section) */}
            <button
              onClick={() => onStartDay(1)}
              className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] w-full sm:w-auto cursor-pointer shadow-[0px_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0px_6px_30px_rgba(212,175,55,0.4)]"
            >
              Begin Day 1
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="w-full max-w-md flex flex-col gap-2">
            <div className="flex justify-between items-center font-sans text-[10px] uppercase tracking-[0.25em] text-[#888888]">
              <span>Curriculum Progress</span>
              <span className="text-[#D4AF37]">0 / 90 Days Completed</span>
            </div>
            <div className="w-full bg-[#1E1E1E] h-[3px] border border-[#282828] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000 ease-out"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </section>
      ) : (
        /* SCREEN 2: Day 1 Completed Dashboard */
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8 animate-fade-in">
          {/* Success Indicator */}
          <div className="inline-flex items-center justify-center border border-[#68BA89]/60 bg-[#16241b] text-[#68BA89] px-6 py-2.5 rounded-full gap-2.5 shadow-[0px_4px_20px_rgba(104,186,137,0.15)]">
            <span className="material-symbols-outlined text-[22px] text-[#68BA89]">
              verified
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold text-[#68BA89]">
              Day 01 Complete (100%)
            </span>
          </div>

          {/* Score Display */}
          <div className="mb-2 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.35em] text-[#888888] mb-2 font-light">
              Proficiency Metric
            </div>
            <h1 className="font-serif italic text-[56px] md:text-[68px] leading-tight font-light text-[#EFEFEF]">
              {score} <span className="text-[#666666] font-serif text-[28px] md:text-[34px] font-light">/ 100</span>
            </h1>
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#AAAAAA] mt-1">
              Overall Day 1 Mastery Score
            </p>
            <div className="w-16 h-[1px] bg-[#D4AF37] mt-4"></div>
          </div>

          {/* 4 Completed Steps Verification Box */}
          <div className="w-full bg-[#1A1A1A] border border-[#333333] p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.4)] text-left">
            <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-semibold">
              Completed Learning Steps:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#EFEFEF] bg-[#141414] p-3 border border-[#282828]">
                <span className="material-symbols-outlined text-[#68BA89] text-[18px]">check_circle</span>
                <span>1. YouTube Video Analyzed</span>
              </div>
              <div className="flex items-center gap-2 text-[#EFEFEF] bg-[#141414] p-3 border border-[#282828]">
                <span className="material-symbols-outlined text-[#68BA89] text-[18px]">check_circle</span>
                <span>2. The 6:00 AM Architect Read</span>
              </div>
              <div className="flex items-center gap-2 text-[#EFEFEF] bg-[#141414] p-3 border border-[#282828]">
                <span className="material-symbols-outlined text-[#68BA89] text-[18px]">check_circle</span>
                <span>3. 41 / 41 Translations Mastered</span>
              </div>
              <div className="flex items-center gap-2 text-[#EFEFEF] bg-[#141414] p-3 border border-[#282828]">
                <span className="material-symbols-outlined text-[#68BA89] text-[18px]">check_circle</span>
                <span>4. AI Spoken Conversation Complete</span>
              </div>
            </div>
          </div>

          {/* AI Feedback Card */}
          <div className="w-full bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 text-left flex flex-col sm:flex-row gap-5 items-start shadow-[0px_8px_32px_rgba(0,0,0,0.4)]">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#888888]">
                Instructor Evaluation
              </div>
              <h3 className="font-serif italic text-[22px] font-normal text-[#EFEFEF]">
                Linguistic Feedback
              </h3>
              <p className="font-serif italic text-[16px] text-[#CCCCCC] leading-relaxed border-l-2 border-[#D4AF37] pl-4 py-1">
                "Outstanding work completing Day 1! Your translations for habitual structures were precise, and your spoken conversation incorporated today's key phrasal verbs with natural confidence."
              </p>
            </div>
          </div>

          {/* Next Milestone: Day 02 UNLOCKED */}
          <div className="mt-2 w-full flex flex-col items-center gap-5 pt-6 border-t border-[#333333]">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              Unlocked Next Milestone
            </div>
            <h2 className="font-serif italic text-[30px] md:text-[36px] leading-tight font-light text-[#EFEFEF]">
              Day 02 // Expanding Descriptions & Daily Commute
            </h2>
            <button
              onClick={() => onStartDay(2)}
              className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0px_4px_24px_rgba(212,175,55,0.3)] group"
            >
              Begin Day 2
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
