/**
 * @typedef {Object} QuizOption
 * @property {string} text - Текст варіанту відповіді
 * @property {number} value - Значення для підрахунку балів
 * @property {boolean} isCorrect - Чи є відповідь правильною
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} text - Текст питання
 * @property {QuizOption[]} options - Варіанти відповідей
 */

/**
 * @typedef {Object} Quiz
 * @property {string} name - Назва квізу
 * @property {string} description - Опис квізу
 * @property {QuizQuestion[]} questions - Масив питань
 */

/**
 * @typedef {Object} QuizResult
 * @property {string} timestamp - Унікальний ідентифікатор результату
 * @property {string} quizName - Назва квізу
 * @property {string} summary - Короткий опис результату
 * @property {number[][]} answers - Масив індексів обраних відповідей
 * @property {number} score - Кількість правильних відповідей
 */

/**
 * @typedef {Object} Storage
 * @property {string} timestamp - Час останнього оновлення
 * @property {Quiz[]} quizzes - Список всіх квізів
 * @property {QuizResult[]} results - Список всіх результатів
 * @property {Quiz|null} selected - Вибраний квіз для проходження
 */

const STORAGE_CONFIG = {
    STORAGE_KEY: 'quizAppStorage',
    DEFAULT_OPTION_VALUE: 1
};

/**
 * StorageService - сервіс для роботи з localStorage
 * 
 * Забезпечує централізоване управління даними квізів та результатів.
 * Використовує localStorage для збереження стану між сесіями.
 * 
 * @class
 * @example
 * const service = new StorageService();
 * const quizzes = service.getAllQuizzes();
 * service.addQuiz({ name: "Test", description: "Test quiz", questions: [] });
 */
class StorageService {
    constructor() {
        this.storageKey = STORAGE_CONFIG.STORAGE_KEY;
        this.initStorage();
    }

    /**
     * Ініціалізація сховища даних
     * Створює структуру даних, якщо вона не існує
     */
    initStorage() {
        try {
            const storage = this.getStorage();
            if (!storage || !storage.quizzes) {
                const defaultStorage = this.createDefaultStorage();
                this.setStorage(defaultStorage);
            }
        } catch (error) {
            console.error('Помилка ініціалізації сховища:', error);
        }
    }

    /**
     * Створити дефолтну структуру сховища
     * @returns {Storage}
     */
    createDefaultStorage() {
        return {
            timestamp: new Date().toISOString(),
            quizzes: this.getDefaultQuizzes(),
            results: [],
            selected: null
        };
    }

