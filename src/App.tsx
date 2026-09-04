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
import {
  getCurrentUser,
  signInWithGoogle,
  signOut,
  fetchPublishedDays,
  fetchSentencesForDay,
  fetchUserProgress,
  saveUserProgress,
  SEED_DAYS,
} from './lib/supabase';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');

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

  // Active Day Record
  const activeDay = publishedDays.find((d) => d.day_number === currentDay) || publishedDays[0] || SEED_DAYS[0];

  // 1. Initialize User Profile from Supabase / Session
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    initAuth();
  }, []);

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
        setCompletedSentenceIds(prog.completed_sentence_ids || []);
        setDay1Completed(prog.day_completed);
        setUserScore(prog.score || 94);

        // Synchronize Stepper state
        setLessonSteps([
          {
            id: 1,
            number: '01',
            title: 'Native Speaker Listening Analysis',
            type: 'listening',
            duration: '08 mins',
            completed: prog.listening_completed,
            active: !prog.listening_completed,
            locked: false,
          },
          {
            id: 2,
            number: '02',
            title: 'Companion PDF & Thematic Reading',
            type: 'reading',
            duration: '12 mins',
            completed: prog.reading_completed,
            active: prog.listening_completed && !prog.reading_completed,
            locked: !prog.listening_completed,
          },
          {
            id: 3,
            number: '03',
            title: 'Sentence Translation Mastery',
            type: 'translation',
            duration: '25 mins',
            completed: prog.translation_completed,
            active: prog.reading_completed && !prog.translation_completed,
            locked: !prog.reading_completed,
          },
          {
            id: 4,
            number: '04',
            title: 'Oral AI Dialogue & Pronunciation Feedback',
            type: 'speaking',
            duration: '15 mins',
            completed: prog.ai_conversation_completed,
            active: prog.translation_completed && !prog.ai_conversation_completed,
            locked: !prog.translation_completed,
          },
        ]);
      }
    } catch (e) {
      console.warn('Error loading day data/progress:', e);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id || 'guest-learner-id';
    loadDayAndProgress(currentDay, userId);
  }, [currentDay, user, loadDayAndProgress]);

  // Auth Action Handlers
  const handleLoginWithGoogle = async () => {
    const { user: loggedInUser, error } = await signInWithGoogle();
    if (!error && loggedInUser) {
      setUser(loggedInUser);
      // Restore user progress for this user
      loadDayAndProgress(currentDay, loggedInUser.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    loadDayAndProgress(currentDay, 'guest-learner-id');
  };

  const handleSelectTab = (tab: TabType) => {
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

  const dayProgress: DayProgress = {
    dayNumber: currentDay,
    topic: activeDay.topic,
    youtubeUrl: activeDay.youtube_url,
    pdfTitle: activeDay.pdf_filename || `${activeDay.topic} Companion Guide`,
    pdfDownloadUrl: activeDay.pdf_url,
    listeningCompleted: lessonSteps[0]?.completed || false,
    readingCompleted: lessonSteps[1]?.completed || false,
    translationCompleted: completedSentenceIds.length >= (currentSentences.length || 41),
    aiConversationCompleted: day1Completed,
    dayCompleted: day1Completed,
    completedSentenceIds,
    score: userScore,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-[#EFEFEF] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#111111]">
      {/* Navigation (TopAppBar on desktop, BottomNavBar on mobile) */}
      <Navigation
        currentTab={currentTab}
        currentScreen={currentScreen}
        user={user}
        onSelectTab={handleSelectTab}
        onOpenSettings={() => handleSelectTab('settings')}
        onLoginWithGoogle={handleLoginWithGoogle}
        onSignOut={handleSignOut}
        onOpenAdmin={() => setCurrentScreen('admin')}
      />

      {/* Main View Router */}
      <div className="flex-grow flex flex-col pb-20 md:pb-6">
        {currentScreen === 'home' && (
          <HomeScreen
            day1Completed={day1Completed}
            dayProgress={dayProgress}
            score={userScore}
            onStartDay={handleStartDay}
            onToggleDemoState={handleToggleDemoState}
          />
        )}

        {currentScreen === 'lesson_stepper' && (
          <LessonStepperScreen
            steps={lessonSteps}
            completedSentenceCount={completedSentenceIds.length}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenTranslationPractice={() => setCurrentScreen('translation')}
            onOpenAIConversation={() => setCurrentScreen('ai_teacher')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'listening_practice' && (
          <ListeningPracticeScreen
            youtubeUrl={activeDay.youtube_url}
            onUpdateYoutubeUrl={(url) => {
              // Update state
              setPublishedDays((prev) =>
                prev.map((d) => (d.day_number === currentDay ? { ...d, youtube_url: url } : d))
              );
            }}
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
            onFinishListening={handleFinishListening}
          />
        )}

        {currentScreen === 'reading' && (
          <ReadingScreen
            dayNumber={currentDay}
            topic={activeDay.topic}
            storyContent={activeDay.story_content}
            pdfUrl={activeDay.pdf_url}
            pdfFilename={activeDay.pdf_filename}
            onBack={() => setCurrentScreen('lesson_stepper')}
            onFinishReading={handleFinishReading}
          />
        )}

        {currentScreen === 'translation' && (
          <TranslationScreen
            dayNumber={currentDay}
            sentences={currentSentences}
            completedSentenceIds={completedSentenceIds}
            onSentenceCompleted={handleSentenceCompleted}
            onCompleteAllForDemo={handleCompleteAllForDemo}
            onFinishTranslation={handleFinishTranslation}
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
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
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            currentDay={currentDay}
            day1Completed={day1Completed}
            user={user}
            onSetDayState={handleSetDayState}
            onNavigateHome={() => handleSelectTab('home')}
            onLoginWithGoogle={handleLoginWithGoogle}
            onSignOut={handleSignOut}
            onOpenAdmin={() => setCurrentScreen('admin')}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminPortalScreen
            user={user}
            onAdminLoginSuccess={(adminUser) => {
              setUser(adminUser);
              loadCurriculumDays();
            }}
            onAdminSignOut={async () => {
              await handleSignOut();
              setCurrentScreen('home');
            }}
            onBackToApp={() => setCurrentScreen('home')}
            onDayPublished={async (dayNum) => {
              await loadCurriculumDays();
              setCurrentDay(dayNum);
              setCurrentScreen('home');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
