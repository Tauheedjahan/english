import React, { useState, useEffect } from 'react';
import { DAY_1_TRANSLATION_SENTENCES } from '../data/translationSentences';
import { SentenceRecord } from '../types';
import { StepRestrictionModal } from './StepRestrictionModal';

interface TranslationScreenProps {
  completedSentenceIds: number[];
  onSentenceCompleted: (sentenceId: number) => void;
  onCompleteAllForDemo: () => void;
  onFinishTranslation: (translations?: Record<number, string>) => void;
  onBackToLessons: () => void;
  onOpenListeningPractice?: () => void;
  onOpenReadingPractice?: () => void;
  onOpenAIConversation?: () => void;
  isListeningDone?: boolean;
  isReadingDone?: boolean;
  isAIDone?: boolean;
  sentences?: SentenceRecord[];
  dayNumber?: number;
  topic?: string;
  storyContent?: string;
  userTranslations?: Record<number, string>;
  onUpdateTranslation?: (sentenceId: number, translation: string) => void;
}

export const TranslationScreen: React.FC<TranslationScreenProps> = ({
  completedSentenceIds,
  onSentenceCompleted,
  onCompleteAllForDemo,
  onFinishTranslation,
  onBackToLessons,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenAIConversation,
  isListeningDone = true,
  isReadingDone = true,
  isAIDone = false,
  sentences,
  dayNumber = 1,
  topic = 'Daily Fluency',
  storyContent = '',
  userTranslations: initialTranslations,
  onUpdateTranslation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavigatorModal, setShowNavigatorModal] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);

  // Store translations in local state keyed by sentence ID
  const [translations, setTranslations] = useState<Record<number, string>>(() => {
    if (initialTranslations && Object.keys(initialTranslations).length > 0) {
      return initialTranslations;
    }
    try {
      const saved = localStorage.getItem(`day_${dayNumber}_translations`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Sync when initialTranslations prop updates
  useEffect(() => {
    if (initialTranslations && Object.keys(initialTranslations).length > 0) {
      setTranslations((prev) => ({ ...prev, ...initialTranslations }));
    }
  }, [initialTranslations]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`day_${dayNumber}_translations`, JSON.stringify(translations));
    } catch {}
  }, [translations, dayNumber]);

  // Use provided sentences or fallback to DAY_1_TRANSLATION_SENTENCES
  const sentenceList = sentences && sentences.length > 0 ? sentences : (DAY_1_TRANSLATION_SENTENCES as any as SentenceRecord[]);
  const totalSentences = sentenceList.length;
  const currentSentence: SentenceRecord = sentenceList[currentIndex] || sentenceList[0];

  const currentSentenceId = currentSentence?.id ?? currentIndex + 1;
  const currentText = translations[currentSentenceId] || '';

  // Count how many sentences have an English translation entered
  const enteredCount = sentenceList.filter((s) => {
    const sId = s.id ?? 0;
    return Boolean(translations[sId] && translations[sId].trim().length > 0);
  }).length;

  const isAllEntered = enteredCount >= totalSentences;

  const handleTextChange = (text: string) => {
    const updated = { ...translations, [currentSentenceId]: text };
    setTranslations(updated);
    if (onUpdateTranslation) {
      onUpdateTranslation(currentSentenceId, text);
    }
    if (text.trim().length > 0 && !completedSentenceIds.includes(currentSentenceId)) {
      onSentenceCompleted(currentSentenceId);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSentences - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinishAndJumpToAI = () => {
    onFinishTranslation(translations);
  };

  const handleFastTrackAll = () => {
    const fastMap: Record<number, string> = { ...translations };
    sentenceList.forEach((s) => {
      const sId = s.id ?? 0;
      if (!fastMap[sId] || !fastMap[sId].trim()) {
        fastMap[sId] = s.english || 'I practiced this translation sentence.';
      }
    });
    setTranslations(fastMap);
    onCompleteAllForDemo();
    setShowNavigatorModal(false);
  };

  return (
    <div className="min-h-full flex flex-col bg-[#F8FAF9]">
      {/* Sub-Header / Breadcrumb */}
      <div className="border-b border-[#E2E8E5] bg-white py-3 px-4 md:px-12 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToLessons}
            className="text-[#6B7280] hover:text-[#1B4D3E] flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Curriculum
          </button>
          <span className="text-[#9CA3AF]">/</span>
          <span className="text-[#1B4D3E] font-medium font-serif italic">
            Day {dayNumber}: {topic}
          </span>
          <span className="text-[#9CA3AF]">/</span>
          <span className="text-[#111827] font-semibold text-[10px] uppercase tracking-wider">
            Step 3: Translation Practice
          </span>
        </div>

        <button
          onClick={() => setShowNavigatorModal(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#1B4D3E] bg-[#E8F2EE] hover:bg-[#D8E8E2] px-3 py-1.5 rounded-full border border-[#1B4D3E]/20 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">grid_view</span>
          <span>
            {enteredCount} / {totalSentences} Written
          </span>
        </button>
      </div>

      {/* Directory Modal */}
      {showNavigatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#1B4D3E]/30 w-full max-w-xl p-6 shadow-2xl rounded-sm">
            <div className="flex justify-between items-center mb-4 border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-serif italic text-lg text-[#1B4D3E] font-medium">
                  Sentence Directory ({totalSentences} Sentences)
                </h3>
                <p className="text-[11px] text-[#6B7280]">
                  Select any sentence to view and write your English translation.
                </p>
              </div>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
              {sentenceList.map((s, idx) => {
                const sId = s.id ?? idx + 1;
                const hasWritten = Boolean(translations[sId] && translations[sId].trim().length > 0);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={sId}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowNavigatorModal(false);
                    }}
                    className={`h-10 rounded-sm flex flex-col items-center justify-center border text-xs font-mono transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#1B4D3E] bg-[#1B4D3E] text-white font-bold shadow-xs'
                        : hasWritten
                        ? 'border-[#1B4D3E]/40 bg-[#E8F2EE] text-[#1B4D3E] font-semibold'
                        : 'border-[#E2E8E5] bg-white text-[#4B5563] hover:border-[#1B4D3E]/40'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {hasWritten && (
                      <span className="material-symbols-outlined text-[10px] text-[#1B4D3E]">
                        edit_note
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
              <button
                onClick={handleFastTrackAll}
                className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#1B4D3E] underline cursor-pointer font-medium"
              >
                [Pre-fill All for Testing]
              </button>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-2 cursor-pointer rounded-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main dir="ltr" className="flex-grow w-full max-w-[850px] mx-auto p-[20px] flex flex-col justify-between text-left">
        <div className="space-y-6">
          {/* Progress Bar & Header */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#6B7280] font-semibold">
              <span className="text-[#1B4D3E]">
                Sentence {currentIndex + 1} of {totalSentences}
              </span>
              <button
                onClick={() => setShowNavigatorModal(true)}
                className="flex items-center gap-1.5 hover:text-[#1B4D3E] cursor-pointer transition-colors"
              >
                <span>
                  {enteredCount} / {totalSentences} Translated ({Math.round((enteredCount / totalSentences) * 100)}%)
                </span>
                <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
              </button>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[4px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSentences) * 100}%` }}
              />
            </div>
          </div>

          {/* Translation Sentence Card - Clean, Box Only */}
          <div className="bg-white border border-[#E2E8E5] p-6 md:p-8 shadow-[0px_8px_32px_rgba(27,77,62,0.06)] relative overflow-hidden rounded-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#1B4D3E] text-[9px] uppercase tracking-[0.3em] font-bold px-3 py-1 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/30">
                {(currentSentence as any).category || currentSentence.difficulty || 'Sentence Translation'}
              </span>

              {currentText.trim().length > 0 && (
                <span className="text-[#1B4D3E] text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1 bg-[#E8F2EE] px-3 py-1 rounded-full border border-[#1B4D3E]/30">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Written
                </span>
              )}
            </div>

            {/* Hindi Prompt */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#6B7280] mb-1 font-semibold">
                Translate into English:
              </div>
              <h2 className="font-serif italic text-[24px] md:text-[30px] leading-relaxed text-[#111827] font-normal">
                "{currentSentence.hindi}"
              </h2>
            </div>

            {/* English User Input Field - Sole element requested */}
            <div>
              <label
                htmlFor="english-translation-input"
                className="block text-[10px] uppercase tracking-[0.25em] text-[#6B7280] mb-2 font-semibold"
              >
                Write English Sentence:
              </label>
              <textarea
                id="english-translation-input"
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (currentIndex < totalSentences - 1) {
                      handleNext();
                    }
                  }
                }}
                placeholder="Type your English translation sentence here..."
                rows={3}
                className="w-full bg-white border border-[#CBD5E1] focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E] p-4 text-[16px] font-sans text-[#111827] outline-none resize-none transition-colors rounded-sm"
              />
              <p className="text-[11px] text-[#9CA3AF] mt-1.5 flex items-center justify-between">
                <span>Write your sentence. Press Enter to proceed to the next sentence.</span>
                <span>{currentText.trim().split(/\s+/).filter(Boolean).length} words</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Jump to AI Conversation */}
        <div className="mt-10 pt-6 border-t border-[#E2E8E5] space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors font-semibold ${
                currentIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#9CA3AF]'
                  : 'hover:text-[#1B4D3E] text-[#4B5563] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Previous Sentence
            </button>

            {currentIndex < totalSentences - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 bg-[#1B4D3E] hover:bg-[#153E32] text-white transition-colors font-semibold rounded-sm cursor-pointer shadow-xs"
              >
                Next Sentence
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleFinishAndJumpToAI}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 bg-[#1B4D3E] hover:bg-[#153E32] text-white transition-colors font-bold rounded-sm cursor-pointer shadow-md animate-pulse"
              >
                Finish & Jump to AI Conversation
                <span className="material-symbols-outlined text-[16px]">forum</span>
              </button>
            )}
          </div>

          {/* AI Conversation Unlock & Jump Box */}
          <div className="p-5 border transition-all rounded-sm bg-[#E8F2EE] border-[#1B4D3E]/40 shadow-[0px_4px_24px_rgba(27,77,62,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[20px] text-[#1B4D3E]">
                  psychology
                </span>
                <h4 className="font-serif italic text-[18px] text-[#111827] font-medium">
                  Next Step: AI Conversation & Full Translation Check
                </h4>
              </div>
              <p className="text-[12px] text-[#4B5563]">
                When you finish writing, jump into the AI Conversation! The AI Tutor will first evaluate all your translated sentences, explain any mistakes, show the correct sentences, and then ask a speaking question about the reading story.
              </p>
            </div>

            <button
              onClick={handleFinishAndJumpToAI}
              className="bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-3.5 px-6 shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-sm transition-all"
            >
              Complete & Jump into AI Conversation →
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Step Restriction Pop-Up */}
          <StepRestrictionModal
            isOpen={showRestrictionModal}
            targetStepTitle="Step 04: Oral AI Dialogue"
            requiredStepTitle="Sentence Translation Mastery"
            requiredStepNumber={3}
            message={`You can write your translations and jump into the AI conversation at any point to receive full translation evaluation and speaking coaching.`}
            onClose={() => setShowRestrictionModal(false)}
            onGoToRequired={() => setShowRestrictionModal(false)}
          />
        </div>
      </main>
    </div>
  );
};