    /**
     * Отримати дефолтні квізи для демонстрації
     * @returns {Quiz[]}
     */
    getDefaultQuizzes() {
        return [
            {
                name: "Математика: Додавання та віднімання",
                description: "Перевірте свої навички простої арифметики",
                questions: [
                    {
                        text: "Скільки буде 5 + 3?",
                        options: [
                            { text: "6", value: 1, isCorrect: false },
                            { text: "7", value: 1, isCorrect: false },
                            { text: "8", value: 1, isCorrect: true },
                            { text: "9", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 12 - 7?",
                        options: [
                            { text: "3", value: 1, isCorrect: false },
                            { text: "4", value: 1, isCorrect: false },
                            { text: "5", value: 1, isCorrect: true },
                            { text: "6", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 15 + 9?",
                        options: [
                            { text: "22", value: 1, isCorrect: false },
                            { text: "23", value: 1, isCorrect: false },
                            { text: "24", value: 1, isCorrect: true },
                            { text: "25", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 20 - 13?",
                        options: [
                            { text: "6", value: 1, isCorrect: false },
                            { text: "7", value: 1, isCorrect: true },
                            { text: "8", value: 1, isCorrect: false },
                            { text: "9", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 8 + 8?",
                        options: [
                            { text: "14", value: 1, isCorrect: false },
                            { text: "15", value: 1, isCorrect: false },
                            { text: "16", value: 1, isCorrect: true },
                            { text: "17", value: 1, isCorrect: false }
                        ]
                    }
                ]
            },
            {
                name: "Математика: Множення та ділення",
                description: "Перевірте знання таблиці множення",
                questions: [
                    {
                        text: "Скільки буде 6 × 7?",
                        options: [
                            { text: "36", value: 1, isCorrect: false },
                            { text: "40", value: 1, isCorrect: false },
                            { text: "42", value: 1, isCorrect: true },
                            { text: "48", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 56 ÷ 8?",
                        options: [
                            { text: "6", value: 1, isCorrect: false },
                            { text: "7", value: 1, isCorrect: true },
                            { text: "8", value: 1, isCorrect: false },
                            { text: "9", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 9 × 4?",
                        options: [
                            { text: "32", value: 1, isCorrect: false },
                            { text: "34", value: 1, isCorrect: false },
                            { text: "36", value: 1, isCorrect: true },
                            { text: "38", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 45 ÷ 5?",
                        options: [
                            { text: "7", value: 1, isCorrect: false },
                            { text: "8", value: 1, isCorrect: false },
                            { text: "9", value: 1, isCorrect: true },
                            { text: "10", value: 1, isCorrect: false }
                        ]
                    }
                ]
            },
            {
                name: "Математика: Загальні знання",
                description: "Змішані математичні питання для розминки мозку",
                questions: [
                    {
                        text: "Скільки градусів у прямому куті?",
                        options: [
                            { text: "45°", value: 1, isCorrect: false },
                            { text: "60°", value: 1, isCorrect: false },
                            { text: "90°", value: 1, isCorrect: true },
                            { text: "180°", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки сторін у трикутника?",
                        options: [
                            { text: "2", value: 1, isCorrect: false },
                            { text: "3", value: 1, isCorrect: true },
                            { text: "4", value: 1, isCorrect: false },
                            { text: "5", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде 10% від 200?",
                        options: [
                            { text: "10", value: 1, isCorrect: false },
                            { text: "15", value: 1, isCorrect: false },
                            { text: "20", value: 1, isCorrect: true },
                            { text: "25", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Яке найменше просте число?",
                        options: [
                            { text: "0", value: 1, isCorrect: false },
                            { text: "1", value: 1, isCorrect: false },
                            { text: "2", value: 1, isCorrect: true },
                            { text: "3", value: 1, isCorrect: false }
                        ]
                    },
                    {
                        text: "Скільки буде √16?",
                        options: [
                            { text: "2", value: 1, isCorrect: false },
                            { text: "3", value: 1, isCorrect: false },
                            { text: "4", value: 1, isCorrect: true },
                            { text: "8", value: 1, isCorrect: false }
                        ]
                    }
                ]
            }
        ];
    }

    /**
     * Отримати весь об'єкт Storage
     * @returns {Storage|null}
     */
    getStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Помилка читання з localStorage:', error);
            return null;
        }
    }

    /**
     * Зберегти весь об'єкт Storage
     * @param {Storage} storage
     */
    setStorage(storage) {
        try {
            storage.timestamp = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(storage));
        } catch (error) {
            console.error('Помилка запису в localStorage:', error);
            throw error;
        }
    }

    /**
     * Отримати значення за ключем
     * @param {string} key
     * @returns {*}
     */
    getKey(key) {
        const storage = this.getStorage();
        return storage ? storage[key] : null;
    }

    /**
     * Встановити значення за ключем
     * @param {string} key
     * @param {*} value
     */
    setKey(key, value) {
        const storage = this.getStorage();
        if (storage) {
            storage[key] = value;
            this.setStorage(storage);
        }
    }

    /**
     * Знайти значення в масиві за предикатом
     * @param {string} key - Ключ в Storage
     * @param {Function} predicate - Функція для пошуку
     * @returns {*}
     */
    findValue(key, predicate) {
        const array = this.getKey(key);
        if (Array.isArray(array)) {
            return array.find(predicate);
        }
        return null;
    }

    /**
     * Додати значення до масиву
     * @param {string} key
     * @param {*} value
     */
    addValue(key, value) {
        const array = this.getKey(key);
        if (Array.isArray(array)) {
            array.push(value);
            this.setKey(key, array);
        }
    }

    /**
     * Видалити значення з масиву
     * @param {string} key
     * @param {Function} predicate - Функція для пошуку елемента
     */
    removeValue(key, predicate) {
        const array = this.getKey(key);
        if (Array.isArray(array)) {
            const filtered = array.filter(item => !predicate(item));
            this.setKey(key, filtered);
        }
    }

    /**
     * Оновити значення в масиві
     * @param {string} key
     * @param {Function} predicate - Функція для пошуку елемента
     * @param {*} newValue - Нове значення
     */
    updateValue(key, predicate, newValue) {
        const array = this.getKey(key);
        if (Array.isArray(array)) {
            const index = array.findIndex(predicate);
            if (index !== -1) {
                array[index] = newValue;
                this.setKey(key, array);
            }
        }
    }

    // Методи-хелпери для роботи з квізами

    /**
     * Отримати всі квізи
     * @returns {Quiz[]}
     */
    getAllQuizzes() {
        return this.getKey('quizzes') || [];
    }

    /**
     * Отримати квіз за назвою
     * @param {string} name
     * @returns {Quiz|null}
     */
    getQuizByName(name) {
        return this.findValue('quizzes', quiz => quiz.name === name);
    }

    /**
     * Додати новий квіз
     * @param {Quiz} quiz
     */
    addQuiz(quiz) {
        this.addValue('quizzes', quiz);
    }

    /**
     * Оновити квіз
     * @param {string} oldName
     * @param {Quiz} newQuiz
     */
    updateQuiz(oldName, newQuiz) {
        this.updateValue('quizzes', quiz => quiz.name === oldName, newQuiz);
    }

    /**
     * Видалити квіз
     * @param {string} name
     */
    deleteQuiz(name) {
        this.removeValue('quizzes', quiz => quiz.name === name);
    }

    /**
     * Встановити вибраний квіз
     * @param {Quiz} quiz
     */
    setSelectedQuiz(quiz) {
        this.setKey('selected', quiz);
    }

    /**
     * Отримати вибраний квіз
     * @returns {Quiz|null}
     */
    getSelectedQuiz() {
        return this.getKey('selected');
    }

    // Методи для роботи з результатами

    /**
     * Отримати всі результати
     * @returns {QuizResult[]}
     */
    getAllResults() {
        return this.getKey('results') || [];
    }

    /**
     * Додати результат
     * @param {QuizResult} result
     */
    addResult(result) {
        this.addValue('results', result);
    }

    /**
     * Видалити результат
     * @param {string} timestamp
     */
    deleteResult(timestamp) {
        this.removeValue('results', result => result.timestamp === timestamp);
    }

    /**
     * Очистити всі результати
     */
    clearAllResults() {
        this.setKey('results', []);
    }
    /**
     * Очистити все сховище та перезавантажити дефолтні дані
     */
    resetStorage() {
        localStorage.removeItem(this.storageKey);
        this.initStorage();
    }
}

// Створюємо глобальний екземпляр сервісу
const storageService = new StorageService();
