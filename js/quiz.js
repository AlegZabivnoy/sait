/**
 * quiz.js - Логіка проходження квізу
 */

// Константи для DOM елементів
const DOM_ELEMENTS = {
    QUESTION: 'question',
    ANSWERS: 'answers',
    QUESTION_COUNTER: 'question-counter',
    PREV_BTN: 'prev-btn',
    NEXT_BTN: 'next-btn',
    QUIZ_CONTAINER: 'quiz-container',
    RESULT_CONTAINER: 'result-container',
    RESULT_CONTENT: 'result-content'
};

// Константи для відображення
const DISPLAY = {
    NONE: 'none',
    BLOCK: 'block'
};

// Константи для класів CSS
const CSS_CLASSES = {
    ANSWER_BTN: 'answer-btn',
    SELECTED: 'selected',
    RESULT_SUMMARY: 'result-summary',
    RESULT_ITEM: 'result-item',
    RESULT_QUESTION: 'result-question',
    RESULT_ANSWER: 'result-answer',
    QUESTION_NUMBER: 'question-number',
    STATUS_ICON: 'status-icon',
    SCORE: 'score',
    CORRECT: 'correct',
    INCORRECT: 'incorrect'
};

// Константи для текстів кнопок
const BUTTON_TEXT = {
    NEXT: 'Далі',
    FINISH: 'Завершити'
};

// Константи для повідомлень
const MESSAGES = {
    QUIZ_NOT_FOUND: 'Квіз не знайдено або він порожній!',
    SELECT_ANSWER: 'Будь ласка, виберіть відповідь!',
    ERROR_LOADING: 'Помилка при завантаженні квізу.',
    THANK_YOU: 'Дякуємо за проходження квізу!'
};

// Константи для URL
const URLS = {
    HOME: '../index.html'
};

// Константи для символів
const SYMBOLS = {
    CORRECT: '+',
    INCORRECT: '-'
};

// Глобальні змінні стану
let questions = [];
let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];

/**
 * Ініціалізація квізу
 */
function initQuiz() {
    try {
        console.log('Ініціалізація квізу...');
        loadQuiz();
        resetQuizState();
        updateTitle();
        showQuestion();
    } catch (error) {
        console.error('Помилка ініціалізації квізу:', error);
        showError(MESSAGES.ERROR_LOADING);
        navigateToHome();
    }
}

/**
 * Завантажити квіз
 */
function loadQuiz() {
    currentQuiz = storageService.getSelectedQuiz();
    
    if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        throw new Error(MESSAGES.QUIZ_NOT_FOUND);
    }
    
    questions = convertQuizStructure(currentQuiz.questions);
}

/**
 * Конвертувати структуру квізу для сумісності
 * @param {QuizQuestion[]} quizQuestions 
 * @returns {Array}
 */
function convertQuizStructure(quizQuestions) {
    return quizQuestions.map(q => ({
        question: q.text,
        answers: q.options.map(o => o.text)
    }));
}

/**
 * Скинути стан квізу
 */
function resetQuizState() {
    currentQuestion = 0;
    userAnswers = [];
}

/**
 * Оновити заголовок сторінки
 */
function updateTitle() {
    const titleElement = document.querySelector('h1');
    if (titleElement && currentQuiz) {
        titleElement.textContent = currentQuiz.name;
    }
}

/**
 * Показати поточне питання
 */
