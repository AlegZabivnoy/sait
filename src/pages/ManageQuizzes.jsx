import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../css/manage.css';

function ManageQuizzes() {
    const navigate = useNavigate();
    const { quizzes, deleteQuiz, setSelectedQuiz } = useQuiz();

    const handleEdit = (quiz) => {
        setSelectedQuiz(quiz);
        navigate('/create?edit=true');
    };

    const handleDelete = (quizName) => {
        if (window.confirm(`Видалити квіз "${quizName}"?`)) {
            deleteQuiz(quizName);
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
                    {quizzes.map((quiz, index) => (
                        <div key={index} className="quiz-manage-card">
                            <div className="quiz-manage-header">
                                <h3>{quiz.name}</h3>
                                <div className="quiz-actions">
                                    <button onClick={() => handleEdit(quiz)} className="edit-btn">
                                        ✏️ Редагувати
                                    </button>
                                    <button onClick={() => handleDelete(quiz.name)} className="delete-btn">
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
