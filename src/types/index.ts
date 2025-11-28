export interface Quiz {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  createdAt?: string;
}

export type QuestionType = 'single' | 'multiple' | 'text';

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswer?: string;
}

export interface QuizResult {
  id: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  date: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}
