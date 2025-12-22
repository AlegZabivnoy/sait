import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUIZZES_FILE = path.join(__dirname, 'quizzes.json');
const RESULTS_FILE = path.join(__dirname, 'results.json');

// Initialize data files if they don't exist
async function initializeFiles() {
  try {
    await fs.access(QUIZZES_FILE);
  } catch {
    await fs.writeFile(QUIZZES_FILE, JSON.stringify([]));
  }
  
  try {
    await fs.access(RESULTS_FILE);
  } catch {
    await fs.writeFile(RESULTS_FILE, JSON.stringify([]));
  }
}

// Read data from file
async function readData(filename) {
  try {
    const data = await fs.readFile(filename, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Write data to file
async function writeData(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Quizzes operations
export const quizStorage = {
  async getAll() {
    return await readData(QUIZZES_FILE);
  },

  async getById(id) {
    const quizzes = await readData(QUIZZES_FILE);
    return quizzes.find(q => q.id === id);
  },

  async create(quiz) {
    const quizzes = await readData(QUIZZES_FILE);
    const newQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    quizzes.push(newQuiz);
    await writeData(QUIZZES_FILE, quizzes);
    return newQuiz;
  },

  async update(id, updates) {
    const quizzes = await readData(QUIZZES_FILE);
    const index = quizzes.findIndex(q => q.id === id);
    
    if (index === -1) {
      return null;
    }
    
    quizzes[index] = {
      ...quizzes[index],
      ...updates,
      id: quizzes[index].id, // Keep original ID
      updatedAt: new Date().toISOString()
    };
    
    await writeData(QUIZZES_FILE, quizzes);
    return quizzes[index];
  },

  async delete(id) {
    const quizzes = await readData(QUIZZES_FILE);
    const filteredQuizzes = quizzes.filter(q => q.id !== id);
    
    if (filteredQuizzes.length === quizzes.length) {
      return null; // Quiz not found
    }
    
    await writeData(QUIZZES_FILE, filteredQuizzes);
    return true;
  }
};

// Results operations
export const resultStorage = {
  async getAll() {
    const results = await readData(RESULTS_FILE);
    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    const results = await readData(RESULTS_FILE);
    return results.find(r => r.id === id);
  },

  async create(result) {
    const results = await readData(RESULTS_FILE);
    const newResult = {
      ...result,
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString()
    };
    results.push(newResult);
    await writeData(RESULTS_FILE, results);
    return newResult;
  },

  async delete(id) {
    const results = await readData(RESULTS_FILE);
    const filteredResults = results.filter(r => r.id !== id);
    
    if (filteredResults.length === results.length) {
      return null; // Result not found
    }
    
    await writeData(RESULTS_FILE, filteredResults);
    return true;
  },

  async deleteAll() {
    await writeData(RESULTS_FILE, []);
    return true;
  }
};

// Initialize on import
await initializeFiles();
