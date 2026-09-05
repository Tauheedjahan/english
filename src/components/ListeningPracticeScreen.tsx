import React, { useState, useEffect } from 'react';
import { StepRestrictionModal } from './StepRestrictionModal';

interface ListeningPracticeScreenProps {
  dayNumber?: number;
  topic?: string;
  listeningTitle?: string;
  youtubeUrl: string;
  onUpdateYoutubeUrl: (url: string) => void;
  onBackToLessons: () => void;
  onFinishListening: () => void;
  onOpenReadingPractice?: () => void;
  onOpenTranslationPractice?: () => void;
  onOpenAIConversation?: () => void;
  isReadingUnlocked?: boolean;
  isTranslationUnlocked?: boolean;
  isAIUnlocked?: boolean;
}

export const ListeningPracticeScreen: React.FC<ListeningPracticeScreenProps> = ({
  dayNumber = 1,
  topic,
  listeningTitle,
  youtubeUrl,
  onUpdateYoutubeUrl,
  onBackToLessons,
  onFinishListening,
  onOpenReadingPractice,
  onOpenTranslationPractice,
  onOpenAIConversation,
  isReadingUnlocked = false,
  isTranslationUnlocked = false,
  isAIUnlocked = false,
}) => {
  const [showEditUrl, setShowEditUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(youtubeUrl);
  const [hasWatchedVideo, setHasWatchedVideo] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    targetStepTitle: string;
    requiredStepTitle: string;
    requiredStepNumber: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    setInputUrl(youtubeUrl);
  }, [youtubeUrl]);

  // Extract YouTube ID for embed
  const getYoutubeEmbedUrl = (url: string) => {
    try {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } catch {
      // Fallback
    }
    return 'https://www.youtube-nocookie.com/embed/RcGyVTAoXEU?autoplay=0&rel=0';
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUpdateYoutubeUrl(inputUrl.trim());
      setShowEditUrl(false);
    }
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
  const isKellyMcgonigalVideo = youtubeUrl.includes('RcGyVTAoXEU');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-[#111827]">
      {/* Edit URL Modal / Dropdown */}
      {showEditUrl && (
        <div className="max-w-[1000px] mx-auto w-full px-4 md:px-12 mt-3 animate-fade-in z-20">
          <form
            onSubmit={handleSaveUrl}
            className="bg-white border border-[#1B4D3E]/40 p-4 md:p-6 shadow-[0px_8px_32px_rgba(27,77,62,0.08)] flex flex-col sm:flex-row items-center gap-4 rounded-sm"
          >
            <div className="flex-1 w-full">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1B4D3E] mb-1.5 font-bold">
                Set YouTube Video URL
              </label>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white border border-[#CBD5E1] focus:border-[#1B4D3E] px-4 py-2 text-[14px] text-[#111827] outline-none rounded-sm"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-2.5 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
              >
                Save URL
              </button>
              <button
                type="button"
                onClick={() => setShowEditUrl(false)}
                className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] text-[11px] uppercase tracking-[0.2em] px-4 py-2.5 transition-colors cursor-pointer rounded-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-12 py-8 md:py-10 flex flex-col pb-24">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-[#E8F2EE] text-[#1B4D3E] font-sans text-[9px] font-bold uppercase tracking-[0.3em] border border-[#1B4D3E]/20 rounded-xs">
                Day {dayNumber.toString().padStart(2, '0')} // Step 1 of 4
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#4B5563] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#E2E8E5] rounded-xs">
                <span className="material-symbols-outlined text-[13px] text-[#1B4D3E]">headphones</span>
                Listening Mastery
              </span>
            </div>

            {/* Edit YouTube Link Button */}
            <button
              onClick={() => setShowEditUrl(!showEditUrl)}
              className="text-[10px] uppercase tracking-[0.2em] text-[#4B5563] hover:text-[#1B4D3E] border border-[#E2E8E5] hover:border-[#1B4D3E]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer bg-white shadow-xs font-medium"
            >
              <span className="material-symbols-outlined text-[14px] text-[#1B4D3E]">link</span>
              <span>Edit Video Link</span>
            </button>
          </div>

          <h1 className="font-serif italic text-[32px] md:text-[44px] font-medium text-[#111827] mb-3">
            {listeningTitle || (isKellyMcgonigalVideo
              ? 'How to Make Stress Your Friend — Kelly McGonigal'
              : topic || 'The Science of Morning Routines & Productive Habits')}
          </h1>
          <div className="w-12 h-[2px] bg-[#1B4D3E] mb-3 md:mx-0 mx-auto"></div>
          <p className="font-sans text-[14px] md:text-[16px] leading-relaxed text-[#4B5563] max-w-2xl">
            {topic ? <span className="font-semibold text-[#111827]">Theme: {topic}. </span> : null}
            Watch and listen carefully to the video. Observe how natural pauses, phrasal verbs, and habitual structures are spoken in real cadence.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="w-full bg-white border border-[#E2E8E5] overflow-hidden mb-8 shadow-[0px_8px_32px_rgba(27,77,62,0.06)] rounded-sm">
          {/* Responsive YouTube Embed Container */}
          <div className="relative w-full pb-[56.25%] bg-[#000000]">
            <iframe
              src={embedUrl}
              title="YouTube English Learning Video"
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Video Action Toolbar */}
          <div className="p-4 md:p-5 bg-[#F8FAF9] border-t border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#b00000] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-2.5 rounded-sm transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                Watch on YouTube
              </a>
            </div>

            <div className="text-[11px] text-[#6B7280] font-mono truncate max-w-xs">
              Link: <span className="text-[#374151]">{youtubeUrl}</span>
            </div>
          </div>
        </div>

        {/* Completion Action Bar */}
        <div className="mt-auto pt-6 border-t border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] text-[#111827]">
              <input
                type="checkbox"
                checked={hasWatchedVideo}
                onChange={(e) => setHasWatchedVideo(e.target.checked)}
                className="w-4 h-4 text-[#1B4D3E] accent-[#1B4D3E] rounded border-[#CBD5E1] cursor-pointer"
              />
              <span className="font-medium">
                I have watched and listened to this complete video session
              </span>
            </label>
            <div className="text-[11px] text-[#6B7280]">
              Completing the video listening is required to unlock Step 2 (Reading Guide).
            </div>
          </div>

          <button
            onClick={() => {
              if (!hasWatchedVideo) {
                setModalInfo({
                  isOpen: true,
                  targetStepTitle: 'Step 02: Companion Reading (PDF Guide)',
                  requiredStepTitle: 'Video Listening Session',
                  requiredStepNumber: 1,
                  message: 'You cannot advance to Step 02 (Reading) yet. Please confirm that you have watched and listened to the video session to train your ear for native rhythm and pronunciation.',
                });
              } else {
                onFinishListening();
              }
            }}
            className="bg-[#1B4D3E] hover:bg-[#153E32] text-white w-full sm:w-auto px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0px_4px_24px_rgba(27,77,62,0.2)] cursor-pointer group rounded-sm"
          >
            Complete Listening → Unlock Reading
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
            }}
          />
        )}
      </main>
    </div>
  );
};
