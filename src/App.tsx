import React, { useState } from 'react';
import { TabType, ScreenView, LessonStep } from './types';
import { INITIAL_LESSON_STEPS } from './data/mockData';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { LessonStepperScreen } from './components/LessonStepperScreen';
import { ListeningPracticeScreen } from './components/ListeningPracticeScreen';
import { SpeakingFeedbackScreen } from './components/SpeakingFeedbackScreen';
import { ReadingScreen } from './components/ReadingScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { AITeacherScreen } from './components/AITeacherScreen';
import { SettingsScreen } from './components/SettingsScreen';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');

  // Application State
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [day1Completed, setDay1Completed] = useState<boolean>(false);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>(INITIAL_LESSON_STEPS);
  const [userScore, setUserScore] = useState<number>(78);

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentScreen(tab);
  };

  const handleStartDay = (day: number) => {
    setCurrentDay(day);
    setCurrentScreen('lesson_stepper');
  };

  const handleFinishListening = () => {
    // Mark listening step completed
    setLessonSteps((prev) =>
      prev.map((step) =>
        step.id === 1 ? { ...step, completed: true, active: false } : step.id === 2 ? { ...step, active: true, locked: false } : step
      )
    );
    // Proceed to Speaking Feedback screen to review performance
    setCurrentScreen('speaking_feedback');
  };

  const handleCompleteSpeakingFeedback = () => {
    setDay1Completed(true);
    setUserScore(78);
    setLessonSteps((prev) =>
      prev.map((step) =>
        step.id <= 3 ? { ...step, completed: true } : step
      )
    );
    setCurrentTab('home');
    setCurrentScreen('home');
  };

  const handleToggleDemoState = () => {
    setDay1Completed(!day1Completed);
  };

  const handleSetDayState = (day: number, completed: boolean) => {
    setCurrentDay(day);
    setDay1Completed(completed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-[#EFEFEF] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#111111]">
      {/* Navigation (TopAppBar on desktop, BottomNavBar on mobile) */}
      <Navigation
        currentTab={currentTab}
        currentScreen={currentScreen}
        onSelectTab={handleSelectTab}
        onOpenSettings={() => handleSelectTab('settings')}
      />

      {/* Main View Router */}
      <div className="flex-grow flex flex-col pb-20 md:pb-6">
        {currentScreen === 'home' && (
          <HomeScreen
            day1Completed={day1Completed}
            score={userScore}
            onStartDay={handleStartDay}
            onToggleDemoState={handleToggleDemoState}
          />
        )}

        {currentScreen === 'lesson_stepper' && (
          <LessonStepperScreen
            steps={lessonSteps}
            onOpenListeningPractice={() => setCurrentScreen('listening_practice')}
            onOpenReadingPractice={() => setCurrentScreen('reading')}
            onOpenSpeakingFeedback={() => setCurrentScreen('speaking_feedback')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'listening_practice' && (
          <ListeningPracticeScreen
            onBackToLessons={() => setCurrentScreen('lesson_stepper')}
            onFinishListening={handleFinishListening}
          />
        )}

        {currentScreen === 'speaking_feedback' && (
          <SpeakingFeedbackScreen
            onContinue={handleCompleteSpeakingFeedback}
            onBackToOverview={() => setCurrentScreen('lesson_stepper')}
          />
        )}

        {currentScreen === 'reading' && (
          <ReadingScreen
            onBack={() => setCurrentScreen('lesson_stepper')}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen
            currentDay={day1Completed ? Math.max(currentDay, 12) : currentDay}
            onNavigateToDay={(day) => handleStartDay(day)}
            onOpenAITeacher={() => handleSelectTab('ai_teacher')}
          />
        )}

        {currentScreen === 'ai_teacher' && (
          <AITeacherScreen
            currentDay={day1Completed ? Math.max(currentDay, 12) : currentDay}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            currentDay={currentDay}
            day1Completed={day1Completed}
            onSetDayState={handleSetDayState}
            onNavigateHome={() => handleSelectTab('home')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
