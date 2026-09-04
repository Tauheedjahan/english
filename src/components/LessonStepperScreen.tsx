import React, { useState } from 'react';
import { LessonStep } from '../types';
import { StepRestrictionModal } from './StepRestrictionModal';

interface LessonStepperScreenProps {
  steps: LessonStep[];
  completedSentenceCount: number;
  totalSentencesCount?: number;
  dayNumber?: number;
  topic?: string;
  listeningHeading?: string;
  readingHeading?: string;
  pdfFilename?: string;
  onOpenListeningPractice: () => void;
  onOpenReadingPractice: () => void;
  onOpenTranslationPractice: () => void;
  onOpenAIConversation: () => void;
  onBackToHome: () => void;
}

export const LessonStepperScreen: React.FC<LessonStepperScreenProps> = ({
  steps,
  completedSentenceCount,
  totalSentencesCount = 30,
  dayNumber = 1,
  topic = 'Morning Routines & Habit Loops',
  listeningHeading,
  readingHeading,
  pdfFilename,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenTranslationPractice,
  onOpenAIConversation,
  onBackToHome,
}) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [restrictionModal, setRestrictionModal] = useState<{
    isOpen: boolean;
    targetStepTitle: string;
    requiredStepTitle: string;
    requiredStepNumber: number;
    message?: string;
    onGoToRequired: () => void;
  } | null>(null);

  const handleTriggerLockPopup = (targetStepId: number) => {
    if (targetStepId === 2) {
      setRestrictionModal({
        isOpen: true,
        targetStepTitle: 'Step 02: Companion Reading',
        requiredStepTitle: 'Video Listening',
        requiredStepNumber: 1,
        message: 'You cannot open the Reading companion yet. You must complete the Step 01 Video Listening session first.',
        onGoToRequired: () => {
          setRestrictionModal(null);
          onOpenListeningPractice();
        },
      });
    } else if (targetStepId === 3) {
      const isStep1Done = steps[0]?.completed;
      if (!isStep1Done) {
        setRestrictionModal({
          isOpen: true,
          targetStepTitle: 'Step 03: Translation Practice',
          requiredStepTitle: 'Video Listening',
          requiredStepNumber: 1,
          message: 'You must complete Step 01 (Video Listening) and Step 02 (Reading) before starting translation sentences.',
          onGoToRequired: () => {
            setRestrictionModal(null);
            onOpenListeningPractice();
          },
        });
      } else {
        setRestrictionModal({
          isOpen: true,
          targetStepTitle: 'Step 03: Translation Practice',
          requiredStepTitle: 'Companion Reading Guide',
          requiredStepNumber: 2,
          message: 'Please complete Step 02 (Reading Companion) before beginning translation exercises.',
          onGoToRequired: () => {
            setRestrictionModal(null);
            onOpenReadingPractice();
          },
        });
      }
    } else if (targetStepId === 4) {
      setRestrictionModal({
        isOpen: true,
        targetStepTitle: 'Step 04: Spoken AI Dialogue',
        requiredStepTitle: 'Sentence Translation Mastery',
        requiredStepNumber: 3,
        message: `Please complete all sentence translation exercises (${completedSentenceCount} completed) before starting the oral AI conversation.`,
        onGoToRequired: () => {
          setRestrictionModal(null);
          onOpenTranslationPractice();
        },
      });
    }
  };

  const handleStepClick = (step: LessonStep) => {
    setActiveStepId(step.id);
    if (!step.locked || step.completed) {
      if (step.id === 1) onOpenListeningPractice();
      else if (step.id === 2) onOpenReadingPractice();
      else if (step.id === 3) onOpenTranslationPractice();
      else if (step.id === 4) onOpenAIConversation();
    } else {
      handleTriggerLockPopup(step.id);
    }
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-160px)] bg-white text-[#111827]">
      {/* Pop-up message modal for step restrictions */}
      {restrictionModal && (
        <StepRestrictionModal
          isOpen={restrictionModal.isOpen}
          targetStepTitle={restrictionModal.targetStepTitle}
          requiredStepTitle={restrictionModal.requiredStepTitle}
          requiredStepNumber={restrictionModal.requiredStepNumber}
          message={restrictionModal.message}
          onClose={() => setRestrictionModal(null)}
          onGoToRequired={restrictionModal.onGoToRequired}
        />
      )}

      {/* Breadcrumb */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-[#4B5563] hover:text-[#1B4D3E] transition-colors text-[10px] uppercase tracking-[0.25em] font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Curriculum Overview
        </button>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#1B4D3E] bg-[#E8F2EE] px-3 py-1 rounded-full border border-[#1B4D3E]/30 font-bold">
          Day {dayNumber.toString().padStart(2, '0')} // Structured Daily Architecture
        </span>
      </div>

      {/* Lesson Header */}
      <div className="w-full max-w-3xl mb-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#1B4D3E] mb-2 font-bold">
          Step-by-Step Daily Mastery
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-medium text-[#111827] mb-3">
          Day {dayNumber.toString().padStart(2, '0')}: {topic}
        </h1>
        <div className="w-12 h-[2px] bg-[#1B4D3E] mx-auto mb-3"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#4B5563]">
          Sequential unlock enabled: 1. Listening → 2. Reading → 3. Translation Sentences → 4. AI Conversation.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="w-full max-w-3xl bg-white border border-[#E2E8E5] p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-[0px_8px_32px_rgba(27,77,62,0.05)] rounded-sm">
        {/* Left Side: Stepper List */}
        <div className="flex-shrink-0 w-full md:w-68 border-b md:border-b-0 md:border-r border-[#E2E8E5] pb-6 md:pb-0 md:pr-6">
          <div className="flex flex-col relative space-y-3">
            {steps.map((step) => {
              const isActive = step.id === activeStepId;
              const isDone = step.completed;
              const isLocked = step.locked;

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  className={`relative flex items-center gap-3 z-10 group cursor-pointer transition-all p-2.5 rounded-sm ${
                    isActive ? 'bg-[#E8F2EE] border-l-4 border-[#1B4D3E]' : 'hover:bg-[#F8FAF9]'
                  } ${isLocked ? 'opacity-65' : 'opacity-100'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif italic text-[13px] transition-all shrink-0 font-bold ${
                      isDone
                        ? 'bg-[#1B4D3E] text-white'
                        : isActive
                        ? 'bg-[#1B4D3E] text-white shadow-xs'
                        : isLocked
                        ? 'bg-[#F3F4F6] border border-[#E5E7EB] text-[#9CA3AF]'
                        : 'bg-white border border-[#CBD5E1] text-[#4B5563]'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-[16px] text-white">
                        check
                      </span>
                    ) : isLocked ? (
                      <span className="material-symbols-outlined text-[14px] text-[#9CA3AF]">
                        lock
                      </span>
                    ) : (
                      step.id
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#6B7280] font-semibold">
                        Step 0{step.id}
                      </span>
                      {step.id === 3 && (
                        <span className="text-[9px] text-[#1B4D3E] font-mono font-bold">
                          ({completedSentenceCount})
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[13px] tracking-wide ${
                        isActive
                          ? 'text-[#111827] font-serif italic font-semibold'
                          : isLocked
                          ? 'text-[#9CA3AF]'
                          : 'text-[#374151]'
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
              <div className="w-16 h-16 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] flex items-center justify-center mb-4 text-[#1B4D3E]">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#1B4D3E] mb-1 font-bold">
                Step 1 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#111827] mb-2 font-medium">
                YouTube Listening Experience
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
                Watch the curated video on {topic}. Completing this video listening session is strictly required to unlock Step 2.
              </p>
              <button
                onClick={onOpenListeningPractice}
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(27,77,62,0.2)] flex items-center gap-2 cursor-pointer group rounded-sm"
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
              <div className="w-16 h-16 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] flex items-center justify-center mb-4 text-[#1B4D3E]">
                <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#1B4D3E] mb-1 font-bold">
                Step 2 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#111827] mb-2 font-medium">
                {pdfFilename || 'Companion Reading (PDF Guide)'}
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
                Read the companion chapter connected to the video topic. Includes parallel Hindi translations and phrasal verb deep dives.
              </p>
              <button
                onClick={() => {
                  if (steps[1].locked && !steps[1].completed) {
                    handleTriggerLockPopup(2);
                  } else {
                    onOpenReadingPractice();
                  }
                }}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group rounded-sm ${
                  steps[1].locked && !steps[1].completed
                    ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]'
                    : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white shadow-[0px_4px_20px_rgba(27,77,62,0.2)]'
                }`}
              >
                {steps[1].locked && !steps[1].completed ? 'Locked (Complete Step 1 First)' : 'Open Reading Section'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  {steps[1].locked && !steps[1].completed ? 'lock' : 'arrow_forward'}
                </span>
              </button>
            </div>
          )}

          {activeStepId === 3 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] flex items-center justify-center mb-4 text-[#1B4D3E]">
                <span className="material-symbols-outlined text-3xl">translate</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#1B4D3E] mb-1 font-bold">
                Step 3 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#111827] mb-2 font-medium">
                Translation Practice Sentences
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
                Practice topic sentences one by one with speech recognition, hint tools, and instant evaluation.
              </p>
              <button
                onClick={() => {
                  if (steps[2].locked && !steps[2].completed) {
                    handleTriggerLockPopup(3);
                  } else {
                    onOpenTranslationPractice();
                  }
                }}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group rounded-sm ${
                  steps[2].locked && !steps[2].completed
                    ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]'
                    : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white shadow-[0px_4px_20px_rgba(27,77,62,0.2)]'
                }`}
              >
                {steps[2].locked && !steps[2].completed ? 'Locked (Complete Step 2 First)' : 'Start Translation Practice'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  {steps[2].locked && !steps[2].completed ? 'lock' : 'arrow_forward'}
                </span>
              </button>
            </div>
          )}

          {activeStepId === 4 && (
            <div className="flex flex-col items-center max-w-md mx-auto w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-[#1B4D3E]/30 bg-[#E8F2EE] flex items-center justify-center mb-4 text-[#1B4D3E]">
                <span className="material-symbols-outlined text-3xl">record_voice_over</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-[#1B4D3E] mb-1 font-bold">
                Step 4 of 4
              </div>
              <h2 className="font-serif italic text-2xl text-[#111827] mb-2 font-medium">
                AI Conversation Practice
              </h2>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-6">
                Converse with your AI tutor using the video and reading concepts. Receive instant syntactic corrections and spoken feedback.
              </p>
              <button
                onClick={() => {
                  if (steps[3].locked && !steps[3].completed) {
                    handleTriggerLockPopup(4);
                  } else {
                    onOpenAIConversation();
                  }
                }}
                className={`font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 flex items-center gap-2 cursor-pointer group rounded-sm ${
                  steps[3].locked && !steps[3].completed
                    ? 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] border border-[#E5E7EB]'
                    : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white shadow-[0px_4px_20px_rgba(27,77,62,0.2)]'
                }`}
              >
                {steps[3].locked && !steps[3].completed ? 'Locked (Finish Translations First)' : 'Enter AI Conversation'}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  {steps[3].locked && !steps[3].completed ? 'lock' : 'arrow_forward'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
