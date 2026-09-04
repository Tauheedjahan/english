import React from 'react';

export interface StepRestrictionModalProps {
  isOpen: boolean;
  targetStepTitle: string;
  requiredStepTitle: string;
  requiredStepNumber: number;
  message?: string;
  onClose: () => void;
  onGoToRequired: () => void;
}

export const StepRestrictionModal: React.FC<StepRestrictionModalProps> = ({
  isOpen,
  targetStepTitle,
  requiredStepTitle,
  requiredStepNumber,
  message,
  onClose,
  onGoToRequired,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white border border-[#E2E8E5] w-full max-w-[480px] p-6 md:p-8 shadow-[0px_16px_48px_rgba(27,77,62,0.15)] relative rounded-sm animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Forest Green Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1B4D3E] rounded-t-sm" />

        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#111827] transition-colors p-1 cursor-pointer"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header with Lock Icon */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B45309] font-bold block mb-1">
              Prerequisite Incomplete
            </span>
            <h3 className="font-serif italic text-2xl text-[#111827] font-medium leading-tight">
              Complete Step 0{requiredStepNumber} First
            </h3>
          </div>
        </div>

        {/* Explanation Message */}
        <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-4 mb-6 rounded-xs">
          <p className="text-xs md:text-[13px] text-[#374151] leading-relaxed">
            {message || (
              <>
                You cannot access <strong className="text-[#111827] font-semibold">{targetStepTitle}</strong> yet.
                In this 90-day learning method, each daily step builds directly upon the previous one. Please complete{' '}
                <strong className="text-[#1B4D3E] font-semibold">{requiredStepTitle}</strong> first.
              </>
            )}
          </p>
        </div>

        {/* Step Sequence Visualizer */}
        <div className="mb-6 px-1">
          <div className="text-[9px] uppercase tracking-[0.25em] text-[#6B7280] font-semibold mb-2.5">
            Lesson Progression Flow
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
            <div
              className={`p-2 rounded-xs border ${
                requiredStepNumber === 1
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold ring-1 ring-[#1B4D3E]'
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <span className="block text-[8px] uppercase">Step 1</span>
              <span className="truncate block font-medium">Listening</span>
            </div>
            <div
              className={`p-2 rounded-xs border ${
                requiredStepNumber === 2
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold ring-1 ring-[#1B4D3E]'
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <span className="block text-[8px] uppercase">Step 2</span>
              <span className="truncate block font-medium">Reading</span>
            </div>
            <div
              className={`p-2 rounded-xs border ${
                requiredStepNumber === 3
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold ring-1 ring-[#1B4D3E]'
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <span className="block text-[8px] uppercase">Step 3</span>
              <span className="truncate block font-medium">Translation</span>
            </div>
            <div
              className={`p-2 rounded-xs border ${
                requiredStepNumber === 4
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E] font-bold ring-1 ring-[#1B4D3E]'
                  : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              <span className="block text-[8px] uppercase">Step 4</span>
              <span className="truncate block font-medium">AI Tutor</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-[#6B7280] hover:text-[#111827] uppercase tracking-wider font-semibold cursor-pointer transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onGoToRequired}
            className="w-full sm:w-auto bg-[#1B4D3E] hover:bg-[#153E32] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs rounded-sm"
          >
            <span>Go to Step 0{requiredStepNumber}: {requiredStepTitle}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
