export type TabType = 'home' | 'progress' | 'ai_teacher' | 'settings';

export type ScreenView = 
  | 'home'
  | 'lesson_stepper'
  | 'listening_practice'
  | 'speaking_feedback'
  | 'reading'
  | 'progress'
  | 'ai_teacher'
  | 'settings';

export interface LessonStep {
  id: number;
  number: string;
  title: string;
  type: 'listening' | 'questions' | 'speaking' | 'reading' | 'translation' | 'assessment';
  duration?: string;
  completed: boolean;
  active: boolean;
  locked: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'teacher' | 'student';
  text: string;
  timestamp: string;
  tip?: string;
  correction?: {
    original: string;
    corrected: string;
    rule: string;
  };
  followup?: string;
}

export interface ReadingPage {
  pageNumber: number;
  english: string[];
  hindi: string[];
}

export interface MistakeItem {
  id: string;
  title: string;
  category: 'Grammar' | 'Speaking' | 'Vocabulary';
  details: string;
  explanation: string;
  incorrectExample: string;
  correctExample: string;
  rule: string;
}
