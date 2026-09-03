import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';

interface AITeacherScreenProps {
  currentDay?: number;
}

export const AITeacherScreen: React.FC<AITeacherScreenProps> = ({ currentDay = 12 }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
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

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
      } catch (err) {
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
      utterance.onstart = () => setIsSpeakingTTS(true);
      utterance.onend = () => setIsSpeakingTTS(false);
      utterance.onerror = () => setIsSpeakingTTS(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: 'Just now',
    };

    const updated = [...messages, studentMsg];
    setMessages(updated);
    setInputText('');

    // Generate smart teacher response with corrections or affirmation
    setTimeout(() => {
      generateTeacherFeedback(text);
    }, 900);
  };

  const generateTeacherFeedback = (studentText: string) => {
    const lower = studentText.toLowerCase();
    let teacherMsg: ChatMessage;

    if (lower.includes('used to play') && !lower.includes('playing')) {
      teacherMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        text: "Spot on, Sarah! 'Used to play' is grammatically flawless.",
        timestamp: 'Just now',
        tip: 'Notice how much more natural and fluent that sounds.',
        followup: 'Now, tell me one activity you still enjoy doing on weekends.',
      };
    } else if (lower.includes('look forward to see') || lower.includes('looking forward to see')) {
      teacherMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        text: 'I can feel your enthusiasm! Let’s refine that key idiom quickly.',
        timestamp: 'Just now',
        correction: {
          original: '...look forward to see...',
          corrected: 'look forward to seeing',
          rule: '"to" acts as a preposition here, requiring the gerund -ing form ("seeing").',
        },
        followup: 'Try restating with "looking forward to seeing".',
      };
    } else if (lower.includes('many time') || lower.includes('much people')) {
      teacherMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        text: 'Great thought! Keep an eye on countable vs uncountable nouns.',
        timestamp: 'Just now',
        correction: {
          original: lower.includes('many time') ? 'many time' : 'much people',
          corrected: lower.includes('many time') ? 'much time' : 'many people',
          rule: 'Use "much" for uncountable concepts like time and "many" for countable nouns like people.',
        },
        followup: 'Give it another try!',
      };
    } else {
      teacherMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'teacher',
        text: `Wonderful expression! You expressed that idea very clearly. Your pronunciation and cadence are steadily improving.`,
        timestamp: 'Just now',
        tip: 'Try expanding your sentences by adding conjunctions such as "although", "since", or "furthermore".',
        followup: 'What is another habit or routine you want to build this month?',
      };
    }

    setMessages((prev) => [...prev, teacherMsg]);
  };

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col min-h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
            Interactive Pedagogical Dialogue
          </div>
          <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-1">
            Linguistic Mentor
          </h1>
          <div className="w-12 h-[1px] bg-[#D4AF37] mb-2"></div>
          <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA]">
            Natural dialogue practice with real-time syntactic corrections and phonetic feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 border border-[#333333] font-sans text-[10px] uppercase tracking-[0.25em] text-[#AAAAAA] bg-[#1A1A1A]">
            Level B1
          </span>
          <span className="px-3.5 py-1.5 border border-[#333333] font-sans text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] bg-[#1A1A1A]">
            Day {currentDay < 10 ? `0${currentDay}` : currentDay}/90
          </span>
        </div>
      </div>

      {/* Main Grid: Left Notes & Right Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Left Column: Focus & Teacher Notes */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Current Focus Card */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.5)]">
            <span className="font-sans text-[9px] font-semibold text-[#888888] uppercase tracking-[0.3em] block mb-2">
              Current Focus
            </span>
            <h2 className="font-serif italic text-2xl font-light text-[#EFEFEF] mb-2">
              Spoken Cadence
            </h2>
            <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed mb-6">
              Executing past narrative transitions and prepositional verb idiomatic forms in spontaneous dialogue.
            </p>

            <div className="pt-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
                <span className="text-[#888888]">Module Mastery</span>
                <span className="text-[#D4AF37]">65%</span>
              </div>
              <div className="w-full bg-[#242424] h-[2px] overflow-hidden">
                <div className="bg-[#D4AF37] h-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>

          {/* Teacher Notes Card */}
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] flex-grow flex flex-col justify-between">
            <div>
              <h3 className="font-serif italic text-2xl font-light text-[#EFEFEF] mb-3">
                Session Briefing
              </h3>
              <p className="font-serif italic text-sm text-[#CCCCCC] leading-relaxed mb-6 border-l-2 border-[#D4AF37] pl-3 py-0.5">
                "Outstanding retention on vocabulary review yesterday. Let's practice rhythm and eliminating hesitations around prepositional phrases."
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-[#68BA89] bg-[#19241B] flex items-center justify-center text-[#68BA89]">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                  <span className="text-xs text-[#CCCCCC]">
                    Goal: Past narrative aspects
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-[#68BA89] bg-[#19241B] flex items-center justify-center text-[#68BA89]">
                    <span className="material-symbols-outlined text-xs">check</span>
                  </div>
                  <span className="text-xs text-[#CCCCCC]">
                    Goal: Prepositional verb complement
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-[#555555] bg-[#222222] flex items-center justify-center" />
                  <span className="text-xs text-[#888888]">
                    Review: Habitual "used to" syntax
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2A2A2A] mt-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#777777]">
                Natural Language Audio Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#333333] flex flex-col shadow-[0px_8px_32px_rgba(0,0,0,0.5)] h-[620px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#333333] flex items-center justify-between bg-[#151515]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif italic text-base">
                  T
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#68BA89] border border-[#111111]" />
              </div>
              <div>
                <h3 className="font-serif italic text-base font-normal text-[#EFEFEF]">
                  Tutor AI
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[#888888] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#68BA89] inline-block"></span>
                  Active Evaluation • Speech Enabled
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playTTS("Hello Sarah. I am your linguistic tutor. Let's cultivate speaking fluency today.")}
                title="Test Audio Voice"
                className="p-2 text-[#888888] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'student' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'teacher' && (
                  <div className="w-8 h-8 border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif italic text-xs shrink-0 mt-1">
                    T
                  </div>
                )}

                <div
                  className={`max-w-lg p-4 space-y-3 ${
                    msg.sender === 'student'
                      ? 'bg-[#221D13] text-[#EFEFEF] border border-[#483B1A]'
                      : 'bg-[#151515] text-[#EFEFEF] border border-[#2D2D2D]'
                  }`}
                >
                  <p className="font-sans text-sm md:text-base leading-relaxed text-[#E0E0E0]">
                    {msg.text}
                  </p>

                  {/* Optional Tip Box */}
                  {msg.tip && (
                    <div className="bg-[#1C1C1C] border border-[#333333] p-3 flex items-start gap-2.5 text-xs text-[#AAAAAA]">
                      <span className="material-symbols-outlined text-base text-[#D4AF37] shrink-0">
                        lightbulb
                      </span>
                      <span>
                        <strong className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[10px] mr-1">Guidance: </strong>
                        {msg.tip}
                      </span>
                    </div>
                  )}

                  {/* Optional Correction Box */}
                  {msg.correction && (
                    <div className="space-y-2 pt-1">
                      {/* Red strikethrough original */}
                      <div className="bg-[#241717] border border-[#482828] p-2.5 flex items-center justify-between text-xs">
                        <span className="line-through text-[#DDAAAA] opacity-80 font-serif italic">
                          {msg.correction.original}
                        </span>
                        <span className="material-symbols-outlined text-[#E07A7A] text-base">
                          close
                        </span>
                      </div>

                      {/* Green correction */}
                      <div className="bg-[#19241B] border border-[#2B4B32] p-2.5 flex items-center justify-between text-xs">
                        <span className="font-serif italic text-[#EFEFEF]">
                          {msg.correction.corrected}
                        </span>
                        <span className="material-symbols-outlined text-[#68BA89] text-base">
                          check
                        </span>
                      </div>

                      {/* Grammar Rule */}
                      <p className="text-xs text-[#AAAAAA] bg-[#111111] p-2 border border-[#282828]">
                        <strong className="text-[#D4AF37] font-semibold uppercase tracking-wide text-[10px] mr-1">Rule: </strong>
                        {msg.correction.rule}
                      </p>
                    </div>
                  )}

                  {/* Followup prompt */}
                  {msg.followup && (
                    <p className="text-xs md:text-sm font-serif italic text-[#D4AF37] pt-1">
                      {msg.followup}
                    </p>
                  )}

                  {/* Speaker button to listen */}
                  {msg.sender === 'teacher' && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => playTTS(msg.text)}
                        title="Listen to this message"
                        className="text-[#888888] hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">volume_up</span>
                        Listen
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'student' && (
                  <div className="w-8 h-8 border border-[#D4AF37]/50 bg-[#262010] text-[#D4AF37] flex items-center justify-center font-sans text-xs font-semibold shrink-0 mt-1">
                    S
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-[#333333] bg-[#151515]">
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
                className={`w-11 h-11 flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-[#882222] text-white animate-pulse border border-[#AA3333]'
                    : 'bg-[#1A1A1A] text-[#AAAAAA] hover:text-[#D4AF37] border border-[#333333]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isListening ? 'mic_off' : 'mic'}
                </span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your cadence...'
                    : 'Articulate or compose your response in English...'
                }
                className="flex-grow bg-[#111111] border border-[#333333] px-5 py-3 text-sm focus:outline-none focus:border-[#D4AF37] text-[#EFEFEF] placeholder:text-[#666666]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-11 h-11 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  inputText.trim()
                    ? 'bg-[#D4AF37] text-[#111111] hover:bg-[#e0bd49]'
                    : 'bg-[#222222] text-[#555555] cursor-not-allowed border border-[#2E2E2E]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </form>
            <div className="flex justify-between items-center mt-2 px-1 text-[10px] uppercase tracking-[0.2em] text-[#666666]">
              <span>Return key to submit</span>
              <span>Synthetic speech enabled</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
