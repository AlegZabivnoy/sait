import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';

function QuizzesSection() {
    const [quizzes, setQuizzes] = useState([]);
    
    useEffect(() => {
        const loadedQuizzes = window.storageService.getAllQuizzes();
        setQuizzes(loadedQuizzes || []);
    }, []);
    
    if (quizzes.length === 0) {
        return (
            <section className="quizzes-section">
                <h2 className="section-title">Доступні квізи</h2>
                <div className="empty-state">
                    <p>Поки немає доступних квізів.</p>
                    <button 
                        onClick={() => window.location.href = '/create/index.html'} 
                        className="create-quiz-btn"
                    >
                        Створити перший квіз
                    </button>
                </div>
            </section>
        );
    }
    
    return (
        <section className="quizzes-section">
            <h2 className="section-title">Доступні квізи</h2>
            <div className="quiz-grid">
                {quizzes.map((quiz, index) => (
                    <QuizCard key={index} quiz={quiz} />
                ))}
            </div>
        </section>
    );
}

export default QuizzesSection;
