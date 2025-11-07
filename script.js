const questions = [
    {
        question: "Який улюблений предмет ",
        answers: ["Матаналіз", "ОП", "ЛААГ", "КДМ"]
    },
    {
        question: "Який ваш улюблений викладач",
        answers: ["Туганських Олександр Антонович", "Бойко Ірина Віталіївна", "Колосова Олена Петрівна", "Стаматієва Вікторія В'ячеславівна"]
    },
    {
        question: "Який найважкіший предмет для вас?",
        answers: ["Матаналіз", "АСД", "КДМ", "ЛААГ"]
    },

];

let currentQuestion = 0;
let userAnswers = [];

function initQuiz() {
    currentQuestion = 0;
    userAnswers = [];
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
    
    let resultsHTML = '<div class="result-summary">Дякуємо за проходження опитування!</div>';
     
    questions.forEach((question, index) => {
        const answerIndex = userAnswers[index];
        const answer = question.answers[answerIndex];
        
        resultsHTML += `
            <div class="result-item">
                <div class="result-question">${index + 1}. ${question.question}</div>
                <div class="result-answer">Ваша відповідь: ${answer}</div>
            </div>
        `;
    });
    
    resultContent.innerHTML = resultsHTML;
}

function restartQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    
    initQuiz();
}

window.onload = initQuiz;
