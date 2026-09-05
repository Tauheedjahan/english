import React, { useState } from 'react';
import { READING_PAGES } from '../data/mockData';
import { StepRestrictionModal } from './StepRestrictionModal';

interface ReadingScreenProps {
  dayNumber?: number;
  topic?: string;
  readingHeading?: string;
  storyContent?: string;
  pdfUrl?: string;
  pdfFilename?: string;
  onBack: () => void;
  onFinishReading: () => void;
  onOpenListeningPractice?: () => void;
  onOpenTranslationPractice?: () => void;
  onOpenAIConversation?: () => void;
  isListeningDone?: boolean;
  isTranslationUnlocked?: boolean;
  isAIUnlocked?: boolean;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({
  dayNumber = 1,
  topic = 'Morning Routines & Habit Loops',
  readingHeading,
  storyContent = '',
  pdfUrl = '',
  pdfFilename = 'Lesson_Guide.pdf',
  onBack,
  onFinishReading,
  onOpenListeningPractice,
  onOpenTranslationPractice,
  onOpenAIConversation,
  isListeningDone = true,
  isTranslationUnlocked = false,
  isAIUnlocked = false,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showHindi, setShowHindi] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [hasReadContent, setHasReadContent] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    targetStepTitle: string;
    requiredStepTitle: string;
    requiredStepNumber: number;
    message: string;
  } | null>(null);

