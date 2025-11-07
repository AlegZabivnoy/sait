/**
 * main.js - Логіка головної сторінки
 */

let currentLanguage = 'uk';

/**
 * Ініціалізація головної сторінки
 */
function initMainPage() {
    loadQuizzes();
}

/**
 * Завантажити та відобразити список квізів
 */
function loadQuizzes() {
    const quizzes = storageService.getAllQuizzes();
    const quizList = document.getElementById('quiz-list');
    const emptyState = document.getElementById('empty-state');

    if (quizzes.length === 0) {
        quizList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    quizList.style.display = 'grid';
    emptyState.style.display = 'none';
    quizList.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizCard = createQuizCard(quiz);
        quizList.appendChild(quizCard);
    });
}

/**
 * Створити картку квізу
 * @param {Quiz} quiz
 * @returns {HTMLElement}
 */
function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    
    card.innerHTML = `
        <div class="quiz-card-header">
            <h3 class="quiz-name">${escapeHtml(quiz.name)}</h3>
        </div>
        <div class="quiz-card-body">
            <p class="quiz-description">${escapeHtml(quiz.description)}</p>
            <p class="quiz-info">
                <span class="quiz-questions-count">📝 ${questionCount} питань${questionCount === 1 ? 'ня' : ''}</span>
            </p>
        </div>
        <div class="quiz-card-footer">
            <button onclick="startQuiz('${escapeHtml(quiz.name)}')" class="go-to-quiz-btn">
                Пройти квіз →
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Почати проходження квізу
 * @param {string} quizName
 */
function startQuiz(quizName) {
    const quiz = storageService.getQuizByName(quizName);
    if (quiz) {
        storageService.setSelectedQuiz(quiz);
        window.location.href = 'quiz/index.html';
    } else {
        alert('Квіз не знайдено!');
    }
}

/**
 * Змінити мову інтерфейсу
 * @param {string} lang
 */
function changeLanguage(lang) {
    currentLanguage = lang;
    // TODO: Реалізувати переклад інтерфейсу
    console.log('Мову змінено на:', lang);
}

/**
 * Екранувати HTML для безпеки
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ініціалізація при завантаженні сторінки
window.onload = initMainPage;
