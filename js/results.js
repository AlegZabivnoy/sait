/**
 * results.js - Логіка сторінки результатів
 */

// Константи для DOM елементів
const DOM_ELEMENTS = {
    RESULTS_LIST: 'results-list',
    EMPTY_RESULTS_STATE: 'empty-results-state',
    CLEAR_BTN: 'clear-btn'
};

// Константи для відображення
const DISPLAY = {
    NONE: 'none',
    BLOCK: 'block'
};

// Константи для класів CSS
const CSS_CLASSES = {
    RESULT_CARD: 'result-card',
    RESULT_CARD_HEADER: 'result-card-header',
    RESULT_CARD_BODY: 'result-card-body',
    RESULT_CARD_FOOTER: 'result-card-footer',
    RESULT_QUIZ_NAME: 'result-quiz-name',
    RESULT_STATUS: 'result-status',
    RESULT_DATE: 'result-date',
    RESULT_SUMMARY_TEXT: 'result-summary-text',
    RESULT_SCORE_DETAIL: 'result-score-detail',
    DELETE_RESULT_BTN: 'delete-result-btn'
};

// Константи для оцінок
const GRADE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40
};

const GRADE_STATUS = {
    EXCELLENT: { class: 'excellent', text: 'Відмінно!' },
    GOOD: { class: 'good', text: 'Добре' },
    AVERAGE: { class: 'average', text: 'Задовільно' },
    POOR: { class: 'poor', text: 'Потрібно покращити' }
};

// Константи для повідомлень
const MESSAGES = {
    CONFIRM_DELETE: 'Видалити цей результат?',
    CONFIRM_CLEAR_ALL: 'Ви впевнені, що хочете видалити ВСЮ історію результатів? Цю дію не можна скасувати!',
    ERROR_LOADING: 'Помилка при завантаженні результатів.',
    ERROR_DELETING: 'Помилка при видаленні результату.'
};

// Константи для форматування дати
const DATE_FORMAT_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

const LOCALE = 'uk-UA';

/**
 * Ініціалізація сторінки результатів
 */
