import React from 'react';
import { DayProgress, DayRecord } from '../types';

interface HomeScreenProps {
  dayNumber?: number;
  topic?: string;
  activeDay?: DayRecord;
  day1Completed: boolean;
  dayProgress?: DayProgress;
  score?: number;
  onStartDay: (day: number) => void;
  onToggleDemoState?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  dayNumber = 1,
  topic = 'Morning Routines & Habit Loops',
  activeDay,
  day1Completed,
  dayProgress,
  score = 94,
  onStartDay,
  onToggleDemoState,
}) => {
  const displayTopic = activeDay?.topic || topic || 'Morning Routines & Habit Loops';
  const formattedDayNumber = dayNumber.toString().padStart(2, '0');
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-12 py-8 md:py-12 w-full max-w-[1200px] mx-auto min-h-[calc(100vh-160px)] bg-white text-[#111827]">
      {/* State Toggle for demo/reviewing both states */}
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={onToggleDemoState}
          className="text-[10px] uppercase tracking-[0.2em] text-[#4B5563] hover:text-[#1B4D3E] bg-white hover:bg-[#F8FAF9] px-4 py-2 rounded-full border border-[#E2E8E5] hover:border-[#1B4D3E]/50 flex items-center gap-2 transition-all cursor-pointer shadow-xs font-medium"
        >
          <span className="material-symbols-outlined text-[16px] text-[#1B4D3E]">swap_horiz</span>
          Switch View: {day1Completed ? 'Initial Day 1' : 'Completed Day 1'}
        </button>
      </div>

      {!day1Completed ? (
        /* SCREEN 1: Day 1 Initial State */
        <section className="w-full max-w-2xl text-center flex flex-col items-center justify-center gap-8 animate-fade-in">
          <div className="space-y-3 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#1B4D3E] font-bold">
              Curriculum 01 // 90-Day Fluency
            </div>
            <h1 className="font-serif italic text-[36px] md:text-[50px] md:leading-[1.1] font-light text-[#111827] max-w-xl mx-auto">
              The Path to Spoken Fluency
            </h1>
            <div className="w-12 h-[2px] bg-[#1B4D3E] my-1"></div>
            <p className="font-sans text-[15px] md:text-[16px] leading-relaxed text-[#4B5563] max-w-md mx-auto">
              Master English through our sequential 4-step workflow: Video, Reading, 41 Translations, and Spoken AI Conversation.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8E5] p-8 md:p-10 w-full shadow-[0px_12px_36px_rgba(27,77,62,0.06)] flex flex-col items-center gap-6 relative overflow-hidden rounded-sm">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#1B4D3E]"></div>

            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-[#1B4D3E] border border-[#1B4D3E]/30 text-[9px] uppercase tracking-[0.3em] font-bold px-3.5 py-1 rounded-full bg-[#E8F2EE]">
                Current Active Phase
              </span>
              <h2 className="font-serif italic text-[30px] md:text-[36px] leading-tight font-medium text-[#111827] max-w-lg">
                Day {formattedDayNumber}: {displayTopic}
              </h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#4B5563] font-medium">
                Theme: {displayTopic}
              </span>
            </div>

            {/* Workflow steps breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full pt-2 text-[10px] uppercase tracking-[0.15em]">
              <div className="p-3 bg-[#F8FAF9] border border-[#E2E8E5] flex flex-col items-center gap-1.5 text-[#1F2937] font-medium rounded-sm">
                <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">play_circle</span>
                <span>1. Listening</span>
              </div>
              <div className="p-3 bg-[#F8FAF9] border border-[#E2E8E5] flex flex-col items-center gap-1.5 text-[#1F2937] font-medium rounded-sm">
                <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">picture_as_pdf</span>
                <span>2. Reading</span>
              </div>
              <div className="p-3 bg-[#F8FAF9] border border-[#E2E8E5] flex flex-col items-center gap-1.5 text-[#1F2937] font-medium rounded-sm">
                <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">translate</span>
                <span>3. Sentences</span>
              </div>
              <div className="p-3 bg-[#F8FAF9] border border-[#E2E8E5] flex flex-col items-center gap-1.5 text-[#1F2937] font-medium rounded-sm">
                <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">forum</span>
                <span>4. AI Chat</span>
              </div>
            </div>

            {/* Begin Day Button */}
            <button
              onClick={() => onStartDay(dayNumber)}
              className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] w-full sm:w-auto cursor-pointer shadow-[0px_4px_20px_rgba(27,77,62,0.25)] hover:shadow-[0px_6px_28px_rgba(27,77,62,0.35)] rounded-sm"
            >
              Begin Day {dayNumber}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="w-full max-w-md flex flex-col gap-2">
            <div className="flex justify-between items-center font-sans text-[10px] uppercase tracking-[0.2em] text-[#4B5563] font-medium">
              <span>Curriculum Progress</span>
              <span className="text-[#1B4D3E] font-bold">0 / 90 Days Completed</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[4px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-1000 ease-out"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </section>
      ) : (
        /* SCREEN 2: Day 1 Completed Dashboard */
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8 animate-fade-in">
          {/* Success Indicator */}
          <div className="inline-flex items-center justify-center border border-[#1B4D3E]/30 bg-[#E8F2EE] text-[#1B4D3E] px-6 py-2.5 rounded-full gap-2.5 shadow-xs">
            <span className="material-symbols-outlined text-[22px] text-[#1B4D3E]">
              verified
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-bold text-[#1B4D3E]">
              Day {formattedDayNumber}: {displayTopic} Complete (100%)
            </span>
          </div>

          {/* Score Display */}
          <div className="mb-2 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#6B7280] mb-2 font-medium">
              Proficiency Metric
            </div>
            <h1 className="font-serif italic text-[56px] md:text-[68px] leading-tight font-light text-[#111827]">
              {score} <span className="text-[#9CA3AF] font-serif text-[28px] md:text-[34px] font-light">/ 100</span>
            </h1>
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#4B5563] mt-1 font-medium">
              Overall Day {dayNumber} Mastery Score
            </p>
            <div className="w-16 h-[2px] bg-[#1B4D3E] mt-4"></div>
          </div>

          {/* 4 Completed Steps Verification Box */}
          <div className="w-full bg-white border border-[#E2E8E5] p-6 shadow-[0px_8px_28px_rgba(27,77,62,0.05)] text-left rounded-sm">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#1B4D3E] mb-3 font-bold">
              Completed Learning Steps:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#111827] bg-[#F8FAF9] p-3 border border-[#E2E8E5] rounded-sm font-medium">
                <span className="material-symbols-outlined text-[#1B4D3E] text-[18px]">check_circle</span>
                <span className="truncate">1. {activeDay?.youtube_title || 'Video Listening Analyzed'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827] bg-[#F8FAF9] p-3 border border-[#E2E8E5] rounded-sm font-medium">
                <span className="material-symbols-outlined text-[#1B4D3E] text-[18px]">check_circle</span>
                <span className="truncate">2. {activeDay?.reading_heading || 'Companion Reading Completed'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827] bg-[#F8FAF9] p-3 border border-[#E2E8E5] rounded-sm font-medium">
                <span className="material-symbols-outlined text-[#1B4D3E] text-[18px]">check_circle</span>
                <span>3. Translation Sentences Mastered</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#111827] bg-[#F8FAF9] p-3 border border-[#E2E8E5] rounded-sm font-medium">
                <span className="material-symbols-outlined text-[#1B4D3E] text-[18px]">check_circle</span>
                <span>4. AI Spoken Conversation Complete</span>
              </div>
            </div>
          </div>

          {/* AI Feedback Card */}
          <div className="w-full bg-white border border-[#E2E8E5] p-6 md:p-8 text-left flex flex-col sm:flex-row gap-5 items-start shadow-[0px_8px_28px_rgba(27,77,62,0.05)] rounded-sm">
            <div className="w-12 h-12 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] flex items-center justify-center shrink-0 text-[#1B4D3E]">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#6B7280] font-medium">
                Instructor Evaluation
              </div>
              <h3 className="font-serif italic text-[22px] font-normal text-[#111827]">
                Linguistic Feedback
              </h3>
              <p className="font-serif italic text-[16px] text-[#374151] leading-relaxed border-l-2 border-[#1B4D3E] pl-4 py-1">
                "Outstanding work completing Day 1! Your translations for habitual structures were precise, and your spoken conversation incorporated today's key phrasal verbs with natural confidence."
              </p>
            </div>
          </div>

          {/* Next Milestone: Day 02 UNLOCKED */}
          <div className="mt-2 w-full flex flex-col items-center gap-5 pt-6 border-t border-[#E2E8E5]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#1B4D3E] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              Unlocked Next Milestone
            </div>
            <h2 className="font-serif italic text-[30px] md:text-[36px] leading-tight font-light text-[#111827]">
              Day 02 // Expanding Descriptions & Daily Commute
            </h2>
            <button
              onClick={() => onStartDay(2)}
              className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0px_4px_24px_rgba(27,77,62,0.25)] group rounded-sm"
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
