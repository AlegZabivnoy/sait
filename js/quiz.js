

(function() {
    'use strict';

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

    // Типи питань
    const QUESTION_TYPES = {
        SINGLE: 'single',
        MULTIPLE: 'multiple',
        TEXT: 'text'
    };

    // Глобальні змінні стану
    let questions = [];
    let currentQuiz = null;
    let currentQuestion = 0;
    let userAnswers = []; // Для single: число, для multiple: масив чисел, для text: рядок

    
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

    
    function loadQuiz() {
        currentQuiz = storageService.getSelectedQuiz();
    
        if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
            throw new Error(MESSAGES.QUIZ_NOT_FOUND);
        }
    
        questions = convertQuizStructure(currentQuiz.questions);
    }

    
    function convertQuizStructure(quizQuestions) {
        return quizQuestions.map(q => ({
            question: q.text,
            type: q.type || QUESTION_TYPES.SINGLE,
            answers: q.options ? q.options.map(o => o.text) : [],
            correctAnswer: q.correctAnswer || ''
        }));
    }

    
    function resetQuizState() {
        currentQuestion = 0;
        userAnswers = [];
    }

    
    function updateTitle() {
        const titleElement = document.querySelector('h1');
        if (titleElement && currentQuiz) {
            titleElement.textContent = currentQuiz.name;
        }
    }

    
    function showQuestion() {
        try {
            const questionElement = getElement(DOM_ELEMENTS.QUESTION);
            const answersElement = getElement(DOM_ELEMENTS.ANSWERS);
            const counterElement = getElement(DOM_ELEMENTS.QUESTION_COUNTER);
            const prevBtn = getElement(DOM_ELEMENTS.PREV_BTN);
            const nextBtn = getElement(DOM_ELEMENTS.NEXT_BTN);

            const currentQuestionData = questions[currentQuestion];
        
            updateQuestionText(questionElement, currentQuestionData.question);
        
            if (currentQuestionData.type === QUESTION_TYPES.TEXT) {
                renderTextInput(answersElement);
            } else {
                renderAnswerButtons(answersElement, currentQuestionData.answers, currentQuestionData.type);
            }
        
            updateQuestionCounter(counterElement);
            updateNavigationButtons(prevBtn, nextBtn);
        } catch (error) {
            console.error('Помилка відображення питання:', error);
            showError(MESSAGES.ERROR_LOADING);
        }
    }

    
    function getElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Елемент з ID "${elementId}" не знайдено`);
        }
        return element;
    }

    
    function updateQuestionText(element, questionText) {
        element.textContent = questionText;
    }

    
    function renderTextInput(answersElement) {
        answersElement.innerHTML = '';
    
        const textarea = document.createElement('textarea');
        textarea.className = 'text-answer-input';
        textarea.placeholder = 'Введіть вашу відповідь...';
        textarea.rows = 5;
        textarea.style.width = '100%';
        textarea.style.padding = '1rem';
        textarea.style.borderRadius = '8px';
        textarea.style.border = '2px solid rgba(220, 38, 38, 0.3)';
        textarea.style.background = 'var(--bg-secondary)';
        textarea.style.color = 'var(--text-white)';
        textarea.style.fontSize = '1rem';
        textarea.style.fontFamily = 'inherit';
    
        // Заповнюємо попередню відповідь якщо є
        if (userAnswers[currentQuestion]) {
            textarea.value = userAnswers[currentQuestion];
        }
    
        textarea.addEventListener('input', (e) => {
            userAnswers[currentQuestion] = e.target.value;
        });
    
        answersElement.appendChild(textarea);
    }

    
    function renderAnswerButtons(answersElement, answers, questionType = QUESTION_TYPES.SINGLE) {
        answersElement.innerHTML = '';
    
        answers.forEach((answer, index) => {
            const button = createAnswerButton(answer, index, questionType);
            answersElement.appendChild(button);
        });
    }

    
    function createAnswerButton(answerText, index, questionType = QUESTION_TYPES.SINGLE) {
        const button = document.createElement('button');
        button.className = CSS_CLASSES.ANSWER_BTN;
        button.textContent = answerText;
        button.onclick = () => selectAnswer(index);
    
        // Для одиночної відповіді
        if (questionType === QUESTION_TYPES.SINGLE) {
            if (userAnswers[currentQuestion] === index) {
                button.classList.add(CSS_CLASSES.SELECTED);
            }
        } 
        // Для множинного вибору
        else if (questionType === QUESTION_TYPES.MULTIPLE) {
            const currentAnswers = userAnswers[currentQuestion] || [];
            if (currentAnswers.includes(index)) {
                button.classList.add(CSS_CLASSES.SELECTED);
            }
        }
    
        return button;
    }

    
    function updateQuestionCounter(counterElement) {
        counterElement.textContent = `Питання ${currentQuestion + 1} з ${questions.length}`;
    }

    
    function updateNavigationButtons(prevBtn, nextBtn) {
        prevBtn.disabled = isFirstQuestion();
        nextBtn.textContent = isLastQuestion() ? BUTTON_TEXT.FINISH : BUTTON_TEXT.NEXT;
    }

    
    function isFirstQuestion() {
        return currentQuestion === 0;
    }

    
    function isLastQuestion() {
        return currentQuestion === questions.length - 1;
    }

    
    function selectAnswer(answerIndex) {
        const currentQuestionData = questions[currentQuestion];
    
        if (currentQuestionData.type === QUESTION_TYPES.MULTIPLE) {
        // Множинний вибір - додаємо/видаляємо з масиву
            if (!Array.isArray(userAnswers[currentQuestion])) {
                userAnswers[currentQuestion] = [];
            }
        
            const currentAnswers = userAnswers[currentQuestion];
            const indexPos = currentAnswers.indexOf(answerIndex);
        
            if (indexPos > -1) {
                currentAnswers.splice(indexPos, 1);
            } else {
                currentAnswers.push(answerIndex);
            }
        
            updateAnswerButtonsSelection(currentAnswers, currentQuestionData.type);
        } else {
        // Одиночний вибір
            userAnswers[currentQuestion] = answerIndex;
            updateAnswerButtonsSelection(answerIndex, currentQuestionData.type);
        }
    }

    
    function updateAnswerButtonsSelection(selected, questionType = QUESTION_TYPES.SINGLE) {
        const buttons = document.querySelectorAll(`.${CSS_CLASSES.ANSWER_BTN}`);
    
        if (questionType === QUESTION_TYPES.MULTIPLE) {
        // Множинний вибір
            const selectedArray = Array.isArray(selected) ? selected : [];
            buttons.forEach((btn, index) => {
                if (selectedArray.includes(index)) {
                    btn.classList.add(CSS_CLASSES.SELECTED);
                } else {
                    btn.classList.remove(CSS_CLASSES.SELECTED);
                }
            });
        } else {
        // Одиночний вибір
            buttons.forEach((btn, index) => {
                if (index === selected) {
                    btn.classList.add(CSS_CLASSES.SELECTED);
                } else {
                    btn.classList.remove(CSS_CLASSES.SELECTED);
                }
            });
        }
    }

    
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

    
    function previousQuestion() {
        if (!isFirstQuestion()) {
            currentQuestion--;
            showQuestion();
        }
    }

    
    function hasAnswerSelected() {
        const answer = userAnswers[currentQuestion];
        const currentQuestionData = questions[currentQuestion];
    
        if (currentQuestionData.type === QUESTION_TYPES.TEXT) {
        // Для текстових питань перевіряємо чи є текст
            return answer !== undefined && answer.trim().length > 0;
        } else if (currentQuestionData.type === QUESTION_TYPES.MULTIPLE) {
        // Для множинного вибору перевіряємо чи є хоча б одна відповідь
            return Array.isArray(answer) && answer.length > 0;
        } else {
        // Для одиночного вибору
            return answer !== undefined;
        }
    }

    
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

    
    function hideQuizContainer(quizContainer, resultContainer) {
        quizContainer.style.display = DISPLAY.NONE;
        resultContainer.style.display = DISPLAY.BLOCK;
    }

    
    function calculateResults() {
        let correctCount = 0;
        const details = [];
    
        currentQuiz.questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            let isCorrect = false;
            let answerText = '';
        
            if (question.type === QUESTION_TYPES.TEXT) {
            // Текстові питання - перевіряємо точну відповідність
                answerText = userAnswer || '';
            
                // Якщо є правильна відповідь для перевірки
                if (question.correctAnswer && question.correctAnswer.trim().length > 0) {
                    const userAnswerLower = answerText.toLowerCase().trim();
                    const correctAnswerLower = question.correctAnswer.toLowerCase().trim();
                
                    // Перевіряємо точну відповідність (без часткового співпадіння)
                    isCorrect = userAnswerLower === correctAnswerLower;
                
                    if (isCorrect) correctCount++;
                } else {
                // Якщо немає правильної відповіді, вважаємо що відповідь не перевіряється
                    isCorrect = null;
                }
            } else if (question.type === QUESTION_TYPES.MULTIPLE) {
            // Множинний вибір
                const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [];
                answerText = selectedIndices.map(idx => question.options[idx]?.text).filter(Boolean).join(', ');
            
                // Перевіряємо чи всі вибрані відповіді правильні і чи вибрані всі правильні
                const correctIndices = question.options
                    .map((opt, idx) => opt.isCorrect ? idx : -1)
                    .filter(idx => idx !== -1);
            
                isCorrect = selectedIndices.length === correctIndices.length &&
                        selectedIndices.every(idx => correctIndices.includes(idx));
            
                if (isCorrect) correctCount++;
            } else {
            // Одиночний вибір
                const selectedOption = question.options[userAnswer];
                if (selectedOption) {
                    answerText = selectedOption.text;
                    isCorrect = selectedOption.isCorrect;
                    if (isCorrect) correctCount++;
                }
            }
        
            details.push({
                question: question.text,
                answer: answerText,
                isCorrect: isCorrect,
                type: question.type
            });
        });
    
        // Підраховуємо тільки питання, які можна оцінити (isCorrect !== null)
        const gradableQuestions = details.filter(d => d.isCorrect !== null).length;
        const total = gradableQuestions > 0 ? gradableQuestions : currentQuiz.questions.length;
        const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
        return {
            score: correctCount,
            total: total,
            percentage: percentage,
            details: details
        };
    }

    
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

    
    function generateResultItemHTML(item, index) {
    // Для текстових питань без правильної відповіді не показуємо статус правильності
        if (item.type === QUESTION_TYPES.TEXT && item.isCorrect === null) {
            return `
            <div class="${CSS_CLASSES.RESULT_ITEM}">
                <div class="${CSS_CLASSES.RESULT_QUESTION}">
                    <span class="${CSS_CLASSES.QUESTION_NUMBER}">${index + 1}.</span> ${escapeHtml(item.question)}
                </div>
                <div class="${CSS_CLASSES.RESULT_ANSWER}">
                    <strong>Ваша відповідь:</strong> ${escapeHtml(item.answer)}
                </div>
            </div>
        `;
        }
    
        const statusClass = item.isCorrect ? CSS_CLASSES.CORRECT : CSS_CLASSES.INCORRECT;
        const statusIcon = item.isCorrect ? SYMBOLS.CORRECT : SYMBOLS.INCORRECT;
    
        return `
        <div class="${CSS_CLASSES.RESULT_ITEM} ${statusClass}">
            <div class="${CSS_CLASSES.RESULT_QUESTION}">
                <span class="${CSS_CLASSES.QUESTION_NUMBER}">${index + 1}.</span> ${escapeHtml(item.question)}
            </div>
            <div class="${CSS_CLASSES.RESULT_ANSWER}">
                <span class="${CSS_CLASSES.STATUS_ICON}">${statusIcon}</span>
                Ваша відповідь: ${escapeHtml(item.answer)}
            </div>
        </div>
    `;
    }

    
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

    
    function exitQuiz() {
        const confirmExit = confirm('Ви впевнені, що хочете вийти? Прогрес не буде збережено.');
        if (confirmExit) {
            navigateToHome();
        }
    }

    
    function navigateToHome() {
        window.location.href = URLS.HOME;
    }

    
    function showError(message) {
        alert(message);
    }

    
    window.addEventListener('DOMContentLoaded', initQuiz);

    // Експортуємо функції для використання з HTML
    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;
    window.restartQuiz = restartQuiz;
    window.exitQuiz = exitQuiz;

})();
