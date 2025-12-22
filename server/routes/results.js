import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { resultStorage } from '../data/storage.js';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/results - Get all results
router.get('/', async (req, res) => {
  try {
    const results = await resultStorage.getAll();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
});

// GET /api/results/:id - Get single result
router.get('/:id', [
  param('id').notEmpty().withMessage('Invalid result ID')
], handleValidationErrors, async (req, res) => {
  try {
    const result = await resultStorage.getById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error: error.message });
  }
});

// POST /api/results - Create new result
router.post('/', [
  body('quizId').notEmpty().withMessage('Valid quiz ID is required'),
  body('quizName').trim().notEmpty().withMessage('Quiz name is required'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('totalQuestions').isInt({ min: 1 }).withMessage('Total questions must be at least 1'),
  body('answers').isArray().withMessage('Answers must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const result = await resultStorage.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error saving result', error: error.message });
  }
});

// DELETE /api/results/:id - Delete result
router.delete('/:id', [
  param('id').notEmpty().withMessage('Invalid result ID')
], handleValidationErrors, async (req, res) => {
  try {
    const deleted = await resultStorage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result', error: error.message });
  }
});

// DELETE /api/results - Delete all results
router.delete('/', async (req, res) => {
  try {
    await resultStorage.deleteAll();
    res.json({ message: 'All results deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting results', error: error.message });
  }
});

export default router;
