import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setSelectedQuiz } from '../store/quizzesSlice';
import { Quiz } from '../types';

interface QuizCardProps {
    quiz: Quiz;
}

function QuizCard({ quiz }: QuizCardProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const questionsCount = quiz.questions ? quiz.questions.length : 0;
    
    const handleStartQuiz = () => {
        dispatch(setSelectedQuiz(quiz));
        navigate('/quiz');
    };
    
    return (
        <div className="quiz-card">
            <div className="quiz-card-header">
                <h3 className="quiz-name">{quiz.name}</h3>
            </div>
            <div className="quiz-card-body">
                <p className="quiz-description">{quiz.name}</p>
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
