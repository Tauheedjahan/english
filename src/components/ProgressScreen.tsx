import React, { useState } from 'react';
import { REPEATED_MISTAKES } from '../data/mockData';
import { MistakeItem } from '../types';
import { ReviewModal } from './ReviewModal';

interface ProgressScreenProps {
  currentDay?: number;
  onNavigateToDay?: (day: number) => void;
  onOpenAITeacher?: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  currentDay = 12,
  onNavigateToDay,
  onOpenAITeacher,
}) => {
  const [selectedMistake, setSelectedMistake] = useState<MistakeItem | null>(null);

  const percentComplete = Math.round((currentDay / 90) * 100);

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col min-h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
          Longitudinal Analytics
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-2">
          Curriculum Progression
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mb-3 md:mx-0 mx-auto"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA]">
          Continuous tracking across the 90-day natural fluency syllabus.
        </p>
      </div>

      {/* Top Banner: Current Journey & Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Current Journey */}
        <div className="md:col-span-8 bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 flex flex-col justify-between shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          <div>
            <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.3em] block mb-1">
              Active Syllabus Stage
            </span>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="font-serif italic text-[28px] md:text-[34px] font-light text-[#EFEFEF]">
                Day {currentDay < 10 ? `0${currentDay}` : currentDay} of 90
              </h2>
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]">
                {percentComplete}% Complete
              </span>
            </div>
          </div>

          <div>
            <div className="w-full bg-[#242424] h-[3px] overflow-hidden mb-3">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#777777]">
              <span>Foundation</span>
              <span>B1 Threshold</span>
              <span>C1 Spontaneous Command</span>
            </div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="md:col-span-4 bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 flex flex-col justify-between shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.3em]">
              Daily Cadence
            </span>
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#262010] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#D4AF37] text-base">
                local_fire_department
              </span>
            </div>
          </div>

          <div className="my-2">
            <h3 className="font-serif italic text-[36px] font-light text-[#EFEFEF] leading-tight">
              {currentDay} Consecutive Days
            </h3>
            <span className="inline-block mt-1 text-[9px] uppercase tracking-[0.25em] font-semibold px-2.5 py-0.5 border border-[#D4AF37]/40 bg-[#262010] text-[#D4AF37] rounded-full">
              Pristine Momentum
            </span>
          </div>

          <p className="font-sans text-[11px] text-[#777777]">
            Next distinction milestone unlocked at Day 14.
          </p>
        </div>
      </div>

      {/* Category Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {/* Speaking */}
        <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] mb-2">
            Speaking
          </span>
          <span className="font-serif italic text-3xl font-light text-[#EFEFEF] mb-3">74%</span>
          <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
            <div className="bg-[#D4AF37] h-full" style={{ width: '74%' }} />
          </div>
        </div>

        {/* Listening */}
        <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] mb-2">
            Listening
          </span>
          <span className="font-serif italic text-3xl font-light text-[#EFEFEF] mb-3">86%</span>
          <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
            <div className="bg-[#D4AF37] h-full" style={{ width: '86%' }} />
          </div>
        </div>

        {/* Reading */}
        <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] mb-2">
            Reading
          </span>
          <span className="font-serif italic text-3xl font-light text-[#EFEFEF] mb-3">89%</span>
          <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
            <div className="bg-[#D4AF37] h-full" style={{ width: '89%' }} />
          </div>
        </div>

        {/* Vocabulary */}
        <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-sm flex flex-col justify-between">
          <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] mb-2">
            Vocabulary
          </span>
          <span className="font-serif italic text-3xl font-light text-[#EFEFEF] mb-3">81%</span>
          <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
            <div className="bg-[#D4AF37] h-full" style={{ width: '81%' }} />
          </div>
        </div>

        {/* Grammar */}
        <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] mb-2">
            Grammar
          </span>
          <span className="font-serif italic text-3xl font-light text-[#EFEFEF] mb-3">72%</span>
          <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
            <div className="bg-[#D4AF37] h-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* Bento Grid: Insights vs Repeated Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Insights Card */}
        <div className="md:col-span-6 bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          <h3 className="font-serif italic text-[24px] font-light text-[#EFEFEF] mb-6">
            Linguistic Insights
          </h3>

          <div className="space-y-6">
            <div>
              <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] block mb-3">
                Established Competencies
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#68BA89] text-base mt-0.5">
                    check_circle
                  </span>
                  <p className="font-sans text-sm text-[#CCCCCC]">
                    Accelerated textual analysis and inference speed.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#68BA89] text-base mt-0.5">
                    check_circle
                  </span>
                  <p className="font-sans text-sm text-[#CCCCCC]">
                    Consistent retention of B1/B2 phrasal combinations.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A]">
              <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.25em] block mb-3">
                Targeted Remediation
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#D4AF37] text-base mt-0.5">
                    north_east
                  </span>
                  <p className="font-sans text-sm text-[#CCCCCC]">
                    Past perfect aspect during compound narratives.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#D4AF37] text-base mt-0.5">
                    north_east
                  </span>
                  <p className="font-sans text-sm text-[#CCCCCC]">
                    Voiced vs. unvoiced dental fricatives ("th" phonemes).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repeated Mistakes Card */}
        <div className="md:col-span-6 bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif italic text-[24px] font-light text-[#EFEFEF]">
                Syntactic Errors
              </h3>
              <span className="text-[9px] text-[#D4AF37] font-sans uppercase tracking-[0.25em] border border-[#D4AF37]/30 bg-[#262010] px-2.5 py-1 rounded-full">
                AI Tracking
              </span>
            </div>

            <div className="space-y-4">
              {REPEATED_MISTAKES.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141414] border border-[#2E2E2E] p-4 flex flex-col gap-2 transition-all hover:border-[#D4AF37]/50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif italic text-base font-normal text-[#EFEFEF]">
                      {item.title}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider text-[#888888] bg-[#1C1C1C] px-2 py-0.5 border border-[#333333]">
                      {item.category}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#AAAAAA]">
                    {item.details}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedMistake(item)}
                      className="text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      Review Micro-Lesson
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
            <span className="text-xs text-[#888888]">
              Target these errors in direct conversation
            </span>
            {onOpenAITeacher && (
              <button
                onClick={onOpenAITeacher}
                className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] hover:text-[#e0bd49] flex items-center gap-1.5 cursor-pointer"
              >
                Launch AI Dialogue
                <span className="material-symbols-outlined text-sm">psychology</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Review Modal */}
      <ReviewModal
        mistake={selectedMistake}
        onClose={() => setSelectedMistake(null)}
      />
    </main>
  );
};
