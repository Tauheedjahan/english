import React, { useState, useEffect, useCallback } from 'react';
import {
  TabType,
  ScreenView,
  LessonStep,
  DayProgress,
  UserProfile,
  DayRecord,
  SentenceRecord,
} from './types';
import { INITIAL_LESSON_STEPS } from './data/mockData';
import { DAY_1_TRANSLATION_SENTENCES } from './data/translationSentences';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { LessonStepperScreen } from './components/LessonStepperScreen';
import { ListeningPracticeScreen } from './components/ListeningPracticeScreen';
import { ReadingScreen } from './components/ReadingScreen';
import { TranslationScreen } from './components/TranslationScreen';
import { SpeakingFeedbackScreen } from './components/SpeakingFeedbackScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { AITeacherScreen } from './components/AITeacherScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AdminPortalScreen } from './components/AdminPortalScreen';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { AdminAccessBlockedScreen } from './components/AdminAccessBlockedScreen';
import { StepRestrictionModal } from './components/StepRestrictionModal';
import { CurriculumStepSubMenu } from './components/CurriculumStepSubMenu';
import { LearnerSignInModal } from './components/LearnerSignInModal';
import {
  getCurrentUser,
  signInWithGoogle,
  signOut,
  fetchPublishedDays,
  fetchSentencesForDay,
  fetchUserProgress,
  saveUserProgress,
  SEED_DAYS,
  isAuthorizedAdminEmail,
  supabase,
} from './lib/supabase';

