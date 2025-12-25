import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { quizStorage } from '../data/storage.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/quizzes - Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await quizStorage.getAll();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
});

// GET /api/quizzes/:id - Get single quiz
router.get('/:id', [
  param('id').notEmpty().withMessage('Invalid quiz ID')
], handleValidationErrors, async (req, res) => {
  try {
    const quiz = await quizStorage.getById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
});

// POST /api/quizzes - Create new quiz
router.post('/', [
  body('name').trim().isLength({ min: 3 }).withMessage('Quiz name must be at least 3 characters'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.text').notEmpty().withMessage('Question text is required'),
  body('questions.*.type').isIn(['single', 'multiple', 'text']).withMessage('Invalid question type')
], handleValidationErrors, async (req, res) => {
  try {
    // Додаткова валідація для питань
    const { questions } = req.body;
    for (const question of questions) {
      if ((question.type === 'single' || question.type === 'multiple')) {
        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
          return res.status(400).json({ 
            message: 'Questions with single or multiple choice must have at least 2 options' 
          });
        }
      }
    }

    const quiz = await quizStorage.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error creating quiz', error: error.message });
  }
});

// PUT /api/quizzes/:id - Update quiz
router.put('/:id', [
  param('id').notEmpty().withMessage('Invalid quiz ID'),
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Quiz name must be at least 3 characters'),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required')
], handleValidationErrors, async (req, res) => {
  try {
    const quiz = await quizStorage.update(req.params.id, req.body);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Error updating quiz', error: error.message });
  }
});

// DELETE /api/quizzes/:id - Delete quiz
router.delete('/:id', [
  param('id').notEmpty().withMessage('Invalid quiz ID')
], handleValidationErrors, async (req, res) => {
  try {
    const deleted = await quizStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
});

export default router;
