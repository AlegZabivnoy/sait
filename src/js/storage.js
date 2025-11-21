

(function() {
    'use strict';

    

    

    

    

    

    
    const STORAGE_CONFIG = {
        STORAGE_KEY: 'quizAppStorage',
        DEFAULT_OPTION_VALUE: 1
    };

    
    class StorageService {
    
        constructor() {
            this.storageKey = STORAGE_CONFIG.STORAGE_KEY;
            this.initStorage();
        }

        
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

        
        createDefaultStorage() {
            return {
                timestamp: new Date().toISOString(),
                quizzes: this.getDefaultQuizzes(),
                results: [],
                selected: null
            };
        }

        
        getDefaultQuizzes() {
            return [
                {
                    name: 'Математика: Додавання та віднімання',
                    description: 'Перевірте свої навички простої арифметики',
                    questions: [
                        {
                            text: 'Скільки буде 5 + 3?',
                            options: [
                                { text: '6', value: 1, isCorrect: false },
                                { text: '7', value: 1, isCorrect: false },
                                { text: '8', value: 1, isCorrect: true },
                                { text: '9', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 12 - 7?',
                            options: [
                                { text: '3', value: 1, isCorrect: false },
                                { text: '4', value: 1, isCorrect: false },
                                { text: '5', value: 1, isCorrect: true },
                                { text: '6', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 15 + 9?',
                            options: [
                                { text: '22', value: 1, isCorrect: false },
                                { text: '23', value: 1, isCorrect: false },
                                { text: '24', value: 1, isCorrect: true },
                                { text: '25', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 20 - 13?',
                            options: [
                                { text: '6', value: 1, isCorrect: false },
                                { text: '7', value: 1, isCorrect: true },
                                { text: '8', value: 1, isCorrect: false },
                                { text: '9', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 8 + 8?',
                            options: [
                                { text: '14', value: 1, isCorrect: false },
                                { text: '15', value: 1, isCorrect: false },
                                { text: '16', value: 1, isCorrect: true },
                                { text: '17', value: 1, isCorrect: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Математика: Множення та ділення',
                    description: 'Перевірте знання таблиці множення',
                    questions: [
                        {
                            text: 'Скільки буде 6 × 7?',
                            options: [
                                { text: '36', value: 1, isCorrect: false },
                                { text: '40', value: 1, isCorrect: false },
                                { text: '42', value: 1, isCorrect: true },
                                { text: '48', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 56 ÷ 8?',
                            options: [
                                { text: '6', value: 1, isCorrect: false },
                                { text: '7', value: 1, isCorrect: true },
                                { text: '8', value: 1, isCorrect: false },
                                { text: '9', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 9 × 4?',
                            options: [
                                { text: '32', value: 1, isCorrect: false },
                                { text: '34', value: 1, isCorrect: false },
                                { text: '36', value: 1, isCorrect: true },
                                { text: '38', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 45 ÷ 5?',
                            options: [
                                { text: '7', value: 1, isCorrect: false },
                                { text: '8', value: 1, isCorrect: false },
                                { text: '9', value: 1, isCorrect: true },
                                { text: '10', value: 1, isCorrect: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Математика: Загальні знання',
                    description: 'Змішані математичні питання для розминки мозку',
                    questions: [
                        {
                            text: 'Скільки градусів у прямому куті?',
                            options: [
                                { text: '45°', value: 1, isCorrect: false },
                                { text: '60°', value: 1, isCorrect: false },
                                { text: '90°', value: 1, isCorrect: true },
                                { text: '180°', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки сторін у трикутника?',
                            options: [
                                { text: '2', value: 1, isCorrect: false },
                                { text: '3', value: 1, isCorrect: true },
                                { text: '4', value: 1, isCorrect: false },
                                { text: '5', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде 10% від 200?',
                            options: [
                                { text: '10', value: 1, isCorrect: false },
                                { text: '15', value: 1, isCorrect: false },
                                { text: '20', value: 1, isCorrect: true },
                                { text: '25', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Яке найменше просте число?',
                            options: [
                                { text: '0', value: 1, isCorrect: false },
                                { text: '1', value: 1, isCorrect: false },
                                { text: '2', value: 1, isCorrect: true },
                                { text: '3', value: 1, isCorrect: false }
                            ]
                        },
                        {
                            text: 'Скільки буде √16?',
                            options: [
                                { text: '2', value: 1, isCorrect: false },
                                { text: '3', value: 1, isCorrect: false },
                                { text: '4', value: 1, isCorrect: true },
                                { text: '8', value: 1, isCorrect: false }
                            ]
                        }
                    ]
                }
            ];
        }

        
        getStorage() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Помилка читання з localStorage:', error);
                return null;
            }
        }

        
        setStorage(storage) {
            try {
                storage.timestamp = new Date().toISOString();
                localStorage.setItem(this.storageKey, JSON.stringify(storage));
            } catch (error) {
                console.error('Помилка запису в localStorage:', error);
                throw error;
            }
        }

        
        getKey(key) {
            const storage = this.getStorage();
            return storage ? storage[key] : null;
        }

        
        setKey(key, value) {
            const storage = this.getStorage();
            if (storage) {
                storage[key] = value;
                this.setStorage(storage);
            }
        }

        
        findValue(key, predicate, isList = true) {
            const data = this.getKey(key);
            if (isList && Array.isArray(data)) {
                return data.find(predicate);
            } else if (!isList) {
                return predicate(data) ? data : null;
            }
            return null;
        }

        
        addValue(key, value, isList = true) {
            if (isList) {
                const array = this.getKey(key);
                if (Array.isArray(array)) {
                    array.push(value);
                    this.setKey(key, array);
                }
            } else {
                this.setKey(key, value);
            }
        }

        
        removeValue(key, predicate, isList = true) {
            if (isList) {
                const array = this.getKey(key);
                if (Array.isArray(array)) {
                    const filtered = array.filter(item => !predicate(item));
                    this.setKey(key, filtered);
                }
            } else {
                if (predicate(this.getKey(key))) {
                    this.setKey(key, null);
                }
            }
        }

        
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

        
        getAllQuizzes() {
            return this.getKey('quizzes') || [];
        }

        
        getQuizByName(name) {
            return this.findValue('quizzes', quiz => quiz.name === name);
        }

        
        addQuiz(quiz) {
            this.addValue('quizzes', quiz);
        }

        
        updateQuiz(oldName, newQuiz) {
            this.updateValue('quizzes', quiz => quiz.name === oldName, newQuiz);
        }

        
        deleteQuiz(name) {
            this.removeValue('quizzes', quiz => quiz.name === name);
        }

        
        setSelectedQuiz(quiz) {
            this.setKey('selected', quiz);
        }

        
        getSelectedQuiz() {
            return this.getKey('selected');
        }

        // Методи для роботи з результатами

        
        getAllResults() {
            return this.getKey('results') || [];
        }

        
        addResult(result) {
            this.addValue('results', result);
        }

        
        deleteResult(timestamp) {
            this.removeValue('results', result => result.timestamp === timestamp);
        }

        
        clearAllResults() {
            this.setKey('results', []);
        }
        
        resetStorage() {
            localStorage.removeItem(this.storageKey);
            this.initStorage();
        }
    }

    // Створюємо глобальний екземпляр сервісу
    const storageService = new StorageService();

    // Експортуємо у глобальний простір
    window.storageService = storageService;

})();
