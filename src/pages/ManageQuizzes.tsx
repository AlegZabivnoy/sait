import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteQuiz, setSelectedQuiz } from '../store/quizzesSlice';
import { Quiz } from '../types';
import '../css/manage.css';

function ManageQuizzes() {
    const navigate = useNavigate();
    const quizzes = useAppSelector((state) => state.quizzes.quizzes);
    const dispatch = useAppDispatch();

    const handleEdit = (quiz: Quiz) => {
        dispatch(setSelectedQuiz(quiz));
        navigate('/create?edit=true');
    };

    const handleDelete = (quizId: string) => {
        const quiz = quizzes.find((q: Quiz) => q.id === quizId);
        if (quiz && window.confirm(`Видалити квіз "${quiz.name}"?`)) {
            dispatch(deleteQuiz(quizId));
        }
    };

    return (
        <div className="container main-container">
            <div className="manage-header">
                <h1>Управління квізами</h1>
                <button onClick={() => navigate('/create')} className="create-new-btn">
                    + Створити новий квіз
                </button>
            </div>

            {quizzes.length === 0 ? (
                <div className="empty-state">
                    <p>Немає створених квізів.</p>
                    <button onClick={() => navigate('/create')} className="create-quiz-btn">
                        Створити перший квіз
                    </button>
                </div>
            ) : (
                <div className="quizzes-list">
                    {quizzes.map((quiz: Quiz) => (
                        <div key={quiz.id} className="quiz-manage-card">
                            <div className="quiz-manage-header">
                                <h3>{quiz.name}</h3>
                                <div className="quiz-actions">
                                    <button onClick={() => handleEdit(quiz)} className="edit-btn">
                                        ✏️ Редагувати
                                    </button>
                                    <button onClick={() => handleDelete(quiz.id)} className="delete-btn">
                                        🗑️ Видалити
                                    </button>
                                </div>
                            </div>
                            <p className="quiz-description">{quiz.description}</p>
                            <p className="quiz-info">Питань: {quiz.questions?.length || 0}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageQuizzes;
