import { quizStorage } from './data/storage.js';

const sampleQuizzes = [
  {
    name: 'JavaScript Basics',
    description: 'Test your knowledge of JavaScript fundamentals',
    questions: [
      {
        id: 1,
        text: 'What is the correct way to declare a variable in JavaScript?',
        type: 'single',
        options: [
          { text: 'let x = 5;', isCorrect: true },
          { text: 'variable x = 5;', isCorrect: false },
          { text: 'var x := 5;', isCorrect: false },
          { text: 'x = 5;', isCorrect: false }
        ]
      },
      {
        id: 2,
        text: 'Which of these are JavaScript data types?',
        type: 'multiple',
        options: [
          { text: 'String', isCorrect: true },
          { text: 'Number', isCorrect: true },
          { text: 'Character', isCorrect: false },
          { text: 'Boolean', isCorrect: true }
        ]
      },
      {
        id: 3,
        text: 'What does DOM stand for?',
        type: 'text',
        options: [],
        correctAnswer: 'Document Object Model'
      }
    ]
  },
  {
    name: 'React Fundamentals',
    description: 'Test your React knowledge',
    questions: [
      {
        id: 1,
        text: 'What is JSX?',
        type: 'single',
        options: [
          { text: 'A syntax extension for JavaScript', isCorrect: true },
          { text: 'A new programming language', isCorrect: false },
          { text: 'A CSS framework', isCorrect: false },
          { text: 'A database query language', isCorrect: false }
        ]
      },
      {
        id: 2,
        text: 'Which hooks are built into React?',
        type: 'multiple',
        options: [
          { text: 'useState', isCorrect: true },
          { text: 'useEffect', isCorrect: true },
          { text: 'useData', isCorrect: false },
          { text: 'useContext', isCorrect: true }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    const existingQuizzes = await quizStorage.getAll();
    for (const quiz of existingQuizzes) {
      await quizStorage.delete(quiz.id);
    }
    console.log('🗑️  Cleared existing quizzes');

    // Create sample quizzes
    console.log('📝 Creating sample quizzes...');
    const createdQuizzes = [];
    for (const quizData of sampleQuizzes) {
      const quiz = await quizStorage.create(quizData);
      createdQuizzes.push(quiz);
    }
    
    console.log(`✅ Successfully created ${createdQuizzes.length} quizzes:`);
    createdQuizzes.forEach(quiz => {
      console.log(`   - ${quiz.name} (${quiz.questions.length} questions)`);
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
