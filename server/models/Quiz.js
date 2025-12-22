import mongoose from 'mongoose';

const questionOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['single', 'multiple', 'text'] 
  },
  options: [questionOptionSchema],
  correctAnswer: { type: String }
});

const quizSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Quiz name is required'],
    trim: true,
    minlength: [3, 'Quiz name must be at least 3 characters long']
  },
  description: { 
    type: String,
    trim: true
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