  // Dynamic pages from storyContent or defaults
  const dynamicPages = React.useMemo(() => {
    if (dayNumber === 1 && (!storyContent || storyContent.length < 50)) {
      return READING_PAGES;
    }
    if (storyContent && storyContent.trim().length > 0) {
      const paragraphs = storyContent
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);
      
      const pages = [];
      const perPage = 3;
      for (let i = 0; i < paragraphs.length; i += perPage) {
        pages.push({
          pageNumber: Math.floor(i / perPage) + 1,
          english: paragraphs.slice(i, i + perPage),
          hindi: [],
        });
      }
      return pages.length > 0 ? pages : READING_PAGES;
    }
    return READING_PAGES;
  }, [dayNumber, storyContent]);

  const currentPage = dynamicPages[currentPageIndex] || dynamicPages[0] || READING_PAGES[0];
  const totalPages = Math.max(1, dynamicPages.length);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-[#111827]">
      {/* PDF Modal / Document View */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8E5] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh] rounded-sm">
            <div className="flex justify-between items-start pb-4 border-b border-[#E5E7EB] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/30 flex items-center justify-center text-[#1B4D3E]">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-[#1B4D3E] font-bold">
                    Official Companion PDF
                  </div>
                  <h3 className="font-serif italic text-[20px] text-[#111827]">
                    {readingHeading || pdfFilename || topic || 'Lesson Companion Guide'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-[#6B7280] hover:text-[#111827] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow pr-2 space-y-4 text-[14px] text-[#374151] font-serif leading-relaxed">
              <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-4 text-[12px] font-sans text-[#4B5563] rounded-sm">
                <div className="text-[#1B4D3E] font-semibold uppercase tracking-wider mb-1">
                  Document Overview & Metadata
                </div>
                <p>
                  Topic: {topic} // Day {dayNumber} Curriculum.
                  Designed to accompany the video lesson and build vocabulary for oral practice.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#E2E8E5] rounded-sm">
                <h4 className="font-sans text-[11px] uppercase tracking-widest text-[#1B4D3E] mb-2 font-bold">
                  Study Guidelines:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[13px] font-sans text-[#4B5563]">
                  <li><strong className="text-[#111827]">Read out loud:</strong> Vocalize each sentence to train muscle memory and rhythm.</li>
                  <li><strong className="text-[#111827]">Notice sentence structures:</strong> Pay attention to conjunctions, past perfect, and phrasal verbs.</li>
                  <li><strong className="text-[#111827]">Prepare for speaking:</strong> These ideas will be discussed with your AI teacher in Step 4.</li>
                </ul>
              </div>

              {storyContent && (
                <div className="p-4 bg-[#F8FAF9] border border-[#E2E8E5] text-xs font-sans text-[#1F2937] whitespace-pre-line leading-relaxed rounded-sm">
                  {storyContent}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#1B4D3E] hover:underline text-[11px] uppercase tracking-[0.2em] font-bold"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Open / Download PDF ({pdfFilename || 'Guide.pdf'})
                </a>
              ) : (
                <span className="text-[11px] uppercase tracking-wider text-[#6B7280]">
                  Lesson guide ready for reading
                </span>
              )}
              <button
                onClick={() => setShowPdfModal(false)}
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-2.5 cursor-pointer rounded-sm"
              >
                Continue Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reader Editorial Container */}
      <main className="flex-grow w-full max-w-[850px] mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col justify-between">
        <article className="animate-fade-in">
          {/* Chapter Header */}
          <div className="mb-8 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-0.5 bg-[#E8F2EE] text-[#1B4D3E] font-sans text-[9px] font-bold uppercase tracking-[0.3em] border border-[#1B4D3E]/20 rounded-xs">
                  Day {dayNumber.toString().padStart(2, '0')} // Step 2 of 4
                </span>
                <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.25em]">
                  {topic ? `${topic} // ` : ''}Chapter 0{currentPage.pageNumber}
                </span>
              </div>

              {/* Action: Open PDF Book & Hindi Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="inline-flex items-center gap-1.5 bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-sm transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                  <span>PDF Guide</span>
                </button>

                <label className="flex items-center gap-1.5 cursor-pointer select-none border border-[#E2E8E5] px-2.5 py-1 rounded-full bg-white shadow-xs">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#4B5563] font-semibold">
                    हिंदी
                  </span>
                  <input
                    type="checkbox"
                    checked={showHindi}
                    onChange={(e) => setShowHindi(e.target.checked)}
                    className="accent-[#1B4D3E] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <h1 className="font-serif italic text-[32px] md:text-[42px] leading-tight font-medium text-[#111827] mb-3">
              {readingHeading || topic}
            </h1>
            <div className="w-12 h-[2px] bg-[#1B4D3E]" />
          </div>

          {/* Book Excerpt Text */}
          <div className="space-y-8 font-serif text-[#1F2937]">
            {currentPage.english.map((paragraph, idx) => (
              <div key={idx} className="group">
                <p className="text-[17px] leading-[30px] text-[#1F2937] font-normal">
                  {paragraph}
                </p>

                {showHindi && currentPage.hindi && currentPage.hindi[idx] && (
                  <div className="mt-4 pl-4 border-l-2 border-[#1B4D3E] bg-[#F8FAF9] py-3.5 pr-4 animate-fade-in rounded-r-sm">
                    <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-[#1B4D3E] uppercase block mb-1">
                      हिंदी अनुवाद:
                    </span>
                    <p className="font-sans text-[14px] md:text-[15px] leading-[24px] text-[#4B5563]">
                      {currentPage.hindi[idx]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Pagination & Next Action */}
        <div className="mt-12 pt-6 border-t border-[#E2E8E5] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] font-semibold py-2 px-4 transition-colors rounded-sm ${
                currentPageIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#9CA3AF]'
                  : 'hover:text-[#1B4D3E] text-[#4B5563] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Previous Page
            </button>

            {/* Page Indicators */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[10px] text-[#6B7280] uppercase tracking-[0.2em] font-medium">
                Page {currentPageIndex + 1} / {totalPages}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageIndex(i)}
                    className={`h-1.5 transition-all cursor-pointer rounded-full ${
                      i === currentPageIndex
                        ? 'bg-[#1B4D3E] w-6'
                        : 'bg-[#CBD5E1] hover:bg-[#94A3B8] w-2'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex === totalPages - 1}
              className={`flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] font-semibold py-2 px-4 transition-colors rounded-sm ${
                currentPageIndex === totalPages - 1
                  ? 'opacity-30 cursor-not-allowed text-[#9CA3AF]'
                  : 'hover:text-[#1B4D3E] text-[#4B5563] cursor-pointer'
              }`}
            >
              Next Page
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Unlock Step 3 Button */}
          <div className="bg-white border border-[#E2E8E5] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs rounded-sm">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-[#111827]">
                <input
                  type="checkbox"
                  checked={hasReadContent}
                  onChange={(e) => setHasReadContent(e.target.checked)}
                  className="w-4 h-4 text-[#1B4D3E] accent-[#1B4D3E] rounded border-[#CBD5E1] cursor-pointer"
                />
                <span className="font-medium">
                  I have read and studied the companion reading content
                </span>
              </label>
              <div className="text-[11px] text-[#6B7280]">
                Completing the reading guide is required to unlock Step 3 (Sentence Translation Mastery).
              </div>
            </div>

            <button
              onClick={() => {
                if (!hasReadContent) {
                  setModalInfo({
                    isOpen: true,
                    targetStepTitle: 'Step 03: Sentence Translation Mastery',
                    requiredStepTitle: 'Companion Reading Guide',
                    requiredStepNumber: 2,
                    message: 'You cannot advance to Step 03 (Translation Practice) yet. Please confirm that you have read through the companion chapter and noted key vocabulary structures.',
                  });
                } else {
                  onFinishReading();
                }
              }}
              className="bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(27,77,62,0.2)] flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap group shrink-0 w-full sm:w-auto rounded-sm"
            >
              Complete Reading → Unlock Translation
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Step Restriction Pop-Up */}
          {modalInfo && (
            <StepRestrictionModal
              isOpen={modalInfo.isOpen}
              targetStepTitle={modalInfo.targetStepTitle}
              requiredStepTitle={modalInfo.requiredStepTitle}
              requiredStepNumber={modalInfo.requiredStepNumber}
              message={modalInfo.message}
              onClose={() => setModalInfo(null)}
              onGoToRequired={() => {
                setModalInfo(null);
                setHasReadContent(true);
                onFinishReading();
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};
