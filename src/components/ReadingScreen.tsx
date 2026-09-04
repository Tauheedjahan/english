import React, { useState } from 'react';
import { READING_PAGES } from '../data/mockData';

interface ReadingScreenProps {
  dayNumber?: number;
  topic?: string;
  storyContent?: string;
  pdfUrl?: string;
  pdfFilename?: string;
  onBack: () => void;
  onFinishReading: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({
  dayNumber = 1,
  topic = 'The 6:00 AM Architect: Daily Habits Guide',
  storyContent = '',
  pdfUrl = '',
  pdfFilename = 'Lesson_Guide.pdf',
  onBack,
  onFinishReading,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showHindi, setShowHindi] = useState(true);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showPdfModal, setShowPdfModal] = useState(false);

  // If custom storyContent is provided from Supabase or Admin, split by double newlines into pages or paragraphs
  const dynamicPages = React.useMemo(() => {
    if (dayNumber === 1 && (!storyContent || storyContent.length < 50)) {
      return READING_PAGES;
    }
    if (storyContent && storyContent.trim().length > 0) {
      const paragraphs = storyContent
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);
      
      // Group paragraphs into pages of 3 paragraphs each
      const pages = [];
      const perPage = 3;
      for (let i = 0; i < paragraphs.length; i += perPage) {
        pages.push({
          pageNumber: Math.floor(i / perPage) + 1,
          english: paragraphs.slice(i, i + perPage),
          hindi: [], // Optional Hindi translations
        });
      }
      return pages.length > 0 ? pages : READING_PAGES;
    }
    return READING_PAGES;
  }, [dayNumber, storyContent]);

  const currentPage = dynamicPages[currentPageIndex] || dynamicPages[0] || READING_PAGES[0];
  const totalPages = Math.max(1, dynamicPages.length);

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-[22px] leading-[36px]'
      : fontSize === 'large'
      ? 'text-[20px] leading-[32px]'
      : 'text-[17px] leading-[29px]';


  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#111111] text-[#EFEFEF]">
      {/* Workflow Header Bar */}
      <header className="sticky top-0 z-30 border-b border-[#333333] px-4 md:px-12 h-18 max-w-[1200px] mx-auto w-full flex items-center justify-between bg-[#111111]/95 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium">
            Curriculum
          </span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 md:gap-3 text-[10px] uppercase tracking-[0.2em]">
          <span className="text-[#68BA89] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span>
            <span className="hidden sm:inline">1. Listening</span>
          </span>
          <span className="text-[#444444]">→</span>
          <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5 bg-[#262010] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            2. Reading
          </span>
          <span className="text-[#444444]">→</span>
          <span className="text-[#666666] hidden sm:inline">3. Translation (41)</span>
          <span className="text-[#444444] hidden sm:inline">→</span>
          <span className="text-[#666666] hidden md:inline">4. AI Conversation</span>
        </div>

        {/* Action: Open PDF Book */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPdfModal(true)}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span className="hidden sm:inline">Open / Download PDF</span>
          </button>

          {/* Hindi Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none border border-[#333333] px-3 py-1.5 rounded-full bg-[#1A1A1A]">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#AAAAAA] hidden md:inline">
              हिंदी
            </span>
            <input
              type="checkbox"
              checked={showHindi}
              onChange={(e) => setShowHindi(e.target.checked)}
              className="accent-[#D4AF37] cursor-pointer"
            />
          </label>
        </div>
      </header>

      {/* PDF Modal / Document View */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start pb-4 border-b border-[#333333] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.25em] text-[#888888]">
                    Official Companion PDF
                  </div>
                  <h3 className="font-serif italic text-[20px] text-[#EFEFEF]">
                    {pdfFilename || topic || 'Lesson Companion Guide'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-[#888888] hover:text-[#D4AF37] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow pr-2 space-y-4 text-[14px] text-[#CCCCCC] font-serif leading-relaxed">
              <div className="bg-[#141414] border border-[#282828] p-4 text-[12px] font-sans text-[#AAAAAA]">
                <div className="text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
                  Document Overview & Metadata
                </div>
                <p>
                  Topic: {topic} // Day {dayNumber} Curriculum.
                  Designed to accompany the video lesson and build vocabulary for oral practice.
                </p>
              </div>

              <div className="p-4 bg-[#161616] border border-[#282828]">
                <h4 className="font-sans text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2 font-semibold">
                  Study Guidelines:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[13px] font-sans text-[#AAAAAA]">
                  <li><strong className="text-[#EFEFEF]">Read out loud:</strong> Vocalize each sentence to train muscle memory and rhythm.</li>
                  <li><strong className="text-[#EFEFEF]">Notice sentence structures:</strong> Pay attention to conjunctions, past perfect, and phrasal verbs.</li>
                  <li><strong className="text-[#EFEFEF]">Prepare for speaking:</strong> These ideas will be discussed with your AI teacher in Step 4.</li>
                </ul>
              </div>

              {storyContent && (
                <div className="p-4 bg-[#141414] border border-[#282828] text-xs font-sans text-[#CCCCCC] whitespace-pre-line leading-relaxed">
                  {storyContent}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#333333] mt-4 flex items-center justify-between">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline text-[11px] uppercase tracking-[0.2em] font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Open / Download PDF ({pdfFilename || 'Guide.pdf'})
                </a>
              ) : (
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Lesson guide is ready for offline reading!");
                  }}
                  className="inline-flex items-center gap-2 text-[#D4AF37] hover:underline text-[11px] uppercase tracking-[0.2em] font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download PDF File
                </a>
              )}
              <button
                onClick={() => setShowPdfModal(false)}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-2.5 cursor-pointer"
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
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="inline-block px-3 py-0.5 bg-[#1A1A1A] text-[#D4AF37] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#333333]">
                Day {dayNumber.toString().padStart(2, '0')} // Step 2 of 4
              </span>
              <span className="text-[#888888] text-[10px] uppercase tracking-[0.25em]">
                {topic} // Chapter 0{currentPage.pageNumber}
              </span>
            </div>
            <h1 className="font-serif italic text-[32px] md:text-[42px] leading-tight font-light text-[#EFEFEF] mb-3">
              {topic}
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37]" />
          </div>

          {/* Book Excerpt Text */}
          <div className="space-y-8 font-serif text-[#E0E0E0]">
            {currentPage.english.map((paragraph, idx) => (
              <div key={idx} className="group">
                <p className={`${fontClass} text-[#E0E0E0] font-normal leading-relaxed`}>
                  {paragraph}
                </p>

                {showHindi && currentPage.hindi[idx] && (
                  <div className="mt-4 pl-4 border-l-2 border-[#D4AF37] bg-[#1A1A1A] py-3.5 pr-4 animate-fade-in">
                    <span className="text-[9px] font-sans font-semibold tracking-[0.25em] text-[#D4AF37] uppercase block mb-1">
                      हिंदी अनुवाद:
                    </span>
                    <p className="font-sans text-[14px] md:text-[15px] leading-[24px] text-[#AAAAAA]">
                      {currentPage.hindi[idx]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Pagination & Next Action */}
        <div className="mt-12 pt-6 border-t border-[#333333] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] font-medium py-2 px-4 transition-colors ${
                currentPageIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#666666]'
                  : 'hover:text-[#D4AF37] text-[#AAAAAA] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Previous Page
            </button>

            {/* Page Indicators */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[10px] text-[#777777] uppercase tracking-[0.2em]">
                Page {currentPageIndex + 1} / {totalPages}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageIndex(i)}
                    className={`h-1.5 transition-all cursor-pointer ${
                      i === currentPageIndex
                        ? 'bg-[#D4AF37] w-6'
                        : 'bg-[#333333] hover:bg-[#555555] w-2'
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPageIndex === totalPages - 1}
              className={`flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] font-medium py-2 px-4 transition-colors ${
                currentPageIndex === totalPages - 1
                  ? 'opacity-30 cursor-not-allowed text-[#666666]'
                  : 'hover:text-[#D4AF37] text-[#AAAAAA] cursor-pointer'
              }`}
            >
              Next Page
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Unlock Step 3 Button */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[12px] text-[#AAAAAA]">
              Finished reading the material? Proceed to the 41 translation sentences to practice the structures you just learned.
            </div>
            <button
              onClick={onFinishReading}
              className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap group shrink-0 w-full sm:w-auto"
            >
              Complete Reading → Unlock Translation (41)
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
