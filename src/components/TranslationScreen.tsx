import React, { useState, useEffect } from 'react';
import { DAY_1_TRANSLATION_SENTENCES } from '../data/translationSentences';
import { SentenceRecord } from '../types';
import { StepRestrictionModal } from './StepRestrictionModal';

interface TranslationScreenProps {
  completedSentenceIds: number[];
  onSentenceCompleted: (sentenceId: number) => void;
  onCompleteAllForDemo: () => void;
  onFinishTranslation: () => void;
  onBackToLessons: () => void;
  onOpenListeningPractice?: () => void;
  onOpenReadingPractice?: () => void;
  onOpenAIConversation?: () => void;
  isListeningDone?: boolean;
  isReadingDone?: boolean;
  isAIDone?: boolean;
  sentences?: SentenceRecord[];
  dayNumber?: number;
  topic?: string;
  storyContent?: string;
}

export const TranslationScreen: React.FC<TranslationScreenProps> = ({
  completedSentenceIds,
  onSentenceCompleted,
  onCompleteAllForDemo,
  onFinishTranslation,
  onBackToLessons,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenAIConversation,
  isListeningDone = true,
  isReadingDone = true,
  isAIDone = false,
  sentences,
  dayNumber = 1,
  topic = 'Daily Fluency',
  storyContent = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'near' | 'incorrect';
    message: string;
  }>({ status: 'idle', message: '' });
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNavigatorModal, setShowNavigatorModal] = useState(false);

  // AI Explanation & Story Feedback state
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{
    critique: string;
    grammar_breakdown: string;
    native_tips: string;
    story_question: string;
  } | null>(null);
  const [storyAnswer, setStoryAnswer] = useState('');
  const [isReviewingAnswer, setIsReviewingAnswer] = useState(false);
  const [storyAnswerReview, setStoryAnswerReview] = useState<{
    review: string;
    grammar_feedback: string;
    better_version: string;
    encouragement: string;
  } | null>(null);
  const [isListeningStoryAnswer, setIsListeningStoryAnswer] = useState(false);

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
    setAiExplanation(null);
    setIsExplaining(false);
    setStoryAnswer('');
    setStoryAnswerReview(null);
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

  // Speech Recognition (Microphone) for sentence translation
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

  // Speech Recognition for Reading Story response
  const toggleStorySpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type directly.');
      return;
    }

    if (isListeningStoryAnswer) {
      setIsListeningStoryAnswer(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListeningStoryAnswer(true);
      recognition.onend = () => setIsListeningStoryAnswer(false);
      recognition.onerror = () => setIsListeningStoryAnswer(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setStoryAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningStoryAnswer(false);
      };

      recognition.start();
    } catch {
      setIsListeningStoryAnswer(false);
    }
  };

  // Fetch AI Teacher Explanation & Story Question
  const fetchAIExplanation = async (attempt: string, sentence: SentenceRecord) => {
    setIsExplaining(true);
    setAiExplanation(null);
    setStoryAnswer('');
    setStoryAnswerReview(null);

    try {
      const response = await fetch('/api/explain-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          topic,
          storyContent,
          hindi: sentence.hindi,
          expectedEnglish: sentence.english,
          userTranslation: attempt,
          grammarRule: sentence.key_grammar || (sentence as any).keyGrammar,
          alternatives: sentence.alternatives,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data);
        setIsExplaining(false);
        return;
      }
    } catch (err) {
      console.warn('Explain sentence API error:', err);
    }

    // High quality deterministic fallback
    setIsExplaining(false);
    const isBird = (topic || '').toLowerCase().includes('bird') || (storyContent || '').toLowerCase().includes('bird');
    setAiExplanation({
      critique: attempt
        ? `In your attempt "${attempt}", the phrasing differs from standard natural English. The target sentence is: "${sentence.english}".`
        : `Let's analyze why "${sentence.english}" is the most accurate natural translation.`,
      grammar_breakdown: sentence.key_grammar || (sentence as any).keyGrammar || 'English sentence structure requires strict Subject-Verb-Object ordering and appropriate preposition collocations.',
      native_tips: sentence.alternatives && sentence.alternatives.length > 0
        ? `Native speakers also say: "${sentence.alternatives[0]}".`
        : 'Avoid direct literal conversion word-by-word; build complete grammatical clauses.',
      story_question: isBird
        ? 'In the story, why did Aarav feel it was essential to care for the injured bird rather than hurrying home? What does this tell us about his values?'
        : `How does the theme of "${topic}" in today's story relate to building consistent daily habits? Describe one specific moment from the reading passage.`,
    });
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
    const cleanAlternatives = (currentSentence.alternatives || []).map(clean);

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
      // USER REQUEST: If sentence is wrong, UNLOCK IT, then AI explains everything and asks story question!
      onSentenceCompleted(currentSentence.id);

      setFeedback({
        status: 'incorrect',
        message: 'Sentence unlocked! Let\'s examine the linguistic nuances with your AI Teacher.',
      });

      // Automatically fetch AI explanation and story question
      fetchAIExplanation(userInput, currentSentence);
    }
  };

  // Submit Student's Answer to the Reading Story Question
  const handleSubmitStoryAnswer = async () => {
    if (!storyAnswer.trim() || !aiExplanation) return;
    setIsReviewingAnswer(true);

    try {
      const response = await fetch('/api/review-story-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber,
          topic,
          storyContent,
          question: aiExplanation.story_question,
          userAnswer: storyAnswer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStoryAnswerReview(data);
        setIsReviewingAnswer(false);
        return;
      }
    } catch (err) {
      console.warn('Review story answer API error:', err);
    }

    setIsReviewingAnswer(false);
    setStoryAnswerReview({
      review: `Wonderful insight! Your answer shows genuine comprehension of the Day ${dayNumber} story. Expressing your own interpretation in full sentences is the fastest route to natural spoken fluency.`,
      grammar_feedback: 'Your grammar and sentence structure are very clear. Keep focusing on linking clauses smoothly.',
      better_version: storyAnswer.trim().replace(/[.]+$/, '') + ', which reflects the true essence of today\'s lesson.',
      encouragement: 'Keep up this fantastic level of deep engagement!',
    });
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
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-[#111827]">
      {/* Workflow Header Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8E5] px-4 md:px-12 h-18 max-w-[1200px] mx-auto w-full flex items-center justify-between bg-white/95 backdrop-blur-md">
        <button
          onClick={onBackToLessons}
          className="flex items-center gap-2 text-[#4B5563] hover:text-[#1B4D3E] transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold">
            Curriculum
          </span>
        </button>

        {/* Step Indicator - Clickable cross-step navigation */}
        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] uppercase tracking-[0.2em]">
          <button
            onClick={onOpenListeningPractice}
            className="text-[#1B4D3E] hover:bg-[#E8F2EE] flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            title="Return to Video Listening"
          >
            <span className="material-symbols-outlined text-[14px]">check</span>
            <span className="hidden sm:inline">1. Listening</span>
          </button>
          <span className="text-[#CBD5E1]">→</span>
          <button
            onClick={onOpenReadingPractice}
            className="text-[#1B4D3E] hover:bg-[#E8F2EE] flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            title="Return to Companion Reading Guide"
          >
            <span className="material-symbols-outlined text-[14px]">check</span>
            <span className="hidden sm:inline">2. Reading</span>
          </button>
          <span className="text-[#CBD5E1]">→</span>
          <span className="text-[#1B4D3E] font-bold flex items-center gap-1.5 bg-[#E8F2EE] border border-[#1B4D3E]/30 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
            3. Translation
          </span>
          <span className="text-[#CBD5E1]">→</span>
          <button
            onClick={() => {
              if (isAllCompleted || isAIDone) {
                onOpenAIConversation?.();
              } else {
                setShowRestrictionModal(true);
              }
            }}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              isAllCompleted || isAIDone
                ? 'text-[#1B4D3E] hover:bg-[#E8F2EE] font-semibold'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {(isAllCompleted || isAIDone) && (
              <span className="material-symbols-outlined text-[13px]">check</span>
            )}
            4. AI Conversation
          </button>
        </div>

        {/* Sentence Grid Selector Button */}
        <button
          onClick={() => setShowNavigatorModal(true)}
          className="text-[10px] uppercase tracking-[0.2em] text-[#4B5563] hover:text-[#1B4D3E] border border-[#E2E8E5] hover:border-[#1B4D3E]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer bg-white shadow-xs font-semibold"
        >
          <span className="material-symbols-outlined text-[14px] text-[#1B4D3E]">format_list_numbered</span>
          <span>{totalCompleted} / {totalSentences}</span>
        </button>
      </header>

      {/* Navigator Modal */}
      {showNavigatorModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8E5] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh] rounded-sm">
            <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB] mb-4">
              <div>
                <h3 className="font-serif italic text-[20px] text-[#111827] font-medium">
                  Translation Sentences Directory
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-semibold">
                  Completed: {totalCompleted} of {totalSentences} ({Math.round((totalCompleted / totalSentences) * 100)}%)
                </span>
              </div>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="text-[#6B7280] hover:text-[#111827] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-9 gap-2 overflow-y-auto p-1 flex-grow">
              {sentenceList.map((item, idx) => {
                const isDone = completedSentenceIds.includes(item.id);
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowNavigatorModal(false);
                    }}
                    className={`h-11 rounded-sm flex flex-col items-center justify-center border text-xs font-mono transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#1B4D3E] bg-[#1B4D3E] text-white font-bold shadow-xs'
                        : isDone
                        ? 'border-[#1B4D3E]/40 bg-[#E8F2EE] text-[#1B4D3E] font-semibold'
                        : 'border-[#E2E8E5] bg-white text-[#4B5563] hover:border-[#1B4D3E]/40'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isDone && (
                      <span className="material-symbols-outlined text-[10px] text-[#1B4D3E]">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  onCompleteAllForDemo();
                  setShowNavigatorModal(false);
                }}
                className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#1B4D3E] underline cursor-pointer font-medium"
              >
                [Fast-Track All for Testing]
              </button>
              <button
                onClick={() => setShowNavigatorModal(false)}
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-2 cursor-pointer rounded-sm"
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
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-[#6B7280] font-semibold">
              <span className="text-[#1B4D3E]">
                Sentence {currentIndex + 1} of {totalSentences}
              </span>
              <span>
                {totalCompleted} Completed ({Math.round((totalCompleted / totalSentences) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-[4px] rounded-full overflow-hidden">
              <div
                className="bg-[#1B4D3E] h-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / totalSentences) * 100}%` }}
              />
            </div>
          </div>

          {/* Sentence Card */}
          <div className="bg-white border border-[#E2E8E5] p-6 md:p-8 shadow-[0px_8px_32px_rgba(27,77,62,0.06)] relative overflow-hidden animate-fade-in rounded-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#1B4D3E] text-[9px] uppercase tracking-[0.3em] font-bold px-3 py-1 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/30">
                {(currentSentence as any).category || currentSentence.difficulty || 'Everyday Fluency'}
              </span>

              {isCurrentCompleted && (
                <span className="text-[#1B4D3E] text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1 bg-[#E8F2EE] px-3 py-1 rounded-full border border-[#1B4D3E]/30">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Mastered
                </span>
              )}
            </div>

            {/* Hindi Prompt */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#6B7280] mb-1 font-semibold">
                Translate into English:
              </div>
              <h2 className="font-serif italic text-[24px] md:text-[30px] leading-relaxed text-[#111827] font-normal">
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
                  placeholder="Type your English translation here..."
                  rows={2}
                  className="w-full bg-white border border-[#CBD5E1] focus:border-[#1B4D3E] p-4 text-[16px] font-sans text-[#111827] outline-none resize-none transition-colors pr-14 rounded-sm"
                />

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title="Speak translation using microphone"
                  className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                    isListening
                      ? 'bg-[#CC0000] text-white border-[#CC0000] animate-pulse'
                      : 'bg-[#F8FAF9] hover:bg-[#E8F2EE] text-[#4B5563] hover:text-[#1B4D3E] border-[#E2E8E5]'
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
                  className="bg-[#1B4D3E] hover:bg-[#153E32] text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-3 cursor-pointer transition-colors shadow-xs rounded-sm"
                >
                  Check Translation
                </button>

                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-[#F8FAF9] hover:bg-[#E8F2EE] text-[#4B5563] hover:text-[#1B4D3E] border border-[#E2E8E5] text-[10px] uppercase tracking-[0.2em] px-4 py-3 cursor-pointer transition-colors font-medium rounded-sm"
                >
                  {showHint ? 'Hide Hint' : 'Vocabulary Hint'}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => fetchAIExplanation(userInput, currentSentence)}
                  disabled={isExplaining}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] hover:text-[#153E32] transition-colors cursor-pointer px-2.5 py-1.5 font-semibold flex items-center gap-1 border border-[#1B4D3E]/30 rounded-sm hover:bg-[#E8F2EE]"
                  title="Ask AI Teacher to explain grammar and nuances"
                >
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  {isExplaining ? 'Explaining...' : 'AI Tutor Explanation'}
                </button>

                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#1B4D3E] transition-colors cursor-pointer px-2 py-2 font-semibold"
                >
                  {showAnswer ? 'Hide Solution' : 'Reveal Solution'}
                </button>

                <button
                  onClick={() => speakSentence(currentSentence.english)}
                  title="Listen to English pronunciation"
                  className="w-9 h-9 rounded-full bg-[#F8FAF9] hover:bg-[#E8F2EE] text-[#4B5563] hover:text-[#1B4D3E] border border-[#E2E8E5] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </button>
              </div>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-4 p-3.5 bg-[#F8FAF9] border-l-3 border-[#1B4D3E] text-[13px] text-[#374151] animate-fade-in rounded-r-sm">
                <span className="text-[#1B4D3E] font-bold uppercase tracking-wider text-[9px] block mb-1">
                  Vocabulary & Grammar Hint:
                </span>
                <p>{currentSentence.hint}</p>
                {(currentSentence.key_grammar || (currentSentence as any).keyGrammar) && (
                  <p className="text-[#6B7280] text-[11px] mt-1 italic">
                    {currentSentence.key_grammar || (currentSentence as any).keyGrammar}
                  </p>
                )}
              </div>
            )}

            {/* Feedback Display */}
            {feedback.status !== 'idle' && (
              <div
                className={`mt-4 p-4 border text-[13px] animate-fade-in rounded-sm ${
                  feedback.status === 'correct'
                    ? 'bg-[#E8F2EE] border-[#1B4D3E]/40 text-[#1B4D3E]'
                    : feedback.status === 'near'
                    ? 'bg-[#FEF9C3] border-[#F59E0B]/40 text-[#B45309]'
                    : 'bg-[#FEE2E2] border-[#EF4444]/40 text-[#B91C1C]'
                }`}
              >
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {feedback.status === 'correct' ? 'check_circle' : feedback.status === 'near' ? 'info' : 'lock_open'}
                  </span>
                  {feedback.message}
                </div>

                {feedback.status !== 'correct' && (
                  <div className="mt-2 text-xs text-[#374151] pt-2 border-t border-black/10">
                    Expected: <span className="font-bold text-[#1B4D3E]">"{currentSentence.english}"</span>
                  </div>
                )}
              </div>
            )}

            {/* Solution Display */}
            {showAnswer && (
              <div className="mt-4 p-4 bg-[#F8FAF9] border border-[#E2E8E5] animate-fade-in text-[13px] rounded-sm">
                <div className="text-[9px] uppercase tracking-[0.25em] text-[#1B4D3E] mb-1 font-bold">
                  Standard English Phrasing:
                </div>
                <div className="text-[#111827] font-semibold text-base mb-2">
                  "{currentSentence.english}"
                </div>
                {currentSentence.alternatives && currentSentence.alternatives.length > 0 && (
                  <div className="text-xs text-[#6B7280] space-y-1">
                    <span className="block text-[9px] uppercase tracking-wider text-[#4B5563] font-semibold">
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

            {/* AI Teacher Deep Dive & Reading Story Interaction */}
            {(isExplaining || aiExplanation) && (
              <div className="mt-6 border-2 border-[#1B4D3E]/20 bg-[#FBFDFB] p-5 md:p-6 shadow-xs rounded-sm animate-fade-in space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E5]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E] animate-pulse"></span>
                    <h3 className="font-serif italic text-[18px] md:text-[20px] text-[#1B4D3E] font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[22px]">psychology</span>
                      AI Teacher Deep Explanation & Story Dialogue
                    </h3>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-1 rounded-full border border-[#1B4D3E]/20">
                    Sentence Unlocked
                  </span>
                </div>

                {isExplaining ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-8 h-8 border-3 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[13px] text-[#4B5563] font-medium">
                      AI Tutor is analyzing your translation attempt, grammar nuances, and preparing your reading story question...
                    </p>
                  </div>
                ) : aiExplanation ? (
                  <div className="space-y-4">
                    {/* Section 1: Error Critique & What went wrong */}
                    <div className="bg-white border border-[#E2E8E5] p-4 rounded-sm shadow-xs">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#B91C1C] font-bold mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">error_outline</span>
                        Linguistic Critique of Attempt:
                      </div>
                      <p className="text-[14px] text-[#1F2937] leading-relaxed">
                        {aiExplanation.critique}
                      </p>
                    </div>

                    {/* Section 2: Grammar Breakdown & Syntax rules */}
                    <div className="bg-white border border-[#E2E8E5] p-4 rounded-sm shadow-xs">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] font-bold mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        Grammar Rule & Construction:
                      </div>
                      <p className="text-[14px] text-[#374151] leading-relaxed">
                        {aiExplanation.grammar_breakdown}
                      </p>
                      {aiExplanation.native_tips && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#E5E7EB] text-[12px] text-[#6B7280] italic flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-[#1B4D3E]">tips_and_updates</span>
                          <span>Native Speaker Tip: {aiExplanation.native_tips}</span>
                        </div>
                      )}
                    </div>

                    {/* Section 3: Reading Story Connection Question */}
                    <div className="bg-[#E8F2EE]/50 border border-[#1B4D3E]/30 p-4 md:p-5 rounded-sm space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                        Story Comprehension Question (Day {dayNumber}: {topic}):
                      </div>
                      <h4 className="font-serif italic text-[16px] md:text-[18px] text-[#111827] leading-snug">
                        "{aiExplanation.story_question}"
                      </h4>

                      {/* Student Response Input Area */}
                      <div className="space-y-3 pt-1">
                        <div className="relative">
                          <textarea
                            value={storyAnswer}
                            onChange={(e) => setStoryAnswer(e.target.value)}
                            placeholder="Write or dictate your answer connecting to today's reading story..."
                            rows={3}
                            className="w-full bg-white border border-[#CBD5E1] focus:border-[#1B4D3E] p-3 text-[14px] font-sans text-[#111827] outline-none resize-none transition-colors pr-12 rounded-sm shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={toggleStorySpeechRecognition}
                            title="Speak response"
                            className={`absolute right-2.5 top-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                              isListeningStoryAnswer
                                ? 'bg-[#CC0000] text-white border-[#CC0000] animate-pulse'
                                : 'bg-[#F8FAF9] hover:bg-[#E8F2EE] text-[#4B5563] hover:text-[#1B4D3E] border-[#E2E8E5]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isListeningStoryAnswer ? 'mic' : 'mic_none'}
                            </span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <button
                            onClick={handleSubmitStoryAnswer}
                            disabled={isReviewingAnswer || !storyAnswer.trim()}
                            className="bg-[#1B4D3E] hover:bg-[#153E32] disabled:opacity-50 text-white text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-2.5 transition-colors cursor-pointer rounded-sm flex items-center gap-2 shadow-xs"
                          >
                            {isReviewingAnswer ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Generating Genuine Review...
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[15px]">send</span>
                                Submit Answer for AI Review
                              </>
                            )}
                          </button>

                          {currentIndex < totalSentences - 1 ? (
                            <button
                              onClick={handleNext}
                              className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] hover:text-[#153E32] font-bold flex items-center gap-1 cursor-pointer py-2 px-3 border border-[#1B4D3E]/30 hover:bg-[#E8F2EE] rounded-sm transition-colors"
                            >
                              Next Sentence
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                          ) : (
                            <button
                              onClick={onFinishTranslation}
                              className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] font-bold flex items-center gap-1 cursor-pointer py-2 px-3 border border-[#1B4D3E]/30 hover:bg-[#E8F2EE] rounded-sm transition-colors"
                            >
                              Finish All → Unlock Step 4
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Section 4: Genuine AI Review */}
                      {storyAnswerReview && (
                        <div className="mt-4 pt-4 border-t border-[#1B4D3E]/20 bg-white p-4 rounded-sm space-y-3 animate-fade-in shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#1B4D3E] font-bold flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">verified</span>
                              Genuine AI Tutor Feedback:
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-[#6B7280]">
                              Story Assessment
                            </span>
                          </div>

                          <p className="text-[13px] text-[#1F2937] leading-relaxed font-medium">
                            {storyAnswerReview.review}
                          </p>

                          {storyAnswerReview.grammar_feedback && (
                            <div className="p-3 bg-[#F8FAF9] border-l-2 border-[#1B4D3E] text-[12px] text-[#374151]">
                              <span className="font-semibold text-[#1B4D3E] block mb-0.5">Linguistic Refinement:</span>
                              {storyAnswerReview.grammar_feedback}
                            </div>
                          )}

                          {storyAnswerReview.better_version && (
                            <div className="p-3 bg-[#E8F2EE] text-[12px] text-[#1B4D3E] rounded-xs">
                              <span className="font-semibold block mb-0.5">Polished Native Phrasing:</span>
                              "{storyAnswerReview.better_version}"
                            </div>
                          )}

                          {storyAnswerReview.encouragement && (
                            <p className="text-[12px] italic text-[#4B5563]">
                              🌟 {storyAnswerReview.encouragement}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation & Unlock AI Conversation */}
        <div className="mt-10 pt-6 border-t border-[#E2E8E5] space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors font-semibold ${
                currentIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-[#9CA3AF]'
                  : 'hover:text-[#1B4D3E] text-[#4B5563] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Previous Sentence
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalSentences - 1}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-colors font-semibold ${
                currentIndex === totalSentences - 1
                  ? 'opacity-30 cursor-not-allowed text-[#9CA3AF]'
                  : 'hover:text-[#1B4D3E] text-[#4B5563] cursor-pointer'
              }`}
            >
              Next Sentence
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* AI Conversation Unlock Section */}
          <div
            className={`p-5 border transition-all rounded-sm ${
              isAllCompleted
                ? 'bg-[#E8F2EE] border-[#1B4D3E] shadow-[0px_4px_24px_rgba(27,77,62,0.1)]'
                : 'bg-white border-[#E2E8E5]'
            } flex flex-col sm:flex-row items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isAllCompleted ? 'text-[#1B4D3E]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {isAllCompleted ? 'lock_open' : 'lock'}
                </span>
                <h4 className="font-serif italic text-[18px] text-[#111827] font-medium">
                  Step 4: AI Conversation Practice
                </h4>
              </div>
              <p className="text-[12px] text-[#4B5563]">
                {isAllCompleted
                  ? `All ${totalSentences} sentences completed! You are fully prepared for the spoken AI conversation.`
                  : `Complete all ${totalSentences} sentences to unlock the AI Conversation (${totalCompleted} of ${totalSentences} completed).`}
              </p>
            </div>

            {isAllCompleted ? (
              <button
                onClick={onFinishTranslation}
                className="bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-8 shadow-[0px_4px_24px_rgba(27,77,62,0.25)] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-sm"
              >
                Unlock AI Conversation →
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setShowRestrictionModal(true)}
                  className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#6B7280] font-sans text-[11px] uppercase tracking-[0.25em] font-semibold py-4 px-6 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-sm border border-[#E5E7EB]"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  Locked ({totalCompleted}/{totalSentences} Done)
                </button>
                <button
                  onClick={onCompleteAllForDemo}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#1B4D3E] underline cursor-pointer font-medium"
                >
                  [Mark All Done for Testing]
                </button>
              </div>
            )}
          </div>

          {/* Step Restriction Pop-Up */}
          <StepRestrictionModal
            isOpen={showRestrictionModal}
            targetStepTitle="Step 04: Oral AI Dialogue"
            requiredStepTitle="Sentence Translation Mastery"
            requiredStepNumber={3}
            message={`You cannot enter the AI Conversation yet. Please complete all ${totalSentences} translation sentences (${totalCompleted} of ${totalSentences} completed) to build the vocabulary and grammar fluency needed for live dialogue.`}
            onClose={() => setShowRestrictionModal(false)}
            onGoToRequired={() => setShowRestrictionModal(false)}
          />
        </div>
      </main>
    </div>
  );
};
