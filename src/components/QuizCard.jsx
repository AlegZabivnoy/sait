import React from 'react';

function QuizCard({ quiz }) {
    const questionsCount = quiz.questions ? quiz.questions.length : 0;
    
    const handleStartQuiz = () => {
        window.storageService.setSelectedQuiz(quiz);
        window.location.href = '/quiz/index.html';
    };
    
    return (
        <div className="quiz-card">
            <div className="quiz-card-header">
                <h3 className="quiz-name">{quiz.name}</h3>
            </div>
            <div className="quiz-card-body">
                <p className="quiz-description">{quiz.description}</p>
                <p className="quiz-questions-count">
                    Питань: {questionsCount}
                </p>
            </div>
            <div className="quiz-card-footer">
                <button onClick={handleStartQuiz} className="go-to-quiz-btn">
                    Почати квіз
                </button>
            </div>
        </div>
    );
}

export default QuizCard;
