import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

function Results() {
    const navigate = useNavigate();
    const { results, deleteResult, clearAllResults } = useQuiz();

    const handleClearAll = () => {
        if (window.confirm('Видалити ВСЮ історію результатів? Цю дію не можна скасувати!')) {
            clearAllResults();
        }
    };

    const handleDeleteOne = (index) => {
        if (window.confirm('Видалити цей результат?')) {
            deleteResult(index);
        }
    };

    const getStatusClass = (summary) => {
        const match = summary.match(/\((\d+)%\)/);
        if (!match) return 'average';
        const percentage = parseInt(match[1]);
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'poor';
    };

    const getStatusText = (summary) => {
        const match = summary.match(/\((\d+)%\)/);
        if (!match) return 'Невідомо';
        const percentage = parseInt(match[1]);
        if (percentage >= 80) return 'Відмінно!';
        if (percentage >= 60) return 'Добре';
        if (percentage >= 40) return 'Задовільно';
        return 'Потрібно покращити';
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container main-container">
            <div className="section-header">
                <h2 className="section-title-dark">Історія результатів</h2>
                {results.length > 0 && (
                    <button onClick={handleClearAll} className="clear-all-btn">
                        🗑️ Очистити всю історію
                    </button>
                )}
            </div>

            {results.length === 0 ? (
                <div className="empty-state">
                    <p>Ще немає пройдених квізів.</p>
                    <button onClick={() => navigate('/')} className="create-quiz-btn">
                        Пройти квіз
                    </button>
                </div>
            ) : (
                <div className="results-list">
                    {results.map((result, index) => (
                        <div key={index} className="result-card">
                            <div className="result-card-header">
                                <h3 className="result-quiz-name">{result.quizName}</h3>
                                <span className={`result-status ${getStatusClass(result.summary)}`}>
                                    {getStatusText(result.summary)}
                                </span>
                            </div>
                            <div className="result-card-body">
                                <p className="result-date">{formatDate(result.timestamp)}</p>
                                <p className="result-summary-text">
                                    <strong>Результат:</strong> {result.summary}
                                </p>
                            </div>
                            <div className="result-card-footer">
                                <button onClick={() => handleDeleteOne(index)} className="delete-result-btn">
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Results;
