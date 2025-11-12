/**
 * results.js - Логіка сторінки результатів
 */

function initResultsPage() {
    loadResults();
}

/**
 * Завантажити та відобразити результати
 */
function loadResults() {
    const results = storageService.getAllResults();
    const resultsList = document.getElementById('results-list');
    const emptyState = document.getElementById('empty-results-state');
    const clearBtn = document.getElementById('clear-btn');

    if (results.length === 0) {
        resultsList.style.display = 'none';
        emptyState.style.display = 'block';
        clearBtn.style.display = 'none';
        return;
    }

    resultsList.style.display = 'block';
    emptyState.style.display = 'none';
    clearBtn.style.display = 'block';
    resultsList.innerHTML = '';

    // Сортуємо за датою (новіші спочатку)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    results.forEach(result => {
        const resultCard = createResultCard(result);
        resultsList.appendChild(resultCard);
    });
}

/**
 * Створити картку результату
 * @param {QuizResult} result
 * @returns {HTMLElement}
 */
function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const date = new Date(result.timestamp);
    const formattedDate = date.toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Визначаємо статус (якщо є інформація про оцінку)
    let statusClass = '';
    let statusText = '';
    if (result.summary && result.summary.includes('%')) {
        const percentMatch = result.summary.match(/(\d+)%/);
        if (percentMatch) {
            const percent = parseInt(percentMatch[1]);
            if (percent >= 80) {
                statusClass = 'excellent';
                statusText = 'Відмінно!';
            } else if (percent >= 60) {
                statusClass = 'good';
                statusText = 'Добре';
            } else if (percent >= 40) {
                statusClass = 'average';
                statusText = 'Задовільно';
            } else {
                statusClass = 'poor';
                statusText = 'Потрібно покращити';
            }
        }
    }
    
    card.innerHTML = `
        <div class="result-card-header ${statusClass}">
            <h3 class="result-quiz-name">${escapeHtml(result.quizName)}</h3>
            ${statusText ? `<span class="result-status">${statusText}</span>` : ''}
        </div>
        <div class="result-card-body">
            <p class="result-date">${formattedDate}</p>
            <p class="result-summary-text">Результат: ${escapeHtml(result.summary)}</p>
            ${result.score !== undefined ? `<p class="result-score-detail">Правильних відповідей: ${result.score}</p>` : ''}
        </div>
        <div class="result-card-footer">
            <button onclick="deleteResult('${result.timestamp}')" class="delete-result-btn">
                Видалити
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Видалити результат
 * @param {string} timestamp
 */
function deleteResult(timestamp) {
    if (confirm('Видалити цей результат?')) {
        storageService.deleteResult(timestamp);
        loadResults();
    }
}

/**
 * Очистити всі результати
 */
function clearAllResults() {
    if (confirm('Ви впевнені, що хочете видалити ВСЮ історію результатів? Цю дію не можна скасувати!')) {
        storageService.clearAllResults();
        loadResults();
    }
}

// Ініціалізація
window.onload = initResultsPage;
