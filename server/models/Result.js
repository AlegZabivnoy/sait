import mongoose from 'mongoose';

const userAnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  selectedAnswer: { type: Number },
  correctAnswer: { type: Number },
  isCorrect: { type: Boolean, required: true }
});

const resultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizName: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true,
    min: 0
  },
  totalQuestions: { 
    type: Number, 
    required: true,
    min: 1
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  answers: [userAnswerSchema]
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
