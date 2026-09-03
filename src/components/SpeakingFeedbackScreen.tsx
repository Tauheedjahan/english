import React from 'react';

interface SpeakingFeedbackScreenProps {
  onContinue: () => void;
  onBackToOverview?: () => void;
}

export const SpeakingFeedbackScreen: React.FC<SpeakingFeedbackScreenProps> = ({
  onContinue,
  onBackToOverview,
}) => {
  // Score: 76/100, radius = 54, circumference = 2 * PI * 54 = ~339.29
  const score = 76;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-160px)]">
      {/* Back button */}
      {onBackToOverview && (
        <div className="w-full flex items-center justify-start mb-6">
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-2 text-[#888888] hover:text-[#D4AF37] transition-colors text-[10px] uppercase tracking-[0.25em] font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Lesson Module
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="w-full text-center md:text-left mb-8 md:mb-10">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
          Acoustic & Syntactic Analysis
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-3">
          Speaking Evaluation
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mb-3 md:mx-0 mx-auto"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA] max-w-2xl">
          Detailed assessment of oral cadence, lexical precision, and prepositional accuracy.
        </p>
      </div>

      {/* Bento Grid: Overall Score & Detailed Metrics */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Overall Score Radial Card */}
        <div className="md:col-span-5 bg-[#1A1A1A] border border-[#333333] p-8 flex flex-col items-center justify-center text-center shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#888888] mb-6">
            Composite Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#2A2A2A"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#D4AF37"
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-serif italic text-4xl font-light text-[#EFEFEF]">{score}</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#777777]">/ 100</span>
            </div>
          </div>

          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#888888]">
            Derived across 4 Core Rubrics
          </span>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Grammar */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.25em]">
                Grammar
              </span>
              <span className="font-serif italic text-2xl text-[#EFEFEF]">72%</span>
            </div>
            <div className="w-full bg-[#262626] h-[3px] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000"
                style={{ width: '72%' }}
              />
            </div>
          </div>

          {/* Vocabulary */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.25em]">
                Vocabulary
              </span>
              <span className="font-serif italic text-2xl text-[#EFEFEF]">81%</span>
            </div>
            <div className="w-full bg-[#262626] h-[3px] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000"
                style={{ width: '81%' }}
              />
            </div>
          </div>

          {/* Fluency */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.25em]">
                Fluency
              </span>
              <span className="font-serif italic text-2xl text-[#EFEFEF]">68%</span>
            </div>
            <div className="w-full bg-[#262626] h-[3px] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000"
                style={{ width: '68%' }}
              />
            </div>
          </div>

          {/* Structure */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-sans text-[10px] font-semibold text-[#888888] uppercase tracking-[0.25em]">
                Structure
              </span>
              <span className="font-serif italic text-2xl text-[#EFEFEF]">78%</span>
            </div>
            <div className="w-full bg-[#262626] h-[3px] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000"
                style={{ width: '78%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mistake to Remember Card */}
      <div className="w-full bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 mb-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="material-symbols-outlined text-[#D4AF37] text-2xl">
            warning
          </span>
          <h2 className="font-serif italic text-[24px] font-light text-[#EFEFEF]">
            Critical Correction
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* What you said */}
          <div className="bg-[#241717] border border-[#482828] p-4 flex items-start gap-4">
            <span className="material-symbols-outlined text-[#E07A7A] shrink-0 mt-0.5 text-lg">
              cancel
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E07A7A] mb-1">
                Your Utterance
              </span>
              <p className="font-serif italic text-base text-[#DDAAAA] line-through opacity-80">
                "I am looking forward to see you tomorrow."
              </p>
            </div>
          </div>

          {/* Correction */}
          <div className="bg-[#19241B] border border-[#2B4B32] p-4 flex items-start gap-4">
            <span className="material-symbols-outlined text-[#68BA89] shrink-0 mt-0.5 text-lg">
              check_circle
            </span>
            <div className="flex flex-col">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#68BA89] mb-1">
                Idiomatic Form
              </span>
              <p className="font-serif italic text-base text-[#EFEFEF]">
                "I am looking forward to <span className="text-[#D4AF37] font-semibold underline underline-offset-4">seeing</span> you tomorrow."
              </p>
            </div>
          </div>

          {/* Grammar Rule Explanation */}
          <div className="bg-[#141414] p-4 border border-[#2B2B2B]">
            <p className="font-sans text-[13px] leading-relaxed text-[#AAAAAA]">
              <strong className="text-[#D4AF37] font-semibold tracking-wide uppercase text-[11px] mr-2">Rule:</strong>
              The phrase "look forward to" is a phrasal-prepositional verb. The "to" serves strictly as a preposition rather than an infinitive particle, necessitating a gerund (-ing form) or noun complement.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher's Note Card */}
      <div className="w-full bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 mb-10 flex flex-col sm:flex-row gap-6 items-start shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif italic text-xl shrink-0">
          T
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-[9px] uppercase tracking-[0.3em] text-[#888888]">
            Instructor Synthesis
          </div>
          <h3 className="font-serif italic text-[22px] font-light text-[#EFEFEF]">
            Teacher's Note
          </h3>
          <p className="font-serif italic text-base md:text-lg leading-relaxed text-[#CCCCCC] border-l-2 border-[#D4AF37] pl-4 py-1">
            "Your lexical breadth is expanding gracefully. In upcoming sessions, introduce slight pacing pauses before prepositional clauses to solidify grammatical precision."
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="w-full flex justify-center md:justify-end">
        <button
          onClick={onContinue}
          className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0px_4px_24px_rgba(212,175,55,0.25)] cursor-pointer group"
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
