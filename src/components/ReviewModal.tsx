import React, { useState } from 'react';
import { MistakeItem } from '../types';

interface ReviewModalProps {
  mistake: MistakeItem | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ mistake, onClose }) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!mistake) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 max-w-xl w-full shadow-[0px_16px_48px_rgba(0,0,0,0.8)] relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <span className="border border-[#D4AF37]/40 bg-[#262010] text-[#D4AF37] text-[9px] font-semibold px-2.5 py-0.5 uppercase tracking-[0.25em]">
              {mistake.category}
            </span>
            <h3 className="font-serif italic text-2xl font-light text-[#EFEFEF]">
              {mistake.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-5 space-y-4">
          <p className="font-sans text-sm md:text-base text-[#AAAAAA] leading-relaxed">
            {mistake.explanation}
          </p>

          <div className="space-y-3">
            {/* Incorrect */}
            <div className="bg-[#241717] border border-[#482828] p-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#E07A7A] text-lg mt-0.5">cancel</span>
              <div>
                <span className="text-[9px] font-semibold text-[#E07A7A] uppercase tracking-[0.25em] block">
                  Avoid
                </span>
                <span className="text-sm line-through text-[#DDAAAA] opacity-80 font-serif italic">
                  {mistake.incorrectExample}
                </span>
              </div>
            </div>

            {/* Correct */}
            <div className="bg-[#19241B] border border-[#2B4B32] p-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#68BA89] text-lg mt-0.5">
                check_circle
              </span>
              <div>
                <span className="text-[9px] font-semibold text-[#68BA89] uppercase tracking-[0.25em] block">
                  Preferred Idiom
                </span>
                <span className="text-sm font-serif italic text-[#EFEFEF]">
                  {mistake.correctExample}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Quiz Check */}
          <div className="bg-[#141414] border border-[#2B2B2B] p-4 mt-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Micro-Verification
            </span>
            <p className="text-sm text-[#CCCCCC] mb-3">
              {mistake.id === 'mistake-1'
                ? 'Select appropriate modifier: "How _____ homework do you have left?"'
                : 'Which form preserves correct prepositional syntax?'}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedOption(1);
                  setQuizAnswered(true);
                }}
                className={`p-2.5 text-xs font-medium border text-left transition-all cursor-pointer ${
                  selectedOption === 1
                    ? 'bg-[#19241B] border-[#2B4B32] text-[#84C99A]'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#AAAAAA] hover:border-[#D4AF37]'
                }`}
              >
                {mistake.id === 'mistake-1' ? 'A) much' : 'A) Looking forward to see'}
              </button>

              <button
                onClick={() => {
                  setSelectedOption(2);
                  setQuizAnswered(true);
                }}
                className={`p-2.5 text-xs font-medium border text-left transition-all cursor-pointer ${
                  selectedOption === 2
                    ? 'bg-[#241717] border-[#482828] text-[#E07A7A]'
                    : 'bg-[#1A1A1A] border-[#333333] text-[#AAAAAA] hover:border-[#D4AF37]'
                }`}
              >
                {mistake.id === 'mistake-1' ? 'B) many' : 'B) Looking forward to seeing'}
              </button>
            </div>

            {quizAnswered && (
              <p className="text-xs text-[#D4AF37] font-medium mt-3 animate-fade-in flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified</span>
                {selectedOption === (mistake.id === 'mistake-1' ? 1 : 2)
                  ? 'Accurate deduction. The rule has been noted.'
                  : 'Notice: Re-examine the prepositional rule above.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-6 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
