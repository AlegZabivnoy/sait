import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../css/create.css';

const QUESTION_TYPES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    TEXT: 'text'
};

function CreateQuiz() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addQuiz, updateQuiz, selectedQuiz, setSelectedQuiz } = useQuiz();
    
    const [quizName, setQuizName] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [originalQuizName, setOriginalQuizName] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('edit') === 'true' && selectedQuiz) {
            setEditMode(true);
            setQuizName(selectedQuiz.name);
            setQuizDescription(selectedQuiz.description);
            setQuestions(selectedQuiz.questions || []);
            setOriginalQuizName(selectedQuiz.name);
        } else {
            addNewQuestion();
        }
    }, [selectedQuiz, location]);

    const addNewQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            text: '',
            type: QUESTION_TYPES.SINGLE,
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            correctAnswer: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (questionId, field, value) => {
        setQuestions(questions.map(q => 
            q.id === questionId ? { ...q, [field]: value } : q
        ));
    };

    const addOption = (questionId) => {
        setQuestions(questions.map(q => 
            q.id === questionId 
                ? { ...q, options: [...q.options, { text: '', isCorrect: false }] }
                : q
        ));
    };

    const updateOption = (questionId, optionIndex, field, value) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                
                // Якщо це поле isCorrect і тип питання SINGLE
                if (field === 'isCorrect' && q.type === QUESTION_TYPES.SINGLE && value === true) {
                    // Спочатку знімаємо всі позначки
                    newOptions.forEach(opt => opt.isCorrect = false);
                }
                
                newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeOption = (questionId, optionIndex) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length > 2) {
                const newOptions = q.options.filter((_, i) => i !== optionIndex);
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeQuestion = (questionId) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== questionId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!quizName.trim() || !quizDescription.trim()) {
            alert('Заповніть назву та опис квізу');
            return;
        }

        if (questions.length === 0) {
            alert('Додайте хоча б одне питання');
            return;
        }

        const quiz = {
            name: quizName.trim(),
            description: quizDescription.trim(),
            questions: questions
        };

        if (editMode) {
            updateQuiz(originalQuizName, quiz);
        } else {
            addQuiz(quiz);
        }

        navigate('/manage');
    };

    return (
        <div className="container main-container">
            <header className="page-header">
                <h1>{editMode ? 'Редагування квізу' : 'Створення нового квізу'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="quiz-form">
                <div className="form-group">
                    <label>Назва квізу</label>
                    <input
                        type="text"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        placeholder="Наприклад: Математика для початківців"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Опис квізу</label>
                    <textarea
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        placeholder="Короткий опис квізу..."
                        rows="3"
                        required
                    />
                </div>

                <div className="questions-section">
                    <h2>Питання</h2>
                    <p className="question-count">Всього питань: {questions.length}</p>

                    {questions.map((question, qIndex) => (
                        <QuestionBlock
                            key={question.id}
                            question={question}
                            questionNumber={qIndex + 1}
                            onUpdate={(field, value) => updateQuestion(question.id, field, value)}
                            onAddOption={() => addOption(question.id)}
                            onUpdateOption={(optionIndex, field, value) => 
                                updateOption(question.id, optionIndex, field, value)
                            }
                            onRemoveOption={(optionIndex) => removeOption(question.id, optionIndex)}
                            onRemove={() => removeQuestion(question.id)}
                            canRemove={questions.length > 1}
                        />
                    ))}

                    <button type="button" onClick={addNewQuestion} className="add-question-btn">
                        + Додати питання
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn">
                        {editMode ? 'Зберегти зміни' : 'Зберегти квіз'}
                    </button>
                    <button type="button" onClick={() => navigate('/manage')} className="cancel-btn">
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}

function QuestionBlock({ 
    question, 
    questionNumber, 
    onUpdate, 
    onAddOption, 
    onUpdateOption, 
    onRemoveOption, 
    onRemove,
    canRemove 
}) {
    return (
        <div className="question-block">
            <div className="question-header">
                <h3>Питання {questionNumber}</h3>
                {canRemove && (
                    <button type="button" onClick={onRemove} className="remove-question-btn">
                        ✖ Видалити питання
                    </button>
                )}
            </div>

            <div className="form-group">
                <label>Текст питання</label>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => onUpdate('text', e.target.value)}
                    placeholder="Введіть питання"
                    required
                />
            </div>

            <div className="form-group">
                <label>Тип питання</label>
                <select
                    value={question.type}
                    onChange={(e) => onUpdate('type', e.target.value)}
                    className="question-type"
                >
                    <option value={QUESTION_TYPES.SINGLE}>Одна правильна відповідь</option>
                    <option value={QUESTION_TYPES.MULTIPLE}>Кілька правильних відповідей</option>
                    <option value={QUESTION_TYPES.TEXT}>Розгорнута відповідь</option>
                </select>
            </div>

            {question.type !== QUESTION_TYPES.TEXT ? (
                <div className="options-section">
                    <label>Варіанти відповідей</label>
                    {question.options.map((option, index) => (
                        <div key={index} className="option-item">
                            <span className="option-number">{index + 1}</span>
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => onUpdateOption(index, 'text', e.target.value)}
                                placeholder="Текст варіанту"
                                required
                            />
                            <label className="checkbox-label">
                                <input
                                    type={question.type === QUESTION_TYPES.SINGLE ? 'radio' : 'checkbox'}
                                    name={question.type === QUESTION_TYPES.SINGLE ? `question-${question.id}` : undefined}
                                    checked={option.isCorrect}
                                    onChange={(e) => onUpdateOption(index, 'isCorrect', e.target.checked)}
                                />
                                Правильна
                            </label>
                            {question.options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveOption(index)}
                                    className="remove-option-btn"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={onAddOption} className="add-option-btn">
                        + Додати варіант
                    </button>
                </div>
            ) : (
                <div className="form-group">
                    <label>Правильна відповідь (для перевірки)</label>
                    <textarea
                        value={question.correctAnswer}
                        onChange={(e) => onUpdate('correctAnswer', e.target.value)}
                        placeholder="Введіть правильну відповідь або ключові слова"
                        rows="3"
                    />
                </div>
            )}
        </div>
    );
}

export default CreateQuiz;
