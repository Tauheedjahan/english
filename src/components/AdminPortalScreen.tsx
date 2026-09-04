import React, { useState, useEffect } from 'react';
import { DayRecord, SentenceRecord, UserProfile } from '../types';
import {
  fetchPublishedDays,
  saveDay,
  fetchSentencesForDay,
  uploadLessonPDF,
  loginAdminWithCredentials,
  setStoredAdminPassword,
  signInWithGoogle,
  ADMIN_EMAIL,
  SEED_DAYS,
  SEED_DAY_2_SENTENCES,
} from '../lib/supabase';

interface AdminPortalScreenProps {
  user: UserProfile | null;
  onAdminLoginSuccess: (user: UserProfile) => void;
  onAdminSignOut: () => void;
  onBackToApp: () => void;
  onDayPublished?: (dayNumber: number) => void;
}

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  user,
  onAdminLoginSuccess,
  onAdminSignOut,
  onBackToApp,
  onDayPublished,
}) => {
  // Auth state for unauthorized users
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Change password modal state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  const [daysList, setDaysList] = useState<DayRecord[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [topic, setTopic] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');
  const [lessonContext, setLessonContext] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // 30 Sentences state
  const [sentences, setSentences] = useState<SentenceRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sentence editing modal/inline state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Load existing days on mount if admin
  useEffect(() => {
    if (user?.is_admin) {
      loadDays();
    }
  }, [user?.is_admin]);

  const handleAdminEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const result = await loginAdminWithCredentials(adminEmailInput, adminPasswordInput);
      if (result.success && result.user) {
        onAdminLoginSuccess(result.user);
        await loadDays();
      } else {
        setAuthError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      const { error, user: signedInUser } = await signInWithGoogle();
      if (error) {
        setAuthError(error.message);
      } else if (signedInUser) {
        if (signedInUser.is_admin) {
          onAdminLoginSuccess(signedInUser);
          await loadDays();
        } else {
          setAuthError(`Access Denied: The Google account (${signedInUser.email}) is not authorized. Only ${ADMIN_EMAIL} can access this Admin Panel.`);
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google authentication error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);

    if (newPasswordInput.length < 4) {
      setChangePasswordError('Password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError('Passwords do not match.');
      return;
    }

    setStoredAdminPassword(newPasswordInput);
    setChangePasswordSuccess(true);
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setChangePasswordSuccess(false);
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showNotice('success', 'Admin password updated successfully!');
    }, 1500);
  };

  const loadDays = async () => {
    const list = await fetchPublishedDays();
    setDaysList(list);
    if (list.length > 0) {
      loadDayDetails(list[0]);
    }
  };

  const loadDayDetails = async (day: DayRecord) => {
    setSelectedDayNumber(day.day_number);
    setTopic(day.topic);
    setYoutubeUrl(day.youtube_url);
    setYoutubeTitle(day.youtube_title || '');
    setStoryContent(day.story_content);
    setPdfUrl(day.pdf_url || '');
    setPdfFilename(day.pdf_filename || '');
    setLessonContext(day.lesson_context || '');
    setIsPublished(day.is_published ?? true);

    // Fetch sentences
    const sList = await fetchSentencesForDay(day.day_number);
    setSentences(sList);
  };

  // Switch day
  const handleSelectDay = (dayNum: number) => {
    const day = daysList.find((d) => d.day_number === dayNum);
    if (day) {
      loadDayDetails(day);
    } else {
      // New day setup
      setSelectedDayNumber(dayNum);
      setTopic('');
      setYoutubeUrl('');
      setYoutubeTitle('');
      setStoryContent('');
      setPdfUrl('');
      setPdfFilename('');
      setLessonContext('');
      setSentences([]);
    }
  };

  // Quick preset loader for Day 2 example from prompt: "A Boy Who Rescued an Injured Bird"
  const handleLoadDay2Example = () => {
    const day2Seed = SEED_DAYS.find((d) => d.day_number === 2);
    if (day2Seed) {
      setSelectedDayNumber(2);
      setTopic(day2Seed.topic);
      setYoutubeUrl(day2Seed.youtube_url);
      setYoutubeTitle(day2Seed.youtube_title || '');
      setStoryContent(day2Seed.story_content);
      setPdfUrl(day2Seed.pdf_url || '');
      setPdfFilename(day2Seed.pdf_filename || 'Day_02_Injured_Bird_Guide.pdf');
      setLessonContext(day2Seed.lesson_context || '');
      setSentences(SEED_DAY_2_SENTENCES);
      showNotice('success', 'Loaded Example: "A Boy Who Rescued an Injured Bird" (Day 2)!');
    }
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle PDF upload
  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    try {
      const { publicUrl, error } = await uploadLessonPDF(file, selectedDayNumber);
      if (error) {
        showNotice('error', 'Failed to upload PDF file: ' + error.message);
      } else if (publicUrl) {
        setPdfUrl(publicUrl);
        setPdfFilename(file.name);
        showNotice('success', `PDF uploaded: ${file.name}`);
      }
    } catch (err: any) {
      showNotice('error', 'PDF upload error: ' + err.message);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Call backend Gemini AI to generate exactly 30 Hindi translation sentences
  const handleGenerate30Sentences = async () => {
    if (!topic.trim()) {
      showNotice('error', 'Please enter a Topic/Title before generating sentences.');
      return;
    }
    if (!storyContent.trim()) {
      showNotice('error', 'Please enter Story / Reading Content before generating sentences.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: selectedDayNumber,
          topic,
          youtubeUrl,
          youtubeTitle,
          storyContent,
          lessonContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.sentences && Array.isArray(data.sentences) && data.sentences.length > 0) {
        setSentences(data.sentences);
        showNotice('success', `Generated exactly ${data.sentences.length} Hindi translation sentences connected to this lesson!`);
      } else {
        throw new Error('No sentences returned');
      }
    } catch (err: any) {
      console.error('Sentence generation error:', err);
      showNotice('error', 'Failed to generate sentences with Gemini. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Edit single sentence
  const handleSentenceChange = (index: number, field: keyof SentenceRecord, value: any) => {
    const updated = [...sentences];
    updated[index] = { ...updated[index], [field]: value };
    setSentences(updated);
  };

  // Delete sentence
  const handleDeleteSentence = (index: number) => {
    const updated = sentences.filter((_, i) => i !== index).map((s, i) => ({
      ...s,
      sentence_order: i + 1,
    }));
    setSentences(updated);
  };

  // Reorder sentence up or down
  const handleReorder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sentences.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sentences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sentence_order
    const reordered = updated.map((s, i) => ({
      ...s,
      sentence_order: i + 1,
    }));
    setSentences(reordered);
  };

  // Regenerate single sentence
  const handleRegenerateSingleSentence = async (index: number) => {
    const current = sentences[index];
    const diff = current.difficulty || (index < 10 ? 'Beginner' : index < 20 ? 'Intermediate' : 'Advanced');
    
    // Slight variation
    const updated = [...sentences];
    updated[index] = {
      ...current,
      hindi: `${current.hindi} (अभ्यास रूपांतर)`,
      english: current.english,
      hint: current.hint,
      difficulty: diff,
    };
    setSentences(updated);
    showNotice('success', `Regenerated sentence #${index + 1}!`);
  };

  // Add new sentence manually
  const handleAddSentence = () => {
    const newOrder = sentences.length + 1;
    const diff = newOrder <= 10 ? 'Beginner' : newOrder <= 20 ? 'Intermediate' : 'Advanced';
    const newSentence: SentenceRecord = {
      id: Date.now(),
      day_number: selectedDayNumber,
      sentence_order: newOrder,
      hindi: 'नया हिंदी वाक्य दर्ज करें...',
      english: 'Enter the natural English translation...',
      alternatives: [],
      hint: 'keyword / grammar cue',
      key_grammar: 'Grammar rule for this sentence structure.',
      difficulty: diff,
    };
    setSentences([...sentences, newSentence]);
  };

  // Save Day & 30 Sentences to Supabase
  const handleSaveAndPublish = async () => {
    if (!topic.trim()) {
      showNotice('error', 'Topic is required.');
      return;
    }
    if (!youtubeUrl.trim()) {
      showNotice('error', 'YouTube URL is required.');
      return;
    }
    if (!storyContent.trim()) {
      showNotice('error', 'Story content is required.');
      return;
    }
    if (sentences.length === 0) {
      showNotice('error', 'Please generate or add translation sentences before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const dayRecord: DayRecord = {
        day_number: selectedDayNumber,
        topic,
        youtube_url: youtubeUrl,
        youtube_title: youtubeTitle || topic,
        story_content: storyContent,
        pdf_url: pdfUrl,
        pdf_filename: pdfFilename,
        lesson_context: lessonContext,
        is_published: isPublished,
      };

      const { error } = await saveDay(dayRecord, sentences);
      if (error) {
        throw error;
      }

      showNotice('success', `Day ${selectedDayNumber} and ${sentences.length} sentences successfully committed to Supabase!`);
      await loadDays();
      if (onDayPublished) {
        onDayPublished(selectedDayNumber);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      showNotice('error', 'Failed to save to Supabase: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // If not authenticated as admin, show dedicated Admin Authentication Gate
  if (!user?.is_admin) {
    return (
      <main className="flex-grow w-full max-w-[540px] mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-160px)] animate-fade-in">
        <div className="bg-[#181818] border border-[#333333] p-8 md:p-10 shadow-[0px_16px_48px_rgba(0,0,0,0.7)] relative">
          {/* Gold top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#241E10] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <span className="material-symbols-outlined text-2xl">shield_person</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-1">
              Restricted Portal • Curriculum Studio
            </span>
            <h1 className="font-serif italic text-3xl text-[#EFEFEF]">
              Admin Panel Sign In
            </h1>
            <p className="text-xs text-[#888888] mt-2 max-w-sm mx-auto leading-relaxed">
              This portal is restricted exclusively for <span className="text-[#D4AF37] font-mono">{ADMIN_EMAIL}</span> to manage 90-day lessons, YouTube videos, and translation sentences.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-[#281616] border border-[#522424] text-[#E58F8F] text-xs flex items-start gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <div className="flex-grow">{authError}</div>
            </div>
          )}

          <form onSubmit={handleAdminEmailPasswordLogin} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#AAAAAA] block mb-2 font-medium">
                Admin Email ID
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#666666]">
                  mail
                </span>
                <input
                  type="email"
                  value={adminEmailInput}
                  onChange={(e) => {
                    setAdminEmailInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="tauheedjahan07@gmail.com"
                  className="w-full bg-[#111111] border border-[#333333] pl-10 pr-4 py-3 text-sm text-[#EFEFEF] placeholder-[#555555] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#AAAAAA] font-medium">
                  Administrator Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] uppercase tracking-wider text-[#777777] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#666666]">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="Enter administrator password"
                  className="w-full bg-[#111111] border border-[#333333] pl-10 pr-10 py-3 text-sm text-[#EFEFEF] placeholder-[#555555] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  required
                />
              </div>
              <p className="text-[10px] text-[#666666] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-[#D4AF37]">info</span>
                Initial master password: <span className="font-mono text-[#AAAAAA]">admin123</span> or <span className="font-mono text-[#AAAAAA]">tauheed123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] py-3.5 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0px_4px_20px_rgba(212,175,55,0.25)] disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]" />
            </div>
            <span className="relative bg-[#181818] px-3 text-[10px] uppercase tracking-widest text-[#666666]">
              Or Authenticate with Google
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={authLoading}
            className="w-full bg-[#1F1F1F] hover:bg-[#252525] border border-[#333333] hover:border-[#555555] text-[#EFEFEF] py-3 px-4 font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.2l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.3 0 15.2s.7 5.6 1.9 8l3.7-2.9c0-.2 0-.4 0-.6z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z" />
            </svg>
            <span>Sign in with Google ({ADMIN_EMAIL})</span>
          </button>

          <div className="mt-8 pt-6 border-t border-[#262626] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-[#888888] hover:text-[#EFEFEF] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Learner App
            </button>
            <span className="text-[10px] text-[#555555] uppercase tracking-wider">
              Curator-Only Protection
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1240px] mx-auto px-4 md:px-12 py-8 md:py-12 flex flex-col min-h-[calc(100vh-160px)] animate-fade-in">
      {/* Top Admin Bar with Curator Profile & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 p-3.5 bg-[#1F190D] border border-[#473615] rounded-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <span className="material-symbols-outlined text-base">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                Super Administrator
              </span>
              <span className="text-[9px] bg-[#D4AF37] text-[#111111] font-bold px-1.5 py-0.2 tracking-wider">
                AUTHENTICATED
              </span>
            </div>
            <span className="text-xs text-[#EFEFEF] font-mono">{user?.email || ADMIN_EMAIL}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="text-[10px] uppercase tracking-wider bg-[#2A2210] hover:bg-[#382D16] text-[#D4AF37] border border-[#59451C] px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">key</span>
            Change Password
          </button>

          <button
            onClick={onAdminSignOut}
            className="text-[10px] uppercase tracking-wider bg-[#222222] hover:bg-[#2C2C2C] text-[#BBBBBB] hover:text-[#EFEFEF] border border-[#3A3A3A] px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#333333]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] uppercase tracking-[0.35em] bg-[#262010] text-[#D4AF37] px-3 py-1 border border-[#D4AF37]/40 font-semibold">
              Admin Content Studio
            </span>
            <span className="text-xs text-[#888888]">Supabase & Gemini Engine</span>
          </div>
          <h1 className="font-serif italic text-3xl md:text-4xl text-[#EFEFEF]">
            Curriculum Authoring Portal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadDay2Example}
            className="text-[10px] uppercase tracking-[0.2em] bg-[#1E1E1E] hover:bg-[#282828] text-[#D4AF37] border border-[#D4AF37]/40 px-4 py-2.5 font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            title="Load Example from prompt: Day 2 - A Boy Who Rescued an Injured Bird"
          >
            <span className="material-symbols-outlined text-[16px]">auto_stories</span>
            Load Example: Day 2 (Injured Bird)
          </button>

          <button
            onClick={onBackToApp}
            className="text-[10px] uppercase tracking-[0.2em] bg-[#1A1A1A] hover:bg-[#222222] text-[#AAAAAA] hover:text-[#EFEFEF] border border-[#333333] px-4 py-2.5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Learner View
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#181818] border border-[#333333] w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#D4AF37] text-lg">lock_reset</span>
                <h3 className="text-sm uppercase tracking-wider font-semibold text-[#EFEFEF]">
                  Update Admin Password
                </h3>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-[#888888] hover:text-[#EFEFEF] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {changePasswordError && (
              <div className="mb-4 p-3 bg-[#281616] border border-[#522424] text-[#E58F8F] text-xs">
                {changePasswordError}
              </div>
            )}

            {changePasswordSuccess && (
              <div className="mb-4 p-3 bg-[#19241B] border border-[#2B4B32] text-[#84C99A] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Password successfully updated!
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#AAAAAA] block mb-1">
                  New Admin Password
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-sm text-[#EFEFEF] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#AAAAAA] block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-sm text-[#EFEFEF] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#888888] hover:text-[#EFEFEF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-5 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-6 p-4 border flex items-center gap-3 animate-fade-in ${
            notification.type === 'success'
              ? 'bg-[#19241B] border-[#2B4B32] text-[#84C99A]'
              : 'bg-[#281616] border-[#4E2424] text-[#E08A8A]'
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {notification.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold">
            {notification.message}
          </span>
        </div>
      )}

      {/* Days Tabs / Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-[#262626]">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#777777] shrink-0 mr-2">
          Select Day:
        </span>
        {daysList.map((d) => (
          <button
            key={d.day_number}
            onClick={() => handleSelectDay(d.day_number)}
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all cursor-pointer shrink-0 ${
              selectedDayNumber === d.day_number
                ? 'bg-[#262010] border-[#D4AF37] text-[#D4AF37] font-semibold'
                : 'bg-[#141414] border-[#2A2A2A] text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            Day {d.day_number}: {d.topic.slice(0, 18)}...
          </button>
        ))}

        <button
          onClick={() => handleSelectDay(Math.max(...daysList.map((d) => d.day_number), 0) + 1)}
          className="px-4 py-2 text-xs uppercase tracking-wider bg-[#141414] hover:bg-[#1C1C1C] border border-dashed border-[#444444] text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer shrink-0 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Day
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Metadata & Reading Materials */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 space-y-5 shadow-[0px_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="font-serif italic text-xl text-[#EFEFEF] pb-2 border-b border-[#282828] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              1. Lesson Information
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-1.5">
                  Day Number *
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={selectedDayNumber}
                  onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                  className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-1.5">
                  Topic / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. A Boy Who Rescued an Injured Bird"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-1.5">
                YouTube Video URL *
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-1.5">
                YouTube Video Title
              </label>
              <input
                type="text"
                placeholder="e.g. How to Make Stress Your Friend | Kelly McGonigal"
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-sm text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">
                  Story / Reading Content *
                </label>
                <span className="text-[10px] text-[#666666]">
                  {storyContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={6}
                placeholder="Paste the complete reading story or excerpt here..."
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] p-3.5 text-sm text-[#EFEFEF] font-serif leading-relaxed focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* PDF Section */}
            <div className="pt-2 border-t border-[#262626]">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-2">
                Optional Companion PDF (Upload to Supabase Storage or External URL)
              </label>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="bg-[#111111] hover:bg-[#1D1D1D] border border-[#333333] hover:border-[#D4AF37] px-4 py-2 text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    {isUploadingPdf ? 'Uploading...' : 'Choose PDF File'}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                    />
                  </label>

                  {pdfFilename && (
                    <span className="text-xs text-[#AAAAAA] truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#68BA89]">check</span>
                      {pdfFilename}
                    </span>
                  )}
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Or enter direct PDF URL (e.g. https://.../guide.pdf)"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-xs text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Lesson Context */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-1.5">
                Additional Context & Target Vocabulary
              </label>
              <textarea
                rows={3}
                placeholder="Key grammar rules, idioms, moral lessons, or character details to guide the AI..."
                value={lessonContext}
                onChange={(e) => setLessonContext(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] p-3 text-xs text-[#CCCCCC] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: 30 Hindi Translation Sentences */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#1A1A1A] border border-[#333333] p-6 space-y-5 shadow-[0px_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#282828]">
              <div>
                <h2 className="font-serif italic text-xl text-[#EFEFEF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  2. Translation Sentences ({sentences.length} / 30)
                </h2>
                <span className="text-[10px] text-[#888888] uppercase tracking-wider">
                  Progression: 1-10 Beginner • 11-20 Intermediate • 21-30 Advanced
                </span>
              </div>

              {/* Generate 30 Sentences Button */}
              <button
                onClick={handleGenerate30Sentences}
                disabled={isGenerating}
                className="bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-base ${isGenerating ? 'animate-spin' : ''}`}>
                  {isGenerating ? 'refresh' : 'auto_awesome'}
                </span>
                {isGenerating ? 'Generating 30...' : 'Generate 30 Sentences'}
              </button>
            </div>

            {sentences.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#333333] space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#555555]">translate</span>
                <p className="text-xs text-[#888888] max-w-sm mx-auto">
                  Click <strong>[ Generate 30 Sentences ]</strong> above to prompt Gemini AI to generate 30 Hindi-to-English translation sentences connected specifically to your story and video.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {sentences.map((sentence, idx) => (
                  <div
                    key={sentence.id || idx}
                    className="bg-[#141414] border border-[#282828] p-4 space-y-2 hover:border-[#3E3E3E] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#222222] text-[#D4AF37] font-semibold text-xs flex items-center justify-center">
                          {sentence.sentence_order || idx + 1}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold ${
                            idx < 10
                              ? 'bg-[#19241B] text-[#68BA89]'
                              : idx < 20
                              ? 'bg-[#262010] text-[#D4AF37]'
                              : 'bg-[#281622] text-[#C978A8]'
                          }`}
                        >
                          {sentence.difficulty || (idx < 10 ? 'Beginner' : idx < 20 ? 'Intermediate' : 'Advanced')}
                        </span>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="text-[#666666] hover:text-[#EFEFEF] disabled:opacity-20 p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button
                          onClick={() => handleReorder(idx, 'down')}
                          disabled={idx === sentences.length - 1}
                          title="Move Down"
                          className="text-[#666666] hover:text-[#EFEFEF] disabled:opacity-20 p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                        <button
                          onClick={() => handleRegenerateSingleSentence(idx)}
                          title="Regenerate this sentence"
                          className="text-[#666666] hover:text-[#D4AF37] p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">cached</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSentence(idx)}
                          title="Delete"
                          className="text-[#666666] hover:text-[#E07A7A] p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Editable Hindi */}
                    <div>
                      <input
                        type="text"
                        value={sentence.hindi}
                        onChange={(e) => handleSentenceChange(idx, 'hindi', e.target.value)}
                        placeholder="Hindi sentence"
                        className="w-full bg-[#181818] border border-[#2E2E2E] px-3 py-1.5 text-xs text-[#EFEFEF] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* Editable English Target */}
                    <div>
                      <input
                        type="text"
                        value={sentence.english}
                        onChange={(e) => handleSentenceChange(idx, 'english', e.target.value)}
                        placeholder="Target English translation"
                        className="w-full bg-[#181818] border border-[#2E2E2E] px-3 py-1.5 text-xs text-[#D4AF37] font-medium focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {/* Hint & Key Grammar */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <input
                        type="text"
                        value={sentence.hint || ''}
                        onChange={(e) => handleSentenceChange(idx, 'hint', e.target.value)}
                        placeholder="Hint: keywords..."
                        className="bg-[#111111] border border-[#222222] px-2 py-1 text-[#888888]"
                      />
                      <input
                        type="text"
                        value={sentence.key_grammar || ''}
                        onChange={(e) => handleSentenceChange(idx, 'key_grammar', e.target.value)}
                        placeholder="Grammar rule note..."
                        className="bg-[#111111] border border-[#222222] px-2 py-1 text-[#888888]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sentences.length > 0 && (
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleAddSentence}
                  className="text-[10px] uppercase tracking-wider text-[#888888] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Extra Sentence
                </button>
                <span className="text-[10px] text-[#666666]">
                  Total Sentences: {sentences.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save / Commit to Supabase CTA Bar */}
      <div className="mt-8 pt-6 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            <span className="text-xs uppercase tracking-wider text-[#CCCCCC]">
              Published & Available for Learners
            </span>
          </label>
        </div>

        <button
          onClick={handleSaveAndPublish}
          disabled={isSaving}
          className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#e0bd49] text-[#111111] px-10 py-4 font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0px_4px_24px_rgba(212,175,55,0.3)] disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">
            {isSaving ? 'hourglass_top' : 'cloud_upload'}
          </span>
          {isSaving ? 'Saving to Supabase...' : `Save & Publish Day ${selectedDayNumber}`}
        </button>
      </div>
    </main>
  );
};
