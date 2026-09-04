import React, { useState, useEffect } from 'react';
import { DAY_1_TRANSLATION_SENTENCES } from '../data/translationSentences';
import { SentenceRecord } from '../types';

interface TranslationScreenProps {
  completedSentenceIds: number[];
  onSentenceCompleted: (sentenceId: number) => void;
  onCompleteAllForDemo: () => void;
  onFinishTranslation: () => void;
  onBackToLessons: () => void;
  sentences?: SentenceRecord[];
  dayNumber?: number;
  topic?: string;
}

export const TranslationScreen: React.FC<TranslationScreenProps> = ({
  completedSentenceIds,
  onSentenceCompleted,
  onCompleteAllForDemo,
  onFinishTranslation,
  onBackToLessons,
  sentences,
  dayNumber = 1,
  topic = 'Lesson Translation',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'near' | 'incorrect';
    message: string;
  }>({ status: 'idle', message: '' });
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNavigatorModal, setShowNavigatorModal] = useState(false);

  // Use provided sentences or fallback to DAY_1_TRANSLATION_SENTENCES
  const sentenceList = (sentences && sentences.length > 0) ? sentences : (DAY_1_TRANSLATION_SENTENCES as any as SentenceRecord[]);
  const currentSentence: SentenceRecord =
    sentenceList[currentIndex] || sentenceList[0];
  const totalSentences = sentenceList.length;

  const isCurrentCompleted = completedSentenceIds.includes(currentSentence.id);
  const totalCompleted = completedSentenceIds.filter((id) =>
    sentenceList.some((s) => s.id === id)
  ).length;
  const isAllCompleted = totalCompleted >= totalSentences;


  // Clear inputs when navigating between sentences
  useEffect(() => {
    setUserInput('');
    setFeedback({ status: 'idle', message: '' });
    setShowHint(false);
    setShowAnswer(false);
  }, [currentIndex]);

  // Speech synthesis for pronunciation
  const speakSentence = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition (Microphone)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your translation directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: { results: { [x: string]: { [x: string]: { transcript: string } } } }) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Check translation logic
  const handleCheckTranslation = () => {
    if (!userInput.trim()) {
      setFeedback({
        status: 'incorrect',
        message: 'Please write or speak your translation first.',
      });
      return;
    }

    const clean = (str: string) =>
      str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const cleanInput = clean(userInput);
    const cleanExpected = clean(currentSentence.english);
    const cleanAlternatives = currentSentence.alternatives.map(clean);

    const isExact = cleanInput === cleanExpected;
    const isAltMatch = cleanAlternatives.includes(cleanInput);

    if (isExact || isAltMatch) {
      setFeedback({
        status: 'correct',
        message: 'Accurate translation! Excellent vocabulary and sentence flow.',
      });
      onSentenceCompleted(currentSentence.id);
      speakSentence(currentSentence.english);
    } else {
      // Check partial word overlap
      const expectedWords = cleanExpected.split(' ');
      const inputWords = cleanInput.split(' ');
      const matchingWords = inputWords.filter((w) => expectedWords.includes(w));
      const matchRatio = matchingWords.length / Math.max(expectedWords.length, 1);

      if (matchRatio >= 0.6) {
        setFeedback({
          status: 'near',
          message: 'Very close! Review the natural phrasing below and compare with yours.',
        });
        onSentenceCompleted(currentSentence.id);
      } else {
        setFeedback({
          status: 'incorrect',
          message: 'Not quite. Check the hint or reveal the correct English phrasing below.',
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSentences - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#111111] text-[#EFEFEF]">
      {/* Workflow Header Bar */}
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
          <span className="text-[#68BA89] hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span>
            1. Listening
          </span>
          <span className="text-[#444444] hidden sm:inline">→</span>
          <span className="text-[#68BA89] hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check</span>
            2. Reading
          </span>
          <span className="text-[#444444] hidden sm:inline">→</span>
          <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5 bg-[#262010] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            3. Translation ({totalSentences})
          </span>
          <span className="text-[#444444]">→</span>
          <span className="text-[#666666] hidden md:inline">4. AI Conversation</span>
        </div>

        {/* Sentence Grid Selector Button */}
        <button
          onClick={() => setShowNavigatorModal(true)}
          className="text-[10px] uppercase tracking-[0.2em] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] hover:border-[#D4AF37]/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer bg-[#1A1A1A]"
        >
          <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
          <span>{totalCompleted} / {totalSentences}</span>
        </button>
      </header>

      {/* Navigator Modal (Shows all 41 sentences) */}
      {showNavigatorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-[#333333] mb-4">
              <div>
                <h3 className="font-serif italic text-[20px] text-[#EFEFEF]">
                  41 Translation Sentences Directory
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  Completed: {totalCompleted} of {totalSentences} ({Math.round((totalCompleted / totalSentences) * 100)}%)
                </span>
              </div>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="text-[#888888] hover:text-[#D4AF37] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-9 gap-2 overflow-y-auto p-1 flex-grow">
              {DAY_1_TRANSLATION_SENTENCES.map((item, idx) => {
                const isDone = completedSentenceIds.includes(item.id);
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowNavigatorModal(false);
                    }}
                    className={`h-11 rounded flex flex-col items-center justify-center border text-xs font-mono transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#D4AF37] bg-[#262010] text-[#D4AF37] font-bold shadow-md'
                        : isDone
                        ? 'border-[#68BA89]/50 bg-[#16241b] text-[#68BA89]'
                        : 'border-[#333333] bg-[#141414] text-[#888888] hover:border-[#555555]'
                    }`}
                  >
                    <span>{item.id}</span>
                    {isDone && (
                      <span className="material-symbols-outlined text-[10px] text-[#68BA89]">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#333333] mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  onCompleteAllForDemo();
                  setShowNavigatorModal(false);
                }}
                className="text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-[#D4AF37] cursor-pointer"
              >
                [Fast-Track All 41 for Testing]
              </button>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[850px] mx-auto px-4 md:px-12 py-8 md:py-10 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Progress Bar & Counter */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#888888]">
              <span className="text-[#D4AF37] font-semibold">
                Sentence {currentIndex + 1} of {totalSentences}
              </span>
              <span>
                {totalCompleted} Completed ({Math.round((totalCompleted / totalSentences) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#1A1A1A] h-[3px] border border-[#282828] overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSentences) * 100}%` }}
              />
            </div>
          </div>

          {/* Sentence Card */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#D4AF37] text-[9px] uppercase tracking-[0.3em] font-semibold px-3 py-1 rounded-full bg-[#262010] border border-[#D4AF37]/30">
                {(currentSentence as any).category || currentSentence.difficulty || 'Everyday Fluency'}
              </span>

              {isCurrentCompleted && (
                <span className="text-[#68BA89] text-[9px] uppercase tracking-[0.2em] font-medium flex items-center gap-1 bg-[#16241b] px-3 py-1 rounded-full border border-[#68BA89]/40">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Mastered
                </span>
              )}
            </div>

            {/* Hindi Prompt */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#888888] mb-1 font-light">
                Translate into English:
              </div>
              <h2 className="font-serif italic text-[24px] md:text-[30px] leading-relaxed text-[#EFEFEF]">
                "{currentSentence.hindi}"
              </h2>
            </div>

            {/* English User Input Field */}
            <div className="mb-4">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCheckTranslation();
                    }
                  }}
                  placeholder="Type your English translation here (e.g. I usually wake up...)"
                  rows={2}
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#D4AF37] p-4 text-[16px] font-sans text-[#EFEFEF] outline-none resize-none transition-colors pr-14"
                />

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title="Speak translation using microphone"
                  className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                    isListening
                      ? 'bg-[#CC0000] text-white border-[#CC0000] animate-pulse'
                      : 'bg-[#1A1A1A] hover:bg-[#222222] text-[#AAAAAA] hover:text-[#D4AF37] border-[#333333]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isListening ? 'mic' : 'mic_none'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons: Check, Hint, Show Answer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckTranslation}
                  className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-3 cursor-pointer transition-colors shadow-sm"
                >
                  Check Translation
                </button>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-[#141414] hover:bg-[#222222] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] text-[10px] uppercase tracking-[0.2em] px-4 py-3 cursor-pointer transition-colors"
                >
                  {showHint ? 'Hide Hint' : 'Vocabulary Hint'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer px-2 py-2"
                >
                  {showAnswer ? 'Hide Solution' : 'Reveal Solution'}
                </button>

                <button
                  onClick={() => speakSentence(currentSentence.english)}
                  title="Listen to English pronunciation"
                  className="w-9 h-9 rounded-full bg-[#141414] hover:bg-[#222222] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-4 p-3.5 bg-[#141414] border-l-2 border-[#D4AF37] text-[13px] text-[#CCCCCC] animate-fade-in">
                <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[9px] block mb-1">
                  Vocabulary & Grammar Hint:
                </span>
                <p>{currentSentence.hint}</p>
                {(currentSentence.key_grammar || (currentSentence as any).keyGrammar) && (
                  <p className="text-[#888888] text-[11px] mt-1 italic">
                    {currentSentence.key_grammar || (currentSentence as any).keyGrammar}
                  </p>
                )}
              </div>
            )}

            {/* Feedback Display */}
            {feedback.status !== 'idle' && (
              <div
                className={`mt-4 p-4 border text-[13px] animate-fade-in ${
                  feedback.status === 'correct'
                    ? 'bg-[#16241b] border-[#68BA89]/50 text-[#9fe6b9]'
                    : feedback.status === 'near'
                    ? 'bg-[#262010] border-[#D4AF37]/50 text-[#f5db8f]'
                    : 'bg-[#2b1616] border-[#e06d6d]/50 text-[#fca5a5]'
                }`}
              >
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {feedback.status === 'correct' ? 'check_circle' : feedback.status === 'near' ? 'info' : 'cancel'}
                  </span>
                  {feedback.message}
                </div>

                {/* Show standard answer on error or near match */}
                {feedback.status !== 'correct' && (
                  <div className="mt-2 text-xs text-[#EFEFEF] pt-2 border-t border-white/10">
                    Expected: <span className="font-medium text-[#D4AF37]">"{currentSentence.english}"</span>
                  </div>
                )}
              </div>
            )}

            {/* Solution Display */}
            {showAnswer && (
              <div className="mt-4 p-4 bg-[#141414] border border-[#333333] animate-fade-in text-[13px]">
                <div className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1 font-semibold">
                  Standard English Phrasing:
                </div>
                <div className="text-[#EFEFEF] font-medium text-base mb-2">
                  "{currentSentence.english}"
                </div>
                {currentSentence.alternatives.length > 0 && (
                  <div className="text-xs text-[#888888] space-y-1">
                    <span className="block text-[9px] uppercase tracking-wider text-[#666666]">
                      Acceptable Variations:
                    </span>
                    {currentSentence.alternatives.map((alt, i) => (
                      <div key={i} className="italic">
                        • {alt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation & Unlock AI Conversation */}
        <div className="mt-10 pt-6 border-t border-[#333333] space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors ${
                currentIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#666666]'
                  : 'hover:text-[#D4AF37] text-[#AAAAAA] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Previous Sentence
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalSentences - 1}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors ${
                currentIndex === totalSentences - 1
                  ? 'opacity-30 cursor-not-allowed text-[#666666]'
                  : 'hover:text-[#D4AF37] text-[#AAAAAA] cursor-pointer'
              }`}
            >
              Next Sentence
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* AI Conversation Unlock Section */}
          <div
            className={`p-5 border transition-all ${
              isAllCompleted
                ? 'bg-[#262010] border-[#D4AF37] shadow-[0px_4px_24px_rgba(212,175,55,0.2)]'
                : 'bg-[#1A1A1A] border-[#333333]'
            } flex flex-col sm:flex-row items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isAllCompleted ? 'text-[#D4AF37]' : 'text-[#666666]'
                  }`}
                >
                  {isAllCompleted ? 'lock_open' : 'lock'}
                </span>
                <h4 className="font-serif italic text-[18px] text-[#EFEFEF]">
                  Step 4: AI Conversation Practice
                </h4>
              </div>
              <p className="text-[12px] text-[#AAAAAA]">
                {isAllCompleted
                  ? `All ${totalSentences} sentences completed! You are fully prepared for the spoken AI conversation.`
                  : `Complete all ${totalSentences} sentences to unlock the AI Conversation (${totalCompleted} of ${totalSentences} completed).`}
              </p>
            </div>

            {isAllCompleted ? (
              <button
                onClick={onFinishTranslation}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_24px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap animate-pulse"
              >
                Unlock AI Conversation →
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </button>
            ) : (
              <button
                onClick={onCompleteAllForDemo}
                className="text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-[#D4AF37] underline cursor-pointer"
              >
                [Mark All {totalSentences} Done for Fast Testing]
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
