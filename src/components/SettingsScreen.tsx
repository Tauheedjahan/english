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
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentDay,
  day1Completed,
  user,
  onSetDayState,
  onNavigateHome,
  onLoginWithGoogle,
  onSignOut,
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
    <main className="flex-grow w-full max-w-[900px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col min-h-[calc(100vh-160px)] animate-fade-in bg-white text-[#111827]">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#1B4D3E] mb-2 font-bold">
          Configuration & Localization
        </div>
        <h1 className="font-serif italic text-[32px] md:text-[46px] leading-tight font-medium text-[#111827] mb-2">
          Curriculum Parameters
        </h1>
        <div className="w-12 h-[2px] bg-[#1B4D3E] mb-3"></div>
        <p className="font-sans text-[14px] md:text-[16px] text-[#4B5563]">
          Personalize pedagogical targets, native glossaries, and synthesized speech cadence.
        </p>
      </div>

      {savedNotification && (
        <div className="mb-6 p-4 bg-[#E8F2EE] border border-[#1B4D3E]/30 text-[#1B4D3E] flex items-center gap-3 animate-fade-in rounded-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-xs uppercase tracking-wider font-semibold">Curriculum parameters committed successfully.</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Learning Profile Section */}
        <section className="bg-white border border-[#E2E8E5] p-6 md:p-8 shadow-xs space-y-6 rounded-sm">
          <h2 className="font-serif italic text-2xl font-medium text-[#111827] pb-3 border-b border-[#E5E7EB]">
            Pedagogical Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280] mb-2">
                Proficiency Level Benchmark
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
              >
                <option value="A1 Beginner">A1 Beginner</option>
                <option value="A2 Elementary">A2 Elementary</option>
                <option value="B1 Intermediate">B1 Intermediate (Recommended)</option>
                <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                <option value="C1 Advanced">C1 Advanced Spontaneity</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280] mb-2">
                Comparative Native Gloss
              </label>
              <select
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
              >
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Arabic (العربية)">Arabic (العربية)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280] mb-2">
                Daily Immersive Allocation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['15 min', '30 min', '45 min'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setDailyGoal(goal)}
                    className={`py-2.5 text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer rounded-sm ${
                      dailyGoal === goal
                        ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white font-bold'
                        : 'bg-[#F8FAF9] border-[#E2E8E5] text-[#4B5563] hover:border-[#1B4D3E]/40'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280] mb-2">
                Acoustic Cadence Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['0.8x', '1.0x', '1.2x'].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeechSpeed(spd)}
                    className={`py-2.5 text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer rounded-sm ${
                      speechSpeed === spd
                        ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white font-bold'
                        : 'bg-[#F8FAF9] border-[#E2E8E5] text-[#4B5563] hover:border-[#1B4D3E]/40'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Account & Storage Section */}
        <section className="bg-white border border-[#E2E8E5] p-6 md:p-8 shadow-xs space-y-6 rounded-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <h2 className="font-serif italic text-2xl font-medium text-[#111827]">
              Account & Storage
            </h2>
            <span className="text-[9px] uppercase tracking-[0.25em] bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-0.5 border border-[#1B4D3E]/30 font-bold rounded-xs">
              Local & Cloud Sync Active
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-[#F8FAF9] border border-[#E2E8E5] rounded-sm">
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-12 h-12 rounded-full object-cover border border-[#1B4D3E]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#E8F2EE] border border-[#1B4D3E] text-[#1B4D3E] flex items-center justify-center font-serif text-lg font-bold">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-semibold text-[#111827]">{user.full_name}</span>
                    <span className="block text-xs text-[#6B7280]">{user.email}</span>
                    <p className="text-[11px] text-[#1B4D3E] mt-0.5 font-medium">
                      ✓ Progress automatically synchronized
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">Guest Learner Mode</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Log in with your Google account to keep your 90-day progress permanently saved across devices.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={onSignOut}
                  className="px-4 py-2.5 bg-white hover:bg-[#F3F4F6] border border-[#CBD5E1] text-[#374151] hover:text-[#111827] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={onLoginWithGoogle}
                  className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs rounded-sm"
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
                  <span>Continue with Gmail</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Demo & Curriculum Navigation Quick Switcher */}
        <section className="bg-white border border-[#E2E8E5] p-6 md:p-8 shadow-xs space-y-4 rounded-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <h2 className="font-serif italic text-2xl font-medium text-[#111827]">
              Simulation Presets
            </h2>
            <span className="text-[9px] uppercase tracking-[0.25em] bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-0.5 border border-[#1B4D3E]/30 font-bold rounded-xs">
              Quick Vectors
            </span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Instantaneously toggle between canonical syllabus states:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => {
                onSetDayState(1, false);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer rounded-sm ${
                currentDay === 1 && !day1Completed
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E]'
                  : 'bg-[#F8FAF9] border-[#E2E8E5] hover:border-[#1B4D3E]/40 text-[#4B5563]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1 font-semibold">State 01</span>
              <span className="text-sm font-serif italic text-[#111827] block font-medium">Day 01: Initiation</span>
              <span className="text-xs text-[#6B7280] block mt-0.5">Fresh syllabus entry point</span>
            </button>

            <button
              onClick={() => {
                onSetDayState(1, true);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer rounded-sm ${
                currentDay === 1 && day1Completed
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E]'
                  : 'bg-[#F8FAF9] border-[#E2E8E5] hover:border-[#1B4D3E]/40 text-[#4B5563]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1 font-semibold">State 02</span>
              <span className="text-sm font-serif italic text-[#111827] block font-medium">Day 01: Evaluated</span>
              <span className="text-xs text-[#6B7280] block mt-0.5">Score & speaking feedback</span>
            </button>

            <button
              onClick={() => {
                onSetDayState(12, true);
                onNavigateHome();
              }}
              className={`p-3.5 border text-left transition-all cursor-pointer rounded-sm ${
                currentDay === 12
                  ? 'bg-[#E8F2EE] border-[#1B4D3E] text-[#1B4D3E]'
                  : 'bg-[#F8FAF9] border-[#E2E8E5] hover:border-[#1B4D3E]/40 text-[#4B5563]'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.25em] block opacity-70 mb-1 font-semibold">State 03</span>
              <span className="text-sm font-serif italic text-[#111827] block font-medium">Day 12: Longitudinal</span>
              <span className="text-xs text-[#6B7280] block mt-0.5">Intermediate fluency milestone</span>
            </button>
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.25em] transition-all cursor-pointer shadow-xs rounded-sm"
          >
            Save Parameters
          </button>
        </div>
      </div>
    </main>
  );
};
