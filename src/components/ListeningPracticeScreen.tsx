import React, { useState, useEffect, useRef } from 'react';

interface ListeningPracticeScreenProps {
  onBackToLessons: () => void;
  onFinishListening: () => void;
}

export const ListeningPracticeScreen: React.FC<ListeningPracticeScreenProps> = ({
  onBackToLessons,
  onFinishListening,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const totalDurationSeconds = 480; // 8:00

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTimeSeconds((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return totalDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTime = (delta: number) => {
    setCurrentTimeSeconds((prev) => {
      const next = prev + delta;
      return Math.max(0, Math.min(totalDurationSeconds, next));
    });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTimeSeconds(Math.round(percentage * totalDurationSeconds));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = (currentTimeSeconds / totalDurationSeconds) * 100;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#111111] text-[#EFEFEF]">
      {/* Desktop TopAppBar (Task-Focused) */}
      <header className="docked top-0 hidden md:flex justify-between items-center w-full px-8 lg:px-12 h-20 max-w-[1200px] mx-auto border-b border-[#333333] bg-[#111111]">
        <button
          onClick={onBackToLessons}
          className="flex items-center gap-3 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-sans text-[10px] leading-5 uppercase tracking-[0.25em] font-medium">
            Back to Curriculum
          </span>
        </button>
        <div className="font-serif italic text-[22px] font-light text-[#EFEFEF]">
          90 Days English
        </div>
        <div className="w-32 text-right text-[9px] uppercase tracking-[0.25em] text-[#888888]">
          Module 01 // Audio
        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="flex md:hidden justify-between items-center w-full px-4 h-16 border-b border-[#333333] bg-[#141414]">
        <button
          onClick={onBackToLessons}
          className="material-symbols-outlined cursor-pointer text-[#888888] hover:text-[#D4AF37] p-2 -ml-2"
        >
          arrow_back
        </button>
        <div className="font-serif italic text-[18px] font-light text-[#EFEFEF]">
          90 Days English
        </div>
        <div className="w-6" />
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1000px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col pb-24">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-[#D4AF37] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#333333]">
              Intermediate B1
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-[#888888] font-sans text-[9px] font-medium uppercase tracking-[0.3em] border border-[#333333]">
              <span className="material-symbols-outlined text-[13px] text-[#D4AF37]">schedule</span> 8 min
            </span>
          </div>

          <h1 className="font-serif italic text-[32px] md:text-[44px] font-light text-[#EFEFEF] mb-3">
            Listening Studio: Daily Routines
          </h1>
          <div className="w-12 h-[1px] bg-[#D4AF37] mb-3 md:mx-0 mx-auto"></div>
          <p className="font-sans text-[14px] md:text-[16px] leading-relaxed text-[#AAAAAA] max-w-2xl">
            Listen carefully to the spoken excerpt. Pay close attention to natural pacing, reductions, and transition markers.
          </p>
        </div>

        {/* Video/Audio Media Container */}
        <div className="w-full bg-[#1A1A1A] border border-[#333333] overflow-hidden mb-8 flex flex-col shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
          {/* Media Player Visual Area */}
          <div
            onClick={togglePlay}
            className="relative w-full pt-[56.25%] bg-[#141414] group cursor-pointer overflow-hidden select-none"
          >
            {/* Hotlinked image with fallbacks */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEcnTNl2RJJsbgDWME-jUd4RuU1iCLOULsCIPQVCn2SqBBk362rWsk-rvImBbjL607P88lkbtwL0enaV94SUBAtgniCK8ImP_Oko_NtIzdb2YZ49X7Ht28hrV0-jjo0uEGoeXsihU-WL1KIhCV31kqoXMj2Q_Qv-MzNXMjzfSVF8T09EOLlazwJNt4kFEjEIA1JgjAD9-KJhT9MmME-rv_e8QAwxN2V5rZqXCaonFi5FLTFlsPOc-p')`,
              }}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/25 transition-colors duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#111111]/85 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-[#D4AF37]">
                <span className="material-symbols-outlined text-[#D4AF37] text-3xl ml-1">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </div>
            </div>

            {/* Closed Captions Overlay */}
            {showCaptions && (
              <div className="absolute bottom-4 inset-x-4 flex justify-center pointer-events-none">
                <div className="bg-[#111111]/90 border border-[#333333] text-[#EFEFEF] font-serif italic text-sm md:text-base px-6 py-2.5 max-w-xl text-center backdrop-blur-md shadow-2xl">
                  {currentTimeSeconds < 30
                    ? "Sarah: \"Every morning begins at roughly 6:30. Before answering any client emails, I make a pour-over coffee.\""
                    : currentTimeSeconds < 90
                    ? "Sarah: \"I used to rush out the door without breakfast, but recently I've established a calmer morning routine.\""
                    : "Sarah: \"Consistent habits create clarity. Notice the contrast between 'I used to do' and 'I am used to doing'.\""}
                </div>
              </div>
            )}

            {/* Simulated progress bar line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A2A2A]">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Audio Controls Bar */}
          <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#333333] bg-[#161616]">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
              <button
                onClick={() => skipTime(-10)}
                title="Rewind 10 seconds"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#222222] transition-colors text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">replay_10</span>
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#111111] flex items-center justify-center hover:bg-[#e0bd49] transition-colors shadow-[0px_0px_16px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => skipTime(10)}
                title="Forward 10 seconds"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#222222] transition-colors text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">forward_10</span>
              </button>
            </div>

            {/* Scrubber slider track */}
            <div className="flex-grow w-full px-2 md:px-4 flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#888888] w-10 text-right">
                {formatTime(currentTimeSeconds)}
              </span>

              <div
                onClick={handleSeek}
                className="flex-grow h-[3px] bg-[#2A2A2A] overflow-hidden cursor-pointer relative group"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-200 group-hover:bg-[#f0cf65]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="font-mono text-[11px] text-[#888888] w-10">
                {formatTime(totalDurationSeconds)}
              </span>
            </div>

            {/* Aux Controls */}
            <div className="flex items-center gap-2 text-[#AAAAAA] w-full md:w-auto justify-end">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                title="Toggle subtitles / closed captions"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                  showCaptions
                    ? 'bg-[#262010] text-[#D4AF37] border-[#D4AF37]'
                    : 'hover:bg-[#222222] border-[#333333] text-[#888888]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">closed_caption</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#222222] hover:text-[#D4AF37] border border-[#333333] transition-colors cursor-pointer text-[#888888]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex justify-center md:justify-end mt-auto pt-4">
          <button
            onClick={onFinishListening}
            className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] w-full md:w-auto px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0px_4px_24px_rgba(212,175,55,0.25)] cursor-pointer group"
          >
            Finish Listening Session
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
