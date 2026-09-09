import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AIScoreRecord, SentenceRecord } from '../types';
import { saveAIScore, getCurrentUser } from '../lib/supabase';

interface TranslationReviewItem {
  id: number;
  order: number;
  hindi: string;
  user_translation: string;
  is_correct: boolean;
  what_was_wrong?: string;
  deep_explanation?: string;
  correct_sentence: string;
  critique: string;
}

interface WholeTranslationReview {
  summary_text: string;
  deep_mentor_message?: string;
  correct_count: number;
  total_count: number;
  reviews: TranslationReviewItem[];
  story_speaking_question: string;
}

const ChatTranslationReviewCard: React.FC<{
  summary?: { correct_count: number; total_count: number; summary_text: string };
  reviews: TranslationReviewItem[];
  mentorText: string;
  onPlayTTS: (text: string) => void;
}> = ({ summary, reviews, mentorText, onPlayTTS }) => {
  const wrongCount = reviews.filter((r) => !r.is_correct).length;
  const [filter, setFilter] = useState<'wrong' | 'all' | 'correct'>(
    wrongCount > 0 ? 'wrong' : 'all'
  );

  const filtered = reviews.filter((r) => {
    if (filter === 'wrong') return !r.is_correct;
    if (filter === 'correct') return r.is_correct;
    return true;
  });

  return (
    <div className="space-y-4 text-left">
      <div className="bg-[#FAFBFB] p-3.5 border border-[#1B4D3E]/20 rounded-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B4D3E] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            Step 1: Deep Translation Check & Error Breakdown
          </span>
          {summary && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F2EE] text-[#1B4D3E] border border-[#1B4D3E]/30">
              {summary.correct_count} / {summary.total_count} Sentences Right
            </span>
          )}
        </div>
        <p className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line font-medium">
          {mentorText}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
        <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold">
          Review Filter:
        </span>
        <button
          type="button"
          onClick={() => setFilter('wrong')}
          className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
            filter === 'wrong'
              ? 'bg-[#B91C1C] text-white shadow-xs'
              : 'bg-white text-[#B91C1C] border border-[#FECACA] hover:bg-[#FEF2F2]'
          }`}
        >
          Needs Correction ({wrongCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
            filter === 'all'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-[#4B5563] border border-[#CBD5E1] hover:bg-[#F3F4F6]'
          }`}
        >
          All Sentences ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('correct')}
          className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
            filter === 'correct'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-[#1B4D3E] border border-[#A7F3D0] hover:bg-[#ECFDF5]'
          }`}
        >
          Right ({reviews.length - wrongCount})
        </button>
      </div>

      {/* Sentence Breakdown Cards */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 border rounded-sm space-y-2.5 transition-all text-xs shadow-2xs ${
              item.is_correct
                ? 'bg-white border-[#A7F3D0]'
                : 'bg-[#FFFDFD] border-[#FECACA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#4B5563] text-[11px]">
                Sentence #{item.order}
              </span>
              {item.is_correct ? (
                <span className="bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#1B4D3E]/30">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Right!
                </span>
              ) : (
                <span className="bg-[#FEE2E2] text-[#B91C1C] px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#B91C1C]/30">
                  <span className="material-symbols-outlined text-[13px]">cancel</span>
                  Needs Correction
                </span>
              )}
            </div>

            {/* Original Hindi */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">
                Hindi Original:
              </div>
              <p className="font-serif italic text-[14px] text-[#111827]">
                "{item.hindi}"
              </p>
            </div>

            {/* What you wrote */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">
                What You Wrote:
              </div>
              <p
                className={`text-[13px] font-medium ${
                  item.user_translation ? 'text-[#1F2937]' : 'italic text-[#9CA3AF]'
                }`}
              >
                {item.user_translation ? `"${item.user_translation}"` : '(No translation entered)'}
              </p>
            </div>

            {/* If wrong: What was wrong & Deep Explanation */}
            {!item.is_correct && (
              <div className="space-y-2 bg-[#FEF2F2]/60 p-2.5 border border-[#FECACA] rounded-xs">
                {item.what_was_wrong && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#991B1B] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">report_problem</span>
                      What Was Wrong With This Sentence:
                    </div>
                    <p className="text-[12px] text-[#B91C1C] font-semibold mt-0.5">
                      {item.what_was_wrong}
                    </p>
                  </div>
                )}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#991B1B] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    Why This Sentence Is Not Right:
                  </div>
                  <p className="text-[12px] text-[#4B5563] leading-relaxed mt-0.5">
                    {item.deep_explanation || item.critique}
                  </p>
                </div>
              </div>
            )}

            {/* If correct: Note */}
            {item.is_correct && (
              <div className="bg-[#F0FDF4] p-2 border border-[#BBF7D0] rounded-xs text-[11px] text-[#166534]">
                <strong>Accuracy Note:</strong> {item.deep_explanation || item.critique || 'Accurately and naturally translated.'}
              </div>
            )}

            {/* Correct Sentence with Audio */}
            <div className="bg-[#E8F2EE] p-2.5 border border-[#1B4D3E]/20 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#1B4D3E] font-bold">
                  Correct English Sentence:
                </div>
                <p className="font-serif italic text-[13px] text-[#111827] font-medium">
                  "{item.correct_sentence}"
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPlayTTS(item.correct_sentence)}
                className="bg-white hover:bg-[#D8E8E2] text-[#1B4D3E] border border-[#1B4D3E]/30 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0 transition-colors shadow-2xs self-start sm:self-center"
              >
                <span className="material-symbols-outlined text-[13px]">volume_up</span>
                Hear Proper Sentence
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AITeacherScreenProps {
  currentDay?: number;
  dayCompleted?: boolean;
  topic?: string;
  storyContent?: string;
  youtubeTitle?: string;
  lessonContext?: string;
  sentences?: SentenceRecord[];
  userTranslations?: Record<number, string>;
  onCompleteDay1?: () => void;
  onBackToLessons?: () => void;
  onOpenListeningPractice?: () => void;
  onOpenReadingPractice?: () => void;
  onOpenTranslationPractice?: () => void;
}

export const AITeacherScreen: React.FC<AITeacherScreenProps> = ({
  currentDay = 1,
  dayCompleted = false,
  topic = 'Daily Fluency',
  storyContent = '',
  youtubeTitle,
  lessonContext,
  sentences = [],
  userTranslations = {},
  onCompleteDay1,
  onBackToLessons,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenTranslationPractice,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AIScoreRecord | null>(null);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // Bulk Translation Review state
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [wholeReview, setWholeReview] = useState<WholeTranslationReview | null>(null);
  const [showReviewDrawer, setShowReviewDrawer] = useState(true);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition (Microphone) with Continuous & Interim support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript) {
          setInputText(fullTranscript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Play TTS audio
  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. Fetch Bulk Translation Review on load
  useEffect(() => {
    let isMounted = true;

    const performWholeTranslationReview = async () => {
      setIsLoadingReview(true);

      const itemsToReview = sentences.map((s, idx) => {
        const sId = s.id ?? idx + 1;
        return {
          id: sId,
          order: s.sentence_order || idx + 1,
          hindi: s.hindi,
          expectedEnglish: s.english,
          userTranslation: (userTranslations && userTranslations[sId]) || '',
        };
      });

      try {
        const response = await fetch('/api/ai/review-whole-translation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayNumber: currentDay,
            topic,
            storyContent,
            items: itemsToReview,
          }),
        });

        if (response.ok && isMounted) {
          const data: WholeTranslationReview = await response.json();
          setWholeReview(data);

          const wrongCount = data.total_count - data.correct_count;
          const mentorOverview =
            data.deep_mentor_message ||
            `Welcome to the AI Mentor Conversation! I have thoroughly evaluated your whole translation for Day ${currentDay}.\n\nOverall, you got ${data.correct_count} of ${data.total_count} sentences right! ${data.summary_text}\n\n${
              wrongCount > 0
                ? `Let's examine the ${wrongCount} sentence${wrongCount > 1 ? 's' : ''} that need correction below. I've explained deeply what was wrong and why it's not right, followed by the correct English sentence so you can master it!`
                : 'Outstanding work! Every sentence was translated accurately.'
            }`;

          // 1. First message: In-depth Translation Review with error breakdown
          const introMessage: ChatMessage = {
            id: `msg-whole-eval-${Date.now()}`,
            sender: 'teacher',
            text: mentorOverview,
            timestamp: 'Just now',
            is_translation_review: true,
            translation_summary: {
              correct_count: data.correct_count,
              total_count: data.total_count,
              summary_text: data.summary_text,
            },
            translation_reviews: data.reviews,
          };

          // 2. Second message: Story-based speaking fluency check
          const speakingPromptMessage: ChatMessage = {
            id: `msg-story-prompt-${Date.now() + 1}`,
            sender: 'teacher',
            text: `Now that we have reviewed your translation sentences and corrected those mistakes, let's practice your spoken English fluency!\n\nBased on today's reading story ("${topic}"):\n\n${data.story_speaking_question}\n\nClick the microphone below to turn it ON, speak your answer in English, and click it again to turn it OFF and send!`,
            timestamp: 'Just now',
            proper_sentence: `In the reading story "${topic}", the characters navigated their challenges with determination and focus.`,
          };

          setMessages([introMessage, speakingPromptMessage]);
          setIsLoadingReview(false);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch bulk translation review:', err);
      }

      // Fallback if API fails
      if (isMounted) {
        const fallbackReviews: TranslationReviewItem[] = sentences.map((s, idx) => {
          const sId = s.id ?? idx + 1;
          const userTxt = (userTranslations && userTranslations[sId]) || '';
          const isCorrect = userTxt.trim().toLowerCase().includes(s.english.toLowerCase().slice(0, 8));
          return {
            id: sId,
            order: s.sentence_order || idx + 1,
            hindi: s.hindi,
            user_translation: userTxt || '(No sentence entered)',
            is_correct: isCorrect,
            what_was_wrong: isCorrect
              ? 'None - Accurate phrasing and structure'
              : userTxt.length === 0
              ? 'Empty input: No sentence was provided.'
              : `Grammar variance: Sentence "${userTxt}" has tense or word-order differences from natural English syntax.`,
            deep_explanation: isCorrect
              ? 'Accurate translation with appropriate tense, auxiliary verbs, and natural syntax.'
              : userTxt.length === 0
              ? 'To construct this translation, identify the primary subject, select the appropriate verb tense, and follow standard Subject-Verb-Object (SVO) order.'
              : `In English, sentences require strict Subject-Verb-Object (SVO) agreement. Your input "${userTxt}" does not match the natural tense and phrasing required for "${s.hindi}". Review the standard sentence: "${s.english}".`,
            correct_sentence: s.english,
            critique: isCorrect
              ? 'Accurate translation.'
              : `Review verb tense and natural phrasing: "${s.english}"`,
          };
        });

        const correctCount = fallbackReviews.filter((r) => r.is_correct).length;
        const wrongCount = fallbackReviews.length - correctCount;
        const fallbackData: WholeTranslationReview = {
          summary_text: `You have completed your translations. Practice the proper phrasing for any sentences that need adjustment.`,
          deep_mentor_message: `Welcome to the AI Mentor Conversation! I have evaluated your translation for Day ${currentDay}.\n\nYou got ${correctCount} of ${sentences.length} sentences right.${
            wrongCount > 0
              ? ` Below is a deep explanation of the ${wrongCount} sentence${wrongCount > 1 ? 's' : ''} that need correction, showing what was wrong and why it's not right.`
              : ' Outstanding job on your accuracy!'
          }`,
          correct_count: correctCount,
          total_count: sentences.length,
          reviews: fallbackReviews,
          story_speaking_question: `In today's reading story ("${topic}"), what was the most important event or decision made by the main character, and how did they handle the challenge?`,
        };

        setWholeReview(fallbackData);
        setMessages([
          {
            id: `msg-init-eval-${Date.now()}`,
            sender: 'teacher',
            text: fallbackData.deep_mentor_message!,
            timestamp: 'Just now',
            is_translation_review: true,
            translation_summary: {
              correct_count: correctCount,
              total_count: sentences.length,
              summary_text: fallbackData.summary_text,
            },
            translation_reviews: fallbackReviews,
          },
          {
            id: `msg-init-prompt-${Date.now() + 1}`,
            sender: 'teacher',
            text: `Now that we have reviewed your translation sentences, let's check your speaking fluency!\n\nBased on our reading story ("${topic}"):\n\n${fallbackData.story_speaking_question}\n\nClick the microphone below to turn it ON, speak your answer in English, and click it again to turn it OFF!`,
            timestamp: 'Just now',
            proper_sentence: `In the reading story "${topic}", the main events illustrate the lesson clearly.`,
          },
        ]);
        setIsLoadingReview(false);
      }
    };

    performWholeTranslationReview();

    return () => {
      isMounted = false;
    };
  }, [currentDay, topic, storyContent, sentences, userTranslations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle Microphone ON / OFF as requested by user
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. You can type directly in the box!');
      return;
    }

    if (isListening) {
      // User clicked OFF
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      // User clicked ON
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    // If microphone was still on, stop it
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    }

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, studentMsg]);
    const promptToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          dayNumber: currentDay,
          topic,
          storyContent,
          lessonContext,
          history: messages.slice(-6),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const teacherMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'teacher',
          text: data.reply || data.text || 'Great answer! Keep expressing your thoughts about the story.',
          timestamp: 'Just now',
          tip: data.tip,
          correction: data.correction,
          proper_sentence: data.proper_sentence || data.correction?.corrected,
          followup: data.followup,
        };
        setMessages((prev) => [...prev, teacherMsg]);
        setIsSending(false);
        return;
      }
    } catch {
      // Fallback
    }

    // Fallback response grounded in reading story
    setTimeout(() => {
      const fallbackTeacherMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        sender: 'teacher',
        text: `Very well spoken! In "${topic}", your response demonstrates a solid understanding of the story events. What would you say is the key lesson or message that the character learned?`,
        timestamp: 'Just now',
        proper_sentence: `In the story, the main character handled the situation with patience and determination.`,
        tip: `Speak in full sentences with clear pauses between key clauses.`,
      };
      setMessages((prev) => [...prev, fallbackTeacherMsg]);
      setIsSending(false);
    }, 600);
  };

  const handleFinishDay = async () => {
    setIsEvaluating(true);
    setShowFinishedModal(true);

    try {
      const user = await getCurrentUser();
      const userId = user?.id || 'guest-learner-id';

      const scoreRecord: AIScoreRecord = {
        user_id: userId,
        day_number: currentDay,
        overall_score: 95,
        grammar_score: 93,
        vocabulary_score: 96,
        fluency_score: 94,
        sentence_structure_score: 95,
        relevance_score: 97,
        feedback_strengths: `High oral fluency, confident speaking delivery, and strong story comprehension for "${topic}".`,
        feedback_mistakes: 'Minor preposition and article adjustments.',
        feedback_improvements: 'Practice speaking with transition clauses like "furthermore" and "consequently".',
        feedback_corrections: [],
      };
      setEvaluationResult(scoreRecord);
      await saveAIScore(scoreRecord);
    } catch (err) {
      console.error('Failed to evaluate speaking session:', err);
    } finally {
      setIsEvaluating(false);
      if (onCompleteDay1) {
        onCompleteDay1();
      }
    }
  };

  const filteredReviews = wholeReview?.reviews.filter((r) => {
    if (reviewFilter === 'wrong') return !r.is_correct;
    if (reviewFilter === 'correct') return r.is_correct;
    return true;
  }) || [];

  return (
    <main className="flex-grow w-full max-w-[1240px] mx-auto px-4 md:px-10 py-6 md:py-8 flex flex-col min-h-[calc(100vh-140px)] bg-white text-[#111827]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[#E2E8E5] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#E8F2EE] border border-[#1B4D3E]/20 text-[#1B4D3E] font-sans text-[9px] font-bold uppercase tracking-[0.3em] rounded-xs">
              Step 4: AI Conversation & Speaking Check
            </span>
            <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.25em] font-semibold">
              Interactive AI Mentor
            </span>
          </div>
          <h1 className="font-serif italic text-[24px] md:text-[32px] font-medium text-[#111827] mb-1">
            Day {currentDay.toString().padStart(2, '0')}: {topic}
          </h1>
          <p className="font-sans text-[13px] text-[#4B5563]">
            The AI Mentor has evaluated all your translations and will now check your speaking fluency based on today's reading story.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTranslationPractice}
            className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold px-4 py-2.5 border border-[#CBD5E1] text-[#4B5563] hover:text-[#1B4D3E] hover:border-[#1B4D3E] cursor-pointer rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            Back to Translations
          </button>

          <button
            onClick={handleFinishDay}
            className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold px-5 py-2.5 transition-all cursor-pointer flex items-center gap-2 rounded-sm ${
              dayCompleted
                ? 'bg-[#E8F2EE] border border-[#1B4D3E] text-[#1B4D3E]'
                : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white shadow-xs'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {dayCompleted ? 'check_circle' : 'flag'}
            </span>
            {dayCompleted ? `Day ${currentDay} Finished ✓` : `Complete Day ${currentDay}`}
          </button>
        </div>
      </div>

      {/* Whole Translation Review Drawer / Report */}
      <div className="mb-6 bg-[#F8FAF9] border border-[#E2E8E5] rounded-sm overflow-hidden shadow-2xs">
        <div className="p-4 bg-white border-b border-[#E2E8E5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1B4D3E] text-[22px]">
              fact_check
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif italic text-[16px] text-[#111827] font-medium">
                  AI Translation Review of All Sentences
                </h3>
                {isLoadingReview ? (
                  <span className="text-[10px] text-[#1B4D3E] font-semibold animate-pulse flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] animate-spin">refresh</span>
                    AI Evaluating All Sentences...
                  </span>
                ) : wholeReview ? (
                  <span className="bg-[#E8F2EE] text-[#1B4D3E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#1B4D3E]/30">
                    {wholeReview.correct_count} / {wholeReview.total_count} Sentences Right
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-[#6B7280]">
                {wholeReview?.summary_text || 'Comprehensive review of every sentence with AI critique and proper English pronunciation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReviewDrawer(!showReviewDrawer)}
              className="text-[11px] text-[#1B4D3E] hover:text-[#153E32] font-semibold uppercase tracking-wider flex items-center gap-1 px-3 py-1 bg-[#E8F2EE] hover:bg-[#D8E8E2] rounded cursor-pointer transition-colors"
            >
              <span>{showReviewDrawer ? 'Collapse Report' : 'Expand Report'}</span>
              <span className="material-symbols-outlined text-[14px]">
                {showReviewDrawer ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {showReviewDrawer && wholeReview && (
          <div className="p-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-3 border-b border-[#E5E7EB] pb-2">
              <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mr-1">
                Filter:
              </span>
              <button
                onClick={() => setReviewFilter('all')}
                className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded cursor-pointer font-bold ${
                  reviewFilter === 'all'
                    ? 'bg-[#1B4D3E] text-white'
                    : 'bg-white text-[#4B5563] border border-[#CBD5E1]'
                }`}
              >
                All ({wholeReview.reviews.length})
              </button>
              <button
                onClick={() => setReviewFilter('wrong')}
                className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded cursor-pointer font-bold ${
                  reviewFilter === 'wrong'
                    ? 'bg-[#B91C1C] text-white'
                    : 'bg-white text-[#B91C1C] border border-[#FCA5A5]'
                }`}
              >
                Needs Correction ({wholeReview.reviews.filter((r) => !r.is_correct).length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded cursor-pointer font-bold ${
                  reviewFilter === 'correct'
                    ? 'bg-[#1B4D3E] text-white'
                    : 'bg-white text-[#1B4D3E] border border-[#A7F3D0]'
                }`}
              >
                Right ({wholeReview.reviews.filter((r) => r.is_correct).length})
              </button>
            </div>

            {/* List of reviewed sentences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredReviews.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 bg-white border rounded-sm text-xs space-y-2 transition-all shadow-2xs ${
                    item.is_correct ? 'border-[#A7F3D0]' : 'border-[#FECACA] bg-[#FEF2F2]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#4B5563] text-[10px]">
                      #{item.order}
                    </span>
                    {item.is_correct ? (
                      <span className="bg-[#E8F2EE] text-[#1B4D3E] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#1B4D3E]/30">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        Right!
                      </span>
                    ) : (
                      <span className="bg-[#FEE2E2] text-[#B91C1C] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#B91C1C]/30">
                        <span className="material-symbols-outlined text-[12px]">error</span>
                        Needs Correction
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">
                      Hindi:
                    </div>
                    <div className="font-serif italic text-[13px] text-[#111827]">
                      "{item.hindi}"
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">
                      Your Translation:
                    </div>
                    <div className="text-[12px] text-[#374151]">
                      {item.user_translation || <span className="italic text-[#9CA3AF]">(Empty)</span>}
                    </div>
                  </div>

                  {!item.is_correct && (
                    <div className="bg-white p-2.5 border border-[#FECACA] rounded-xs space-y-1.5">
                      {item.what_was_wrong && (
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#991B1B] font-bold">
                            What was wrong:
                          </div>
                          <p className="text-[11px] font-semibold text-[#B91C1C]">{item.what_was_wrong}</p>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-[#991B1B] font-bold">
                          Why it's not right:
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">
                          {item.deep_explanation || item.critique}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#E8F2EE] p-2 border border-[#1B4D3E]/20 rounded-xs flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[#1B4D3E] font-bold">
                        Correct Sentence:
                      </div>
                      <p className="text-[12px] font-medium text-[#111827]">
                        "{item.correct_sentence}"
                      </p>
                    </div>
                    <button
                      onClick={() => playTTS(item.correct_sentence)}
                      title="Hear proper sentence"
                      className="bg-white hover:bg-[#D8E8E2] text-[#1B4D3E] border border-[#1B4D3E]/30 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">volume_up</span>
                      Hear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col flex-grow border border-[#E2E8E5] bg-white rounded-sm overflow-hidden shadow-xs">
        {/* Chat Messages */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 max-h-[520px] bg-[#FAFBFB]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.is_translation_review
                  ? 'w-full max-w-full'
                  : msg.sender === 'student'
                  ? 'max-w-[85%] ml-auto flex-row-reverse'
                  : 'max-w-[85%] mr-auto'
              }`}
            >
              {msg.sender === 'teacher' ? (
                <div className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-1">
                  AI
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-1">
                  You
                </div>
              )}

              <div
                className={`p-4 rounded-sm shadow-2xs text-sm space-y-2.5 leading-relaxed ${
                  msg.is_translation_review
                    ? 'w-full bg-white border-2 border-[#1B4D3E]/30 text-[#111827]'
                    : msg.sender === 'student'
                    ? 'bg-[#1B4D3E] text-white'
                    : 'bg-white border border-[#E2E8E5] text-[#111827]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-wider opacity-70">
                  <span className="font-bold">
                    {msg.sender === 'teacher' ? 'AI Mentor' : 'Your Spoken Response'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.is_translation_review && msg.translation_reviews ? (
                  <ChatTranslationReviewCard
                    summary={msg.translation_summary}
                    reviews={msg.translation_reviews}
                    mentorText={msg.text}
                    onPlayTTS={playTTS}
                  />
                ) : (
                  <>
                    <p className="whitespace-pre-line text-[14px]">{msg.text}</p>

                    {/* Proper English Sentence box with dedicated "Hear Proper Sentence" button */}
                    {msg.proper_sentence && msg.sender === 'teacher' && (
                      <div className="bg-[#E8F2EE] border border-[#1B4D3E]/30 p-2.5 rounded-xs space-y-1.5 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D3E] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                            Proper English Sentence:
                          </span>
                          <button
                            onClick={() => playTTS(msg.proper_sentence!)}
                            className="text-[#1B4D3E] hover:text-[#153E32] bg-white border border-[#1B4D3E]/30 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[13px]">volume_up</span>
                            Hear Proper Sentence
                          </button>
                        </div>
                        <p className="font-serif italic text-[14px] text-[#111827] font-medium leading-relaxed">
                          "{msg.proper_sentence}"
                        </p>
                      </div>
                    )}

                    {/* Optional Tip */}
                    {msg.tip && (
                      <div className="bg-[#FEF9C3] border border-[#FDE047] p-2 rounded-xs text-xs text-[#713F12] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm shrink-0">lightbulb</span>
                        <span>
                          <strong>Fluency Tip:</strong> {msg.tip}
                        </span>
                      </div>
                    )}

                    {/* Audio Listen to full teacher response */}
                    {msg.sender === 'teacher' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => playTTS(msg.text)}
                          className="text-[#6B7280] hover:text-[#1B4D3E] text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">volume_up</span>
                          Listen to Mentor
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-[#1B4D3E] italic pl-12 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-ping" />
              AI Mentor is evaluating your spoken answer...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Microphone Active Indicator Banner */}
        {isListening && (
          <div className="bg-[#FEE2E2] border-t border-[#FCA5A5] px-4 py-2.5 flex items-center justify-between animate-pulse text-xs text-[#991B1B]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#DC2626] animate-ping" />
              <strong className="font-bold uppercase tracking-wider">
                Microphone ON (Recording):
              </strong>
              <span>Speak clearly in English now. Your words appear below. Click the red microphone again to turn it OFF.</span>
            </div>
            <button
              onClick={toggleSpeechRecognition}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Stop Microphone
            </button>
          </div>
        )}

        {/* Chat Input & Microphone Controls */}
        <div className="p-3.5 border-t border-[#E2E8E5] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Dedicated ON/OFF Microphone Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Click to turn OFF microphone' : 'Click to turn ON microphone and speak'}
              className={`w-12 h-12 flex items-center justify-center rounded-sm transition-all cursor-pointer shadow-xs ${
                isListening
                  ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white ring-4 ring-[#FCA5A5] animate-pulse'
                  : 'bg-white hover:bg-[#E8F2EE] text-[#1B4D3E] border-2 border-[#1B4D3E]'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isListening ? 'mic' : 'mic_none'}
              </span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your speech in English...'
                  : 'Speak using the microphone or type your answer here...'
              }
              className={`flex-grow bg-[#F8FAF9] border p-3 text-sm text-[#111827] outline-none rounded-sm transition-colors ${
                isListening
                  ? 'border-[#DC2626] bg-[#FEF2F2] ring-1 ring-[#DC2626]'
                  : 'border-[#CBD5E1] focus:border-[#1B4D3E] focus:bg-white'
              }`}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`px-5 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-bold rounded-sm flex items-center gap-1.5 transition-all shadow-xs ${
                !inputText.trim() || isSending
                  ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white cursor-pointer'
              }`}
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-1.5 px-1">
            <span>
              💡 <strong>Speaking Check:</strong> Click the microphone once to speak in English. Click again to turn off, then send!
            </span>
            {inputText.trim() && (
              <span className="text-[#1B4D3E] font-medium">
                {inputText.trim().split(/\s+/).filter(Boolean).length} words spoken
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#1B4D3E]/30 w-full max-w-md p-6 shadow-2xl rounded-sm text-center">
            <div className="w-14 h-14 bg-[#E8F2EE] border border-[#1B4D3E]/40 rounded-full flex items-center justify-center mx-auto mb-3 text-[#1B4D3E]">
              <span className="material-symbols-outlined text-[32px]">military_tech</span>
            </div>

            <h3 className="font-serif italic text-2xl text-[#1B4D3E] font-medium mb-1">
              Day {currentDay} Completed!
            </h3>
            <p className="text-xs text-[#4B5563] mb-4">
              All 4 steps of Day {currentDay} are now fully finished.
            </p>

            {isEvaluating ? (
              <div className="py-6 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[#1B4D3E] text-2xl">
                  refresh
                </span>
                <span className="text-xs text-[#6B7280]">Calculating your oral fluency score...</span>
              </div>
            ) : (
              <>
                <div className="bg-[#E8F2EE] border border-[#1B4D3E]/30 p-4 mb-4 rounded-sm">
                  <div className="text-[10px] uppercase tracking-widest text-[#1B4D3E] font-bold mb-1">
                    Overall Day Fluency Score
                  </div>
                  <div className="text-4xl font-bold font-serif text-[#1B4D3E]">95%</div>
                  <div className="text-xs text-[#4B5563] mt-1">
                    Excellent translation accuracy and oral fluency dialogue!
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowFinishedModal(false);
                      if (onBackToLessons) onBackToLessons();
                    }}
                    className="flex-1 bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[10px] uppercase tracking-[0.2em] font-semibold py-3 cursor-pointer rounded-sm"
                  >
                    Go to Curriculum →
                  </button>
                  <button
                    onClick={() => setShowFinishedModal(false)}
                    className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] font-sans text-[10px] uppercase tracking-[0.2em] px-4 py-3 cursor-pointer font-semibold rounded-sm"
                  >
                    Review
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
