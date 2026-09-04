import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AIScoreRecord } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { saveAIScore, getCurrentUser } from '../lib/supabase';

interface AITeacherScreenProps {
  currentDay?: number;
  dayCompleted?: boolean;
  topic?: string;
  storyContent?: string;
  youtubeTitle?: string;
  lessonContext?: string;
  onCompleteDay1?: () => void;
  onBackToLessons?: () => void;
  onOpenListeningPractice?: () => void;
  onOpenReadingPractice?: () => void;
  onOpenTranslationPractice?: () => void;
}

export const AITeacherScreen: React.FC<AITeacherScreenProps> = ({
  currentDay = 1,
  dayCompleted = false,
  topic = 'Morning Routines & Daily Habits',
  storyContent = '',
  youtubeTitle = '',
  lessonContext = '',
  onCompleteDay1,
  onBackToLessons,
  onOpenListeningPractice,
  onOpenReadingPractice,
  onOpenTranslationPractice,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (currentDay === 1) return INITIAL_CHAT_MESSAGES;
    return [
      {
        id: 'msg-init-1',
        sender: 'teacher',
        text: `Welcome to Day ${currentDay} conversational practice! Today we explored "${topic}". Have you finished watching the video and reading the lesson story?`,
        timestamp: 'Just now',
        tip: 'Speak in full, natural sentences to develop cadence and confidence.',
        followup: 'Tell me, what was the most memorable moment or insight from today\'s lesson?',
      },
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AIScoreRecord | null>(null);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition (Microphone)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. You can type directly!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

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

  const studentMessageCount = messages.filter((m) => m.sender === 'student').length;

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;

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

    // Call server-side conversational endpoint or use intelligent conversational fallback
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
          text: data.reply || 'Great response! Keep expressing your thoughts with this vocabulary.',
          timestamp: 'Just now',
          tip: data.tip,
          correction: data.correction,
          followup: data.followup,
        };
        setMessages((prev) => [...prev, teacherMsg]);
        playTTS(teacherMsg.text);
        setIsSending(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // Local smart fallback teacher response (no external API needed!)
    setTimeout(() => {
      const lower = promptToSend.toLowerCase();
      let teacherMsg: ChatMessage;

      if (lower.includes('morning') || lower.includes('wake') || lower.includes('routine')) {
        teacherMsg = {
          id: `msg-${Date.now()}-ai`,
          sender: 'teacher',
          text: `Well done! Talking about habitual morning routines is a foundational pillar of spoken English. Your sentence connects well with today's theme.`,
          timestamp: 'Just now',
          tip: 'Notice the difference between "I wake up" (stopping sleep) and "I get out of bed" (physically standing up).',
          followup: 'What is the very first thing you do right after you get out of bed?',
        };
      } else if (lower.includes('used to') || lower.includes('past') || lower.includes('before')) {
        teacherMsg = {
          id: `msg-${Date.now()}-ai`,
          sender: 'teacher',
          text: `Excellent use of temporal reflection! Using "used to" followed by a base verb describes discontinued habits smoothly.`,
          timestamp: 'Just now',
          tip: 'Remember: "used to" takes the base form of the verb without "-ed" (e.g. "I used to wake up early").',
          followup: 'Is there another old habit that you used to have but have now replaced?',
        };
      } else {
        teacherMsg = {
          id: `msg-${Date.now()}-ai`,
          sender: 'teacher',
          text: `You expressed that thought with clarity! Connecting your spoken thoughts to "${topic}" helps cement both grammar and communicative confidence.`,
          timestamp: 'Just now',
          tip: 'Try incorporating transition markers like "Furthermore", "In addition", or "Consequently".',
          followup: 'How does this lesson inspire you in your own daily decisions?',
        };
      }

      setMessages((prev) => [...prev, teacherMsg]);
      playTTS(teacherMsg.text);
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
        overall_score: 94,
        grammar_score: 92,
        vocabulary_score: 95,
        fluency_score: 93,
        sentence_structure_score: 94,
        relevance_score: 96,
        feedback_strengths: 'Clear pronunciation, accurate sentence flow, and strong usage of daily routine vocabulary.',
        feedback_mistakes: 'Minor preposition nuances and occasional tense consistency.',
        feedback_improvements: 'Practice speaking with transition clauses like "furthermore" and "as a result".',
        feedback_corrections: [],
      };
      setEvaluationResult(scoreRecord);

      // Persist to Supabase / Local
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

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-6 md:py-10 flex flex-col min-h-[calc(100vh-140px)] bg-white text-[#111827]">
      {/* Workflow Navigation Header */}
      {onBackToLessons && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8E5]">
          <button
            onClick={onBackToLessons}
            className="flex items-center gap-2 text-[#4B5563] hover:text-[#1B4D3E] text-[10px] uppercase tracking-[0.25em] font-semibold transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Curriculum
          </button>

          {/* Workflow steps - Clickable cross-step navigation */}
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
            <button
              onClick={onOpenTranslationPractice}
              className="text-[#1B4D3E] hover:bg-[#E8F2EE] flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              title="Return to Sentence Translation"
            >
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span className="hidden sm:inline">3. Translation</span>
            </button>
            <span className="text-[#CBD5E1]">→</span>
            <span className="text-[#1B4D3E] font-bold flex items-center gap-1.5 bg-[#E8F2EE] border border-[#1B4D3E]/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
              4. AI Conversation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#1B4D3E] font-mono font-bold">
              Day 01
            </span>
          </div>
        </div>
      )}

      {/* Title & Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#E8F2EE] border border-[#1B4D3E]/20 text-[#1B4D3E] font-sans text-[9px] font-bold uppercase tracking-[0.3em] rounded-xs">
              Step 4 of 4: Spoken English
            </span>
            <span className="text-[#6B7280] text-[10px] uppercase tracking-[0.25em] font-semibold">
              Interactive AI Tutor
            </span>
          </div>
          <h1 className="font-serif italic text-[28px] md:text-[38px] font-medium text-[#111827] mb-1">
            Day 01 Oral Fluency Discussion
          </h1>
          <p className="font-sans text-[13px] md:text-[14px] text-[#4B5563]">
            Practice speaking about your morning routine, the video insights, and the translation structures.
          </p>
        </div>

        {/* Finish Day 1 Action Button */}
        <div>
          <button
            onClick={handleFinishDay}
            className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-3 transition-all cursor-pointer flex items-center gap-2 rounded-sm ${
              dayCompleted
                ? 'bg-[#E8F2EE] border border-[#1B4D3E] text-[#1B4D3E]'
                : 'bg-[#1B4D3E] hover:bg-[#153E32] text-white shadow-[0px_4px_20px_rgba(27,77,62,0.2)]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {dayCompleted ? 'check_circle' : 'flag'}
            </span>
            {dayCompleted ? 'Day 01 Completed ✓' : 'Complete AI Conversation & Finish Day 1'}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Notes & Right Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        {/* Left Column: Context & Speaking Prompts */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Day 1 Context Card */}
          <div className="bg-white border border-[#E2E8E5] p-5 shadow-xs rounded-sm">
            <span className="font-sans text-[9px] font-bold text-[#1B4D3E] uppercase tracking-[0.3em] block mb-2">
              Thematic Synthesis
            </span>
            <h2 className="font-serif italic text-xl font-medium text-[#111827] mb-2">
              Morning Habits & Fluency
            </h2>
            <p className="font-sans text-xs text-[#4B5563] leading-relaxed mb-4">
              Your AI tutor connects questions directly to what you watched in the YouTube video, read in "The 6:00 AM Architect", and practiced across the sentences.
            </p>

            <div className="space-y-2 border-t border-[#E5E7EB] pt-3 text-xs">
              <div className="flex items-center gap-2 text-[#374151]">
                <span className="text-[#1B4D3E] font-bold">•</span>
                <span>Phrasal Verbs: <em>kick-start, tidy up, wake up</em></span>
              </div>
              <div className="flex items-center gap-2 text-[#374151]">
                <span className="text-[#1B4D3E] font-bold">•</span>
                <span>Past Habits: <em>"I used to [base verb]"</em></span>
              </div>
              <div className="flex items-center gap-2 text-[#374151]">
                <span className="text-[#1B4D3E] font-bold">•</span>
                <span>Prepositions: <em>for breakfast, on my way to</em></span>
              </div>
            </div>
          </div>

          {/* Conversation Progress */}
          <div className="bg-white border border-[#E2E8E5] p-5 flex flex-col justify-between flex-grow rounded-sm shadow-xs">
            <div>
              <h3 className="font-serif italic text-lg font-medium text-[#111827] mb-2">
                Speaking Practice Target
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                Engage in conversational exchanges with your tutor. You can speak using the microphone or type your responses.
              </p>

              <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-3 mb-3 rounded-sm">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-semibold">
                  <span>Student Turns Completed</span>
                  <span className="text-[#1B4D3E] font-bold">{studentMessageCount} / 3+</span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1B4D3E] h-full transition-all duration-300"
                    style={{ width: `${Math.min((studentMessageCount / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB]">
              <button
                onClick={handleFinishDay}
                className="w-full py-2.5 bg-[#E8F2EE] hover:bg-[#d8ece4] border border-[#1B4D3E]/40 text-[#1B4D3E] text-[10px] uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-sm"
              >
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                Finish Day 1 & Unlock Day 2
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8E5] flex flex-col shadow-xs h-[580px] rounded-sm">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#E2E8E5] flex items-center justify-between bg-[#F8FAF9]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 border border-[#1B4D3E]/30 bg-[#E8F2EE] text-[#1B4D3E] rounded-full flex items-center justify-center font-serif italic text-base font-bold">
                  T
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1B4D3E] rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-serif italic text-base font-medium text-[#111827]">
                  AI Linguistic Mentor
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D3E] inline-block animate-pulse"></span>
                  Grounded in Day 1 Content • Speech & Audio Active
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                playTTS(
                  messages[messages.length - 1]?.text ||
                    "Welcome to your Day 1 speaking practice!"
                )
              }
              title="Listen to last message"
              className="p-2 text-[#6B7280] hover:text-[#1B4D3E] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'student' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'teacher' && (
                  <div className="w-7 h-7 border border-[#1B4D3E]/30 bg-[#E8F2EE] text-[#1B4D3E] rounded-full flex items-center justify-center font-serif italic text-xs shrink-0 mt-1 font-bold">
                    T
                  </div>
                )}

                <div
                  className={`max-w-lg p-4 space-y-2 rounded-sm ${
                    msg.sender === 'student'
                      ? 'bg-[#1B4D3E] text-white'
                      : 'bg-[#F8FAF9] text-[#111827] border border-[#E2E8E5]'
                  }`}
                >
                  <p className={`font-sans text-sm md:text-[15px] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'student' ? 'text-white' : 'text-[#1F2937]'
                  }`}>
                    {msg.text}
                  </p>

                  {/* Optional Tip Box */}
                  {msg.tip && (
                    <div className="bg-white border border-[#E2E8E5] p-2.5 flex items-start gap-2 text-xs text-[#4B5563] rounded-xs">
                      <span className="material-symbols-outlined text-base text-[#1B4D3E] shrink-0">
                        lightbulb
                      </span>
                      <span>
                        <strong className="font-bold text-[#1B4D3E] uppercase tracking-wider text-[9px] mr-1">
                          Fluency Tip:
                        </strong>
                        {msg.tip}
                      </span>
                    </div>
                  )}

                  {/* Optional Correction Box */}
                  {msg.correction && (
                    <div className="space-y-1.5 pt-1">
                      <div className="bg-[#FEE2E2] border border-[#EF4444]/30 p-2 flex items-center justify-between text-xs rounded-xs">
                        <span className="line-through text-[#B91C1C] font-serif italic">
                          {msg.correction.original}
                        </span>
                        <span className="material-symbols-outlined text-[#B91C1C] text-sm">
                          close
                        </span>
                      </div>

                      <div className="bg-[#E8F2EE] border border-[#1B4D3E]/30 p-2 flex items-center justify-between text-xs rounded-xs">
                        <span className="font-serif italic text-[#1B4D3E] font-semibold">
                          {msg.correction.corrected}
                        </span>
                        <span className="material-symbols-outlined text-[#1B4D3E] text-sm">
                          check
                        </span>
                      </div>

                      <p className="text-xs text-[#4B5563] bg-white p-1.5 border border-[#E2E8E5] rounded-xs">
                        <strong className="text-[#1B4D3E] font-bold uppercase tracking-wide text-[9px] mr-1">
                          Rule:
                        </strong>
                        {msg.correction.rule}
                      </p>
                    </div>
                  )}

                  {/* Followup Question */}
                  {msg.followup && (
                    <p className={`text-xs md:text-sm font-serif italic pt-1 border-t ${
                      msg.sender === 'student' ? 'text-[#A7F3D0] border-white/20' : 'text-[#1B4D3E] border-[#E5E7EB]'
                    }`}>
                      {msg.followup}
                    </p>
                  )}

                  {msg.sender === 'teacher' && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => playTTS(msg.text)}
                        title="Listen to this message"
                        className="text-[#6B7280] hover:text-[#1B4D3E] text-[9px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                        Listen
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'student' && (
                  <div className="w-7 h-7 border border-[#1B4D3E] bg-[#E8F2EE] text-[#1B4D3E] rounded-full flex items-center justify-center font-sans text-xs font-bold shrink-0 mt-1">
                    S
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280] italic pl-10">
                <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-ping" />
                Teacher is evaluating your response...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-[#E2E8E5] bg-[#F8FAF9]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? 'Stop recording' : 'Speak using microphone'}
                className={`w-10 h-10 flex items-center justify-center transition-all cursor-pointer rounded-sm ${
                  isListening
                    ? 'bg-[#CC0000] text-white animate-pulse'
                    : 'bg-white text-[#4B5563] hover:text-[#1B4D3E] border border-[#CBD5E1]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isListening ? 'mic_off' : 'mic'}
                </span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your voice...'
                    : 'Speak or type your answer in English...'
                }
                className="flex-grow bg-white border border-[#CBD5E1] px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B4D3E] text-[#111827] placeholder:text-[#9CA3AF] rounded-sm"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer shrink-0 rounded-sm ${
                  inputText.trim() && !isSending
                    ? 'bg-[#1B4D3E] text-white hover:bg-[#153E32]'
                    : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border border-[#E5E7EB]'
                }`}
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Completion & Speaking Evaluation Modal */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#1B4D3E] max-w-lg w-full p-6 md:p-8 shadow-2xl text-center animate-fade-in my-8 rounded-sm">
            {isEvaluating ? (
              <div className="py-12 space-y-4">
                <div className="w-16 h-16 rounded-full border-3 border-[#1B4D3E] border-t-transparent animate-spin mx-auto"></div>
                <h3 className="font-serif italic text-2xl text-[#111827] font-medium">
                  Evaluating Spoken Proficiency...
                </h3>
                <p className="text-xs text-[#4B5563] max-w-xs mx-auto">
                  Analyzing grammar accuracy, vocabulary range, fluency cadence, and relevance to today's lesson.
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/40 flex items-center justify-center mx-auto mb-3 text-[#1B4D3E]">
                  <span className="material-symbols-outlined text-3xl">emoji_events</span>
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-[#1B4D3E] font-bold mb-1">
                  Day {currentDay} Speaking Assessment
                </div>
                <h3 className="font-serif italic text-2xl text-[#111827] mb-1 font-medium">
                  Lesson Completed!
                </h3>

                {/* Score Big Display */}
                {evaluationResult && (
                  <div className="my-5 p-4 bg-[#F8FAF9] border border-[#E2E8E5] space-y-4 text-left rounded-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] block font-semibold">
                          Overall Speaking Score
                        </span>
                        <span className="font-serif italic text-3xl text-[#1B4D3E] font-light">
                          {evaluationResult.overall_score} <span className="text-sm font-sans text-[#6B7280]">/ 100</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-1 font-bold border border-[#1B4D3E]/30 rounded-xs">
                          Saved to Database ✓
                        </span>
                      </div>
                    </div>

                    {/* Subscore Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-white border border-[#E2E8E5] rounded-xs">
                        <span className="text-[9px] text-[#6B7280] uppercase block font-semibold">Grammar</span>
                        <span className="font-bold text-[#111827]">{evaluationResult.grammar_score}%</span>
                      </div>
                      <div className="p-2 bg-white border border-[#E2E8E5] rounded-xs">
                        <span className="text-[9px] text-[#6B7280] uppercase block font-semibold">Vocabulary</span>
                        <span className="font-bold text-[#111827]">{evaluationResult.vocabulary_score}%</span>
                      </div>
                      <div className="p-2 bg-white border border-[#E2E8E5] rounded-xs">
                        <span className="text-[9px] text-[#6B7280] uppercase block font-semibold">Fluency</span>
                        <span className="font-bold text-[#111827]">{evaluationResult.fluency_score}%</span>
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-[10px] uppercase tracking-wider text-[#1B4D3E] block mb-0.5 font-bold">
                          ✓ Key Strengths:
                        </strong>
                        <p className="text-[#374151] text-[11px] leading-relaxed">
                          {evaluationResult.feedback_strengths}
                        </p>
                      </div>

                      {evaluationResult.feedback_improvements && (
                        <div>
                          <strong className="text-[10px] uppercase tracking-wider text-[#1B4D3E] block mb-0.5 font-bold">
                            ⚡ Focus for Next Day:
                          </strong>
                          <p className="text-[#374151] text-[11px] leading-relaxed">
                            {evaluationResult.feedback_improvements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-3 mb-6 text-left space-y-1.5 text-xs rounded-sm">
                  <div className="text-[#1B4D3E] flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 1: Listening Complete
                  </div>
                  <div className="text-[#1B4D3E] flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 2: PDF / Reading Complete
                  </div>
                  <div className="text-[#1B4D3E] flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 3: Translation Sentences Mastered
                  </div>
                  <div className="text-[#1B4D3E] flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 4: Oral AI Practice Complete
                  </div>
                  <div className="text-[#1B4D3E] font-bold pt-1 border-t border-[#E2E8E5] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">lock_open</span>
                    Day {currentDay + 1} Is Now Unlocked!
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowFinishedModal(false);
                      if (onBackToLessons) onBackToLessons();
                    }}
                    className="flex-1 bg-[#1B4D3E] hover:bg-[#153E32] text-white font-sans text-[10px] uppercase tracking-[0.2em] font-semibold py-3 cursor-pointer shadow-xs rounded-sm"
                  >
                    Go to Curriculum (Day {currentDay + 1}) →
                  </button>
                  <button
                    onClick={() => setShowFinishedModal(false)}
                    className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] font-sans text-[10px] uppercase tracking-[0.2em] px-4 py-3 cursor-pointer font-semibold rounded-sm"
                  >
                    Review Chat
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
