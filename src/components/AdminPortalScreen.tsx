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
  const [readingHeading, setReadingHeading] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');
  const [lessonContext, setLessonContext] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Sentences state (manually managed)
  const [sentences, setSentences] = useState<SentenceRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const [isGeneratingSentences, setIsGeneratingSentences] = useState(false);

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
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

    try {
      const token = localStorage.getItem('admin_session_token') || '';
      const adminSecret = localStorage.getItem('admin_portal_custom_password') || 'admin123';
      await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({ newPassword: newPasswordInput.trim() }),
      });
    } catch (err) {
      console.warn('Server password update note:', err);
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

  const handleGenerateSentencesWithAI = async () => {
    setIsGeneratingSentences(true);
    try {
      const token = localStorage.getItem('admin_session_token') || '';
      const adminSecret = localStorage.getItem('admin_portal_custom_password') || 'admin123';
      const res = await fetch('/api/admin/generate-sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({
          dayNumber: selectedDayNumber,
          topic: topic || youtubeTitle || `Day ${selectedDayNumber}`,
          youtubeUrl,
          youtubeTitle,
          storyContent,
          lessonContext,
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.sentences) && data.sentences.length > 0) {
        setSentences(data.sentences);
        showNotice('success', `Generated ${data.sentences.length} sentences for Day ${selectedDayNumber}!`);
      } else {
        showNotice('error', data.error || 'Failed to generate sentences.');
      }
    } catch (err: any) {
      showNotice('error', 'Error generating sentences with AI.');
    } finally {
      setIsGeneratingSentences(false);
    }
  };

  const loadDays = async () => {
    const list = await fetchPublishedDays();
    setDaysList(list);
    if (list.length > 0) {
      const current = list.find((d) => d.day_number === selectedDayNumber) || list[0];
      loadDayDetails(current);
    }
  };

  const loadDayDetails = async (day: DayRecord) => {
    setSelectedDayNumber(day.day_number);
    setTopic(day.topic || '');
    setYoutubeUrl(day.youtube_url || '');
    setYoutubeTitle(day.youtube_title || '');
    setReadingHeading(day.reading_heading || '');
    setStoryContent(day.story_content || '');
    setPdfUrl(day.pdf_url || '');
    setPdfFilename(day.pdf_filename || '');
    setLessonContext(day.lesson_context || '');
    setIsPublished(day.is_published ?? true);

    // Fetch sentences for this day
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
      setTopic(`Day ${dayNum}`);
      setYoutubeUrl('');
      setYoutubeTitle('');
      setReadingHeading('');
      setStoryContent('');
      setPdfUrl('');
      setPdfFilename(`Day_${dayNum.toString().padStart(2, '0')}_Guide.pdf`);
      setLessonContext('');
      setSentences([]);
    }
  };

  // Quick preset loader for Day 2 example
  const handleLoadDay2Example = () => {
    const day2Seed = SEED_DAYS.find((d) => d.day_number === 2);
    if (day2Seed) {
      setSelectedDayNumber(2);
      setTopic(day2Seed.topic);
      setYoutubeUrl(day2Seed.youtube_url);
      setYoutubeTitle(day2Seed.youtube_title || '');
      setReadingHeading(day2Seed.reading_heading || 'The Injured Sparrow’s Flight');
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
      if (error || !publicUrl) {
        // Local preview fallback if remote bucket is not active
        const blobUrl = URL.createObjectURL(file);
        setPdfUrl(blobUrl);
        setPdfFilename(file.name);
        showNotice('success', `PDF loaded: ${file.name}`);
      } else {
        setPdfUrl(publicUrl);
        setPdfFilename(file.name);
        showNotice('success', `PDF uploaded: ${file.name}`);
      }
    } catch (err: any) {
      const blobUrl = URL.createObjectURL(file);
      setPdfUrl(blobUrl);
      setPdfFilename(file.name);
      showNotice('success', `PDF loaded: ${file.name}`);
    } finally {
      setIsUploadingPdf(false);
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

  // Add new sentence manually
  const handleAddSentence = () => {
    const newOrder = sentences.length + 1;
    const diff = newOrder <= 10 ? 'Beginner' : newOrder <= 20 ? 'Intermediate' : 'Advanced';
    const newSentence: SentenceRecord = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      day_number: selectedDayNumber,
      sentence_order: newOrder,
      hindi: '',
      english: '',
      alternatives: [],
      hint: '',
      key_grammar: '',
      difficulty: diff,
    };
    setSentences([...sentences, newSentence]);
  };

  // Save Day & Sentences
  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      // Auto-derive topic if not set
      const derivedTopic = (topic || '').trim() || (youtubeTitle || '').trim() || `Day ${selectedDayNumber} - Lesson`;

      const dayRecord: DayRecord = {
        day_number: selectedDayNumber,
        topic: derivedTopic,
        youtube_url: youtubeUrl.trim(),
        youtube_title: youtubeTitle.trim() || derivedTopic,
        reading_heading: readingHeading.trim() || derivedTopic,
        story_content: storyContent.trim(),
        pdf_url: pdfUrl.trim(),
        pdf_filename: pdfFilename.trim(),
        lesson_context: lessonContext.trim(),
        is_published: isPublished,
      };

      const { error } = await saveDay(dayRecord, sentences);
      if (error) {
        throw error;
      }

      showNotice('success', `Day ${selectedDayNumber} with ${sentences.length} sentence(s) saved and published!`);
      await loadDays();
      if (onDayPublished) {
        onDayPublished(selectedDayNumber);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      showNotice('error', 'Failed to save: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // If not authenticated as admin, show dedicated Admin Authentication Gate
  if (!user?.is_admin) {
    return (
      <main className="flex-grow w-full max-w-[520px] mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-160px)] animate-fade-in bg-white text-[#111827]">
        <div className="bg-white border border-[#E2E8E5] p-8 md:p-10 shadow-[0px_16px_40px_rgba(27,77,62,0.08)] relative rounded-sm">
          {/* Top Forest Green Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1B4D3E] rounded-t-sm" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#F4F7F5] border border-[#E2E8E5] rounded-xs">
              <span className="w-2 h-2 rounded-full bg-[#1B4D3E]"></span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#1B4D3E] font-bold">
                ADMIN PANEL
              </span>
            </div>
            <h1 className="font-serif italic text-3xl text-[#111827]">
              Administrator Sign In
            </h1>
            <p className="text-xs text-[#4B5563] mt-2 max-w-sm mx-auto leading-relaxed">
              This curriculum management studio is restricted exclusively to{' '}
              <strong className="text-[#1B4D3E] font-medium">{ADMIN_EMAIL}</strong>.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-3 animate-fade-in rounded-sm">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <div className="flex-grow">{authError}</div>
            </div>
          )}

          <form onSubmit={handleAdminEmailPasswordLogin} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#374151] block mb-2 font-semibold">
                Admin Email ID
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#9CA3AF]">
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
                  className="w-full bg-white border border-[#CBD5E1] pl-10 pr-4 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E] focus:outline-none transition-colors rounded-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#374151] font-semibold">
                  Administrator Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] uppercase tracking-wider text-[#6B7280] hover:text-[#1B4D3E] transition-colors cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-[#9CA3AF]">
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
                  className="w-full bg-white border border-[#CBD5E1] pl-10 pr-10 py-2.5 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E] focus:outline-none transition-colors rounded-sm"
                  required
                />
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#1B4D3E]">info</span>
                Initial master password: <span className="font-mono text-[#111827] font-medium">admin123</span> or <span className="font-mono text-[#111827] font-medium">tauheed123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#1B4D3E] hover:bg-[#153E32] text-white py-3 px-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 rounded-sm"
            >
              {authLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>Sign In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Learner App
            </button>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
              Admin Access Only
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1240px] mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col min-h-[calc(100vh-160px)] animate-fade-in bg-white text-[#111827]">
      {/* Top Admin Status & Security Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-white border border-[#E2E8E5] shadow-xs rounded-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F2EE] border border-[#1B4D3E]/30 flex items-center justify-center text-[#1B4D3E]">
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#1B4D3E] font-bold">
                Super Administrator
              </span>
              <span className="text-[9px] bg-[#1B4D3E] text-white font-semibold px-2 py-0.5 rounded-xs tracking-wider">
                AUTHENTICATED
              </span>
            </div>
            <span className="text-xs text-[#4B5563] font-mono">{user?.email || ADMIN_EMAIL}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="text-[11px] uppercase tracking-wider bg-white hover:bg-[#F3F4F6] text-[#1B4D3E] border border-[#1B4D3E]/30 px-3.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer font-medium rounded-sm"
          >
            <span className="material-symbols-outlined text-xs">key</span>
            Change Password
          </button>

          <button
            onClick={onAdminSignOut}
            className="text-[11px] uppercase tracking-wider bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#DC2626] border border-[#D1D5DB] px-3.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer font-medium rounded-sm"
          >
            <span className="material-symbols-outlined text-xs">logout</span>
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8E5]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] uppercase tracking-[0.3em] bg-[#E8F2EE] text-[#1B4D3E] px-2.5 py-0.5 border border-[#1B4D3E]/20 font-bold rounded-xs">
              Instructor Studio
            </span>
            <span className="text-xs text-[#6B7280]">Manual Curriculum Authoring</span>
          </div>
          <h1 className="font-serif italic text-2xl md:text-3xl text-[#111827]">
            Curriculum Authoring Portal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadDay2Example}
            className="text-[11px] uppercase tracking-[0.15em] bg-white hover:bg-[#F3F4F6] text-[#1B4D3E] border border-[#1B4D3E]/30 px-3.5 py-2 font-medium transition-all cursor-pointer flex items-center gap-1.5 rounded-sm"
            title="Load Example from prompt: Day 2 - A Boy Who Rescued an Injured Bird"
          >
            <span className="material-symbols-outlined text-[16px]">auto_stories</span>
            Load Day 2 Preset
          </button>

          <button
            onClick={onBackToApp}
            className="text-[11px] uppercase tracking-[0.15em] bg-[#1B4D3E] hover:bg-[#153E32] text-white px-4 py-2 font-medium transition-all cursor-pointer flex items-center gap-1.5 rounded-sm shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Learner App
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#E2E8E5] w-full max-w-md p-6 shadow-2xl relative rounded-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B4D3E] text-lg">lock_reset</span>
                <h3 className="text-sm uppercase tracking-wider font-semibold text-[#111827]">
                  Update Admin Password
                </h3>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {changePasswordError && (
              <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-sm">
                {changePasswordError}
              </div>
            )}

            {changePasswordSuccess && (
              <div className="mb-4 p-3 bg-[#D1FAE5] border border-[#6EE7B7] text-[#065F46] text-xs flex items-center gap-2 rounded-sm">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Password successfully updated!
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#374151] block mb-1 font-semibold">
                  New Admin Password
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full bg-white border border-[#CBD5E1] px-3 py-2 text-sm text-[#111827] focus:border-[#1B4D3E] focus:outline-none rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#374151] block mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white border border-[#CBD5E1] px-3 py-2 text-sm text-[#111827] focus:border-[#1B4D3E] focus:outline-none rounded-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#111827] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors rounded-sm"
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
          className={`mb-6 p-4 border flex items-center gap-3 animate-fade-in rounded-sm ${
            notification.type === 'success'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
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
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-[#E2E8E5]">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] shrink-0 mr-2 font-semibold">
          Select Day:
        </span>
        {daysList.map((d) => (
          <button
            key={d.day_number}
            onClick={() => handleSelectDay(d.day_number)}
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all cursor-pointer shrink-0 rounded-sm ${
              selectedDayNumber === d.day_number
                ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white font-semibold shadow-xs'
                : 'bg-white border-[#E2E8E5] text-[#4B5563] hover:text-[#111827] hover:border-[#CBD5E1]'
            }`}
          >
            Day {d.day_number}
          </button>
        ))}

        <button
          onClick={() => handleSelectDay(Math.max(...daysList.map((d) => d.day_number), 0) + 1)}
          className="px-4 py-2 text-xs uppercase tracking-wider bg-white hover:bg-[#F8FAF9] border border-dashed border-[#1B4D3E]/40 text-[#1B4D3E] hover:border-[#1B4D3E] transition-all cursor-pointer shrink-0 flex items-center gap-1 font-semibold rounded-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Day
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Materials (Clean & focused) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E2E8E5] p-6 space-y-5 shadow-[0px_4px_20px_rgba(27,77,62,0.04)] rounded-sm">
            <h2 className="font-serif italic text-xl text-[#111827] pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]"></span>
              1. Lesson Materials
            </h2>

            {/* Day Number Selector */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#374151] mb-1.5">
                Day Number *
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                className="w-full max-w-[120px] bg-white border border-[#CBD5E1] px-3.5 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm font-semibold"
              />
            </div>

            {/* Configurable Headings & Titles Section */}
            <div className="bg-[#F8FAF9] border border-[#E2E8E5] p-4 md:p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E5]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#1B4D3E]">title</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1B4D3E]">
                    Day & Lesson Headings Configuration
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-medium bg-white px-2 py-0.5 border border-[#E2E8E5] rounded-xs">
                  Editable Titles
                </span>
              </div>

              {/* 1. Main Home Page & Curriculum Title */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111827]">
                    1. Main Day Topic / Title * <span className="text-[#6B7280] font-normal">(Home Page & Stepper)</span>
                  </label>
                  <span className="text-[9px] text-[#1B4D3E] font-medium">
                    Preview: Day {selectedDayNumber.toString().padStart(2, '0')}: {topic || 'Topic'}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Morning Routines & Habit Loops"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2.5 text-sm text-[#111827] font-medium focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Controls the primary headline displayed on the Home Page (<em>"Day {selectedDayNumber.toString().padStart(2, '0')}: {topic || '...'}"</em>) and the main Curriculum Stepper.
                </p>
              </div>

              {/* 2. Step 1: Listening Section Heading */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111827]">
                    2. Step 1: Listening Heading <span className="text-[#6B7280] font-normal">(Video Lesson Screen)</span>
                  </label>
                  <span className="text-[9px] text-[#6B7280]">
                    Shown when student clicks Listening
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. The Science of Morning Routines & Productive Habits"
                  value={youtubeTitle}
                  onChange={(e) => setYoutubeTitle(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Specific heading displayed at the top of the video player in Step 1 (Listening Practice).
                </p>
              </div>

              {/* 3. Step 2: Reading Section Heading */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111827]">
                    3. Step 2: Reading Heading <span className="text-[#6B7280] font-normal">(Companion Story Screen)</span>
                  </label>
                  <span className="text-[9px] text-[#6B7280]">
                    Shown when student clicks Reading
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. The 6:00 AM Architect"
                  value={readingHeading}
                  onChange={(e) => setReadingHeading(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                />
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Specific heading displayed at the top of the reading companion in Step 2 (Reading Guide).
                </p>
              </div>
            </div>

            {/* YouTube Video URL */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#374151] mb-1.5">
                YouTube Video URL (Step 1 Video)
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
              />
            </div>

            {/* Story / Reading Content */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#374151]">
                  Story / Reading Text
                </label>
                <span className="text-[10px] text-[#6B7280]">
                  {storyContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={7}
                placeholder="Paste the complete reading story or excerpt for learners here..."
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] p-3.5 text-sm text-[#111827] font-serif leading-relaxed focus:outline-none focus:border-[#1B4D3E] rounded-sm"
              />
            </div>

            {/* Companion PDF Section */}
            <div className="pt-3 border-t border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#374151]">
                  Companion PDF Document (Changes per Day)
                </label>
                {pdfFilename && (
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFilename('');
                      setPdfUrl('');
                      showNotice('success', 'Companion PDF removed from this day');
                    }}
                    className="text-[10px] text-[#DC2626] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Clear PDF
                  </button>
                )}
              </div>

              {/* Editable PDF Document Title/Filename */}
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] mb-1">
                  PDF Guide Name / Filename (Editable)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`e.g. Day_${selectedDayNumber.toString().padStart(2, '0')}_Lesson_Guide.pdf`}
                    value={pdfFilename}
                    onChange={(e) => setPdfFilename(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPdfFilename(`Day_${selectedDayNumber.toString().padStart(2, '0')}_Lesson_Guide.pdf`)}
                    className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-[10px] uppercase tracking-wider font-medium whitespace-nowrap rounded-sm cursor-pointer transition-colors"
                    title="Set standard naming for this day"
                  >
                    Auto-Name
                  </button>
                </div>
              </div>

              {/* Upload File & Link Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <label className="bg-white hover:bg-[#F8FAF9] border border-[#1B4D3E]/40 px-4 py-2 text-xs uppercase tracking-wider text-[#1B4D3E] font-medium flex items-center gap-2 cursor-pointer transition-colors rounded-sm shadow-2xs">
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  {isUploadingPdf ? 'Processing PDF...' : 'Choose / Replace PDF File'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileChange}
                    className="hidden"
                  />
                </label>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1B4D3E] hover:underline flex items-center gap-1 font-medium bg-[#E8F2EE] px-3 py-1.5 border border-[#1B4D3E]/20 rounded-sm"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Test / Preview PDF
                  </a>
                )}
              </div>

              {/* Direct PDF Link */}
              <div>
                <label className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] mb-1">
                  Direct Download Link / URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/day-guide.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manual Translation Sentences */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2E8E5] p-6 space-y-5 shadow-[0px_4px_20px_rgba(27,77,62,0.04)] rounded-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h2 className="font-serif italic text-xl text-[#111827] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]"></span>
                  2. Translation Practice Sentences ({sentences.length})
                </h2>
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider">
                  Author English sentences and Hindi/Urdu translations manually
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleGenerateSentencesWithAI}
                  disabled={isGeneratingSentences}
                  className="bg-white hover:bg-[#F3F4F6] text-[#1B4D3E] border border-[#1B4D3E]/30 px-3 py-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-sm disabled:opacity-50"
                  title="Generate 30 Progressive Translation Sentences based on story content using AI"
                >
                  {isGeneratingSentences ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                      AI Sentences
                    </>
                  )}
                </button>

                <button
                  onClick={handleAddSentence}
                  className="bg-[#1B4D3E] hover:bg-[#153E32] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-sm shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Sentence
                </button>
              </div>
            </div>

            {sentences.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-[#CBD5E1] space-y-3 rounded-sm bg-[#F9FAFB]">
                <span className="material-symbols-outlined text-4xl text-[#9CA3AF]">translate</span>
                <p className="text-xs text-[#4B5563] max-w-sm mx-auto">
                  No translation sentences added yet for Day {selectedDayNumber}. Click <strong>[ + Add Sentence ]</strong> to add your first translation practice pair.
                </p>
                <button
                  onClick={handleAddSentence}
                  className="bg-white hover:bg-[#F3F4F6] text-[#1B4D3E] border border-[#1B4D3E]/40 px-4 py-2 text-xs uppercase tracking-wider font-medium inline-flex items-center gap-1.5 cursor-pointer rounded-sm"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add First Sentence
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                {sentences.map((sentence, idx) => (
                  <div
                    key={sentence.id || idx}
                    className="bg-[#F8FAF9] border border-[#E2E8E5] p-4 space-y-2.5 hover:border-[#CBD5E1] transition-all rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#1B4D3E] text-white font-semibold text-xs flex items-center justify-center">
                          {sentence.sentence_order || idx + 1}
                        </span>
                        <select
                          value={sentence.difficulty || (idx < 10 ? 'Beginner' : idx < 20 ? 'Intermediate' : 'Advanced')}
                          onChange={(e) => handleSentenceChange(idx, 'difficulty', e.target.value)}
                          className="text-[10px] uppercase tracking-wider bg-white border border-[#CBD5E1] text-[#1B4D3E] font-semibold px-2 py-0.5 rounded-sm focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="text-[#6B7280] hover:text-[#111827] disabled:opacity-20 p-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button
                          onClick={() => handleReorder(idx, 'down')}
                          disabled={idx === sentences.length - 1}
                          title="Move Down"
                          className="text-[#6B7280] hover:text-[#111827] disabled:opacity-20 p-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSentence(idx)}
                          title="Delete Sentence"
                          className="text-[#9CA3AF] hover:text-[#DC2626] p-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Hindi / Urdu Sentence */}
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1">
                        Hindi / Urdu Sentence *
                      </label>
                      <input
                        type="text"
                        value={sentence.hindi}
                        onChange={(e) => handleSentenceChange(idx, 'hindi', e.target.value)}
                        placeholder="यहाँ हिंदी वाक्य लिखें... (e.g. वह तुरंत उसे अपने घर ले आया।)"
                        className="w-full bg-white border border-[#CBD5E1] px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                      />
                    </div>

                    {/* Target English Sentence */}
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1B4D3E] block mb-1">
                        English Translation *
                      </label>
                      <input
                        type="text"
                        value={sentence.english}
                        onChange={(e) => handleSentenceChange(idx, 'english', e.target.value)}
                        placeholder="Enter natural English translation... (e.g. He brought it home immediately.)"
                        className="w-full bg-white border border-[#CBD5E1] px-3 py-2 text-xs text-[#111827] font-medium focus:outline-none focus:border-[#1B4D3E] rounded-sm"
                      />
                    </div>

                    {/* Hint & Key Grammar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <input
                          type="text"
                          value={sentence.hint || ''}
                          onChange={(e) => handleSentenceChange(idx, 'hint', e.target.value)}
                          placeholder="Optional cue (e.g. brought it home)"
                          className="w-full bg-white border border-[#E2E8E5] px-2.5 py-1.5 text-xs text-[#4B5563] rounded-sm placeholder-[#9CA3AF] focus:border-[#1B4D3E] focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={sentence.key_grammar || ''}
                          onChange={(e) => handleSentenceChange(idx, 'key_grammar', e.target.value)}
                          placeholder="Optional grammar note"
                          className="w-full bg-white border border-[#E2E8E5] px-2.5 py-1.5 text-xs text-[#4B5563] rounded-sm placeholder-[#9CA3AF] focus:border-[#1B4D3E] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sentences.length > 0 && (
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleAddSentence}
                  className="text-xs uppercase tracking-wider text-[#1B4D3E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  + Add Another Sentence
                </button>
                <span className="text-xs text-[#6B7280]">
                  Total: <strong className="text-[#111827]">{sentences.length}</strong> sentences
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save / Commit CTA Bar */}
      <div className="mt-8 pt-6 border-t border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-sm border shadow-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-[#1B4D3E] w-4 h-4 cursor-pointer"
            />
            <span className="text-xs uppercase tracking-wider text-[#374151] font-medium">
              Published & Available in Learner Curriculum
            </span>
          </label>
        </div>

        <button
          onClick={handleSaveAndPublish}
          disabled={isSaving}
          className="w-full sm:w-auto bg-[#1B4D3E] hover:bg-[#153E32] text-white px-8 py-3.5 font-sans text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm disabled:opacity-50 rounded-sm"
        >
          <span className="material-symbols-outlined text-lg">
            {isSaving ? 'hourglass_top' : 'cloud_upload'}
          </span>
          {isSaving ? 'Saving Changes...' : `Save & Publish Day ${selectedDayNumber}`}
        </button>
      </div>
    </main>
  );
};
