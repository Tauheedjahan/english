import React from 'react';

interface SpeakingFeedbackScreenProps {
  onContinue: () => void;
  onBackToOverview?: () => void;
}

export const SpeakingFeedbackScreen: React.FC<SpeakingFeedbackScreenProps> = ({
  onContinue,
  onBackToOverview,
}) => {
  const score = 76;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-160px)] bg-white text-[#111827]">
      {/* Back button */}
      {onBackToOverview && (
        <div className="w-full flex items-center justify-start mb-6">
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1B4D3E] transition-colors text-[10px] uppercase tracking-[0.25em] font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Lesson Module
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="w-full text-center md:text-left mb-8 md:mb-10">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#1B4D3E] mb-2 font-bold">
          Acoustic & Syntactic Analysis
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-medium text-[#111827] mb-3">
          Speaking Evaluation
        </h1>
        <div className="w-12 h-[2px] bg-[#1B4D3E] mb-3 md:mx-0 mx-auto"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#4B5563] max-w-2xl">
          Detailed assessment of oral cadence, lexical precision, and prepositional accuracy.
        </p>
      </div>

      {/* Bento Grid: Overall Score & Detailed Metrics */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Overall Score Radial Card */}
        <div className="md:col-span-5 bg-white border border-[#E2E8E5] p-8 flex flex-col items-center justify-center text-center shadow-xs rounded-sm">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#6B7280] mb-6 font-bold">
            Composite Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#1B4D3E"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-serif italic text-4xl font-light text-[#111827]">{score}</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-semibold">/ 100</span>
            </div>
          </div>

          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#6B7280] font-medium">
            Derived across 4 Core Rubrics
          </span>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Grammar */}
          <div className="bg-white border border-[#E2E8E5] p-6 flex flex-col justify-between shadow-xs rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.25em]">
                Grammar
              </span>
              <span className="font-serif italic text-2xl text-[#111827]">72%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-1000"
                style={{ width: '72%' }}
              />
            </div>
          </div>

          {/* Vocabulary */}
          <div className="bg-white border border-[#E2E8E5] p-6 flex flex-col justify-between shadow-xs rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.25em]">
                Vocabulary
              </span>
              <span className="font-serif italic text-2xl text-[#111827]">81%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-1000"
                style={{ width: '81%' }}
              />
            </div>
          </div>

          {/* Fluency */}
          <div className="bg-white border border-[#E2E8E5] p-6 flex flex-col justify-between shadow-xs rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.25em]">
                Fluency
              </span>
              <span className="font-serif italic text-2xl text-[#111827]">68%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-1000"
                style={{ width: '68%' }}
              />
            </div>
          </div>

          {/* Structure */}
          <div className="bg-white border border-[#E2E8E5] p-6 flex flex-col justify-between shadow-xs rounded-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.25em]">
                Structure
              </span>
              <span className="font-serif italic text-2xl text-[#111827]">78%</span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-1000"
                style={{ width: '78%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mistake to Remember Card */}
      <div className="w-full bg-white border border-[#E2E8E5] p-6 md:p-8 mb-8 shadow-xs rounded-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="material-symbols-outlined text-[#B45309] text-2xl">
            warning
          </span>
          <h2 className="font-serif italic text-[24px] font-medium text-[#111827]">
            Critical Correction
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* What you said */}
          <div className="bg-[#FEE2E2] border border-[#EF4444]/30 p-4 flex items-start gap-4 rounded-xs">
            <span className="material-symbols-outlined text-[#DC2626] shrink-0 mt-0.5 text-lg">
              cancel
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#DC2626] mb-1">
                Your Utterance
              </span>
              <p className="font-serif italic text-base text-[#991B1B] line-through">
                "I am looking forward to see you tomorrow."
              </p>
            </div>
          </div>

          {/* Correction */}
          <div className="bg-[#E8F2EE] border border-[#1B4D3E]/30 p-4 flex items-start gap-4 rounded-xs">
            <span className="material-symbols-outlined text-[#1B4D3E] shrink-0 mt-0.5 text-lg">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#1B4D3E] mb-1">
                Idiomatic Form
              </span>
              <p className="font-serif italic text-base text-[#111827]">
                "I am looking forward to <span className="text-[#1B4D3E] font-bold underline underline-offset-4">seeing</span> you tomorrow."
              </p>
            </div>
          </div>

          {/* Grammar Rule Explanation */}
          <div className="bg-[#F8FAF9] p-4 border border-[#E2E8E5] rounded-xs">
            <p className="font-sans text-[13px] leading-relaxed text-[#4B5563]">
              <strong className="text-[#1B4D3E] font-bold tracking-wide uppercase text-[11px] mr-2">Rule:</strong>
              The phrase "look forward to" is a phrasal-prepositional verb. The "to" serves strictly as a preposition rather than an infinitive particle, necessitating a gerund (-ing form) or noun complement.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher's Note Card */}
      <div className="w-full bg-white border border-[#E2E8E5] p-6 md:p-8 mb-10 flex flex-col sm:flex-row gap-6 items-start shadow-xs rounded-sm">
        <div className="w-12 h-12 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] text-[#1B4D3E] flex items-center justify-center font-serif italic text-xl font-bold shrink-0">
          T
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-[9px] uppercase tracking-[0.3em] text-[#6B7280] font-bold">
            Instructor Synthesis
          </div>
          <h3 className="font-serif italic text-[22px] font-medium text-[#111827]">
            Teacher's Note
          </h3>
          <p className="font-serif italic text-base md:text-lg leading-relaxed text-[#374151] border-l-2 border-[#1B4D3E] pl-4 py-1">
            "Your lexical breadth is expanding gracefully. In upcoming sessions, introduce slight pacing pauses before prepositional clauses to solidify grammatical precision."
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="w-full flex justify-center md:justify-end">
        <button
          onClick={onContinue}
          className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xs cursor-pointer group rounded-sm"
        >
          Continue to Reading
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </main>
  );
};
