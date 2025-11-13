/**
 * create.js - Логіка створення та редагування квізів
 * @file Управління створенням та редагуванням квізів
 */

/**
 * @typedef {Object} QuizOption
 * @property {string} text - Текст варіанту відповіді
 * @property {number} value - Значення варіанту (завжди 1)
 * @property {boolean} isCorrect - Чи є варіант правильним
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} text - Текст питання
 * @property {string} type - Тип питання: 'single', 'multiple', 'text'
 * @property {QuizOption[]} options - Варіанти відповідей (для single/multiple)
 * @property {string} correctAnswer - Правильна відповідь (для text)
 */

/**
 * @typedef {Object} Quiz
 * @property {string} name - Назва квізу
 * @property {string} description - Опис квізу
 * @property {QuizQuestion[]} questions - Масив питань
 */

// Константи для DOM елементів
const DOM_ELEMENTS = {
    QUIZ_FORM: 'quiz-form',
    PAGE_TITLE: 'page-title',
    QUIZ_NAME: 'quiz-name',
    QUIZ_DESCRIPTION: 'quiz-description',
    QUESTIONS_CONTAINER: 'questions-container',
    QUESTIONS_TOTAL: 'questions-total'
};

// Константи для класів CSS
const CSS_CLASSES = {
    QUESTION_BLOCK: 'question-block',
    QUESTION_HEADER: 'question-header',
    QUESTION_TEXT: 'question-text',
    QUESTION_TYPE: 'question-type',
    OPTIONS_SECTION: 'options-section',
    OPTIONS_CONTAINER: 'options-container',
    OPTION_ITEM: 'option-item',
    OPTION_NUMBER: 'option-number',
    OPTION_TEXT: 'option-text',
    OPTION_CORRECT: 'option-correct',
    CHECKBOX_LABEL: 'checkbox-label',
    FORM_GROUP: 'form-group',
    REMOVE_QUESTION_BTN: 'remove-question-btn',
    ADD_OPTION_BTN: 'add-option-btn',
    REMOVE_OPTION_BTN: 'remove-option-btn',
    TEXT_ANSWER: 'text-answer'
};

// Константи для мінімальних вимог
const MIN_REQUIREMENTS = {
    QUIZ_NAME_LENGTH: 1,
    QUIZ_DESCRIPTION_LENGTH: 1,
    QUESTIONS_COUNT: 1,
    OPTIONS_PER_QUESTION: 2,
    OPTION_TEXT_LENGTH: 1
};

// Константи для повідомлень
const MESSAGES = {
    QUIZ_NOT_FOUND: 'Квіз не знайдено!',
    QUIZ_NAME_REQUIRED: `Назва квізу має містити мінімум ${MIN_REQUIREMENTS.QUIZ_NAME_LENGTH} символи`,
    QUIZ_DESCRIPTION_REQUIRED: `Опис квізу має містити мінімум ${MIN_REQUIREMENTS.QUIZ_DESCRIPTION_LENGTH} символів`,
    MIN_QUESTIONS_REQUIRED: `Додайте мінімум ${MIN_REQUIREMENTS.QUESTIONS_COUNT} питання`,
    MIN_OPTIONS_REQUIRED: `Кожне питання має містити мінімум ${MIN_REQUIREMENTS.OPTIONS_PER_QUESTION} варіанти відповіді`,
    CORRECT_ANSWER_REQUIRED: 'Оберіть хоча б одну правильну відповідь для кожного питання',
    OPTION_TEXT_REQUIRED: 'Заповніть всі варіанти відповідей',
    DUPLICATE_QUIZ_NAME: 'Квіз з такою назвою вже існує',
    QUIZ_SAVED: 'Квіз успішно збережено!',
    ERROR_SAVING: 'Помилка при збереженні квізу',
    ERROR_LOADING: 'Помилка при завантаженні квізу'
};

// Константи для URL параметрів
const URL_PARAMS = {
    EDIT: 'edit',
    EDIT_VALUE: 'true'
};

// Константи для URL
const URLS = {
    MANAGE: '../manage/index.html',
    HOME: '../index.html'
};

// Константи для тексту
const TEXT = {
    PAGE_TITLE_EDIT: 'Редагування квізу',
    PAGE_TITLE_CREATE: 'Створення квізу',
    ADD_OPTION_BTN: '+ Додати варіант',
    REMOVE_BTN: 'Видалити',
    CORRECT_LABEL: 'Правильна'
};

