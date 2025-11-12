/**
 * create.js - Логіка створення та редагування квізів
 */

let questionCounter = 0;
let editMode = false;
let originalQuizName = '';

function initCreatePage() {
    // Перевіряємо чи це редагування
    const urlParams = new URLSearchParams(window.location.search);
    editMode = urlParams.get('edit') === 'true';

    if (editMode) {
        loadQuizForEditing();
    } else {
        // Додаємо одне питання за замовчуванням
        addQuestion();
    }

    // Обробник форми
    document.getElementById('quiz-form').addEventListener('submit', saveQuiz);
}

/**
 * Завантажити квіз для редагування
 */
function loadQuizForEditing() {
    const quiz = storageService.getSelectedQuiz();
    
    if (!quiz) {
        alert('Квіз не знайдено!');
        window.location.href = '../manage/index.html';
        return;
    }

    document.getElementById('page-title').textContent = 'Редагування квізу';
    document.getElementById('quiz-name').value = quiz.name;
    document.getElementById('quiz-description').value = quiz.description;
    
    originalQuizName = quiz.name;

    // Завантажуємо питання
    quiz.questions.forEach(question => {
        addQuestion(question);
    });
}

/**
 * Оновити лічильник питань
 */
function updateQuestionCounter() {
    const total = document.querySelectorAll('.question-block').length;
    const counter = document.getElementById('questions-total');
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
    const container = document.getElementById('questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block';
    questionDiv.id = `question-${questionCounter}`;
    
    const questionText = questionData ? questionData.text : '';
    const options = questionData ? questionData.options : [
        { text: '', value: 1, isCorrect: false },
        { text: '', value: 1, isCorrect: false }
    ];
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <h4>Питання ${questionCounter}</h4>
            <button type="button" onclick="removeQuestion(${questionCounter})" class="remove-question-btn" title="Видалити питання">
                Видалити
            </button>
        </div>
        
        <div class="form-group">
            <label>Текст питання *</label>
            <input type="text" class="question-text" required placeholder="Введіть текст питання" value="${escapeHtml(questionText)}">
        </div>

        <div class="options-section">
            <label>Варіанти відповідей * (позначте правильні)</label>
            <div class="options-container" id="options-${questionCounter}">
                ${options.map((opt, index) => createOptionHTML(questionCounter, index, opt)).join('')}
            </div>
            <button type="button" onclick="addOption(${questionCounter})" class="add-option-btn">+ Додати варіант</button>
        </div>
    `;
    
    container.appendChild(questionDiv);
    updateQuestionCounter();
    
    // Прокрутка до нового питання
    questionDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        <div class="option-item" id="option-${questionId}-${optionIndex}">
            <div class="option-number">${optionIndex + 1}</div>
            <input type="text" class="option-text" required placeholder="Текст варіанту" value="${escapeHtml(text)}">
            <label class="checkbox-label" title="Позначити як правильну відповідь">
                <input type="checkbox" class="option-correct" ${isCorrect ? 'checked' : ''}>
                <span>✓ Правильна</span>
            </label>
            <button type="button" onclick="removeOption(${questionId}, ${optionIndex})" class="remove-option-btn" title="Видалити варіант">✖</button>
        </div>
    `;
}

/**
 * Додати новий варіант відповіді
 * @param {number} questionId
 */
function addOption(questionId) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    const currentOptions = optionsContainer.querySelectorAll('.option-item').length;
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-item';
    optionDiv.id = `option-${questionId}-${currentOptions}`;
    optionDiv.innerHTML = createOptionHTML(questionId, currentOptions);
    
    optionsContainer.appendChild(optionDiv);
}

/**
 * Видалити варіант відповіді
 * @param {number} questionId
 * @param {number} optionIndex
 */
function removeOption(questionId, optionIndex) {
    const optionElement = document.getElementById(`option-${questionId}-${optionIndex}`);
    const container = optionElement.parentElement;
    
    // Мінімум 2 варіанти
    if (container.querySelectorAll('.option-item').length <= 2) {
        alert('Питання повинно мати принаймні 2 варіанти відповіді!');
        return;
    }
    
    optionElement.remove();
}

/**
 * Видалити питання
 * @param {number} questionId
 */
function removeQuestion(questionId) {
    const questionElement = document.getElementById(`question-${questionId}`);
    const container = document.getElementById('questions-container');
    
    // Мінімум 1 питання
    if (container.querySelectorAll('.question-block').length <= 1) {
        alert('Квіз повинен мати принаймні 1 питання!');
        return;
    }
    
    if (confirm('Видалити це питання?')) {
        questionElement.remove();
        updateQuestionNumbers();
        updateQuestionCounter();
    }
}

/**
 * Оновити номери питань після видалення
 */
function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-block');
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
    
    const name = document.getElementById('quiz-name').value.trim();
    const description = document.getElementById('quiz-description').value.trim();
    
    if (!name || !description) {
        alert('Заповніть всі обов\'язкові поля!');
        return;
    }
    
    // Збираємо питання
    const questions = [];
    const questionBlocks = document.querySelectorAll('.question-block');
    
    questionBlocks.forEach(block => {
        const questionText = block.querySelector('.question-text').value.trim();
        
        if (!questionText) {
            alert('Всі питання повинні мати текст!');
            throw new Error('Empty question');
        }
        
        const options = [];
        const optionItems = block.querySelectorAll('.option-item');
        
        optionItems.forEach(item => {
            const optionText = item.querySelector('.option-text').value.trim();
            const isCorrect = item.querySelector('.option-correct').checked;
            
            if (!optionText) {
                alert('Всі варіанти відповідей повинні мати текст!');
                throw new Error('Empty option');
            }
            
            options.push({
                text: optionText,
                value: 1,
                isCorrect: isCorrect
            });
        });
        
        if (options.length < 2) {
            alert('Кожне питання повинно мати принаймні 2 варіанти!');
            throw new Error('Not enough options');
        }
        
        questions.push({
            text: questionText,
            options: options
        });
    });
    
    if (questions.length === 0) {
        alert('Додайте принаймні одне питання!');
        return;
    }
    
    const quiz = {
        name: name,
        description: description,
        questions: questions
    };
    
    try {
        if (editMode && originalQuizName) {
            // Оновлюємо існуючий квіз
            storageService.updateQuiz(originalQuizName, quiz);
            alert('Квіз успішно оновлено!');
        } else {
            // Перевіряємо чи не існує квіз з такою назвою
            const existing = storageService.getQuizByName(name);
            if (existing) {
                alert('Квіз з такою назвою вже існує!');
                return;
            }
            
            storageService.addQuiz(quiz);
            alert('Квіз успішно створено!');
        }
        
        window.location.href = '../manage/index.html';
    } catch (error) {
        console.error('Error saving quiz:', error);
    }
}

/**
 * Скасувати створення
 */
function cancelCreate() {
    if (confirm('Ви впевнені? Всі незбережені зміни будуть втрачені.')) {
        window.location.href = '../manage/index.html';
    }
}

// Ініціалізація
window.onload = initCreatePage;
