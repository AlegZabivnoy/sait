import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import QuizCard from './QuizCard';
import type { Quiz } from '../types';

function QuizzesSection() {
    const navigate = useNavigate();
    const quizzes = useAppSelector((state) => state.quizzes.quizzes);
    
    if (quizzes.length === 0) {
        return (
            <section className="quizzes-section">
                <h2 className="section-title">Доступні квізи</h2>
                <div className="empty-state-inline">
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
                {quizzes.map((quiz: Quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
        </section>
    );
}

export default QuizzesSection;