function showQuestion() {
    try {
        const questionElement = getElement(DOM_ELEMENTS.QUESTION);
        const answersElement = getElement(DOM_ELEMENTS.ANSWERS);
        const counterElement = getElement(DOM_ELEMENTS.QUESTION_COUNTER);
        const prevBtn = getElement(DOM_ELEMENTS.PREV_BTN);
        const nextBtn = getElement(DOM_ELEMENTS.NEXT_BTN);

        const currentQuestionData = questions[currentQuestion];
        
        updateQuestionText(questionElement, currentQuestionData.question);
        renderAnswerButtons(answersElement, currentQuestionData.answers);
        updateQuestionCounter(counterElement);
        updateNavigationButtons(prevBtn, nextBtn);
    } catch (error) {
        console.error('Помилка відображення питання:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
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
 * Оновити текст питання
 * @param {HTMLElement} element 
 * @param {string} questionText 
 */
function updateQuestionText(element, questionText) {
    element.textContent = questionText;
}

/**
 * Відрендерити кнопки відповідей
 * @param {HTMLElement} answersElement 
 * @param {string[]} answers 
 */
function renderAnswerButtons(answersElement, answers) {
    answersElement.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const button = createAnswerButton(answer, index);
        answersElement.appendChild(button);
    });
}

/**
 * Створити кнопку відповіді
 * @param {string} answerText 
 * @param {number} index 
 * @returns {HTMLElement}
 */
function createAnswerButton(answerText, index) {
    const button = document.createElement('button');
    button.className = CSS_CLASSES.ANSWER_BTN;
    button.textContent = answerText;
    button.onclick = () => selectAnswer(index);
    
    if (userAnswers[currentQuestion] === index) {
        button.classList.add(CSS_CLASSES.SELECTED);
    }
    
    return button;
}

/**
 * Оновити лічильник питань
 * @param {HTMLElement} counterElement 
 */
function updateQuestionCounter(counterElement) {
    counterElement.textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
}

/**
 * Оновити кнопки навігації
 * @param {HTMLElement} prevBtn 
 * @param {HTMLElement} nextBtn 
 */
function updateNavigationButtons(prevBtn, nextBtn) {
    prevBtn.disabled = isFirstQuestion();
    nextBtn.textContent = isLastQuestion() ? BUTTON_TEXT.FINISH : BUTTON_TEXT.NEXT;
}

/**
 * Перевірити чи це перше питання
 * @returns {boolean}
 */
function isFirstQuestion() {
    return currentQuestion === 0;
}

/**
 * Перевірити чи це останнє питання
 * @returns {boolean}
 */
function isLastQuestion() {
    return currentQuestion === questions.length - 1;
}

/**
 * Вибрати відповідь
 * @param {number} answerIndex 
 */
function selectAnswer(answerIndex) {
    userAnswers[currentQuestion] = answerIndex;
    updateAnswerButtonsSelection(answerIndex);
}

/**
 * Оновити виділення кнопок відповідей
 * @param {number} selectedIndex 
 */
function updateAnswerButtonsSelection(selectedIndex) {
    const buttons = document.querySelectorAll(`.${CSS_CLASSES.ANSWER_BTN}`);
    buttons.forEach((btn, index) => {
        if (index === selectedIndex) {
            btn.classList.add(CSS_CLASSES.SELECTED);
        } else {
            btn.classList.remove(CSS_CLASSES.SELECTED);
        }
    });
}

/**
 * Перейти до наступного питання
 */
function nextQuestion() {
    try {
        if (!hasAnswerSelected()) {
            showError(MESSAGES.SELECT_ANSWER);
            return;
        }
        
        if (!isLastQuestion()) {
            currentQuestion++;
            showQuestion();
        } else {
            showResults();
        }
    } catch (error) {
        console.error('Помилка переходу до наступного питання:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Перейти до попереднього питання
 */
function previousQuestion() {
    if (!isFirstQuestion()) {
        currentQuestion--;
        showQuestion();
    }
}

/**
 * Перевірити чи вибрано відповідь
 * @returns {boolean}
 */
function hasAnswerSelected() {
    return userAnswers[currentQuestion] !== undefined;
}

/**
 * Показати результати квізу
 */
function showResults() {
    try {
        const quizContainer = getElement(DOM_ELEMENTS.QUIZ_CONTAINER);
        const resultContainer = getElement(DOM_ELEMENTS.RESULT_CONTAINER);
        const resultContent = getElement(DOM_ELEMENTS.RESULT_CONTENT);
        
        hideQuizContainer(quizContainer, resultContainer);
        
        const resultDetails = calculateResults();
        const resultsHTML = generateResultsHTML(resultDetails);
        
        resultContent.innerHTML = resultsHTML;
        saveResult(resultDetails);
    } catch (error) {
        console.error('Помилка відображення результатів:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
}

/**
 * Сховати контейнер квізу і показати результати
 * @param {HTMLElement} quizContainer 
 * @param {HTMLElement} resultContainer 
 */
function hideQuizContainer(quizContainer, resultContainer) {
    quizContainer.style.display = DISPLAY.NONE;
    resultContainer.style.display = DISPLAY.BLOCK;
}

/**
 * Підрахувати результати
 * @returns {{score: number, total: number, percentage: number, details: Array}}
 */
function calculateResults() {
    let correctCount = 0;
    const details = [];
    
    currentQuiz.questions.forEach((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const selectedOption = question.options[userAnswerIndex];
        const isCorrect = selectedOption.isCorrect;
        
        if (isCorrect) {
            correctCount++;
        }
        
        details.push({
            question: question.text,
            answer: selectedOption.text,
            isCorrect: isCorrect
        });
    });
    
    const total = currentQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    
    return {
        score: correctCount,
        total: total,
        percentage: percentage,
        details: details
    };
}

/**
 * Генерувати HTML для результатів
 * @param {{score: number, total: number, percentage: number, details: Array}} resultData 
 * @returns {string}
 */
function generateResultsHTML(resultData) {
    let html = `
        <div class="${CSS_CLASSES.RESULT_SUMMARY}">
            <h3>${MESSAGES.THANK_YOU}</h3>
            <p class="${CSS_CLASSES.SCORE}">Ваш результат: ${resultData.score} з ${resultData.total} (${resultData.percentage}%)</p>
        </div>
    `;
    
    resultData.details.forEach((item, index) => {
        html += generateResultItemHTML(item, index);
    });
    
    return html;
}

/**
 * Генерувати HTML для одного елемента результату
 * @param {{question: string, answer: string, isCorrect: boolean}} item 
 * @param {number} index 
 * @returns {string}
 */
function generateResultItemHTML(item, index) {
    const statusClass = item.isCorrect ? CSS_CLASSES.CORRECT : CSS_CLASSES.INCORRECT;
    const statusIcon = item.isCorrect ? SYMBOLS.CORRECT : SYMBOLS.INCORRECT;
    
    return `
        <div class="${CSS_CLASSES.RESULT_ITEM} ${statusClass}">
            <div class="${CSS_CLASSES.RESULT_QUESTION}">
                <span class="${CSS_CLASSES.QUESTION_NUMBER}">${index + 1}.</span> ${item.question}
            </div>
            <div class="${CSS_CLASSES.RESULT_ANSWER}">
                <span class="${CSS_CLASSES.STATUS_ICON}">${statusIcon}</span>
                Ваша відповідь: ${item.answer}
            </div>
        </div>
    `;
}

/**
 * Зберегти результат квізу
 * @param {{score: number, total: number, percentage: number}} resultData 
 */
function saveResult(resultData) {
    try {
        const result = {
            timestamp: new Date().toISOString(),
            quizName: currentQuiz.name,
            summary: `${resultData.score}/${resultData.total} (${resultData.percentage}%)`,
            answers: userAnswers.map(answerIndex => [answerIndex]),
            score: resultData.score
        };
        
        storageService.addResult(result);
    } catch (error) {
        console.error('Помилка збереження результату:', error);
    }
}

/**
 * Перезапустити квіз
 */
function restartQuiz() {
    try {
        const quizContainer = getElement(DOM_ELEMENTS.QUIZ_CONTAINER);
        const resultContainer = getElement(DOM_ELEMENTS.RESULT_CONTAINER);
        
        resultContainer.style.display = DISPLAY.NONE;
        quizContainer.style.display = DISPLAY.BLOCK;
        
        initQuiz();
    } catch (error) {
        console.error('Помилка перезапуску квізу:', error);
        showError(MESSAGES.ERROR_LOADING);
    }
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
 * Ініціалізація при завантаженні сторінки
 */
window.addEventListener('DOMContentLoaded', initQuiz);
