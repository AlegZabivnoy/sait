/**
 * storage.js - Сервіс для роботи з localStorage
 * 
 * Цей файл містить StorageService клас, який забезпечує централізоване
 * управління даними квізів та результатів у браузері без використання backend.
 * 
 * Архітектура:
 * - Використовує localStorage API для збереження даних між сесіями
 * - Реалізує generic методи згідно з технічним завданням
 * - Забезпечує типізацію через JSDoc для кращої підтримки IDE
 * 
 * @file Сервіс управління даними квізів
 * @author Банда "Вуличні Койоти"
 * @version 1.0.0
 */

(function() {
    'use strict';

    /**
 * Варіант відповіді на питання квізу
 * 
 * @typedef {Object} QuizOption
 * @property {string} text - Текст варіанту відповіді, який бачить користувач
 * @property {number} value - Числове значення для підрахунку балів (зазвичай 1)
 * @property {boolean} isCorrect - Прапорець правильності відповіді (true = правильна)
 * 
 * @example
 * {
 *   text: "42",
 *   value: 1,
 *   isCorrect: true
 * }
 */

    /**
 * Питання квізу з варіантами відповідей
 * 
 * @typedef {Object} QuizQuestion
 * @property {string} text - Текст питання
 * @property {QuizOption[]} options - Масив варіантів відповідей (мінімум 2)
 * 
 * @example
 * {
 *   text: "Скільки буде 2+2?",
 *   options: [
 *     { text: "3", value: 1, isCorrect: false },
 *     { text: "4", value: 1, isCorrect: true }
 *   ]
 * }
 */

    /**
 * Квіз - основна сутність системи
 * 
 * @typedef {Object} Quiz
 * @property {string} name - Унікальна назва квізу (використовується як ідентифікатор)
 * @property {string} description - Детальний опис квізу для користувачів
 * @property {QuizQuestion[]} questions - Масив питань (мінімум 1 питання)
 * 
 * @example
 * {
 *   name: "Математика базова",
 *   description: "Тест базових математичних знань",
 *   questions: [...]
 * }
 */

    /**
 * Результат проходження квізу користувачем
 * 
 * Згідно з технічним завданням, answers зберігаються як Array<Array<string>>
 * для підтримки множинних відповідей та збереження текстових значень
 * 
 * @typedef {Object} QuizResult
 * @property {string} timestamp - ISO рядок дати/часу як унікальний ідентифікатор
 * @property {string} quizName - Назва квізу (посилання на Quiz.name)
 * @property {string} summary - Короткий підсумок результату (наприклад "8/10 (80%)")
 * @property {Array<Array<string>>} answers - Двовимірний масив текстів обраних відповідей
 * @property {number} score - Кількість правильних відповідей для швидкого доступу
 * 
 * @example
 * {
 *   timestamp: "2025-11-13T14:30:00.000Z",
 *   quizName: "Математика базова",
 *   summary: "8/10 (80%)",
 *   answers: [["42"], ["Так"], ["Ні"]],
 *   score: 8
 * }
 */

    /**
 * Структура даних, що зберігається в localStorage
 * 
 * @typedef {Object} Storage
 * @property {string} timestamp - ISO рядок часу останнього оновлення сховища
 * @property {Quiz[]} quizzes - Масив всіх доступних квізів
 * @property {QuizResult[]} results - Масив всіх результатів проходження квізів
 * @property {Quiz|null} selected - Поточний вибраний квіз для проходження (або null)
 * 
 * @example
 * {
 *   timestamp: "2025-11-13T14:30:00.000Z",
 *   quizzes: [...],
 *   results: [...],
 *   selected: null
 * }
 */

    /**
 * Конфігураційні константи для StorageService
 * 
 * @constant {Object}
 * @property {string} STORAGE_KEY - Ключ для збереження даних у localStorage
 * @property {number} DEFAULT_OPTION_VALUE - Значення за замовчуванням для опцій відповідей
 */
    const STORAGE_CONFIG = {
        STORAGE_KEY: 'quizAppStorage',
        DEFAULT_OPTION_VALUE: 1
    };

    /**
 * StorageService - сервіс для роботи з localStorage
 * 
 * Основний клас для управління даними квізів без використання backend.
 * Реалізує no-backend принцип згідно з технічним завданням.
 * 
 * Функціональність:
 * - Збереження та отримання квізів
 * - Управління результатами тестування
 * - Generic методи для роботи з даними (getKey, setKey, findValue, addValue, removeValue)
 * - Автоматична ініціалізація з демонстраційними даними
 * 
 * Особливості:
 * - Всі дані зберігаються в localStorage під ключем 'quizAppStorage'
 * - Структура даних відповідає типу Storage
 * - Підтримка immutable операцій через оновлення timestamp
 * 
 * @class
 * @example
 * // Створення екземпляру сервісу
 * const service = new StorageService();
 * 
 * // Отримання квізів
 * const quizzes = service.getAllQuizzes();
 * 
 * // Додавання нового квізу
 * service.addQuiz({ 
 *   name: "Тест", 
 *   description: "Опис", 
 *   questions: [...] 
 * });
 * 
 * // Збереження результату
 * service.addResult({
 *   timestamp: new Date().toISOString(),
 *   quizName: "Тест",
 *   summary: "5/10 (50%)",
 *   answers: [["відповідь1"], ["відповідь2"]],
 *   score: 5
 * });
 */
    class StorageService {
    /**
     * Конструктор StorageService
     * 
     * Ініціалізує сервіс та створює початкову структуру даних,
     * якщо вона ще не існує в localStorage
     * 
     * @constructor
     */
        constructor() {
            this.storageKey = STORAGE_CONFIG.STORAGE_KEY;
            this.initStorage();
        }

        /**
     * Ініціалізація сховища даних
     * 
     * Перевіряє наявність даних у localStorage та створює структуру
     * за замовчуванням з демонстраційними квізами, якщо дані відсутні.
     * 
     * Викликається автоматично при створенні екземпляру класу.
     * 
     * @private
     * @throws {Error} Якщо виникає помилка доступу до localStorage
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
     * 
     * Генерує початковий об'єкт Storage з:
     * - Поточним timestamp
     * - Масивом демонстраційних квізів
     * - Порожнім масивом результатів
     * - Відсутнім вибраним квізом (null)
     * 
     * @private
     * @returns {Storage} Об'єкт сховища з початковими даними
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

        /**
     * Отримати весь об'єкт Storage з localStorage
     * 
     * Базовий метод для читання всієї структури даних.
     * Автоматично парсить JSON та обробляє помилки.
     * 
     * @returns {Storage|null} Об'єкт Storage або null у разі помилки
     * 
     * @example
     * const storage = service.getStorage();
     * console.log(storage.quizzes.length); // Кількість квізів
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
     * Зберегти весь об'єкт Storage у localStorage
     * 
     * Автоматично оновлює timestamp перед збереженням для
     * відстеження часу останньої модифікації даних.
     * Серіалізує об'єкт у JSON формат.
     * 
     * @param {Storage} storage - Об'єкт для збереження
     * @throws {Error} Якщо localStorage недоступний або переповнений
     * 
     * @example
     * const storage = service.getStorage();
     * storage.quizzes.push(newQuiz);
     * service.setStorage(storage);
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
     * Отримати значення за ключем зі Storage (generic метод)
     * 
     * Універсальний метод для отримання будь-якого поля Storage.
     * Реалізує generic інтерфейс згідно технічного завдання.
     * 
     * @template Kt - Тип значення ключа
     * @param {string} key - Ім'я ключа ('quizzes', 'results', 'selected')
     * @returns {Kt|null} Значення ключа або null якщо не знайдено
     * 
     * @example
     * const quizzes = service.getKey('quizzes'); // Quiz[]
     * const results = service.getKey('results'); // QuizResult[]
     */
        getKey(key) {
            const storage = this.getStorage();
            return storage ? storage[key] : null;
        }

        /**
     * Встановити значення за ключем у Storage (generic метод)
     * 
     * Універсальний метод для зміни будь-якого поля Storage.
     * Автоматично зберігає всю структуру після зміни.
     * Реалізує generic інтерфейс згідно технічного завдання.
     * 
     * @template Kt - Тип значення ключа
     * @param {string} key - Ім'я ключа
     * @param {Kt} value - Нове значення
     * 
     * @example
     * service.setKey('selected', myQuiz);
     * service.setKey('quizzes', updatedQuizzes);
     */
        setKey(key, value) {
            const storage = this.getStorage();
            if (storage) {
                storage[key] = value;
                this.setStorage(storage);
            }
        }

        /**
     * Знайти значення в масиві за предикатом (generic метод згідно ТЗ)
     * 
     * Універсальний метод пошуку елемента в масиві або перевірки одиночного значення.
     * Параметр isList дозволяє працювати як з масивами, так і з окремими об'єктами.
     * 
     * @template T - Тип елементів для пошуку
     * @param {string} key - Ключ в Storage ('quizzes', 'results', тощо)
     * @param {Function} predicate - Функція-предикат (value: T) => boolean
     * @param {boolean} [isList=true] - true для масивів, false для одиночних значень
     * @returns {T|null} Знайдений елемент або null
     * 
     * @example
     * // Пошук квізу за назвою
     * const quiz = service.findValue(
     *   'quizzes', 
     *   q => q.name === 'Математика',
     *   true
     * );
     * 
     * // Перевірка одиночного значення
     * const selected = service.findValue(
     *   'selected',
     *   s => s !== null,
     *   false
     * );
     */
        findValue(key, predicate, isList = true) {
            const data = this.getKey(key);
            if (isList && Array.isArray(data)) {
                return data.find(predicate);
            } else if (!isList) {
                return predicate(data) ? data : null;
            }
            return null;
        }

        /**
     * Додати значення до масиву або встановити одиночне значення (generic метод згідно ТЗ)
     * 
     * Універсальний метод додавання даних. Якщо isList=true, додає елемент
     * до масиву. Якщо isList=false, встановлює значення безпосередньо.
     * Автоматично зберігає зміни в localStorage.
     * 
     * @template T - Тип значення для додавання
     * @param {string} key - Ключ в Storage
     * @param {T} value - Значення для додавання
     * @param {boolean} [isList=true] - true для масивів, false для одиночних значень
     * 
     * @example
     * // Додати квіз до списку
     * service.addValue('quizzes', newQuiz, true);
     * 
     * // Встановити вибраний квіз
     * service.addValue('selected', quiz, false);
     * 
     * // Додати результат
     * service.addValue('results', result, true);
     */
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

        /**
     * Видалити значення з масиву або очистити одиночне значення (generic метод згідно ТЗ)
     * 
     * Універсальний метод видалення даних. Якщо isList=true, фільтрує масив
     * видаляючи елементи, що відповідають предикату. Якщо isList=false,
     * встановлює null якщо предикат повертає true.
     * 
     * @template T - Тип елементів для видалення
     * @param {string} key - Ключ в Storage
     * @param {Function} predicate - Функція-предикат (item: T) => boolean
     * @param {boolean} [isList=true] - true для масивів, false для одиночних значень
     * 
     * @example
     * // Видалити квіз за назвою
     * service.removeValue(
     *   'quizzes',
     *   quiz => quiz.name === 'Старий квіз',
     *   true
     * );
     * 
     * // Очистити вибраний квіз
     * service.removeValue(
     *   'selected',
     *   s => s !== null,
     *   false
     * );
     * 
     * // Видалити результат за timestamp
     * service.removeValue(
     *   'results',
     *   r => r.timestamp === '2025-11-13T10:00:00.000Z',
     *   true
     * );
     */
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

    // Експортуємо у глобальний простір
    window.storageService = storageService;

})();
