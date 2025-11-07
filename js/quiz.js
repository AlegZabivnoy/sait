let questions = [];
let currentQuiz = null;
let currentQuestion = 0;
let userAnswers = [];

function initQuiz() {
    // Завантажуємо вибраний квіз з LocalStorage
    currentQuiz = storageService.getSelectedQuiz();
    
    if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        alert('Квіз не знайдено або він порожній!');
        window.location.href = '../index.html';
        return;
    }
    
    // Конвертуємо структуру даних для сумісності
    questions = currentQuiz.questions.map(q => ({
        question: q.text,
        answers: q.options.map(o => o.text)
    }));
    
    currentQuestion = 0;
    userAnswers = [];
    
    // Оновлюємо заголовок
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = currentQuiz.name;
    }
    
    showQuestion();
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const counterElement = document.getElementById('question-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    questionElement.textContent = questions[currentQuestion].question;
    
    answersElement.innerHTML = '';
    
    questions[currentQuestion].answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        
        if (userAnswers[currentQuestion] === index) {
            button.classList.add('selected');
        }
        
        answersElement.appendChild(button);
    });
    
    counterElement.textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
    
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'Завершити';
    } else {
        nextBtn.textContent = 'Далі';
    }
}

function selectAnswer(answerIndex) {
    userAnswers[currentQuestion] = answerIndex;
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, index) => {
        if (index === answerIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    if (userAnswers[currentQuestion] === undefined) {
        alert('Будь ласка, виберіть відповідь!');
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const resultContent = document.getElementById('result-content');
    
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    // Підраховуємо правильні відповіді
    let correctCount = 0;
    const resultDetails = [];
    
    currentQuiz.questions.forEach((question, index) => {
        const userAnswerIndex = userAnswers[index];
        const selectedOption = question.options[userAnswerIndex];
        const isCorrect = selectedOption.isCorrect;
        
        if (isCorrect) {
            correctCount++;
        }
        
        resultDetails.push({
            question: question.text,
            answer: selectedOption.text,
            isCorrect: isCorrect
        });
    });
    
    const score = correctCount;
    const total = currentQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    let resultsHTML = `
        <div class="result-summary">
            <h3>Дякуємо за проходження квізу!</h3>
            <p class="score">Ваш результат: ${score} з ${total} (${percentage}%)</p>
        </div>
    `;
    
    resultDetails.forEach((item, index) => {
        const statusClass = item.isCorrect ? 'correct' : 'incorrect';
        const statusIcon = item.isCorrect ? '✓' : '✗';
        
        resultsHTML += `
            <div class="result-item ${statusClass}">
                <div class="result-question">
                    <span class="question-number">${index + 1}.</span> ${item.question}
                </div>
                <div class="result-answer">
                    <span class="status-icon">${statusIcon}</span>
                    Ваша відповідь: ${item.answer}
                </div>
            </div>
        `;
    });
    
    resultContent.innerHTML = resultsHTML;
    
    // Зберігаємо результат в LocalStorage
    const result = {
        timestamp: new Date().toISOString(),
        quizName: currentQuiz.name,
        summary: `${score}/${total} (${percentage}%)`,
        answers: userAnswers.map(answerIndex => [answerIndex]),
        score: score
    };
    
    storageService.addResult(result);
}

function restartQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    
    initQuiz();
}

window.onload = initQuiz;
