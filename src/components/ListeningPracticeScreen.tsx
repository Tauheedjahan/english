import React, { useState, useEffect } from 'react';

interface ListeningPracticeScreenProps {
  youtubeUrl: string;
  onUpdateYoutubeUrl: (url: string) => void;
  onBackToLessons: () => void;
  onFinishListening: () => void;
}

export const ListeningPracticeScreen: React.FC<ListeningPracticeScreenProps> = ({
  youtubeUrl,
  onUpdateYoutubeUrl,
  onBackToLessons,
  onFinishListening,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEditUrl, setShowEditUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(youtubeUrl);
  const [showCaptions, setShowCaptions] = useState(true);

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
    <div className="min-h-screen flex flex-col font-sans bg-[#111111] text-[#EFEFEF]">
      {/* Workflow Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#333333] px-4 md:px-12 h-18 max-w-[1200px] mx-auto w-full flex items-center justify-between bg-[#111111]/95 backdrop-blur-md">
        <button
          onClick={onBackToLessons}
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
          <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5 bg-[#262010] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            1. Listening
          </span>
          <span className="text-[#444444]">→</span>
          <span className="text-[#666666] hidden sm:inline">2. Reading</span>
          <span className="text-[#444444] hidden sm:inline">→</span>
          <span className="text-[#666666] hidden sm:inline">3. Translation (41)</span>
          <span className="text-[#444444] hidden sm:inline">→</span>
          <span className="text-[#666666] hidden md:inline">4. AI Conversation</span>
        </div>

        {/* Edit YouTube Link Button */}
        <button
          onClick={() => setShowEditUrl(!showEditUrl)}
          className="text-[10px] uppercase tracking-[0.2em] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] hover:border-[#D4AF37]/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer bg-[#1A1A1A]"
        >
          <span className="material-symbols-outlined text-[14px]">link</span>
          <span className="hidden sm:inline">Edit Video Link</span>
        </button>
      </header>

      {/* Edit URL Modal / Dropdown */}
      {showEditUrl && (
        <div className="max-w-[1200px] mx-auto w-full px-4 md:px-12 mt-3 animate-fade-in z-20">
          <form
            onSubmit={handleSaveUrl}
            className="bg-[#1A1A1A] border border-[#D4AF37]/50 p-4 md:p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="flex-1 w-full">
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1 font-semibold">
                Set YouTube Video URL (Add your custom link manually anytime)
              </label>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] px-4 py-2 text-[14px] text-[#EFEFEF] outline-none"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] text-[11px] uppercase tracking-[0.2em] font-semibold px-6 py-2.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                Save URL
              </button>
              <button
                type="button"
                onClick={() => setShowEditUrl(false)}
                className="bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] text-[11px] uppercase tracking-[0.2em] px-4 py-2.5 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-[#D4AF37] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#333333]">
              Day 01 // Step 1 of 4
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-[#888888] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#333333]">
              <span className="material-symbols-outlined text-[13px] text-[#D4AF37]">headphones</span>
              Listening Mastery
            </span>
          </div>

          <h1 className="font-serif italic text-[32px] md:text-[44px] font-light text-[#EFEFEF] mb-3">
            {isKellyMcgonigalVideo
              ? 'How to Make Stress Your Friend — Kelly McGonigal'
              : 'The Science of Morning Routines & Productive Habits'}
          </h1>
          <div className="w-12 h-[1px] bg-[#D4AF37] mb-3 md:mx-0 mx-auto"></div>
          <p className="font-sans text-[14px] md:text-[16px] leading-relaxed text-[#AAAAAA] max-w-2xl">
            {isKellyMcgonigalVideo
              ? 'Watch and listen to psychologist Kelly McGonigal’s TED Talk. Pay close attention to spoken cadence, rhetorical questions, and how she explains transforming anxiety into courage and connection.'
              : 'Watch and listen carefully to the video. Observe how natural pauses, phrasal verbs, and habitual structures like "used to" and "kick-start" are spoken in real cadence.'}
          </p>
        </div>

        {/* Video Player Container */}
        <div className="w-full bg-[#1A1A1A] border border-[#333333] overflow-hidden mb-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          {/* Responsive YouTube Embed Container */}
          <div className="relative w-full pb-[56.25%] bg-[#0A0A0A]">
            <iframe
              src={embedUrl}
              title="YouTube English Learning Video"
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Video Action Toolbar */}
          <div className="p-4 md:p-6 bg-[#161616] border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#b00000] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-2.5 rounded transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                Watch on YouTube
              </a>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`text-[10px] uppercase tracking-[0.2em] px-3 py-2 rounded border transition-colors cursor-pointer ${
                  showCaptions
                    ? 'bg-[#262010] text-[#D4AF37] border-[#D4AF37]/50'
                    : 'bg-[#1A1A1A] text-[#888888] border-[#333333] hover:text-[#EFEFEF]'
                }`}
              >
                {showCaptions ? 'Hide Key Highlights' : 'Show Key Highlights'}
              </button>
            </div>

            <div className="text-[11px] text-[#888888] font-mono truncate max-w-xs">
              Link: <span className="text-[#AAAAAA]">{youtubeUrl}</span>
            </div>
          </div>
        </div>

        {/* Key Vocabulary & Video Highlights */}
        {showCaptions && (
          <div className="w-full bg-[#1A1A1A] border border-[#333333] p-6 mb-8 shadow-sm">
            <h3 className="font-serif italic text-[20px] text-[#EFEFEF] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4AF37] text-[20px]">lightbulb</span>
              Essential Expressions from this Video
            </h3>
            {isKellyMcgonigalVideo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    1. "Rise to the challenge"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    To respond courageously to a difficult demand or stressful task. <span className="text-[#888888] italic">("Your pounding heart is preparing you to rise to the challenge.")</span>
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    2. "Reach out to others"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    To seek or give human support and connection. <span className="text-[#888888] italic">("A natural instinct under pressure is to reach out and connect.")</span>
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    3. "The biology of courage"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    How understanding your body's physiological reaction transforms anxiety into inner strength and resilience.
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    4. "Make stress your friend"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    Reframing stress as a helpful, empowering physiological ally rather than a harmful burden.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    1. "Kick-start the day"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    To give vigorous momentum to your morning. <span className="text-[#888888] italic">("A warm glass of water kick-starts my digestive system.")</span>
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    2. "Used to [base verb]"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    Past discontinued habits. <span className="text-[#888888] italic">("I used to wake up late, but now my daily routine has changed.")</span>
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    3. "Wake up" vs "Get out of bed"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    "Wake up" is the cessation of sleep; "get out of bed" is physical movement.
                  </p>
                </div>

                <div className="border border-[#282828] bg-[#141414] p-3.5">
                  <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    4. "Prioritize over"
                  </span>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    To choose what matters most. <span className="text-[#888888] italic">("I prioritize early sleep rather than scrolling through my phone.")</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Action Bar */}
        <div className="mt-auto pt-6 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-[#888888]">
            Watched and listened to the video? Click below to unlock the related PDF Reading guide.
          </div>

          <button
            onClick={onFinishListening}
            className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] w-full sm:w-auto px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0px_4px_24px_rgba(212,175,55,0.25)] cursor-pointer group"
          >
            Complete Listening → Unlock Reading
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
