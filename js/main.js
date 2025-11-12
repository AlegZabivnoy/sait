/**
 * main.js - Логіка головної сторінки
 * Відповідає за відображення списку доступних квізів
 */

// Константи для DOM елементів
const DOM_ELEMENTS = {
    QUIZ_LIST: 'quiz-list',
    EMPTY_STATE: 'empty-state'
};

// Константи для відображення
const DISPLAY = {
    NONE: 'none',
    GRID: 'grid',
    BLOCK: 'block'
};

// Константи для класів CSS
const CSS_CLASSES = {
    QUIZ_CARD: 'quiz-card',
    QUIZ_CARD_HEADER: 'quiz-card-header',
    QUIZ_CARD_BODY: 'quiz-card-body',
    QUIZ_CARD_FOOTER: 'quiz-card-footer',
    QUIZ_NAME: 'quiz-name',
    QUIZ_DESCRIPTION: 'quiz-description',
    QUIZ_INFO: 'quiz-info',
    QUIZ_QUESTIONS_COUNT: 'quiz-questions-count',
    GO_TO_QUIZ_BTN: 'go-to-quiz-btn'
};

// Константи для повідомлень
const MESSAGES = {
    ERROR_QUIZ_NOT_FOUND: 'Помилка: Квіз не знайдено!',
    ERROR_LOADING: 'Помилка при завантаженні квізів. Спробуйте оновити сторінку.'
};

/**
 * Ініціалізація головної сторінки
 */
function initMainPage() {
    try {
        console.log('Ініціалізація головної сторінки...');
        loadQuizzes();
    } catch (error) {
        console.error('Помилка ініціалізації:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Завантажити та відобразити список квізів
 */
function loadQuizzes() {
    try {
        const quizzes = storageService.getAllQuizzes();
        const quizList = getElement(DOM_ELEMENTS.QUIZ_LIST);
        const emptyState = getElement(DOM_ELEMENTS.EMPTY_STATE);

        if (!quizzes || quizzes.length === 0) {
            showEmptyState(quizList, emptyState);
            return;
        }

        showQuizList(quizList, emptyState);
        renderQuizCards(quizList, quizzes);
    } catch (error) {
        console.error('Помилка завантаження квізів:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Отримати елемент DOM за ID з перевіркою існування
 * @param {string} elementId - ID елемента
 * @returns {HTMLElement}
 * @throws {Error} Якщо елемент не знайдено
 */
function getElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Елемент з ID "${elementId}" не знайдено`);
    }
    return element;
}

/**
 * Показати порожній стан (коли немає квізів)
 * @param {HTMLElement} quizList 
 * @param {HTMLElement} emptyState 
 */
function showEmptyState(quizList, emptyState) {
    quizList.style.display = DISPLAY.NONE;
    emptyState.style.display = DISPLAY.BLOCK;
}

/**
 * Показати список квізів
 * @param {HTMLElement} quizList 
 * @param {HTMLElement} emptyState 
 */
function showQuizList(quizList, emptyState) {
    quizList.style.display = DISPLAY.GRID;
    emptyState.style.display = DISPLAY.NONE;
}

/**
 * Відрендерити картки квізів
 * @param {HTMLElement} quizList 
 * @param {Quiz[]} quizzes 
 */
function renderQuizCards(quizList, quizzes) {
    quizList.innerHTML = '';
    quizzes.forEach(quiz => {
        const quizCard = createQuizCard(quiz);
        quizList.appendChild(quizCard);
    });
}

/**
 * Створити картку квізу
 * @param {Quiz} quiz - Об'єкт квізу
 * @returns {HTMLElement} DOM елемент картки
 */
function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = CSS_CLASSES.QUIZ_CARD;
    
    const questionCount = getQuestionCount(quiz);
    const questionText = getQuestionText(questionCount);
    
    card.innerHTML = `
        <div class="${CSS_CLASSES.QUIZ_CARD_HEADER}">
            <h3 class="${CSS_CLASSES.QUIZ_NAME}">${escapeHtml(quiz.name)}</h3>
        </div>
        <div class="${CSS_CLASSES.QUIZ_CARD_BODY}">
            <p class="${CSS_CLASSES.QUIZ_DESCRIPTION}">${escapeHtml(quiz.description)}</p>
            <p class="${CSS_CLASSES.QUIZ_INFO}">
                <span class="${CSS_CLASSES.QUIZ_QUESTIONS_COUNT}">${questionCount} ${questionText}</span>
            </p>
        </div>
        <div class="${CSS_CLASSES.QUIZ_CARD_FOOTER}">
            <button onclick="startQuiz('${escapeHtml(quiz.name)}')" class="${CSS_CLASSES.GO_TO_QUIZ_BTN}">
                Пройти квіз →
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Отримати кількість питань у квізі
 * @param {Quiz} quiz 
 * @returns {number}
 */
function getQuestionCount(quiz) {
    return quiz.questions ? quiz.questions.length : 0;
}

/**
 * Отримати текст для кількості питань (з правильним відмінюванням)
 * @param {number} count 
 * @returns {string}
 */
function getQuestionText(count) {
    if (count === 1) return 'питання';
    if (count >= 2 && count <= 4) return 'питання';
    return 'питань';
}

/**
 * Почати проходження квізу
 * @param {string} quizName - Назва квізу
 */
function startQuiz(quizName) {
    try {
        if (!quizName) {
            throw new Error('Не вказано назву квізу');
        }

        const quiz = storageService.getQuizByName(quizName);
        
        if (!quiz) {
            throw new Error(MESSAGES.ERROR_QUIZ_NOT_FOUND);
        }

        storageService.setSelectedQuiz(quiz);
        navigateToQuiz();
    } catch (error) {
        console.error('Помилка запуску квізу:', error);
        showError(error.message);
    }
}

/**
 * Перейти на сторінку проходження квізу
 */
function navigateToQuiz() {
    window.location.href = 'quiz/index.html';
}

/**
 * Показати повідомлення про помилку
 * @param {string} message 
 */
function showError(message) {
    alert(message);
}

/**
 * Ініціалізація при завантаженні сторінки
 */
window.addEventListener('DOMContentLoaded', initMainPage);

