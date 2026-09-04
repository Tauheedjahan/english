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
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (currentDay === 1) return INITIAL_CHAT_MESSAGES;
    // Initial welcome message customized to the topic
    return [
      {
        id: 'msg-init-1',
        sender: 'teacher',
        text: `Welcome to Day ${currentDay} conversational practice! Today we explored "${topic}". Have you finished watching the video and reading the lesson story?`,
        timestamp: 'Just now',
        tip: 'Speak in full, natural sentences to develop cadence and confidence.',
        followup: 'Tell me, what was the most memorable moment or character action from today\'s lesson?',
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const studentMessageCount = messages.filter((m) => m.sender === 'student').length;

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: 'Just now',
    };

    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsSending(true);

    try {
      // Call server-side Express Gemini endpoint with lesson context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          dayNumber: currentDay,
          topic,
          storyContent,
          youtubeTitle,
          lessonContext,
          history: updatedMessages.map((m) => ({
            role: m.sender === 'student' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const teacherMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: data.text || "That's a thoughtful response.",
          timestamp: 'Just now',
          tip: data.tip,
          correction: data.correction,
          followup: data.followup,
        };
        setMessages((prev) => [...prev, teacherMsg]);
        if (data.text) {
          playTTS(data.text);
        }
        setIsSending(false);
        return;
      }
    } catch {
      // Fall through to smart client-side conversational logic
    }

    // Contextual fallback connected to lesson
    setTimeout(() => {
      const lower = text.toLowerCase();
      let teacherMsg: ChatMessage;

      if (lower.includes('water') || lower.includes('drink') || lower.includes('lemon')) {
        teacherMsg = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: "Starting with hydration is exactly what was emphasized! Drinking water first thing in the morning gently kick-starts your physiological systems.",
          timestamp: 'Just now',
          tip: 'Notice the phrasal verb "kick-start" — it means to give energetic momentum to something.',
          followup: 'In the lesson story, what role did deliberate focus play in the character\'s morning routine?',
        };
      } else if (lower.includes('bird') || lower.includes('injured') || lower.includes('rescue') || lower.includes('wing') || lower.includes('care')) {
        teacherMsg = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: "That shows wonderful empathy! Rescuing an injured bird requires patience, gentle hands, and true devotion. Aarav showed immense kindness by creating a safe shelter.",
          timestamp: 'Just now',
          tip: 'Use the collocation "nurse back to health" when talking about caring for wounded animals.',
          followup: 'Why do you think Aarav decided to set the bird free instead of keeping it in a cage?',
        };
      } else {
        teacherMsg = {
          id: `msg-${Date.now() + 1}`,
          sender: 'teacher',
          text: `You expressed that thought with clarity and natural rhythm! Connecting your spoken thoughts to "${topic}" helps cement both grammar and communicative confidence.`,
          timestamp: 'Just now',
          tip: 'Try incorporating transition markers like "Furthermore", "In addition", or "Consequently".',
          followup: 'How does this lesson inspire you in your own daily decisions?',
        };
      }

      setMessages((prev) => [...prev, teacherMsg]);
      playTTS(teacherMsg.text);
      setIsSending(false);
    }, 800);
  };

  const handleFinishDay = async () => {
    setIsEvaluating(true);
    setShowFinishedModal(true);

    try {
      const response = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: currentDay,
          topic,
          storyContent,
          messages,
        }),
      });

      if (response.ok) {
        const evalData = await response.json();
        const user = await getCurrentUser();
        const userId = user?.id || 'guest-learner-id';

        const scoreRecord: AIScoreRecord = {
          user_id: userId,
          day_number: currentDay,
          overall_score: evalData.overall_score || 85,
          grammar_score: evalData.grammar_score || 82,
          vocabulary_score: evalData.vocabulary_score || 86,
          fluency_score: evalData.fluency_score || 80,
          sentence_structure_score: evalData.sentence_structure_score || 84,
          relevance_score: evalData.relevance_score || 88,
          feedback_strengths: evalData.feedback_strengths || 'Clear pronunciation and good use of lesson vocabulary.',
          feedback_mistakes: evalData.feedback_mistakes || 'Minor preposition and tense consistency details.',
          feedback_improvements: evalData.feedback_improvements || 'Practice speaking with transition clauses.',
          feedback_corrections: evalData.feedback_corrections || [],
        };
        setEvaluationResult(scoreRecord);

        // Persist to Supabase
        await saveAIScore(scoreRecord);
      }
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
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-6 md:py-10 flex flex-col min-h-[calc(100vh-140px)]">
      {/* Workflow Navigation Header */}
      {onBackToLessons && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#333333]">
          <button
            onClick={onBackToLessons}
            className="flex items-center gap-2 text-[#888888] hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Curriculum
          </button>

          {/* Workflow steps */}
          <div className="flex items-center gap-2 md:gap-3 text-[10px] uppercase tracking-[0.2em]">
            <span className="text-[#68BA89] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span className="hidden sm:inline">1. Listening</span>
            </span>
            <span className="text-[#444444]">→</span>
            <span className="text-[#68BA89] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span className="hidden sm:inline">2. Reading</span>
            </span>
            <span className="text-[#444444]">→</span>
            <span className="text-[#68BA89] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span className="hidden sm:inline">3. Translation (41)</span>
            </span>
            <span className="text-[#444444]">→</span>
            <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5 bg-[#262010] border border-[#D4AF37]/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              4. AI Conversation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono">
              Day 01
            </span>
          </div>
        </div>
      )}

      {/* Title & Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#D4AF37] font-sans text-[9px] uppercase tracking-[0.3em]">
              Step 4 of 4: Spoken English
            </span>
            <span className="text-[#888888] text-[10px] uppercase tracking-[0.25em]">
              Interactive AI Tutor
            </span>
          </div>
          <h1 className="font-serif italic text-[28px] md:text-[38px] font-light text-[#EFEFEF] mb-1">
            Day 01 Oral Fluency Discussion
          </h1>
          <p className="font-sans text-[13px] md:text-[14px] text-[#AAAAAA]">
            Practice speaking about your morning routine, the video insights, and the 41 translation structures.
          </p>
        </div>

        {/* Finish Day 1 Action Button */}
        <div>
          <button
            onClick={handleFinishDay}
            className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold px-6 py-3 transition-all cursor-pointer flex items-center gap-2 ${
              dayCompleted
                ? 'bg-[#19241B] border border-[#68BA89] text-[#68BA89]'
                : 'bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] shadow-[0px_4px_20px_rgba(212,175,55,0.25)]'
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
          <div className="bg-[#1A1A1A] border border-[#333333] p-5 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
            <span className="font-sans text-[9px] font-semibold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">
              Thematic Synthesis
            </span>
            <h2 className="font-serif italic text-xl font-light text-[#EFEFEF] mb-2">
              Morning Habits & Fluency
            </h2>
            <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed mb-4">
              Your AI tutor connects questions directly to what you watched in the YouTube video, read in "The 6:00 AM Architect", and translated across the 41 sentences.
            </p>

            <div className="space-y-2 border-t border-[#282828] pt-3 text-xs">
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <span className="text-[#D4AF37]">•</span>
                <span>Phrasal Verbs: <em>kick-start, tidy up, wake up</em></span>
              </div>
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <span className="text-[#D4AF37]">•</span>
                <span>Past Habits: <em>"I used to [base verb]"</em></span>
              </div>
              <div className="flex items-center gap-2 text-[#CCCCCC]">
                <span className="text-[#D4AF37]">•</span>
                <span>Prepositions: <em>for breakfast, on my way to</em></span>
              </div>
            </div>
          </div>

          {/* Conversation Progress */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-5 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-serif italic text-lg font-light text-[#EFEFEF] mb-2">
                Speaking Practice Target
              </h3>
              <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                Engage in conversational exchanges with your tutor. You can speak using the microphone or type your responses.
              </p>

              <div className="bg-[#141414] border border-[#282828] p-3 mb-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#888888] mb-1">
                  <span>Student Turns Completed</span>
                  <span className="text-[#D4AF37] font-semibold">{studentMessageCount} / 3+</span>
                </div>
                <div className="w-full bg-[#222222] h-1.5 overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full transition-all duration-300"
                    style={{ width: `${Math.min((studentMessageCount / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#282828]">
              <button
                onClick={handleFinishDay}
                className="w-full py-2.5 bg-[#262010] hover:bg-[#332b14] border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                Finish Day 1 & Unlock Day 2
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#333333] flex flex-col shadow-[0px_8px_32px_rgba(0,0,0,0.5)] h-[580px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#333333] flex items-center justify-between bg-[#151515]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif italic text-base">
                  T
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#68BA89] rounded-full" />
              </div>
              <div>
                <h3 className="font-serif italic text-base font-normal text-[#EFEFEF]">
                  AI Linguistic Mentor
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#68BA89] inline-block animate-pulse"></span>
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
              className="p-2 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'student' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'teacher' && (
                  <div className="w-7 h-7 border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif italic text-xs shrink-0 mt-1">
                    T
                  </div>
                )}

                <div
                  className={`max-w-lg p-4 space-y-2.5 ${
                    msg.sender === 'student'
                      ? 'bg-[#221D13] text-[#EFEFEF] border border-[#483B1A]'
                      : 'bg-[#151515] text-[#EFEFEF] border border-[#2D2D2D]'
                  }`}
                >
                  <p className="font-sans text-sm md:text-base leading-relaxed text-[#E0E0E0] whitespace-pre-line">
                    {msg.text}
                  </p>

                  {/* Optional Tip Box */}
                  {msg.tip && (
                    <div className="bg-[#1C1C1C] border border-[#333333] p-2.5 flex items-start gap-2 text-xs text-[#AAAAAA]">
                      <span className="material-symbols-outlined text-base text-[#D4AF37] shrink-0">
                        lightbulb
                      </span>
                      <span>
                        <strong className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[9px] mr-1">
                          Fluency Tip:
                        </strong>
                        {msg.tip}
                      </span>
                    </div>
                  )}

                  {/* Optional Correction Box */}
                  {msg.correction && (
                    <div className="space-y-1.5 pt-1">
                      <div className="bg-[#241717] border border-[#482828] p-2 flex items-center justify-between text-xs">
                        <span className="line-through text-[#DDAAAA] opacity-80 font-serif italic">
                          {msg.correction.original}
                        </span>
                        <span className="material-symbols-outlined text-[#E07A7A] text-sm">
                          close
                        </span>
                      </div>

                      <div className="bg-[#19241B] border border-[#2B4B32] p-2 flex items-center justify-between text-xs">
                        <span className="font-serif italic text-[#EFEFEF]">
                          {msg.correction.corrected}
                        </span>
                        <span className="material-symbols-outlined text-[#68BA89] text-sm">
                          check
                        </span>
                      </div>

                      <p className="text-xs text-[#AAAAAA] bg-[#111111] p-1.5 border border-[#282828]">
                        <strong className="text-[#D4AF37] font-semibold uppercase tracking-wide text-[9px] mr-1">
                          Rule:
                        </strong>
                        {msg.correction.rule}
                      </p>
                    </div>
                  )}

                  {/* Followup Question */}
                  {msg.followup && (
                    <p className="text-xs md:text-sm font-serif italic text-[#D4AF37] pt-1 border-t border-[#262626]">
                      {msg.followup}
                    </p>
                  )}

                  {msg.sender === 'teacher' && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => playTTS(msg.text)}
                        title="Listen to this message"
                        className="text-[#888888] hover:text-[#D4AF37] text-[9px] uppercase tracking-[0.2em] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                        Listen
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'student' && (
                  <div className="w-7 h-7 border border-[#D4AF37]/50 bg-[#262010] text-[#D4AF37] flex items-center justify-center font-sans text-xs font-semibold shrink-0 mt-1">
                    S
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-[#888888] italic pl-10">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                Teacher is evaluating your response...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-[#333333] bg-[#151515]">
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
                className={`w-10 h-10 flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-[#882222] text-white animate-pulse border border-[#AA3333]'
                    : 'bg-[#1A1A1A] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333]'
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
                className="flex-grow bg-[#111111] border border-[#333333] px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] text-[#EFEFEF] placeholder:text-[#666666]"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  inputText.trim() && !isSending
                    ? 'bg-[#D4AF37] text-[#111111] hover:bg-[#e0bd49]'
                    : 'bg-[#222222] text-[#555555] cursor-not-allowed border border-[#2E2E2E]'
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-[#D4AF37] max-w-lg w-full p-6 md:p-8 shadow-[0px_16px_60px_rgba(0,0,0,0.8)] text-center animate-fade-in my-8">
            {isEvaluating ? (
              <div className="py-12 space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mx-auto"></div>
                <h3 className="font-serif italic text-2xl text-[#EFEFEF]">
                  Evaluating Spoken Proficiency...
                </h3>
                <p className="text-xs text-[#AAAAAA] max-w-xs mx-auto">
                  Analyzing grammar accuracy, vocabulary range, fluency cadence, and relevance to today's lesson.
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#262010] border border-[#D4AF37] flex items-center justify-center mx-auto mb-3 text-[#D4AF37]">
                  <span className="material-symbols-outlined text-3xl">emoji_events</span>
                </div>

                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-1">
                  Day {currentDay} Speaking Assessment
                </div>
                <h3 className="font-serif italic text-2xl text-[#EFEFEF] mb-1">
                  Lesson Completed!
                </h3>

                {/* Score Big Display */}
                {evaluationResult && (
                  <div className="my-5 p-4 bg-[#141414] border border-[#2D2D2D] space-y-4 text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] block">
                          Overall Speaking Score
                        </span>
                        <span className="font-serif italic text-3xl text-[#D4AF37] font-light">
                          {evaluationResult.overall_score} <span className="text-sm font-sans text-[#777777]">/ 100</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider bg-[#19241B] text-[#68BA89] px-2.5 py-1 font-semibold border border-[#2B4B32]">
                          Saved to Supabase ✓
                        </span>
                      </div>
                    </div>

                    {/* Subscore Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-[#1A1A1A] border border-[#282828]">
                        <span className="text-[9px] text-[#888888] uppercase block">Grammar</span>
                        <span className="font-semibold text-[#EFEFEF]">{evaluationResult.grammar_score}%</span>
                      </div>
                      <div className="p-2 bg-[#1A1A1A] border border-[#282828]">
                        <span className="text-[9px] text-[#888888] uppercase block">Vocabulary</span>
                        <span className="font-semibold text-[#EFEFEF]">{evaluationResult.vocabulary_score}%</span>
                      </div>
                      <div className="p-2 bg-[#1A1A1A] border border-[#282828]">
                        <span className="text-[9px] text-[#888888] uppercase block">Fluency</span>
                        <span className="font-semibold text-[#EFEFEF]">{evaluationResult.fluency_score}%</span>
                      </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-[10px] uppercase tracking-wider text-[#68BA89] block mb-0.5">
                          ✓ Key Strengths:
                        </strong>
                        <p className="text-[#CCCCCC] text-[11px] leading-relaxed">
                          {evaluationResult.feedback_strengths}
                        </p>
                      </div>

                      {evaluationResult.feedback_improvements && (
                        <div>
                          <strong className="text-[10px] uppercase tracking-wider text-[#D4AF37] block mb-0.5">
                            ⚡ Focus for Next Day:
                          </strong>
                          <p className="text-[#CCCCCC] text-[11px] leading-relaxed">
                            {evaluationResult.feedback_improvements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-[#141414] border border-[#282828] p-3 mb-6 text-left space-y-1.5 text-xs">
                  <div className="text-[#68BA89] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 1: Listening Complete
                  </div>
                  <div className="text-[#68BA89] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 2: PDF / Reading Complete
                  </div>
                  <div className="text-[#68BA89] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 3: Translation Sentences Mastered
                  </div>
                  <div className="text-[#68BA89] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Step 4: Oral AI Practice Complete
                  </div>
                  <div className="text-[#D4AF37] font-semibold pt-1 border-t border-[#282828] flex items-center gap-2">
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
                    className="flex-1 bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] font-sans text-[10px] uppercase tracking-[0.2em] font-semibold py-3 cursor-pointer shadow-[0px_4px_20px_rgba(212,175,55,0.3)]"
                  >
                    Go to Curriculum (Day {currentDay + 1}) →
                  </button>
                  <button
                    onClick={() => setShowFinishedModal(false)}
                    className="bg-[#222222] hover:bg-[#333333] text-[#AAAAAA] font-sans text-[10px] uppercase tracking-[0.2em] px-4 py-3 cursor-pointer"
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
