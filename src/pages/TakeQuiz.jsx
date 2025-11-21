import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../css/quiz.css';

function TakeQuiz() {
    const navigate = useNavigate();
    const { selectedQuiz, addResult } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!selectedQuiz) {
            navigate('/');
            return;
        }
        setUserAnswers(new Array(selectedQuiz.questions.length).fill(null));
    }, [selectedQuiz, navigate]);

    if (!selectedQuiz) return null;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const totalQuestions = selectedQuiz.questions.length;

    const handleAnswer = (answer) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishQuiz = () => {
        let correctCount = 0;
        selectedQuiz.questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            
            if (question.type === 'single') {
                const correctOption = question.options.findIndex(opt => opt.isCorrect);
                if (userAnswer === correctOption) correctCount++;
            } else if (question.type === 'multiple') {
                const correctOptions = question.options
                    .map((opt, i) => opt.isCorrect ? i : -1)
                    .filter(i => i !== -1);
                const userSelected = userAnswer || [];
                if (JSON.stringify(correctOptions.sort()) === JSON.stringify(userSelected.sort())) {
                    correctCount++;
                }
            } else if (question.type === 'text') {
                if (userAnswer?.toLowerCase().includes(question.correctAnswer?.toLowerCase())) {
                    correctCount++;
                }
            }
        });

        setScore(correctCount);
        
        const result = {
            timestamp: new Date().toISOString(),
            quizName: selectedQuiz.name,
            summary: `${correctCount}/${totalQuestions} (${Math.round(correctCount / totalQuestions * 100)}%)`,
            answers: userAnswers,
            score: correctCount
        };
        
        addResult(result);
        setShowResults(true);
    };

    const handleExit = () => {
        if (window.confirm('Вийти без збереження результатів?')) {
            navigate('/');
        }
    };

    if (showResults) {
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <div className="container main-container">
                <div className="result-container">
                    <h1>Результати опитування</h1>
                    <div className="result-content">
                        <h2>{selectedQuiz.name}</h2>
                        <p className="result-score">
                            Правильних відповідей: {score} з {totalQuestions}
                        </p>
                        <p className="result-percentage">{percentage}%</p>
                        <div className="result-status" data-status={
                            percentage >= 80 ? 'excellent' :
                            percentage >= 60 ? 'good' :
                            percentage >= 40 ? 'average' : 'poor'
                        }>
                            {percentage >= 80 ? 'Відмінно!' :
                             percentage >= 60 ? 'Добре' :
                             percentage >= 40 ? 'Задовільно' : 'Потрібно покращити'}
                        </div>
                    </div>
                    <div className="result-actions">
                        <button onClick={() => navigate('/')} className="home-btn">
                            На головну
                        </button>
                        <button onClick={() => navigate('/results')} className="view-results-btn">
                            Переглянути всі результати
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="quiz-container">
                <div className="quiz-header">
                    <h1>{selectedQuiz.name}</h1>
                    <button onClick={handleExit} className="exit-quiz-btn">
                        ✖ Вийти
                    </button>
                </div>

                <div className="question-container">
                    <h2>{currentQuestion.text}</h2>
                    
                    {currentQuestion.type === 'text' ? (
                        <textarea
                            value={userAnswers[currentQuestionIndex] || ''}
                            onChange={(e) => handleAnswer(e.target.value)}
                            placeholder="Введіть вашу відповідь..."
                            rows="5"
                            className="text-answer"
                        />
                    ) : currentQuestion.type === 'single' ? (
                        <div className="answers-grid">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`answer-btn ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="answers-grid">
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className="checkbox-answer">
                                    <input
                                        type="checkbox"
                                        checked={(userAnswers[currentQuestionIndex] || []).includes(index)}
                                        onChange={(e) => {
                                            const current = userAnswers[currentQuestionIndex] || [];
                                            const newAnswer = e.target.checked
                                                ? [...current, index]
                                                : current.filter(i => i !== index);
                                            handleAnswer(newAnswer);
                                        }}
                                    />
                                    <span>{option.text}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="navigation">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="nav-btn"
                    >
                        Назад
                    </button>
                    <span className="question-counter">
                        {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                    <button onClick={handleNext} className="nav-btn">
                        {currentQuestionIndex === totalQuestions - 1 ? 'Завершити' : 'Далі'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TakeQuiz;
