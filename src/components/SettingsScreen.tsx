import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsScreenProps {
  currentDay: number;
  day1Completed: boolean;
  user: UserProfile | null;
  onSetDayState: (day: number, completed: boolean) => void;
  onNavigateHome: () => void;
  onLoginWithGoogle: () => void;
  onSignOut: () => void;
  onOpenAdmin: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentDay,
  day1Completed,
  user,
  onSetDayState,
  onNavigateHome,
  onLoginWithGoogle,
  onSignOut,
  onOpenAdmin,
}) => {
  const [targetLevel, setTargetLevel] = useState('B1 Intermediate');
  const [dailyGoal, setDailyGoal] = useState('30 min');
  const [nativeLanguage, setNativeLanguage] = useState('Hindi (हिंदी)');
  const [speechSpeed, setSpeechSpeed] = useState('1.0x');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };


  return (
    <main className="flex-grow w-full max-w-[900px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col min-h-[calc(100vh-160px)] animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#888888] mb-2 font-light">
          Configuration & Localization
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-light text-[#EFEFEF] mb-2">
          Curriculum Parameters
        </h1>
        <div className="w-12 h-[1px] bg-[#D4AF37] mb-3"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#AAAAAA]">
          Personalize pedagogical targets, native glossaries, and synthesized speech cadence.
        </p>
      </div>

      {savedNotification && (
        <div className="mb-6 p-4 bg-[#19241B] border border-[#2B4B32] text-[#84C99A] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs uppercase tracking-wider font-semibold">Curriculum parameters committed successfully.</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Learning Profile Section */}
        <section className="bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] space-y-6">
          <h2 className="font-serif italic text-2xl font-light text-[#EFEFEF] pb-3 border-b border-[#2A2A2A]">
            Pedagogical Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888] mb-2">
                Proficiency Level Benchmark
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] px-4 py-3 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="A1 Beginner">A1 Beginner</option>
                <option value="A2 Elementary">A2 Elementary</option>
                <option value="B1 Intermediate">B1 Intermediate (Recommended)</option>
                <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                <option value="C1 Advanced">C1 Advanced Spontaneity</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888] mb-2">
                Comparative Native Gloss
              </label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] px-4 py-3 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Arabic (العربية)">Arabic (العربية)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888] mb-2">
                Daily Immersive Allocation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['15 min', '30 min', '45 min'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setDailyGoal(goal)}
                    className={`py-2.5 text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      dailyGoal === goal
                        ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#111111] border-[#333333] text-[#AAAAAA] hover:border-[#666666]'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#888888] mb-2">
                Acoustic Cadence Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['0.8x', '1.0x', '1.2x'].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeechSpeed(spd)}
                    className={`py-2.5 text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      speechSpeed === spd
                        ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#111111] border-[#333333] text-[#AAAAAA] hover:border-[#666666]'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Supabase Account & Google Authentication */}
        <section className="bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
            <h2 className="font-serif italic text-2xl font-light text-[#EFEFEF]">
              Account & Cloud Database
            </h2>
            <span className="text-[9px] uppercase tracking-[0.25em] bg-[#16241b] text-[#68BA89] px-2.5 py-0.5 border border-[#68BA89]/30 font-semibold">
              Supabase Persistence Active
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-[#141414] border border-[#282828]">
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#262010] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-serif text-lg">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#EFEFEF]">{user.full_name}</span>
                      {user.is_admin && (
                        <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-semibold bg-[#262010] px-2 py-0.5 border border-[#D4AF37]/40">
                          Curriculum Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#888888]">{user.email}</span>
                    <p className="text-[11px] text-[#68BA89] mt-0.5">
                      ✓ Progress automatically synchronized to cloud
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-[#EFEFEF]">Guest Learner Mode</h3>
                  <p className="text-xs text-[#888888] mt-0.5">
                    Log in with your Google account to keep your 90-day progress permanently saved across devices.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={onSignOut}
                  className="px-4 py-2.5 bg-[#222222] hover:bg-[#333333] border border-[#444444] text-[#CCCCCC] hover:text-white text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={onLoginWithGoogle}
                  className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0px_4px_16px_rgba(212,175,55,0.25)]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9c0-.2 0-.4 0-.6z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Admin Portal Gateway */}
          {user?.is_admin ? (
            <div className="p-4 bg-[#211B10] border border-[#523F16] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                    Administrator Panel Active
                  </span>
                  <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/30 font-medium">
                    tauheedjahan07@gmail.com
                  </span>
                </div>
                <p className="text-xs text-[#CCCCCC]">
                  You are authenticated as the Lead Curriculum Administrator. You have full access to author learning days, upload companion PDFs, and generate translation sentences.
                </p>
              </div>
              <button
                onClick={onOpenAdmin}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Open Admin Portal
              </button>
            </div>
          ) : (
            <div className="p-4 bg-[#141414] border border-[#282828] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-xs text-[#888888]">lock</span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#888888] font-semibold">
                    Curator & Admin Portal
                  </span>
                  <span className="text-[9px] bg-[#222222] text-[#888888] px-1.5 py-0.5 border border-[#333333]">
                    Restricted Access
                  </span>
                </div>
                <p className="text-xs text-[#777777]">
                  Curriculum authoring is reserved exclusively for <strong className="text-[#AAAAAA]">tauheedjahan07@gmail.com</strong>. Log in with your email ID & password or Google admin account.
                </p>
              </div>
              <button
                onClick={onOpenAdmin}
                className="bg-[#1C1C1C] hover:bg-[#282828] text-[#D4AF37] border border-[#444444] hover:border-[#D4AF37] px-4 py-2 font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-xs">key</span>
                Admin Login
              </button>
            </div>
          )}
        </section>

        {/* Demo & Curriculum Navigation Quick Switcher */}
        <section className="bg-[#1A1A1A] border border-[#333333] p-6 md:p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
            <h2 className="font-serif italic text-2xl font-light text-[#EFEFEF]">
              Simulation Presets
            </h2>
            <span className="text-[9px] uppercase tracking-[0.25em] bg-[#262010] text-[#D4AF37] px-2.5 py-0.5 border border-[#D4AF37]/30">
              Prototype Vectors
            </span>
          </div>
          <p className="text-xs text-[#AAAAAA]">
            Instantaneously toggle between canonical syllabus states defined in the UX specification:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => {
                onSetDayState(1, false);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer ${
                currentDay === 1 && !day1Completed
                  ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#111111] border-[#333333] hover:border-[#666666] text-[#CCCCCC]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1">State 01</span>
              <span className="text-sm font-serif italic text-[#EFEFEF] block">Day 01: Initiation</span>
              <span className="text-xs text-[#888888] block mt-0.5">Fresh syllabus entry point</span>
            </button>

            <button
              onClick={() => {
                onSetDayState(1, true);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer ${
                currentDay === 1 && day1Completed
                  ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#111111] border-[#333333] hover:border-[#666666] text-[#CCCCCC]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1">State 02</span>
              <span className="text-sm font-serif italic text-[#EFEFEF] block">Day 01: Evaluated</span>
              <span className="text-xs text-[#888888] block mt-0.5">Score 78 & speaking feedback</span>
            </button>

            <button
              onClick={() => {
                onSetDayState(12, true);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer ${
                currentDay === 12
                  ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#111111] border-[#333333] hover:border-[#666666] text-[#CCCCCC]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1">State 03</span>
              <span className="text-sm font-serif italic text-[#EFEFEF] block">Day 12: Longitudinal</span>
              <span className="text-xs text-[#888888] block mt-0.5">Intermediate fluency milestone</span>
            </button>
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] transition-all cursor-pointer shadow-[0px_4px_20px_rgba(212,175,55,0.25)]"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </main>
  );
};
