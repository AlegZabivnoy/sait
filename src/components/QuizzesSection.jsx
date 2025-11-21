import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuizCard from './QuizCard';

function QuizzesSection() {
    const navigate = useNavigate();
    const { quizzes } = useQuiz();
    
    if (quizzes.length === 0) {
        return (
            <section className="quizzes-section">
                <h2 className="section-title">Доступні квізи</h2>
                <div className="empty-state">
                    <p>Поки немає доступних квізів.</p>
                    <button 
                        onClick={() => navigate('/create')} 
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
