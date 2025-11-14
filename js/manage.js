/**
 * manage.js - Логіка сторінки управління квізами
 */

(function() {
    'use strict';

    // Константи для DOM елементів
    const DOM_ELEMENTS = {
        QUIZ_MANAGE_LIST: 'quiz-manage-list',
        EMPTY_MANAGE_STATE: 'empty-manage-state'
    };

    // Константи для відображення
    const DISPLAY = {
        NONE: 'none',
        BLOCK: 'block'
    };

    // Константи для класів CSS
    const CSS_CLASSES = {
        MANAGE_ITEM: 'manage-item',
        MANAGE_ITEM_INFO: 'manage-item-info',
        MANAGE_QUIZ_NAME: 'manage-quiz-name',
        MANAGE_QUIZ_DESCRIPTION: 'manage-quiz-description',
        MANAGE_QUIZ_META: 'manage-quiz-meta',
        MANAGE_ITEM_ACTIONS: 'manage-item-actions',
        EDIT_BTN: 'edit-btn',
        DELETE_BTN: 'delete-btn'
    };

    // Константи для повідомлень
    const MESSAGES = {
        CONFIRM_DELETE: 'Ви впевнені, що хочете видалити квіз "%s"?',
        ERROR_LOADING: 'Помилка при завантаженні списку квізів.',
        ERROR_QUIZ_NOT_FOUND: 'Квіз не знайдено!',
        ERROR_DELETING: 'Помилка при видаленні квізу.'
    };

    // Константи для URL
    const URLS = {
        CREATE_EDIT: '../create/index.html?edit=true'
    };

    /**
 * Ініціалізація сторінки управління
 */
    function initManagePage() {
        try {
            console.log('Ініціалізація сторінки управління...');
            loadQuizzesForManagement();
        } catch (error) {
            console.error('Помилка ініціалізації:', error);
            showError(MESSAGES.ERROR_LOADING);
        }
    }

    /**
 * Завантажити список квізів для управління
 */
    function loadQuizzesForManagement() {
        try {
            const quizzes = storageService.getAllQuizzes();
            const manageList = getElement(DOM_ELEMENTS.QUIZ_MANAGE_LIST);
            const emptyState = getElement(DOM_ELEMENTS.EMPTY_MANAGE_STATE);

            if (!quizzes || quizzes.length === 0) {
                showEmptyState(manageList, emptyState);
                return;
            }

            showManageList(manageList, emptyState);
            renderManageItems(manageList, quizzes);
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
 * Показати порожній стан
 * @param {HTMLElement} manageList 
 * @param {HTMLElement} emptyState 
 */
    function showEmptyState(manageList, emptyState) {
        manageList.style.display = DISPLAY.NONE;
        emptyState.style.display = DISPLAY.BLOCK;
    }

    /**
 * Показати список квізів
 * @param {HTMLElement} manageList 
 * @param {HTMLElement} emptyState 
 */
    function showManageList(manageList, emptyState) {
        manageList.style.display = DISPLAY.BLOCK;
        emptyState.style.display = DISPLAY.NONE;
    }

    /**
 * Відрендерити елементи управління квізами
 * @param {HTMLElement} manageList 
 * @param {Quiz[]} quizzes 
 */
    function renderManageItems(manageList, quizzes) {
        manageList.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizItem = createManageQuizItem(quiz);
            manageList.appendChild(quizItem);
        });
    }

    /**
 * Створити елемент квізу для управління
 * @param {Quiz} quiz
 * @returns {HTMLElement}
 */
    function createManageQuizItem(quiz) {
        const item = document.createElement('div');
        item.className = CSS_CLASSES.MANAGE_ITEM;
    
        const questionCount = getQuestionCount(quiz);
        const questionText = getQuestionText(questionCount);
    
        item.innerHTML = `
        <div class="${CSS_CLASSES.MANAGE_ITEM_INFO}">
            <h3 class="${CSS_CLASSES.MANAGE_QUIZ_NAME}">${escapeHtml(quiz.name)}</h3>
            <p class="${CSS_CLASSES.MANAGE_QUIZ_DESCRIPTION}">${escapeHtml(quiz.description)}</p>
            <p class="${CSS_CLASSES.MANAGE_QUIZ_META}">${questionCount} ${questionText}</p>
        </div>
        <div class="${CSS_CLASSES.MANAGE_ITEM_ACTIONS}">
            <button onclick="editQuiz('${escapeHtml(quiz.name)}')" class="${CSS_CLASSES.EDIT_BTN}" title="Редагувати">
                Редагувати
            </button>
            <button onclick="deleteQuiz('${escapeHtml(quiz.name)}')" class="${CSS_CLASSES.DELETE_BTN}" title="Видалити">
                Видалити
            </button>
        </div>
    `;
    
        return item;
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
 * Редагувати квіз
 * @param {string} quizName
 */
    function editQuiz(quizName) {
        try {
            if (!quizName) {
                throw new Error('Не вказано назву квізу');
            }

            const quiz = storageService.getQuizByName(quizName);
            if (!quiz) {
                throw new Error(MESSAGES.ERROR_QUIZ_NOT_FOUND);
            }

            storageService.setSelectedQuiz(quiz);
            navigateToEdit();
        } catch (error) {
            console.error('Помилка редагування квізу:', error);
            showError(error.message);
        }
    }

    /**
 * Видалити квіз
 * @param {string} quizName
 */
    function deleteQuiz(quizName) {
        try {
            if (!quizName) {
                throw new Error('Не вказано назву квізу');
            }

            const confirmMessage = MESSAGES.CONFIRM_DELETE.replace('%s', quizName);
            if (!confirm(confirmMessage)) {
                return;
            }

            storageService.deleteQuiz(quizName);
            loadQuizzesForManagement();
        } catch (error) {
            console.error('Помилка видалення квізу:', error);
            showError(MESSAGES.ERROR_DELETING);
        }
    }

    /**
 * Перейти на сторінку редагування
 */
    function navigateToEdit() {
        window.location.href = URLS.CREATE_EDIT;
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
    window.addEventListener('DOMContentLoaded', initManagePage);

    // Експортуємо функції для використання з HTML
    window.editQuiz = editQuiz;
    window.deleteQuiz = deleteQuiz;

})();
