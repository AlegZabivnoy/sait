/**
 * manage.js - Логіка сторінки управління квізами
 */

function initManagePage() {
    loadQuizzesForManagement();
}

/**
 * Завантажити список квізів для управління
 */
function loadQuizzesForManagement() {
    const quizzes = storageService.getAllQuizzes();
    const manageList = document.getElementById('quiz-manage-list');
    const emptyState = document.getElementById('empty-manage-state');

    if (quizzes.length === 0) {
        manageList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    manageList.style.display = 'block';
    emptyState.style.display = 'none';
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
    item.className = 'manage-item';
    
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    
    item.innerHTML = `
        <div class="manage-item-info">
            <h3 class="manage-quiz-name">${escapeHtml(quiz.name)}</h3>
            <p class="manage-quiz-description">${escapeHtml(quiz.description)}</p>
            <p class="manage-quiz-meta">📝 ${questionCount} питань${questionCount === 1 ? 'ня' : ''}</p>
        </div>
        <div class="manage-item-actions">
            <button onclick="editQuiz('${escapeHtml(quiz.name)}')" class="edit-btn" title="Редагувати">
                ✏️ Редагувати
            </button>
            <button onclick="deleteQuiz('${escapeHtml(quiz.name)}')" class="delete-btn" title="Видалити">
                🗑️ Видалити
            </button>
        </div>
    `;
    
    return item;
}

/**
 * Редагувати квіз
 * @param {string} quizName
 */
function editQuiz(quizName) {
    const quiz = storageService.getQuizByName(quizName);
    if (quiz) {
        storageService.setSelectedQuiz(quiz);
        window.location.href = '../create/index.html?edit=true';
    }
}

/**
 * Видалити квіз
 * @param {string} quizName
 */
function deleteQuiz(quizName) {
    if (confirm(`Ви впевнені, що хочете видалити квіз "${quizName}"?`)) {
        storageService.deleteQuiz(quizName);
        loadQuizzesForManagement();
    }
}

/**
 * Екранувати HTML
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ініціалізація при завантаженні
window.onload = initManagePage;
