import React, { useState } from 'react';
import { LessonStep } from '../types';

interface LessonStepperScreenProps {
  steps: LessonStep[];
  onOpenListeningPractice: () => void;
  onOpenReadingPractice: () => void;
  onOpenSpeakingFeedback: () => void;
  onBackToHome: () => void;
}

export const LessonStepperScreen: React.FC<LessonStepperScreenProps> = ({
  steps,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenSpeakingFeedback,
  onBackToHome,
}) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState('0:00');

  const toggleMiniAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      setAudioCurrentTime('0:42');
    }
  };

  const handleStepClick = (step: LessonStep) => {
    // If not locked or if it's the active one
    setActiveStepId(step.id);
    if (step.type === 'reading') {
      onOpenReadingPractice();
    } else if (step.type === 'speaking') {
      onOpenSpeakingFeedback();
    }
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-160px)]">
      {/* Breadcrumb / Back button */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-[#888888] hover:text-[#D4AF37] transition-colors text-[10px] uppercase tracking-[0.25em] font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Curriculum Overview
        </button>
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] bg-[#262010] px-3 py-1 rounded-full border border-[#D4AF37]/40">
          Module 01 // Daily Routine
        </span>
      </div>

      {/* Lesson Header */}
      <div className="w-full max-w-3xl mb-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
          Lesson Architecture
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-3">
          Day 01: The Morning Routine
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-3"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA]">
          Follow each curated module sequentially to master natural cadence and usage.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="w-full max-w-3xl bg-[#1A1A1A] border border-[#333333] p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
        {/* Left Side: Stepper List */}
        <div className="flex-shrink-0 w-full md:w-64 border-b md:border-b-0 md:border-r border-[#333333] pb-6 md:pb-0 md:pr-6">
          <div className="flex flex-col relative">
            {/* Progress Line (Background) */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-[#2A2A2A] z-0" />

            {steps.map((step) => {
              const isActive = step.id === activeStepId;
              const isDone = step.completed;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  className={`relative flex items-center gap-4 mb-3.5 z-10 group cursor-pointer transition-all ${
                    !isActive && !isDone ? 'opacity-50 hover:opacity-80' : 'opacity-100'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif italic text-[13px] transition-all ${
                      isActive
                        ? 'bg-[#262010] text-[#D4AF37] border border-[#D4AF37] shadow-[0px_0px_12px_rgba(212,175,55,0.3)]'
                        : isDone
                        ? 'bg-[#18261D] text-[#68BA89] border border-[#68BA89]/50'
                        : 'bg-[#141414] border border-[#333333] text-[#666666]'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-[16px] text-[#68BA89]">
                        check
                      </span>
                    ) : (
                      step.id < 10 ? `0${step.id}` : step.id
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#777777]">
                      {step.number}
                    </span>
                    <span
                      className={`text-[13px] tracking-wide ${
                        isActive
                          ? 'text-[#EFEFEF] font-serif italic font-medium'
                          : 'text-[#888888] font-sans'
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

        {/* Right Side: Active Content Area */}
        <div className="flex-grow flex flex-col justify-center min-h-[380px]">
          {activeStepId === 1 ? (
            /* Active State: Listening */
            <div className="flex flex-col items-center text-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37] shadow-[0px_0px_20px_rgba(212,175,55,0.15)]">
                <span className="material-symbols-outlined text-4xl">
                  headphones
                </span>
              </div>
              
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#888888] mb-1">
                Audio Exploration
              </div>
              <h2 className="font-serif italic text-[26px] md:text-[30px] font-light text-[#EFEFEF] mb-3">
                Dialogue: Sarah's Morning Routine
              </h2>
              
              <p className="font-sans text-[14px] leading-relaxed text-[#AAAAAA] mb-6">
                Listen carefully to Sarah describing her morning routine. Pay close attention to phrasal verbs and temporal transitions.
              </p>

              {/* Audio Player Mockup */}
              <div className="w-full bg-[#141414] border border-[#333333] p-4 flex items-center gap-4 mb-6 shadow-inner">
                <button
                  onClick={toggleMiniAudio}
                  aria-label={isPlayingAudio ? 'Pause' : 'Play'}
                  className="w-11 h-11 bg-[#D4AF37] text-[#111111] hover:bg-[#e0bd49] rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <span className="material-symbols-outlined text-2xl icon-filled">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-grow">
                  {/* Waveform bars */}
                  <div className="h-8 w-full flex items-center gap-1">
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-6 animate-pulse' : 'bg-[#D4AF37] h-2'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-7' : 'bg-[#D4AF37] h-4'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-3' : 'bg-[#D4AF37] h-3'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-8 animate-pulse' : 'bg-[#D4AF37] h-6'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-8' : 'bg-[#D4AF37] h-8'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-5' : 'bg-[#D4AF37] h-5'}`} />
                    <div className={`w-1 rounded-full transition-all duration-300 ${isPlayingAudio ? 'bg-[#D4AF37] h-7' : 'bg-[#D4AF37] h-7'}`} />
                    <div className="w-1 bg-[#333333] h-4 rounded-full" />
                    <div className="w-1 bg-[#333333] h-2 rounded-full" />
                    <div className="w-1 bg-[#333333] h-5 rounded-full" />
                    <div className="w-1 bg-[#333333] h-3 rounded-full" />
                    <div className="w-1 bg-[#333333] h-6 rounded-full" />
                    <div className="w-1 bg-[#333333] h-2 rounded-full" />
                    <div className="w-1 bg-[#333333] h-4 rounded-full" />
                    <div className="w-1 bg-[#333333] h-3 rounded-full" />
                    <div className="w-1 bg-[#333333] h-5 rounded-full" />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-[#777777] font-mono">
                    <span>{audioCurrentTime}</span>
                    <span>2:15</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <button
                  onClick={onOpenListeningPractice}
                  className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(212,175,55,0.2)] flex justify-center items-center gap-2 cursor-pointer group"
                >
                  Enter Listening Room
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ) : activeStepId === 3 ? (
            /* Speaking step preview */
            <div className="flex flex-col items-center text-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37]">
                <span className="material-symbols-outlined text-4xl">
                  record_voice_over
                </span>
              </div>
              <h2 className="font-serif italic text-[26px] md:text-[30px] font-light text-[#EFEFEF] mb-3">
                Speaking Assessment
              </h2>
              <p className="font-sans text-[14px] leading-relaxed text-[#AAAAAA] mb-6">
                Review your recent speaking recording, phonetics evaluation, and grammatical accuracy.
              </p>
              <button
                onClick={onOpenSpeakingFeedback}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(212,175,55,0.2)] flex items-center gap-2 cursor-pointer"
              >
                View Speaking Feedback
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ) : activeStepId === 4 ? (
            /* Reading step preview */
            <div className="flex flex-col items-center text-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-20 h-20 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37]">
                <span className="material-symbols-outlined text-4xl">
                  menu_book
                </span>
              </div>
              <h2 className="font-serif italic text-[26px] md:text-[30px] font-light text-[#EFEFEF] mb-3">
                Reading: The Unexpected Journey
              </h2>
              <p className="font-sans text-[14px] leading-relaxed text-[#AAAAAA] mb-6">
                Read Chapter 1 with editorial serif typography and parallel Hindi translations.
              </p>
              <button
                onClick={onOpenReadingPractice}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(212,175,55,0.2)] flex items-center gap-2 cursor-pointer"
              >
                Open Reading Chapter
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            /* Questions or Assessment */
            <div className="flex flex-col items-center text-center max-w-md mx-auto w-full">
              <div className="w-16 h-16 rounded-full border border-[#333333] bg-[#141414] flex items-center justify-center mb-4 text-[#888888]">
                <span className="material-symbols-outlined text-3xl">quiz</span>
              </div>
              <h3 className="font-serif italic text-[24px] font-light text-[#EFEFEF] mb-2">
                Step 0{activeStepId}: Practice & Evaluation
              </h3>
              <p className="font-sans text-[14px] text-[#AAAAAA] mb-6">
                Complete the listening exercises first to unlock these comprehension questions and assessments.
              </p>
              <button
                onClick={onOpenListeningPractice}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-6 shadow-[0px_4px_20px_rgba(212,175,55,0.2)] flex items-center gap-2 cursor-pointer"
              >
                Begin with Listening
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
