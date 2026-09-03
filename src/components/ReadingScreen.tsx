import React, { useState } from 'react';
import { READING_PAGES } from '../data/mockData';

interface ReadingScreenProps {
  onBack: () => void;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ onBack }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showHindi, setShowHindi] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const currentPage = READING_PAGES[currentPageIndex] || READING_PAGES[0];
  const totalPages = READING_PAGES.length;

  const fontClass =
    fontSize === 'xlarge'
      ? 'text-[22px] leading-[36px]'
      : fontSize === 'large'
      ? 'text-[20px] leading-[32px]'
      : 'text-[18px] leading-[29px]';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#111111] text-[#EFEFEF]">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 border-b border-[#333333] px-4 md:px-12 h-18 max-w-[1200px] mx-auto w-full flex items-center justify-between bg-[#111111]">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-medium">
            Curriculum Lessons
          </span>
        </button>

        {/* Translation Switch & Controls */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#AAAAAA]">
              Hindi Translation
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showHindi}
                onChange={(e) => setShowHindi(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ease-in-out border border-[#333333] ${
                  showHindi ? 'bg-[#D4AF37]' : 'bg-[#222222]'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 bg-[#111111] w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                  showHindi ? 'translate-x-5 bg-[#111111]' : 'translate-x-0 bg-[#888888]'
                }`}
              />
            </div>
          </label>

          <button
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            title="Reading Settings"
            className="p-2 rounded-full hover:bg-[#222222] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] transition-colors cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-[18px]">format_size</span>
          </button>
        </div>
      </header>

      {/* Reader Settings Floating Dropdown */}
      {showSettingsModal && (
        <div className="max-w-[1200px] mx-auto w-full px-4 md:px-12 flex justify-end">
          <div className="bg-[#1A1A1A] border border-[#333333] p-4 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] w-64 mt-2 z-40 animate-fade-in flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#333333]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888]">
                Typography Scale
              </span>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-[#888888] hover:text-[#D4AF37] text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-[#141414] p-1 border border-[#282828]">
              <button
                onClick={() => setFontSize('normal')}
                className={`py-1.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors ${
                  fontSize === 'normal' ? 'bg-[#D4AF37] text-[#111111] font-bold' : 'text-[#AAAAAA]'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`py-1.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors ${
                  fontSize === 'large' ? 'bg-[#D4AF37] text-[#111111] font-bold' : 'text-[#AAAAAA]'
                }`}
              >
                Large
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`py-1.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors ${
                  fontSize === 'xlarge' ? 'bg-[#D4AF37] text-[#111111] font-bold' : 'text-[#AAAAAA]'
                }`}
              >
                XL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Editorial Container */}
      <main className="flex-grow w-full max-w-[800px] mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col justify-between">
        <article className="animate-fade-in">
          {/* Chapter Header */}
          <div className="mb-10 text-center md:text-left">
            <span className="font-sans text-[10px] font-semibold tracking-[0.4em] text-[#888888] uppercase mb-2 block font-light">
              Chapter 0{currentPage.pageNumber} // Reader
            </span>
            <h1 className="font-serif italic text-[34px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-3">
              The Unexpected Journey
            </h1>
            <div className="w-12 h-[1px] bg-[#D4AF37]" />
          </div>

          {/* Paragraphs with parallel bilingual translations */}
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
                    <p className="font-sans text-[15px] leading-[26px] text-[#AAAAAA]">
                      {currentPage.hindi[idx]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Bottom Pagination */}
        <div className="mt-16 pt-8 border-t border-[#333333] flex items-center justify-between">
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
            Previous
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
            Next
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};
