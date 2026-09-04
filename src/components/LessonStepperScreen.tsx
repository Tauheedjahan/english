import React, { useState } from 'react';
import { LessonStep } from '../types';

interface LessonStepperScreenProps {
  steps: LessonStep[];
  completedSentenceCount: number;
  onOpenListeningPractice: () => void;
  onOpenReadingPractice: () => void;
  onOpenTranslationPractice: () => void;
  onOpenAIConversation: () => void;
  onBackToHome: () => void;
}

export const LessonStepperScreen: React.FC<LessonStepperScreenProps> = ({
  steps,
  completedSentenceCount,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenTranslationPractice,
  onOpenAIConversation,
  onBackToHome,
}) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const handleStepClick = (step: LessonStep) => {
    setActiveStepId(step.id);
    if (!step.locked) {
      if (step.id === 1) onOpenListeningPractice();
      else if (step.id === 2) onOpenReadingPractice();
      else if (step.id === 3) onOpenTranslationPractice();
      else if (step.id === 4) onOpenAIConversation();
    }
  };

  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-160px)]">
      {/* Breadcrumb */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-[#888888] hover:text-[#D4AF37] transition-colors text-[10px] uppercase tracking-[0.25em] font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Curriculum Overview
        </button>
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] bg-[#262010] px-3 py-1 rounded-full border border-[#D4AF37]/40">
          Module 01 // Daily Habits Workflow
        </span>
      </div>

      {/* Lesson Header */}
      <div className="w-full max-w-3xl mb-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
          Structured Daily Architecture
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-3">
          Day 01: Morning Routines & Habit Loops
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-3"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA]">
          Complete each step in sequence: Listening → Reading → 41 Translation Sentences → AI Conversation.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="w-full max-w-3xl bg-[#1A1A1A] border border-[#333333] p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
        {/* Left Side: Stepper List */}
        <div className="flex-shrink-0 w-full md:w-68 border-b md:border-b-0 md:border-r border-[#333333] pb-6 md:pb-0 md:pr-6">
          <div className="flex flex-col relative space-y-4">
            {steps.map((step) => {
              const isActive = step.id === activeStepId;
              const isDone = step.completed;
              const isLocked = step.locked;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  className={`relative flex items-center gap-3.5 z-10 group cursor-pointer transition-all p-2 rounded ${
                    isActive ? 'bg-[#222222] border-l-2 border-[#D4AF37]' : ''
                  } ${isLocked ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif italic text-[13px] transition-all shrink-0 ${
                      isDone
                        ? 'bg-[#18261D] text-[#68BA89] border border-[#68BA89]/60'
                        : isActive
                        ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37] shadow-[0px_0px_10px_rgba(212,175,55,0.3)]'
                        : isLocked
                        ? 'bg-[#141414] border border-[#333333] text-[#555555]'
                        : 'bg-[#1A1A1A] border border-[#444444] text-[#888888]'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-[16px] text-[#68BA89]">
                        check
                      </span>
                    ) : isLocked ? (
                      <span className="material-symbols-outlined text-[14px] text-[#555555]">
                        lock
                      </span>
                    ) : (
                      step.id
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#777777]">
                        Step 0{step.id}
                      </span>
                      {step.id === 3 && (
                        <span className="text-[9px] text-[#D4AF37] font-mono font-semibold">
                          ({completedSentenceCount}/41)
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[12px] tracking-wide ${
                        isActive
                          ? 'text-[#EFEFEF] font-serif italic font-medium'
                          : isLocked
                          ? 'text-[#666666]'
                          : 'text-[#AAAAAA]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Step Detail & Action */}
        <div className="flex-grow flex flex-col justify-center min-h-[360px] text-center p-2">
          {activeStepId === 1 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37]">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#888888] mb-1">
                Step 1 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#EFEFEF] mb-2">
                YouTube Listening Experience
              </h2>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-6">
                Watch the curated YouTube video on morning routines and habit loops. Discover essential phrasal verbs and temporal expressions.
              </p>
              <button
                onClick={onOpenListeningPractice}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(212,175,55,0.25)] flex items-center gap-2 cursor-pointer group"
              >
                Open Listening Section
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {activeStepId === 2 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37]">
                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#888888] mb-1">
                Step 2 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#EFEFEF] mb-2">
                The 6:00 AM Architect (PDF Guide)
              </h2>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-6">
                Read the companion chapter connected to the video topic. Includes parallel Hindi translations and phrasal verb deep dives.
              </p>
              <button
                onClick={onOpenReadingPractice}
                disabled={steps[1].locked}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group ${
                  steps[1].locked
                    ? 'bg-[#222222] text-[#666666] cursor-not-allowed border border-[#333333]'
                    : 'bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] shadow-[0px_4px_20px_rgba(212,175,55,0.25)]'
                }`}
              >
                {steps[1].locked ? 'Locked (Finish Step 1 First)' : 'Open Reading Section'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {activeStepId === 3 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37]">
                <span className="material-symbols-outlined text-3xl">translate</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#888888] mb-1">
                Step 3 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#EFEFEF] mb-2">
                41 Translation Sentences
              </h2>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-6">
                Practice 41 daily routine sentences one by one with hints, speech recognition, and instant correctness evaluation.
              </p>
              <button
                onClick={onOpenTranslationPractice}
                disabled={steps[2].locked}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group ${
                  steps[2].locked
                    ? 'bg-[#222222] text-[#666666] cursor-not-allowed border border-[#333333]'
                    : 'bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] shadow-[0px_4px_20px_rgba(212,175,55,0.25)]'
                }`}
              >
                {steps[2].locked ? 'Locked (Finish Step 2 First)' : 'Start Translation (41)'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {activeStepId === 4 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-4 text-[#D4AF37]">
                <span className="material-symbols-outlined text-3xl">record_voice_over</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#888888] mb-1">
                Step 4 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#EFEFEF] mb-2">
                AI Conversation Practice
              </h2>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-6">
                Converse with your AI tutor using the video and reading concepts. Receive instant syntactic corrections and spoken feedback.
              </p>
              <button
                onClick={onOpenAIConversation}
                disabled={steps[3].locked}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group ${
                  steps[3].locked
                    ? 'bg-[#222222] text-[#666666] cursor-not-allowed border border-[#333333]'
                    : 'bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] shadow-[0px_4px_20px_rgba(212,175,55,0.25)]'
                }`}
              >
                {steps[3].locked ? 'Locked (Complete All 41 Translations First)' : 'Enter AI Conversation'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
