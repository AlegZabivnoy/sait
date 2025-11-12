/**
 * main.js - Логіка головної сторінки
 * 
 * Цей файл відповідає за відображення списку доступних квізів на головній сторінці.
 * Тут використовуються основні концепції роботи з DOM та localStorage.
 * 
 * Навчальні концепції:
 * - Робота з DOM API (getElementById, createElement, appendChild)
 * - Цикл forEach для перебору масивів
 * - Динамічне створення HTML елементів
 * - Використання template literals для генерації HTML
 */

/**
 * Ініціалізація головної сторінки
 * Ця функція викликається автоматично при завантаженні сторінки (див. кінець файлу)
 */
function initMainPage() {
    console.log('Ініціалізація головної сторінки...');
    loadQuizzes(); // Завантажуємо та відображаємо квізи
}

/**
 * Завантажити та відобразити список квізів
 * 
 * Алгоритм роботи:
 * 1. Отримуємо всі квізи з localStorage через storageService
 * 2. Перевіряємо чи є квізи
 * 3. Якщо немає - показуємо повідомлення "Поки немає квізів"
 * 4. Якщо є - створюємо картку для кожного квізу
 */
function loadQuizzes() {
    // Отримуємо всі квізи з localStorage
    const quizzes = storageService.getAllQuizzes();
    
    // Знаходимо елементи на сторінці за їх ID
    const quizList = document.getElementById('quiz-list');
    const emptyState = document.getElementById('empty-state');

    // Перевіряємо чи є квізи в системі
    if (quizzes.length === 0) {
        // Якщо квізів немає - ховаємо список і показуємо порожній стан
        quizList.style.display = 'none';
        emptyState.style.display = 'block';
        return; // Виходимо з функції
    }

    // Якщо квізи є - показуємо список і ховаємо порожній стан
    quizList.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Очищуємо попередній вміст списку (важливо при оновленні!)
    quizList.innerHTML = '';

    // Перебираємо всі квізи і створюємо картку для кожного
    // forEach - метод масиву, який виконує функцію для кожного елементу
    quizzes.forEach(quiz => {
        const quizCard = createQuizCard(quiz); // Створюємо картку квізу
        quizList.appendChild(quizCard);         // Додаємо картку до списку
    });
}

/**
 * Створити картку квізу (DOM елемент)
 * 
 * Ця функція створює HTML-картку для відображення квізу на сторінці.
 * Використовує template literals (зворотні лапки `) для зручного створення HTML.
 * 
 * @param {Quiz} quiz - Об'єкт квізу з властивостями name, description, questions
 * @returns {HTMLElement} - Готовий DOM елемент картки
 * 
 * Навчальні концепції:
 * - createElement() - створення нового DOM елемента
 * - innerHTML - вставка HTML коду як рядка
 * - Template literals - зручний спосіб створення багаторядкових рядків
 * - Тернарний оператор (? :) - коротка форма if-else
 * - escapeHtml() - захист від XSS атак
 */
function createQuizCard(quiz) {
    // Створюємо новий div елемент для картки
    const card = document.createElement('div');
    
    // Додаємо CSS клас для стилізації
    card.className = 'quiz-card';
    
    // Підраховуємо кількість питань (якщо питання є)
    // Оператор ? перевіряє чи існує quiz.questions, якщо ні - повертає 0
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    
    // Використовуємо template literals для створення HTML структури
    // ${} дозволяє вставляти JavaScript вирази всередину рядка
    card.innerHTML = `
        <div class="quiz-card-header">
            <h3 class="quiz-name">${escapeHtml(quiz.name)}</h3>
        </div>
        <div class="quiz-card-body">
            <p class="quiz-description">${escapeHtml(quiz.description)}</p>
            <p class="quiz-info">
                <span class="quiz-questions-count">${questionCount} питань${questionCount === 1 ? 'ня' : ''}</span>
            </p>
        </div>
        <div class="quiz-card-footer">
            <button onclick="startQuiz('${escapeHtml(quiz.name)}')" class="go-to-quiz-btn">
                Пройти квіз →
            </button>
        </div>
    `;
    
    // Повертаємо готову картку
    return card;
}

/**
 * Почати проходження квізу
 * 
 * Ця функція викликається при натисканні кнопки "Пройти квіз"
 * Вона знаходить квіз за назвою, зберігає його як вибраний і переходить на сторінку проходження
 * 
 * @param {string} quizName - Назва квізу, який потрібно пройти
 * 
 * Навчальні концепції:
 * - Умовні оператори (if-else)
 * - Редірект між сторінками (window.location.href)
 * - Базова обробка помилок
 */
function startQuiz(quizName) {
    // Шукаємо квіз за назвою в localStorage
    const quiz = storageService.getQuizByName(quizName);
    
    // Перевіряємо чи знайдено квіз
    if (quiz) {
        // Зберігаємо квіз як вибраний (щоб на наступній сторінці знати, який квіз проходимо)
        storageService.setSelectedQuiz(quiz);
        
        // Переходимо на сторінку проходження квізу
        window.location.href = 'quiz/index.html';
    } else {
        // Якщо квіз не знайдено - показуємо помилку
        alert('Квіз не знайдено!');
    }
}

// ====================================
// ІНІЦІАЛІЗАЦІЯ ДОДАТКУ
// ====================================

/**
 * Автоматично викликаємо ініціалізацію при завантаженні сторінки
 * window.onload - подія, яка спрацьовує коли вся сторінка завантажена
 * 
 * Альтернативи:
 * - DOMContentLoaded - спрацьовує швидше (коли HTML завантажений, без картинок)
 * - document.addEventListener('DOMContentLoaded', initMainPage)
 */
window.onload = initMainPage;

