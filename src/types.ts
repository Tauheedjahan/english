export type TabType = 'home' | 'progress' | 'ai_teacher' | 'settings';

export type ScreenView = 
  | 'home'
  | 'lesson_stepper'
  | 'listening_practice'
  | 'reading'
  | 'translation'
  | 'speaking_feedback'
  | 'progress'
  | 'ai_teacher'
  | 'settings'
  | 'admin'
  | 'admin_login';

export type WorkflowStepId = 'listening' | 'reading' | 'translation' | 'ai_conversation';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_admin?: boolean;
  created_at?: string;
}

export interface DayRecord {
  id?: string;
  day_number: number;
  topic: string;
  youtube_url: string;
  youtube_title?: string;
  reading_heading?: string;
  story_content: string;
  pdf_url?: string;
  pdf_filename?: string;
  lesson_context?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SentenceRecord {
  id?: number;
  day_number: number;
  sentence_order: number;
  hindi: string;
  english: string;
  alternatives: string[];
  hint?: string;
  key_grammar?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserDayProgressRecord {
  id?: string;
  user_id: string;
  day_number: number;
  listening_completed: boolean;
  reading_completed: boolean;
  translation_completed: boolean;
  completed_sentence_ids: number[];
  ai_conversation_completed: boolean;
  day_completed: boolean;
  score: number;
  completed_at?: string | null;
  updated_at?: string;
}

export interface AIScoreRecord {
  id?: string;
  user_id: string;
  day_number: number;
  overall_score: number;
  grammar_score: number;
  vocabulary_score: number;
  fluency_score: number;
  sentence_structure_score: number;
  relevance_score: number;
  feedback_strengths: string;
  feedback_mistakes: string;
  feedback_improvements: string;
  feedback_corrections: Array<{
    original: string;
    corrected: string;
    rule: string;
  }>;
  created_at?: string;
}

export interface DayProgress {
  dayNumber: number;
  topic: string;
  youtubeUrl: string;
  pdfTitle: string;
  pdfDownloadUrl?: string;
  listeningCompleted: boolean;
  readingCompleted: boolean;
  translationCompleted: boolean;
  aiConversationCompleted: boolean;
  dayCompleted: boolean;
  completedSentenceIds: number[];
  score: number;
}

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