function initResultsPage() {
    try {
        console.log('Ініціалізація сторінки результатів...');
        loadResults();
    } catch (error) {
        console.error('Помилка ініціалізації:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Завантажити та відобразити результати
 */
function loadResults() {
    try {
        const results = storageService.getAllResults();
        const resultsList = getElement(DOM_ELEMENTS.RESULTS_LIST);
        const emptyState = getElement(DOM_ELEMENTS.EMPTY_RESULTS_STATE);
        const clearBtn = getElement(DOM_ELEMENTS.CLEAR_BTN);

        if (!results || results.length === 0) {
            showEmptyState(resultsList, emptyState, clearBtn);
            return;
        }

        showResultsList(resultsList, emptyState, clearBtn);
        renderResults(resultsList, results);
    } catch (error) {
        console.error('Помилка завантаження результатів:', error);
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
 * Показати порожній стан
 * @param {HTMLElement} resultsList 
 * @param {HTMLElement} emptyState 
 * @param {HTMLElement} clearBtn 
 */
function showEmptyState(resultsList, emptyState, clearBtn) {
    resultsList.style.display = DISPLAY.NONE;
    emptyState.style.display = DISPLAY.BLOCK;
    clearBtn.style.display = DISPLAY.NONE;
}

/**
 * Показати список результатів
 * @param {HTMLElement} resultsList 
 * @param {HTMLElement} emptyState 
 * @param {HTMLElement} clearBtn 
 */
function showResultsList(resultsList, emptyState, clearBtn) {
    resultsList.style.display = DISPLAY.BLOCK;
    emptyState.style.display = DISPLAY.NONE;
    clearBtn.style.display = DISPLAY.BLOCK;
}

/**
 * Відрендерити результати
 * @param {HTMLElement} resultsList 
 * @param {QuizResult[]} results 
 */
function renderResults(resultsList, results) {
    resultsList.innerHTML = '';
    const sortedResults = sortResultsByDate(results);
    
    sortedResults.forEach(result => {
        const resultCard = createResultCard(result);
        resultsList.appendChild(resultCard);
    });
}

/**
 * Сортувати результати за датою (новіші спочатку)
 * @param {QuizResult[]} results 
 * @returns {QuizResult[]}
 */
function sortResultsByDate(results) {
    return [...results].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Створити картку результату
 * @param {QuizResult} result
 * @returns {HTMLElement}
 */
function createResultCard(result) {
    const card = document.createElement('div');
    card.className = CSS_CLASSES.RESULT_CARD;
    
    const formattedDate = formatDate(result.timestamp);
    const gradeStatus = getGradeStatus(result.summary);
    
    card.innerHTML = `
        <div class="${CSS_CLASSES.RESULT_CARD_HEADER} ${gradeStatus.class}">
            <h3 class="${CSS_CLASSES.RESULT_QUIZ_NAME}">${escapeHtml(result.quizName)}</h3>
            ${gradeStatus.text ? `<span class="${CSS_CLASSES.RESULT_STATUS}">${gradeStatus.text}</span>` : ''}
        </div>
        <div class="${CSS_CLASSES.RESULT_CARD_BODY}">
            <p class="${CSS_CLASSES.RESULT_DATE}">${formattedDate}</p>
            <p class="${CSS_CLASSES.RESULT_SUMMARY_TEXT}">Результат: ${escapeHtml(result.summary)}</p>
        </div>
        <div class="${CSS_CLASSES.RESULT_CARD_FOOTER}">
            <button onclick="deleteResult('${result.timestamp}')" class="${CSS_CLASSES.DELETE_RESULT_BTN}">
                Видалити
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Форматувати дату
 * @param {string} timestamp 
 * @returns {string}
 */
function formatDate(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString(LOCALE, DATE_FORMAT_OPTIONS);
    } catch (error) {
        console.error('Помилка форматування дати:', error);
        return timestamp;
    }
}

/**
 * Отримати статус оцінки на основі результату
 * @param {string} summary 
 * @returns {{class: string, text: string}}
 */
function getGradeStatus(summary) {
    if (!summary || !summary.includes('%')) {
        return { class: '', text: '' };
    }

    const percent = extractPercentage(summary);
    if (percent === null) {
        return { class: '', text: '' };
    }

    if (percent >= GRADE_THRESHOLDS.EXCELLENT) {
        return GRADE_STATUS.EXCELLENT;
    } else if (percent >= GRADE_THRESHOLDS.GOOD) {
        return GRADE_STATUS.GOOD;
    } else if (percent >= GRADE_THRESHOLDS.AVERAGE) {
        return GRADE_STATUS.AVERAGE;
    } else {
        return GRADE_STATUS.POOR;
    }
}

/**
 * Витягти відсоток з рядка
 * @param {string} text 
 * @returns {number|null}
 */
function extractPercentage(text) {
    const percentMatch = text.match(/(\d+)%/);
    return percentMatch ? parseInt(percentMatch[1], 10) : null;
}

/**
 * Видалити результат
 * @param {string} timestamp
 */
function deleteResult(timestamp) {
    try {
        if (!timestamp) {
            throw new Error('Не вказано timestamp результату');
        }

        if (!confirm(MESSAGES.CONFIRM_DELETE)) {
            return;
        }

        storageService.deleteResult(timestamp);
        loadResults();
    } catch (error) {
        console.error('Помилка видалення результату:', error);
        showError(MESSAGES.ERROR_DELETING);
    }
}

/**
 * Очистити всі результати
 */
function clearAllResults() {
    try {
        if (!confirm(MESSAGES.CONFIRM_CLEAR_ALL)) {
            return;
        }

        storageService.clearAllResults();
        loadResults();
    } catch (error) {
        console.error('Помилка очищення результатів:', error);
        showError(MESSAGES.ERROR_DELETING);
    }
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
window.addEventListener('DOMContentLoaded', initResultsPage);
