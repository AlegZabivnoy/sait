import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteResultAsync, deleteAllResultsAsync } from '../store/resultsSlice';
import type { QuizResult } from '../types';
import '../css/home.css';
import '../css/results.css';

function Results() {
    const navigate = useNavigate();
    const results = useAppSelector((state) => state.results.results);
    const dispatch = useAppDispatch();

    const handleClearAll = () => {
        if (window.confirm('Видалити ВСЮ історію результатів? Цю дію не можна скасувати!')) {
            dispatch(deleteAllResultsAsync());
        }
    };

    const handleDeleteOne = (id: string) => {
        if (window.confirm('Видалити цей результат?')) {
            dispatch(deleteResultAsync(id));
        }
    };

    const getStatusClass = (score: number, total: number): string => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'average';
        return 'poor';
    };

    const getStatusText = (score: number, total: number): string => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'Відмінно!';
        if (percentage >= 60) return 'Добре';
        if (percentage >= 40) return 'Задовільно';
        return 'Потрібно покращити';
    };

    const formatDate = (timestamp: string): string => {
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
                    {results.map((result: QuizResult) => (
                        <div key={result.id} className="result-card">
                            <div className="result-card-header">
                                <h3 className="result-quiz-name">{result.quizName}</h3>
                                <span className={`result-status ${getStatusClass(result.score, result.totalQuestions)}`}>
                                    {getStatusText(result.score, result.totalQuestions)}
                                </span>
                            </div>
                            <div className="result-card-body">
                                <p className="result-date">{formatDate(result.date)}</p>
                                <p className="result-summary-text">
                                    <strong>Результат:</strong> {result.score}/{result.totalQuestions} 
                                    ({Math.round((result.score / result.totalQuestions) * 100)}%)
                                </p>
                            </div>
                            <div className="result-card-footer">
                                <button onClick={() => handleDeleteOne(result.id)} className="delete-result-btn">
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
