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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E2E8E5] p-6 md:p-8 max-w-xl w-full shadow-2xl relative rounded-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <span className="border border-[#1B4D3E]/30 bg-[#E8F2EE] text-[#1B4D3E] text-[9px] font-bold px-2.5 py-0.5 uppercase tracking-[0.25em] rounded-xs">
              {mistake.category}
            </span>
            <h3 className="font-serif italic text-2xl font-medium text-[#111827]">
              {mistake.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#1B4D3E] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="py-5 space-y-4">
          <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed">
            {mistake.explanation}
          </p>

          <div className="space-y-3">
            {/* Incorrect */}
            <div className="bg-[#FEE2E2] border border-[#EF4444]/30 p-3.5 flex items-start gap-3 rounded-xs">
              <span className="material-symbols-outlined text-[#DC2626] text-lg mt-0.5">cancel</span>
              <div>
                <span className="text-[9px] font-bold text-[#DC2626] uppercase tracking-[0.25em] block">
                  Avoid
                </span>
                <span className="text-sm line-through text-[#991B1B] font-serif italic">
                  {mistake.incorrectExample}
                </span>
              </div>
            </div>

            {/* Correct */}
            <div className="bg-[#E8F2EE] border border-[#1B4D3E]/30 p-3.5 flex items-start gap-3 rounded-xs">
              <span className="material-symbols-outlined text-[#1B4D3E] text-lg mt-0.5">
                check_circle
              </span>
              <div>
                <span className="text-[9px] font-bold text-[#1B4D3E] uppercase tracking-[0.25em] block">
                  Preferred Idiom
                </span>
                <span className="text-sm font-serif italic text-[#1B4D3E] font-medium">
                  {mistake.correctExample}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Quiz Check */}
          <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-4 mt-4 rounded-sm">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#1B4D3E] block mb-2">
              Micro-Verification
            </span>
            <p className="text-sm text-[#374151] mb-3 font-medium">
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
                className={`p-2.5 text-xs font-medium border text-left transition-all cursor-pointer rounded-xs ${
                  selectedOption === 1
                    ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold'
                    : 'bg-white border-[#CBD5E1] text-[#4B5563] hover:border-[#1B4D3E]'
                }`}
              >
                {mistake.id === 'mistake-1' ? 'A) much' : 'A) Looking forward to see'}
              </button>

              <button
                onClick={() => {
                  setSelectedOption(2);
                  setQuizAnswered(true);
                }}
                className={`p-2.5 text-xs font-medium border text-left transition-all cursor-pointer rounded-xs ${
                  selectedOption === 2
                    ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold'
                    : 'bg-white border-[#CBD5E1] text-[#4B5563] hover:border-[#1B4D3E]'
                }`}
              >
                {mistake.id === 'mistake-1' ? 'B) many' : 'B) Looking forward to seeing'}
              </button>
            </div>

            {quizAnswered && (
              <p className="text-xs text-[#1B4D3E] font-semibold mt-3 animate-fade-in flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified</span>
                {selectedOption === (mistake.id === 'mistake-1' ? 1 : 2)
                  ? 'Accurate deduction. The rule has been noted.'
                  : 'Notice: Re-examine the rule above.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-6 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors cursor-pointer rounded-sm"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