// Константи для значень за замовчуванням
const DEFAULTS = {
    OPTION_VALUE: 1,
    MIN_OPTIONS: 2,
    QUESTION_TYPE: 'single'
};

// Типи питань
const QUESTION_TYPES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    TEXT: 'text'
};

// Глобальні змінні стану
let questionCounter = 0;
let editMode = false;
let originalQuizName = '';

/**
 * Ініціалізація сторінки створення/редагування
 */
function initCreatePage() {
    try {
        console.log('Ініціалізація сторінки створення квізу...');
        checkEditMode();
        attachFormHandler();
    } catch (error) {
        console.error('Помилка ініціалізації:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Перевірити режим редагування
 */
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    editMode = urlParams.get(URL_PARAMS.EDIT) === URL_PARAMS.EDIT_VALUE;

    if (editMode) {
        loadQuizForEditing();
    } else {
        addQuestion();
    }
}

/**
 * Прикріпити обробник форми
 */
function attachFormHandler() {
    const form = getElement(DOM_ELEMENTS.QUIZ_FORM);
    form.addEventListener('submit', saveQuiz);
}

/**
 * Завантажити квіз для редагування
 */
function loadQuizForEditing() {
    try {
        const quiz = storageService.getSelectedQuiz();
        
        if (!quiz) {
            throw new Error(MESSAGES.QUIZ_NOT_FOUND);
        }

        updatePageTitle(TEXT.PAGE_TITLE_EDIT);
        fillQuizData(quiz);
        loadQuestions(quiz.questions);
    } catch (error) {
        console.error('Помилка завантаження квізу:', error);
        showError(error.message);
        navigateToManage();
    }
}

/**
 * Оновити заголовок сторінки
 * @param {string} title 
 */
function updatePageTitle(title) {
    const pageTitle = getElement(DOM_ELEMENTS.PAGE_TITLE);
    pageTitle.textContent = title;
}

/**
 * Заповнити дані квізу
 * @param {Quiz} quiz 
 */
function fillQuizData(quiz) {
    getElement(DOM_ELEMENTS.QUIZ_NAME).value = quiz.name;
    getElement(DOM_ELEMENTS.QUIZ_DESCRIPTION).value = quiz.description;
    originalQuizName = quiz.name;
}

/**
 * Завантажити питання
 * @param {QuizQuestion[]} questions 
 */
function loadQuestions(questions) {
    questions.forEach(question => {
        addQuestion(question);
    });
}

/**
 * Отримати елемент DOM за ID з перевіркою існування
 * @param {string} elementId 
 * @returns {HTMLElement}
 */
function getElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Елемент з ID "${elementId}" не знайдено`);
    }
    return element;
}

/**
 * Оновити лічильник питань
 */
function updateQuestionCounter() {
    const total = document.querySelectorAll(`.${CSS_CLASSES.QUESTION_BLOCK}`).length;
    const counter = document.getElementById(DOM_ELEMENTS.QUESTIONS_TOTAL);
    if (counter) {
        counter.textContent = total;
    }
}

/**
 * Додати нове питання
 * @param {QuizQuestion} questionData - Дані питання (для редагування)
 */
function addQuestion(questionData = null) {
    questionCounter++;
    const container = getElement(DOM_ELEMENTS.QUESTIONS_CONTAINER);
    
    const questionDiv = createQuestionElement(questionData);
    container.appendChild(questionDiv);
    
    // Оновлюємо номери варіантів ПІСЛЯ додавання в DOM
    updateOptionNumbers(questionCounter);
    
    updateQuestionCounter();
    
    // Прокрутка до нового питання
    questionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Створити елемент питання
 * @param {QuizQuestion|null} questionData 
 * @returns {HTMLDivElement}
 */
function createQuestionElement(questionData) {
    const questionDiv = document.createElement('div');
    questionDiv.className = CSS_CLASSES.QUESTION_BLOCK;
    questionDiv.id = `question-${questionCounter}`;
    
    const questionText = questionData ? questionData.text : '';
    const questionType = getQuestionType(questionData);
    const options = questionData && questionData.options ? questionData.options : getDefaultOptions();
    
    questionDiv.innerHTML = buildQuestionHTML(questionText, options, questionType);
    
    // Якщо це текстове питання і є дані, заповнюємо правильну відповідь
    if (questionType === QUESTION_TYPES.TEXT && questionData && questionData.correctAnswer) {
        setTimeout(() => {
            const textAnswer = questionDiv.querySelector(`.${CSS_CLASSES.TEXT_ANSWER}`);
            if (textAnswer) {
                textAnswer.value = questionData.correctAnswer;
            }
        }, 0);
    }
    
    // Прикріплюємо обробники подій до кнопок видалення варіантів
    attachOptionRemoveHandlers(questionDiv, questionCounter);
    
    return questionDiv;
}

/**
 * Отримати варіанти за замовчуванням
 * @returns {QuizOption[]}
 */
function getDefaultOptions() {
    return [
        { text: '', value: DEFAULTS.OPTION_VALUE, isCorrect: false },
        { text: '', value: DEFAULTS.OPTION_VALUE, isCorrect: false }
    ];
}

/**
 * Отримати тип питання за замовчуванням
 * @param {QuizQuestion|null} questionData
 * @returns {string}
 */
function getQuestionType(questionData) {
    return questionData && questionData.type ? questionData.type : DEFAULTS.QUESTION_TYPE;
}

/**
 * Побудувати HTML для питання
 * @param {string} questionText 
 * @param {QuizOption[]} options 
 * @param {string} questionType
 * @returns {string}
 */
function buildQuestionHTML(questionText, options, questionType = DEFAULTS.QUESTION_TYPE) {
    const typeLabel = questionType === QUESTION_TYPES.SINGLE ? '(одна правильна)' : 
                      questionType === QUESTION_TYPES.MULTIPLE ? '(кілька правильних)' : '';
    
    return `
        <div class="${CSS_CLASSES.QUESTION_HEADER}">
            <h4>Питання ${questionCounter}</h4>
            <button type="button" onclick="removeQuestion(${questionCounter})" class="${CSS_CLASSES.REMOVE_QUESTION_BTN}" title="Видалити питання">
                Видалити
            </button>
        </div>
        
        <div class="form-group">
            <label>Текст питання</label>
            <input type="text" class="${CSS_CLASSES.QUESTION_TEXT}" required placeholder="Введіть текст питання" value="${escapeHtml(questionText)}">
        </div>

        <div class="form-group">
            <label>Тип питання</label>
            <select class="${CSS_CLASSES.QUESTION_TYPE}" onchange="handleQuestionTypeChange(${questionCounter})">
                <option value="${QUESTION_TYPES.SINGLE}" ${questionType === QUESTION_TYPES.SINGLE ? 'selected' : ''}>Одна правильна відповідь</option>
                <option value="${QUESTION_TYPES.MULTIPLE}" ${questionType === QUESTION_TYPES.MULTIPLE ? 'selected' : ''}>Кілька правильних відповідей</option>
                <option value="${QUESTION_TYPES.TEXT}" ${questionType === QUESTION_TYPES.TEXT ? 'selected' : ''}>Розгорнута відповідь</option>
            </select>
        </div>

        ${questionType !== QUESTION_TYPES.TEXT ? `
            <div class="${CSS_CLASSES.OPTIONS_SECTION}">
                <label>Варіанти відповідей ${typeLabel}</label>
                <div class="${CSS_CLASSES.OPTIONS_CONTAINER}" id="options-${questionCounter}">
                    ${options.map((opt, index) => createOptionHTML(questionCounter, index, opt)).join('')}
                </div>
                <button type="button" onclick="addOption(${questionCounter})" class="${CSS_CLASSES.ADD_OPTION_BTN}">+ Додати варіант</button>
            </div>
        ` : `
            <div class="form-group">
                <label>Правильна відповідь (для перевірки)</label>
                <textarea class="${CSS_CLASSES.TEXT_ANSWER}" placeholder="Введіть правильну відповідь або ключові слова" rows="3"></textarea>
            </div>
        `}
    `;
}

/**
 * Створити HTML для варіанту відповіді
 * @param {number} questionId
 * @param {number} optionIndex
 * @param {QuizOption} optionData
 * @returns {string}
 */
function createOptionHTML(questionId, optionIndex, optionData = null) {
    const text = optionData ? optionData.text : '';
    const isCorrect = optionData ? optionData.isCorrect : false;
    
    return `
        <div class="${CSS_CLASSES.OPTION_ITEM}">
            <div class="${CSS_CLASSES.OPTION_NUMBER}">1</div>
            <input type="text" class="${CSS_CLASSES.OPTION_TEXT}" required placeholder="Текст варіанту" value="${escapeHtml(text)}">
            <label class="${CSS_CLASSES.CHECKBOX_LABEL}" title="Позначити як правильну відповідь">
                <input type="checkbox" class="${CSS_CLASSES.OPTION_CORRECT}" ${isCorrect ? 'checked' : ''}>
                <span>Правильна</span>
            </label>
            <button type="button" class="${CSS_CLASSES.REMOVE_OPTION_BTN}" title="Видалити варіант">✖</button>
        </div>
    `;
}

/**
 * Додати новий варіант відповіді
 * @param {number} questionId
 */
function addOption(questionId) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    
    if (!optionsContainer) {
        console.error(`Options container not found for question ${questionId}`);
        return;
    }
    
    // Створюємо новий варіант без прив'язки до індексу
    const optionDiv = createOptionElement(questionId, 0);
    
    // Додаємо до контейнера
    optionsContainer.appendChild(optionDiv);
    
    // Оновлюємо всі номери після додавання
    updateOptionNumbers(questionId);
}

/**
 * Створити елемент варіанту відповіді
 * @param {number} questionId 
 * @param {number} optionIndex 
 * @returns {HTMLDivElement}
 */
function createOptionElement(questionId, optionIndex) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createOptionHTML(questionId, optionIndex);
    const optionDiv = wrapper.firstElementChild;
    
    // Прикріплюємо обробник події до кнопки видалення
    const removeBtn = optionDiv.querySelector(`.${CSS_CLASSES.REMOVE_OPTION_BTN}`);
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeOptionByElement(optionDiv, questionId));
    }
    
    // Прикріплюємо обробник для чекбоксу (тільки одна правильна відповідь)
    const checkbox = optionDiv.querySelector(`.${CSS_CLASSES.OPTION_CORRECT}`);
    if (checkbox) {
        checkbox.addEventListener('change', (e) => handleCorrectAnswerChange(e, questionId));
    }
    
    return optionDiv;
}

/**
 * Обробник зміни правильної відповіді
 * @param {Event} event
 * @param {number} questionId
 */
function handleCorrectAnswerChange(event, questionId) {
    const currentCheckbox = event.target;
    const questionBlock = document.getElementById(`question-${questionId}`);
    
    if (!questionBlock) return;
    
    // Перевіряємо тип питання
    const typeSelect = questionBlock.querySelector(`.${CSS_CLASSES.QUESTION_TYPE}`);
    const questionType = typeSelect ? typeSelect.value : DEFAULTS.QUESTION_TYPE;
    
    // Для одиночного вибору - дозволяємо тільки одну правильну відповідь
    if (questionType === QUESTION_TYPES.SINGLE && currentCheckbox.checked) {
        const optionsContainer = document.getElementById(`options-${questionId}`);
        if (optionsContainer) {
            const allCheckboxes = optionsContainer.querySelectorAll(`.${CSS_CLASSES.OPTION_CORRECT}`);
            allCheckboxes.forEach(checkbox => {
                if (checkbox !== currentCheckbox) {
                    checkbox.checked = false;
                }
            });
        }
    }
    // Для множинного вибору - дозволяємо будь-яку кількість
}

/**
 * Видалити варіант відповіді за елементом
 * @param {HTMLElement} optionElement
 * @param {number} questionId
 */
function removeOptionByElement(optionElement, questionId) {
    const container = optionElement.parentElement;
    
    if (!canRemoveOption(container)) {
        showError(MESSAGES.MIN_OPTIONS_REQUIRED);
        return;
    }
    
    optionElement.remove();
    updateOptionNumbers(questionId);
}

/**
 * Видалити варіант відповіді (застаріла функція для сумісності)
 * @param {number} questionId
 * @param {number} optionIndex
 */
function removeOption(questionId, optionIndex) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    if (!optionsContainer) return;
    
    const options = optionsContainer.querySelectorAll(`.${CSS_CLASSES.OPTION_ITEM}`);
    if (options[optionIndex]) {
        removeOptionByElement(options[optionIndex], questionId);
    }
}

/**
 * Оновити номери варіантів відповідей
 * @param {number} questionId
 */
function updateOptionNumbers(questionId) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    if (!optionsContainer) return;
    
    const options = optionsContainer.querySelectorAll(`.${CSS_CLASSES.OPTION_ITEM}`);
    options.forEach((option, index) => {
        const numberElement = option.querySelector(`.${CSS_CLASSES.OPTION_NUMBER}`);
        if (numberElement) {
            numberElement.textContent = index + 1;
        }
    });
}

/**
 * Прикріпити обробники подій до кнопок видалення варіантів та чекбоксів
 * @param {HTMLElement} questionElement
 * @param {number} questionId
 */
function attachOptionRemoveHandlers(questionElement, questionId) {
    const removeButtons = questionElement.querySelectorAll(`.${CSS_CLASSES.REMOVE_OPTION_BTN}`);
    removeButtons.forEach(button => {
        const optionElement = button.closest(`.${CSS_CLASSES.OPTION_ITEM}`);
        button.addEventListener('click', () => removeOptionByElement(optionElement, questionId));
    });
    
    // Прикріплюємо обробники для чекбоксів
    const checkboxes = questionElement.querySelectorAll(`.${CSS_CLASSES.OPTION_CORRECT}`);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => handleCorrectAnswerChange(e, questionId));
    });
}

/**
 * Перевірити чи можна видалити варіант
 * @param {HTMLElement} container 
 * @returns {boolean}
 */
function canRemoveOption(container) {
    const optionsCount = container.querySelectorAll(`.${CSS_CLASSES.OPTION_ITEM}`).length;
    return optionsCount > MIN_REQUIREMENTS.OPTIONS_PER_QUESTION;
}

/**
 * Видалити питання
 * @param {number} questionId
 */
function removeQuestion(questionId) {
    const questionElement = document.getElementById(`question-${questionId}`);
    const container = getElement(DOM_ELEMENTS.QUESTIONS_CONTAINER);
    
    if (!questionElement) {
        console.error(`Question element not found: ${questionId}`);
        return;
    }
    
    if (!canRemoveQuestion(container)) {
        showError(MESSAGES.MIN_QUESTIONS_REQUIRED);
        return;
    }
    
    if (confirm('Видалити це питання?')) {
        questionElement.remove();
        updateQuestionNumbers();
        updateQuestionCounter();
    }
}

/**
 * Перевірити чи можна видалити питання
 * @param {HTMLElement} container 
 * @returns {boolean}
 */
function canRemoveQuestion(container) {
    const questionsCount = container.querySelectorAll(`.${CSS_CLASSES.QUESTION_BLOCK}`).length;
    return questionsCount > MIN_REQUIREMENTS.QUESTIONS_COUNT;
}

/**
 * Оновити номери питань після видалення
 */
function updateQuestionNumbers() {
    const questions = document.querySelectorAll(`.${CSS_CLASSES.QUESTION_BLOCK}`);
    questions.forEach((q, index) => {
        const header = q.querySelector('.question-header h4');
        header.textContent = `Питання ${index + 1}`;
    });
}

/**
 * Зберегти квіз
 * @param {Event} e
 */
function saveQuiz(e) {
    e.preventDefault();
    
    try {
        const name = getQuizName();
        const description = getQuizDescription();
        const questions = collectQuestions();
        
        validateQuizData(name, description, questions);
        
        const quiz = createQuizObject(name, description, questions);
        
        if (editMode && originalQuizName) {
            updateExistingQuiz(quiz);
        } else {
            createNewQuiz(quiz);
        }
        
        navigateToManage();
    } catch (error) {
        console.error('Помилка збереження квізу:', error);
        // Показуємо конкретне повідомлення про помилку
        showError(error.message || MESSAGES.ERROR_SAVING);
    }
}

/**
 * Отримати назву квізу
 * @returns {string}
 */
function getQuizName() {
    return getElement(DOM_ELEMENTS.QUIZ_NAME).value.trim();
}

/**
 * Отримати опис квізу
 * @returns {string}
 */
function getQuizDescription() {
    return getElement(DOM_ELEMENTS.QUIZ_DESCRIPTION).value.trim();
}

/**
 * Зібрати всі питання з форми
 * @returns {QuizQuestion[]}
 */
function collectQuestions() {
    const questions = [];
    const questionBlocks = document.querySelectorAll(`.${CSS_CLASSES.QUESTION_BLOCK}`);
    
    questionBlocks.forEach((block, blockIndex) => {
        const questionText = block.querySelector(`.${CSS_CLASSES.QUESTION_TEXT}`).value.trim();
        const questionTypeSelect = block.querySelector(`.${CSS_CLASSES.QUESTION_TYPE}`);
        const questionType = questionTypeSelect ? questionTypeSelect.value : DEFAULTS.QUESTION_TYPE;
        
        if (!questionText) {
            const errorMsg = `Питання ${blockIndex + 1}: Текст питання не може бути порожнім!`;
            showError(errorMsg);
            throw new Error(errorMsg);
        }
        
        const question = {
            text: questionText,
            type: questionType
        };
        
        if (questionType === QUESTION_TYPES.TEXT) {
            // Для текстових питань збираємо правильну відповідь
            const textAnswer = block.querySelector(`.${CSS_CLASSES.TEXT_ANSWER}`);
            question.correctAnswer = textAnswer ? textAnswer.value.trim() : '';
            question.options = []; // Порожній масив для текстових питань
        } else {
            // Для питань з варіантами відповідей
            const options = collectOptions(block, blockIndex + 1, questionType);
            
            if (options.length < MIN_REQUIREMENTS.OPTIONS_PER_QUESTION) {
                const errorMsg = `Питання ${blockIndex + 1}: ${MESSAGES.MIN_OPTIONS_REQUIRED}`;
                showError(errorMsg);
                throw new Error(errorMsg);
            }
            
            question.options = options;
        }
        
        questions.push(question);
    });
    
    return questions;
}

/**
 * Зібрати варіанти відповідей для питання
 * @param {HTMLElement} questionBlock 
 * @param {number} questionNumber - Номер питання для повідомлень про помилки
 * @param {string} questionType - Тип питання
 * @returns {QuizOption[]}
 */
function collectOptions(questionBlock, questionNumber = 0, questionType = DEFAULTS.QUESTION_TYPE) {
    const options = [];
    const optionItems = questionBlock.querySelectorAll(`.${CSS_CLASSES.OPTION_ITEM}`);
    
    optionItems.forEach((item, index) => {
        const optionText = item.querySelector(`.${CSS_CLASSES.OPTION_TEXT}`).value.trim();
        const isCorrect = item.querySelector(`.${CSS_CLASSES.OPTION_CORRECT}`).checked;
        
        if (!optionText) {
            const errorMsg = questionNumber > 0 
                ? `Питання ${questionNumber}, Варіант ${index + 1}: ${MESSAGES.OPTION_TEXT_REQUIRED}`
                : MESSAGES.OPTION_TEXT_REQUIRED;
            showError(errorMsg);
            throw new Error(errorMsg);
        }
        
        options.push({
            text: optionText,
            value: DEFAULTS.OPTION_VALUE,
            isCorrect: isCorrect
        });
    });
    
    return options;
}

/**
 * Валідувати дані квізу
 * @param {string} name 
 * @param {string} description 
 * @param {QuizQuestion[]} questions 
 */
function validateQuizData(name, description, questions) {
    if (!name || name.length < MIN_REQUIREMENTS.QUIZ_NAME_LENGTH) {
        throw new Error(MESSAGES.QUIZ_NAME_REQUIRED);
    }
    
    if (!description || description.length < MIN_REQUIREMENTS.QUIZ_DESCRIPTION_LENGTH) {
        throw new Error(MESSAGES.QUIZ_DESCRIPTION_REQUIRED);
    }
    
    if (questions.length < MIN_REQUIREMENTS.QUESTIONS_COUNT) {
        throw new Error(MESSAGES.MIN_QUESTIONS_REQUIRED);
    }
    
    // Перевірка наявності правильної відповіді в кожному питанні
    questions.forEach((question, index) => {
        if (question.type === QUESTION_TYPES.TEXT) {
            // Для текстових питань правильна відповідь не обов'язкова
            return;
        }
        
        const correctAnswersCount = question.options.filter(opt => opt.isCorrect).length;
        
        if (correctAnswersCount === 0) {
            throw new Error(`Питання ${index + 1}: ${MESSAGES.CORRECT_ANSWER_REQUIRED}`);
        }
        
        // Для питань з однією відповіддю перевіряємо, що вибрана тільки одна
        if (question.type === QUESTION_TYPES.SINGLE && correctAnswersCount > 1) {
            throw new Error(`Питання ${index + 1}: можлива тільки одна правильна відповідь`);
        }
    });
}

/**
 * Створити об'єкт квізу
 * @param {string} name 
 * @param {string} description 
 * @param {QuizQuestion[]} questions 
 * @returns {Quiz}
 */
function createQuizObject(name, description, questions) {
    return {
        name: name,
        description: description,
        questions: questions
    };
}

/**
 * Оновити існуючий квіз
 * @param {Quiz} quiz 
 */
function updateExistingQuiz(quiz) {
    storageService.updateQuiz(originalQuizName, quiz);
    showSuccess('Квіз успішно оновлено!');
}

/**
 * Створити новий квіз
 * @param {Quiz} quiz 
 */
function createNewQuiz(quiz) {
    const existing = storageService.getQuizByName(quiz.name);
    if (existing) {
        showError(MESSAGES.DUPLICATE_QUIZ_NAME);
        throw new Error(MESSAGES.DUPLICATE_QUIZ_NAME);
    }
    
    storageService.addQuiz(quiz);
    showSuccess(MESSAGES.QUIZ_SAVED);
}

/**
 * Обробити зміну типу питання
 * @param {number} questionId
 */
function handleQuestionTypeChange(questionId) {
    const questionBlock = document.getElementById(`question-${questionId}`);
    if (!questionBlock) return;
    
    const typeSelect = questionBlock.querySelector(`.${CSS_CLASSES.QUESTION_TYPE}`);
    const newType = typeSelect.value;
    
    const optionsSection = questionBlock.querySelector(`.${CSS_CLASSES.OPTIONS_SECTION}`);
    const textAnswerSection = questionBlock.querySelector(`.${CSS_CLASSES.TEXT_ANSWER}`)?.parentElement;
    
    if (newType === QUESTION_TYPES.TEXT) {
        // Перехід на текстову відповідь
        if (optionsSection) {
            optionsSection.style.display = 'none';
            // Скидаємо всі чекбокси при переході на текстовий тип
            resetAllCheckboxes(questionBlock);
        }
        
        if (!textAnswerSection) {
            // Створюємо секцію текстової відповіді
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.innerHTML = `
                <label>Правильна відповідь (для перевірки)</label>
                <textarea class="${CSS_CLASSES.TEXT_ANSWER}" placeholder="Введіть правильну відповідь або ключові слова" rows="3"></textarea>
            `;
            typeSelect.parentElement.after(formGroup);
        } else {
            textAnswerSection.style.display = 'block';
        }
    } else {
        // Перехід на варіанти відповідей
        if (textAnswerSection) {
            textAnswerSection.style.display = 'none';
        }
        
        if (optionsSection) {
            optionsSection.style.display = 'block';
            
            // Скидаємо всі чекбокси при зміні типу
            resetAllCheckboxes(questionBlock);
            
            // Оновлюємо підказку в залежності від типу
            const label = optionsSection.querySelector('label');
            if (label) {
                const typeLabel = newType === QUESTION_TYPES.SINGLE ? '(одна правильна)' : '(кілька правильних)';
                label.textContent = `Варіанти відповідей ${typeLabel}`;
            }
        }
    }
}

/**
 * Скинути всі чекбокси правильних відповідей у питанні
 * @param {HTMLElement} questionBlock
 */
function resetAllCheckboxes(questionBlock) {
    const checkboxes = questionBlock.querySelectorAll(`.${CSS_CLASSES.OPTION_CORRECT}`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Скасувати створення
 */
function cancelCreate() {
    if (confirm('Ви впевнені? Всі незбережені зміни будуть втрачені.')) {
        navigateToManage();
    }
}

/**
 * Перейти на сторінку управління
 */
function navigateToManage() {
    window.location.href = URLS.MANAGE;
}

/**
 * Перейти на головну сторінку
 */
function navigateToHome() {
    window.location.href = URLS.HOME;
}

/**
 * Показати повідомлення про помилку
 * @param {string} message 
 */
function showError(message) {
    alert(message);
}

/**
 * Показати повідомлення про успіх
 * @param {string} message 
 */
function showSuccess(message) {
    showError(message);
}

/**
 * Ініціалізація при завантаженні сторінки
 */
window.addEventListener('DOMContentLoaded', initCreatePage);