function getScreenFromLocation(): ScreenView {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
  if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') return 'admin_login';
  if (path === '/admin' || hash === '#/admin' || hash === '#admin') return 'admin';
  return 'home';
}

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(() => getScreenFromLocation());
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Helper to change screen and keep URL path synchronized
  const navigateTo = useCallback((screen: ScreenView) => {
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (screen === 'admin') targetPath = '/admin';
      else if (screen === 'admin_login') targetPath = '/admin/login';
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      const cleanTarget = targetPath.toLowerCase().replace(/\/+$/, '') || '/';
      if (currentPath !== cleanTarget || window.location.hash) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, []);

  // Listen to browser forward/backward and direct URL changes
  useEffect(() => {
    const handlePopState = () => {
      const target = getScreenFromLocation();
      setCurrentScreen(target);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);

  // Curriculum Data (from Supabase)
  const [publishedDays, setPublishedDays] = useState<DayRecord[]>(SEED_DAYS);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentSentences, setCurrentSentences] = useState<SentenceRecord[]>(DAY_1_TRANSLATION_SENTENCES);

  // Progress State
  const [day1Completed, setDay1Completed] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(94);
  const [completedSentenceIds, setCompletedSentenceIds] = useState<number[]>([]);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>(INITIAL_LESSON_STEPS);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [globalRestrictionModal, setGlobalRestrictionModal] = useState<{
    isOpen: boolean;
    targetStepTitle: string;
    requiredStepTitle: string;
    requiredStepNumber: number;
    message?: string;
    onGoToRequired: () => void;
  } | null>(null);

  // Active Day Record
  const activeDay = publishedDays.find((d) => d.day_number === currentDay) || publishedDays[0] || SEED_DAYS[0];

  // 1. Initialize User Profile from Supabase / Session / Admin Token
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && isMounted) {
          setUser(currentUser);
          return;
        }
        // Check stored admin session
        const adminToken = localStorage.getItem('admin_session_token');
        if (adminToken) {
          try {
            const res = await fetch('/api/admin/verify', {
              headers: { 'x-admin-token': adminToken },
            });
            const data = await res.json();
            if (data.authenticated && data.user && isMounted) {
              setUser({
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.full_name,
                is_admin: true,
              });
              return;
            }
          } catch {
            // Ignore
          }
        }
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };
    initAuth();

    // Listen to Supabase auth state changes to auto-restore learner sessions
    let authUnsubscribe: (() => void) | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profile = await getCurrentUser();
            if (profile && isMounted) {
              setUser(profile);
              setIsSignInModalOpen(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
          }
        }
      });
      authUnsubscribe = () => data.subscription.unsubscribe();
    }

    // Listen for OAuth popup completion messages
    const handleOAuthPopupMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_AUTH_SUCCESS' || event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const profile = await getCurrentUser();
        if (profile && isMounted) {
          setUser(profile);
          setIsSignInModalOpen(false);
        }
      }
    };
    window.addEventListener('message', handleOAuthPopupMessage);

    return () => {
      isMounted = false;
      if (authUnsubscribe) authUnsubscribe();
      window.removeEventListener('message', handleOAuthPopupMessage);
    };
  }, []);

  const isAdminUser = Boolean(
    user && (user.is_admin || isAuthorizedAdminEmail(user.email))
  );

  // Automated route protection and redirection for /admin and /admin/login
  useEffect(() => {
    if (authLoading) return;
    if (currentScreen === 'admin') {
      if (!user) {
        // Not logged in -> redirect to /admin/login
        navigateTo('admin_login');
      }
    } else if (currentScreen === 'admin_login') {
      if (isAdminUser) {
        // Already authenticated admin -> redirect to /admin dashboard
        navigateTo('admin');
      }
    }
  }, [authLoading, currentScreen, user, isAdminUser, navigateTo]);

  // 2. Load Published Curriculum Days from Supabase
  const loadCurriculumDays = useCallback(async () => {
    try {
      const days = await fetchPublishedDays();
      if (days && days.length > 0) {
        setPublishedDays(days);
      }
    } catch (e) {
      console.warn('Could not fetch published days:', e);
    }
  }, []);

  useEffect(() => {
    loadCurriculumDays();
  }, [loadCurriculumDays]);

  // 3. Load Sentences and Progress for Current Day and Current User
  const loadDayAndProgress = useCallback(async (dayNum: number, userId: string) => {
    try {
      // Load sentences for day
      const s = await fetchSentencesForDay(dayNum);
      if (s && s.length > 0) {
        setCurrentSentences(s);
      } else if (dayNum === 1) {
        setCurrentSentences(DAY_1_TRANSLATION_SENTENCES);
      }

      // Load persistent user progress from Supabase
      const prog = await fetchUserProgress(userId, dayNum);
      if (prog) {
        setCompletedSentenceIds(Array.isArray(prog.completed_sentence_ids) ? prog.completed_sentence_ids : []);
        setDay1Completed(Boolean(prog.day_completed));
        setUserScore(typeof prog.score === 'number' ? prog.score : 0);

        // Synchronize Stepper state strictly for this user
        setLessonSteps([
          {
            id: 1,
            number: '01',
            title: 'Native Speaker Listening Analysis',
            type: 'listening',
            duration: '08 mins',
            completed: Boolean(prog.listening_completed),
            active: !prog.listening_completed,
            locked: false,
          },
          {
            id: 2,
            number: '02',
            title: 'Companion PDF & Thematic Reading',
            type: 'reading',
            duration: '12 mins',
            completed: Boolean(prog.reading_completed),
            active: Boolean(prog.listening_completed && !prog.reading_completed),
            locked: !prog.listening_completed,
          },
          {
            id: 3,
            number: '03',
            title: 'Sentence Translation Mastery',
            type: 'translation',
            duration: '25 mins',
            completed: Boolean(prog.translation_completed),
            active: Boolean(prog.reading_completed && !prog.translation_completed),
            locked: !prog.reading_completed,
          },
          {
            id: 4,
            number: '04',
            title: 'Oral AI Dialogue & Pronunciation Feedback',
            type: 'speaking',
            duration: '15 mins',
            completed: Boolean(prog.ai_conversation_completed),
            active: Boolean(prog.translation_completed && !prog.ai_conversation_completed),
            locked: !prog.translation_completed,
          },
        ]);
      } else {
        // Clean default starting state for a new user with no previous records
        setCompletedSentenceIds([]);
        setDay1Completed(false);
        setUserScore(0);
        setLessonSteps(INITIAL_LESSON_STEPS);
      }
    } catch (e) {
      console.warn('Error loading day data/progress:', e);
      setCompletedSentenceIds([]);
      setDay1Completed(false);
      setUserScore(0);
      setLessonSteps(INITIAL_LESSON_STEPS);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id || 'guest-learner-id';
    loadDayAndProgress(currentDay, userId);
  }, [currentDay, user?.id, loadDayAndProgress]);

  // Auth Action Handlers
  const handleOpenSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const handleLearnerSignInSuccess = (loggedInUser: UserProfile) => {
    // Immediately clear in-memory state so previous user's data is never displayed
    setCompletedSentenceIds([]);
    setDay1Completed(false);
    setUserScore(0);
    setLessonSteps(INITIAL_LESSON_STEPS);

    setUser(loggedInUser);
    loadDayAndProgress(currentDay, loggedInUser.id);
    setIsSignInModalOpen(false);
  };

  const handleSignOut = async () => {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('app_mock_user');
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    await signOut();
    setCompletedSentenceIds([]);
    setDay1Completed(false);
    setUserScore(0);
    setLessonSteps(INITIAL_LESSON_STEPS);
    setUser(null);
    loadDayAndProgress(currentDay, 'guest-learner-id');
  };

  const handleSelectTab = (tab: TabType) => {
    if (tab === 'ai_teacher') {
      const isStep3Completed = lessonSteps.find((s) => s.id === 3)?.completed;
      if (!isStep3Completed) {
        const isStep1Done = lessonSteps.find((s) => s.id === 1)?.completed;
        const isStep2Done = lessonSteps.find((s) => s.id === 2)?.completed;

        let reqNum = 1;
        let reqTitle = 'Video Listening';
        let reqScreen: ScreenView = 'listening_practice';
        let msg = 'You cannot enter the AI Tutor yet. Please watch and complete the video listening session first.';

        if (isStep1Done && !isStep2Done) {
          reqNum = 2;
          reqTitle = 'Companion Reading Guide';
          reqScreen = 'reading';
          msg = 'Please complete the companion reading guide before proceeding to the AI Tutor.';
        } else if (isStep1Done && isStep2Done) {
          reqNum = 3;
          reqTitle = 'Sentence Translation Mastery';
          reqScreen = 'translation';
          msg = `Please complete all translation sentences (${completedSentenceIds.length}/${currentSentences.length || 30} completed) before entering the AI Tutor.`;
        }

        setGlobalRestrictionModal({
          isOpen: true,
          targetStepTitle: 'Step 04: Oral AI Dialogue',
          requiredStepTitle: reqTitle,
          requiredStepNumber: reqNum,
          message: msg,
          onGoToRequired: () => {
            setGlobalRestrictionModal(null);
            setCurrentScreen(reqScreen);
          },
        });
        return;
      }
    }
    setCurrentTab(tab);
    setCurrentScreen(tab);
  };

  // Workflow Handlers
  const handleStartDay = (day: number) => {
    setCurrentDay(day);
    if (day === 1) {
      if (day1Completed) {
        setCurrentScreen('lesson_stepper');
      } else {
        // Open Listening directly as specified in Day 1 workflow
        setCurrentScreen('listening_practice');
      }
    } else {
      setCurrentScreen('lesson_stepper');
    }
  };

  // 1. Listening Complete -> Unlock Reading & save to Supabase
  const handleFinishListening = async () => {
    setLessonSteps((prev) =>
      prev.map((step) => {
        if (step.id === 1) return { ...step, completed: true, active: false };
        if (step.id === 2) return { ...step, locked: false, active: true };
        return step;
      })
    );
    const userId = user?.id || 'guest-learner-id';
    await saveUserProgress(userId, currentDay, { listening_completed: true });
    setCurrentScreen('reading');
  };

  // 2. Reading Complete -> Unlock Translation & save to Supabase
  const handleFinishReading = async () => {
    setLessonSteps((prev) =>
      prev.map((step) => {
        if (step.id === 2) return { ...step, completed: true, active: false };
        if (step.id === 3) return { ...step, locked: false, active: true };
        return step;
      })
    );
    const userId = user?.id || 'guest-learner-id';
    await saveUserProgress(userId, currentDay, { reading_completed: true });
    setCurrentScreen('translation');
  };

  // 3. Translation sentences progress
  const handleSentenceCompleted = async (sentenceId: number) => {
    const totalCount = currentSentences.length || 41;
    const nextCompleted = completedSentenceIds.includes(sentenceId)
      ? completedSentenceIds
      : [...completedSentenceIds, sentenceId];

    setCompletedSentenceIds(nextCompleted);

    const isAllDone = nextCompleted.length >= totalCount;
    if (isAllDone) {
      setLessonSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.id === 3) return { ...step, completed: true, active: false };
          if (step.id === 4) return { ...step, locked: false, active: true };
          return step;
        })
      );
    }

    const userId = user?.id || 'guest-learner-id';
    await saveUserProgress(userId, currentDay, {
      completed_sentence_ids: nextCompleted,
      translation_completed: isAllDone,
    });
  };

  const handleCompleteAllForDemo = async () => {
    const allIds = currentSentences.map((s) => s.id || 0).filter(Boolean);
    setCompletedSentenceIds(allIds);
    setLessonSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === 3) return { ...step, completed: true, active: false };
        if (step.id === 4) return { ...step, locked: false, active: true };
        return step;
      })
    );
    const userId = user?.id || 'guest-learner-id';
    await saveUserProgress(userId, currentDay, {
      completed_sentence_ids: allIds,
      translation_completed: true,
    });
  };

  // 3b. Complete Translation -> Unlock AI Conversation
  const handleFinishTranslation = () => {
    setLessonSteps((prev) =>
      prev.map((step) => {
        if (step.id === 3) return { ...step, completed: true, active: false };
        if (step.id === 4) return { ...step, locked: false, active: true };
        return step;
      })
    );
    setCurrentScreen('ai_teacher');
  };

  // 4. Complete AI Conversation -> Day 100% finished & save to Supabase
  const handleCompleteDay = async () => {
    setDay1Completed(true);
    setUserScore(96);
    setLessonSteps((prev) =>
      prev.map((step) => ({ ...step, completed: true, locked: false }))
    );

    const userId = user?.id || 'guest-learner-id';
    await saveUserProgress(userId, currentDay, {
      ai_conversation_completed: true,
      day_completed: true,
      score: 96,
    });
  };

  const handleToggleDemoState = async () => {
    const userId = user?.id || 'guest-learner-id';
    if (!day1Completed) {
      setDay1Completed(true);
      setUserScore(96);
      const allIds = currentSentences.map((s) => s.id || 0).filter(Boolean);
      setCompletedSentenceIds(allIds);
      setLessonSteps((prev) =>
        prev.map((step) => ({ ...step, completed: true, locked: false }))
      );
      await saveUserProgress(userId, currentDay, {
        listening_completed: true,
        reading_completed: true,
        translation_completed: true,
        completed_sentence_ids: allIds,
        ai_conversation_completed: true,
        day_completed: true,
        score: 96,
      });
    } else {
      setDay1Completed(false);
      setCompletedSentenceIds([]);
      setLessonSteps(INITIAL_LESSON_STEPS);
      await saveUserProgress(userId, currentDay, {
        listening_completed: false,
        reading_completed: false,
        translation_completed: false,
        completed_sentence_ids: [],
        ai_conversation_completed: false,
        day_completed: false,
        score: 0,
      });
    }
  };

  const handleSetDayState = async (day: number, completed: boolean) => {
    setCurrentDay(day);
    setDay1Completed(completed);
    const userId = user?.id || 'guest-learner-id';

    if (completed) {
      const allIds = currentSentences.map((s) => s.id || 0).filter(Boolean);
      setCompletedSentenceIds(allIds);
      setLessonSteps((prev) =>
        prev.map((step) => ({ ...step, completed: true, locked: false }))
      );
      await saveUserProgress(userId, day, {
        listening_completed: true,
        reading_completed: true,
        translation_completed: true,
        completed_sentence_ids: allIds,
        ai_conversation_completed: true,
        day_completed: true,
        score: 94,
      });
    } else {
      setCompletedSentenceIds([]);
      setLessonSteps(INITIAL_LESSON_STEPS);
      await saveUserProgress(userId, day, {
        listening_completed: false,
        reading_completed: false,
        translation_completed: false,
        completed_sentence_ids: [],
        ai_conversation_completed: false,
        day_completed: false,
        score: 0,
      });
    }
  };

  const isListeningDone = lessonSteps.find((s) => s.id === 1)?.completed || false;
  const isReadingDone = lessonSteps.find((s) => s.id === 2)?.completed || false;
  const isTranslationDone = completedSentenceIds.length >= (currentSentences.length || 30) || (lessonSteps.find((s) => s.id === 3)?.completed || false);
  const isAIDone = day1Completed || (lessonSteps.find((s) => s.id === 4)?.completed || false);

  const dayProgress: DayProgress = {
    dayNumber: currentDay,
    topic: activeDay.topic,
    youtubeUrl: activeDay.youtube_url,
    pdfTitle: activeDay.pdf_filename || `${activeDay.topic} Companion Guide`,
    pdfDownloadUrl: activeDay.pdf_url,
    listeningCompleted: isListeningDone,
    readingCompleted: isReadingDone,
    translationCompleted: isTranslationDone,
    aiConversationCompleted: isAIDone,
    dayCompleted: day1Completed,
    completedSentenceIds,
    score: userScore,
  };

  const handleNavigateCurriculumStep = (target: ScreenView) => {
    if (target === 'reading' && !isListeningDone) {
      setGlobalRestrictionModal({
        isOpen: true,
        targetStepTitle: 'Step 02: Companion Reading Guide',
        requiredStepTitle: 'Native Speaker Listening Analysis',
        requiredStepNumber: 1,
        message: 'Please complete the video listening session before proceeding to the reading guide.',
        onGoToRequired: () => {
          setGlobalRestrictionModal(null);
          setCurrentScreen('listening_practice');
        },
      });
      return;
    }
    if (target === 'translation' && !isReadingDone) {
      setGlobalRestrictionModal({
        isOpen: true,
        targetStepTitle: 'Step 03: Sentence Translation Mastery',
        requiredStepTitle: 'Companion Reading Guide',
        requiredStepNumber: 2,
        message: 'Please finish reading the companion passage before proceeding to sentence translation.',
        onGoToRequired: () => {
          setGlobalRestrictionModal(null);
          setCurrentScreen('reading');
        },
      });
      return;
    }
    if (target === 'ai_teacher' && !isTranslationDone) {
      setGlobalRestrictionModal({
        isOpen: true,
        targetStepTitle: 'Step 04: Oral Fluency & AI Conversation',
        requiredStepTitle: 'Sentence Translation Mastery',
        requiredStepNumber: 3,
        message: `Please complete translation sentences (${completedSentenceIds.length}/${currentSentences.length || 30}) before entering the oral AI conversation.`,
        onGoToRequired: () => {
          setGlobalRestrictionModal(null);
          setCurrentScreen('translation');
        },
      });
      return;
    }

    setCurrentScreen(target);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827] font-sans antialiased selection:bg-[#1B4D3E] selection:text-white">
      {/* Navigation (TopAppBar on desktop, BottomNavBar on mobile) - Excluded from admin section */}
      {!['admin', 'admin_login'].includes(currentScreen) && (
        <Navigation
          currentTab={currentTab}
          currentScreen={currentScreen}
          user={user}
          onSelectTab={handleSelectTab}
          onOpenSettings={() => handleSelectTab('settings')}
          onLoginWithGoogle={handleOpenSignInModal}
          onSignOut={handleSignOut}
        />
      )}

      {/* Sub-menu appearing right after main menu when practicing any section */}
      {['listening_practice', 'reading', 'translation', 'ai_teacher'].includes(currentScreen) && (
        <CurriculumStepSubMenu
          currentScreen={currentScreen}
          dayNumber={currentDay}
          topic={activeDay.topic}
          isListeningDone={isListeningDone}
          isReadingDone={isReadingDone}
          isTranslationDone={isTranslationDone}
          isAIDone={isAIDone}
          completedSentenceCount={completedSentenceIds.length}
          totalSentenceCount={currentSentences.length || 30}
          onBackToCurriculum={() => setCurrentScreen('lesson_stepper')}
          onNavigateStep={handleNavigateCurriculumStep}
        />
      )}

      {/* Main View Router */}
      <div className="flex-grow flex flex-col pb-20 md:pb-6">
        {currentScreen === 'home' && (
          <HomeScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            activeDay={activeDay}
            day1Completed={day1Completed}
            dayProgress={dayProgress}
            score={userScore}
            onStartDay={handleStartDay}
            onToggleDemoState={handleToggleDemoState}
          />
        )}

        {currentScreen === 'lesson_stepper' && (
          <LessonStepperScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            listeningHeading={activeDay.youtube_title}
            readingHeading={activeDay.reading_heading}
            pdfFilename={activeDay.pdf_filename}
            steps={lessonSteps.map((s) => {
              if (s.id === 1 && activeDay.youtube_title) return { ...s, title: activeDay.youtube_title };
              if (s.id === 2 && activeDay.reading_heading) return { ...s, title: activeDay.reading_heading };
              return s;
            })}
            completedSentenceCount={completedSentenceIds.length}
            totalSentencesCount={currentSentences.length || 30}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenTranslationPractice={() => setCurrentScreen('translation')}
            onOpenAIConversation={() => setCurrentScreen('ai_teacher')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'listening_practice' && (
          <ListeningPracticeScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            listeningTitle={activeDay.youtube_title}
            youtubeUrl={activeDay.youtube_url}
            onUpdateYoutubeUrl={(url) => {
              // Update state
              setPublishedDays((prev) =>
                prev.map((d) => (d.day_number === currentDay ? { ...d, youtube_url: url } : d))
              );
            }}
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
            onFinishListening={handleFinishListening}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenTranslationPractice={() => setCurrentScreen('translation')}
            onOpenAIConversation={() => setCurrentScreen('ai_teacher')}
            isReadingUnlocked={isListeningDone}
            isTranslationUnlocked={isReadingDone}
            isAIUnlocked={isTranslationDone}
          />
        )}

        {currentScreen === 'reading' && (
          <ReadingScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            readingHeading={activeDay.reading_heading}
            storyContent={activeDay.story_content}
            pdfUrl={activeDay.pdf_url}
            pdfFilename={activeDay.pdf_filename}
            onBack={() => setCurrentScreen('lesson_stepper')}
            onFinishReading={handleFinishReading}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenTranslationPractice={() => setCurrentScreen('translation')}
            onOpenAIConversation={() => setCurrentScreen('ai_teacher')}
            isListeningDone={isListeningDone}
            isTranslationUnlocked={isReadingDone}
            isAIUnlocked={isTranslationDone}
          />
        )}

        {currentScreen === 'translation' && (
          <TranslationScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            storyContent={activeDay.story_content}
            sentences={currentSentences}
            completedSentenceIds={completedSentenceIds}
            onSentenceCompleted={handleSentenceCompleted}
            onCompleteAllForDemo={handleCompleteAllForDemo}
            onFinishTranslation={handleFinishTranslation}
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenAIConversation={() => setCurrentScreen('ai_teacher')}
            isListeningDone={isListeningDone}
            isReadingDone={isReadingDone}
            isAIDone={isAIDone}
          />
        )}

        {currentScreen === 'speaking_feedback' && (
          <SpeakingFeedbackScreen
            onContinue={() => setCurrentScreen('lesson_stepper')}
            onBackToOverview={() => setCurrentScreen('lesson_stepper')}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen
            currentDay={day1Completed ? Math.max(currentDay, 2) : currentDay}
            onNavigateToDay={(day) => handleStartDay(day)}
            onOpenAITeacher={() => setCurrentScreen('ai_teacher')}
          />
        )}

        {currentScreen === 'ai_teacher' && (
          <AITeacherScreen
            currentDay={currentDay}
            dayCompleted={day1Completed}
            topic={activeDay.topic}
            storyContent={activeDay.story_content}
            youtubeTitle={activeDay.youtube_title}
            lessonContext={activeDay.lesson_context}
            onCompleteDay1={handleCompleteDay}
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenTranslationPractice={() => setCurrentScreen('translation')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            currentDay={currentDay}
            day1Completed={day1Completed}
            user={user}
            onSetDayState={handleSetDayState}
            onNavigateHome={() => handleSelectTab('home')}
            onLoginWithGoogle={handleOpenSignInModal}
            onSignOut={handleSignOut}
          />
        )}

        {/* Dedicated /admin Section with strict Role-Based Access Control */}
        {currentScreen === 'admin' && (
          authLoading ? (
            <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest text-[#6B7280]">Verifying credentials...</span>
              </div>
            </div>
          ) : isAdminUser ? (
            <AdminPortalScreen
              user={user}
              onAdminLoginSuccess={(adminUser) => {
                setUser(adminUser);
                loadCurriculumDays();
              }}
              onAdminSignOut={async () => {
                await handleSignOut();
                navigateTo('admin_login');
              }}
              onBackToApp={() => navigateTo('home')}
              onDayPublished={async (dayNum) => {
                await loadCurriculumDays();
                setCurrentDay(dayNum);
                navigateTo('home');
              }}
            />
          ) : user ? (
            /* Logged-in non-admin -> 403 Forbidden */
            <AdminAccessBlockedScreen
              currentUser={user}
              onNavigateHome={() => navigateTo('home')}
              onNavigateAdminLogin={() => navigateTo('admin_login')}
              onSignOut={async () => {
                await handleSignOut();
                navigateTo('admin_login');
              }}
            />
          ) : (
            /* Unauthenticated visitor -> redirecting to /admin/login */
            <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest text-[#6B7280]">Redirecting to /admin/login...</span>
              </div>
            </div>
          )
        )}

        {/* Dedicated /admin/login Route */}
        {currentScreen === 'admin_login' && (
          authLoading ? (
            <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest text-[#6B7280]">Checking session...</span>
              </div>
            </div>
          ) : isAdminUser ? (
            <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs uppercase tracking-widest text-[#6B7280]">Redirecting to admin dashboard...</span>
              </div>
            </div>
          ) : (
            <AdminLoginScreen
              currentUser={user}
              onLoginSuccess={(adminUser) => {
                setUser(adminUser);
                loadCurriculumDays();
                navigateTo('admin');
              }}
              onNavigateHome={() => navigateTo('home')}
              onLoginWithGoogle={handleOpenSignInModal}
            />
          )
        )}
      </div>

      {/* Global Step Restriction Pop-Up */}
      {globalRestrictionModal && (
        <StepRestrictionModal
          isOpen={globalRestrictionModal.isOpen}
          targetStepTitle={globalRestrictionModal.targetStepTitle}
          requiredStepTitle={globalRestrictionModal.requiredStepTitle}
          requiredStepNumber={globalRestrictionModal.requiredStepNumber}
          message={globalRestrictionModal.message}
          onClose={() => setGlobalRestrictionModal(null)}
          onGoToRequired={globalRestrictionModal.onGoToRequired}
        />
      )}

      {/* Dedicated Learner Sign In Modal */}
      <LearnerSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleLearnerSignInSuccess}
        initialEmail={user?.email || ''}
      />
    </div>
  );
}

export default App;
