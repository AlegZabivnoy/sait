import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createQuiz, updateQuizAsync, fetchQuizzes } from '../store/quizzesSlice';
import type { Question, QuestionType, QuestionOption } from '../types';
import '../css/create.css';

const QUESTION_TYPES: Record<string, QuestionType> = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    TEXT: 'text'
};

function CreateQuiz() {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedQuiz = useAppSelector((state) => state.quizzes.selectedQuiz);
    const dispatch = useAppDispatch();
    
    const [quizName, setQuizName] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [originalQuizId, setOriginalQuizId] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('edit') === 'true' && selectedQuiz) {
            setEditMode(true);
            setQuizName(selectedQuiz.name);
            setQuizDescription(selectedQuiz.description || '');
            setQuestions(selectedQuiz.questions || []);
            setOriginalQuizId(selectedQuiz.id);
        } else {
            addNewQuestion();
        }
    }, [selectedQuiz, location]);

    const addNewQuestion = () => {
        const newQuestion: Question = {
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

    const updateQuestion = (questionId: number, field: keyof Question, value: string | QuestionType) => {
        setQuestions(questions.map((q: Question) => {
            if (q.id === questionId) {
                const updated = { ...q, [field]: value };
                
                // Якщо тип змінюється на TEXT, очищаємо опції
                if (field === 'type' && value === QUESTION_TYPES.TEXT) {
                    updated.options = [];
                }
                // Якщо тип змінюється з TEXT на інший, додаємо дефолтні опції
                else if (field === 'type' && q.type === QUESTION_TYPES.TEXT && value !== QUESTION_TYPES.TEXT) {
                    updated.options = [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false }
                    ];
                }
                
                return updated;
            }
            return q;
        }));
    };

    const addOption = (questionId: number) => {
        setQuestions(questions.map((q: Question) => 
            q.id === questionId 
                ? { ...q, options: [...q.options, { text: '', isCorrect: false }] }
                : q
        ));
    };

    const updateOption = (questionId: number, optionIndex: number, field: keyof QuestionOption, value: string | boolean) => {
        setQuestions(questions.map((q: Question) => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                
                // Якщо це поле isCorrect і тип питання SINGLE
                if (field === 'isCorrect' && q.type === QUESTION_TYPES.SINGLE && value === true) {
                    // Спочатку знімаємо всі позначки
                    newOptions.forEach((opt: QuestionOption) => opt.isCorrect = false);
                }
                
                newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeOption = (questionId: number, optionIndex: number) => {
        setQuestions(questions.map((q: Question) => {
            if (q.id === questionId && q.options.length > 2) {
                const newOptions = q.options.filter((_: QuestionOption, i: number) => i !== optionIndex);
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeQuestion = (questionId: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((q: Question) => q.id !== questionId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!quizName.trim() || !quizDescription.trim()) {
            alert('Заповніть назву та опис квізу');
            return;
        }

        if (questions.length === 0) {
            alert('Додайте хоча б одне питання');
            return;
        }

        // Валідація питань
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) {
                alert(`Заповніть текст питання ${i + 1}`);
                return;
            }

            if (q.type === QUESTION_TYPES.SINGLE || q.type === QUESTION_TYPES.MULTIPLE) {
                if (q.options.length < 2) {
                    alert(`Питання ${i + 1} повинно мати хоча б 2 варіанти відповіді`);
                    return;
                }

                const hasEmptyOption = q.options.some(opt => !opt.text.trim());
                if (hasEmptyOption) {
                    alert(`Заповніть всі варіанти відповіді для питання ${i + 1}`);
                    return;
                }

                const hasCorrectAnswer = q.options.some(opt => opt.isCorrect);
                if (!hasCorrectAnswer) {
                    alert(`Оберіть правильну відповідь для питання ${i + 1}`);
                    return;
                }
            }
        }

        const quizData = {
            name: quizName.trim(),
            description: quizDescription.trim(),
            questions: questions.map(q => {
                // Для текстових питань видаляємо опції
                if (q.type === QUESTION_TYPES.TEXT) {
                    return {
                        id: q.id,
                        text: q.text,
                        type: q.type,
                        correctAnswer: q.correctAnswer || '',
                        options: []
                    };
                }
                return q;
            })
        };

        try {
            if (editMode) {
                await dispatch(updateQuizAsync({ id: originalQuizId, quiz: quizData })).unwrap();
            } else {
                await dispatch(createQuiz(quizData)).unwrap();
            }
            
            // Перезавантажити список квізів після створення/оновлення
            await dispatch(fetchQuizzes()).unwrap();
            navigate('/manage');
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Помилка при збереженні квізу. Спробуйте ще раз.');
        }
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
                        rows={3}
                        required
                    />
                </div>

                <div className="questions-section">
                    <h2>Питання</h2>
                    <p className="question-count">Всього питань: {questions.length}</p>

                    {questions.map((question: Question, qIndex: number) => (
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

interface QuestionBlockProps {
    question: Question;
    questionNumber: number;
    onUpdate: (field: keyof Question, value: string | QuestionType) => void;
    onAddOption: () => void;
    onUpdateOption: (optionIndex: number, field: keyof QuestionOption, value: string | boolean) => void;
    onRemoveOption: (optionIndex: number) => void;
    onRemove: () => void;
    canRemove: boolean;
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
}: QuestionBlockProps) {
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
                    onChange={(e) => onUpdate('type', e.target.value as QuestionType)}
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
                    {question.options.map((option: QuestionOption, index: number) => (
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
                                <span>Правильна</span>
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
                        value={question.correctAnswer || ''}
                        onChange={(e) => onUpdate('correctAnswer', e.target.value)}
                        placeholder="Введіть правильну відповідь або ключові слова"
                        rows={3}
                    />
                </div>
            )}
        </div>
    );
}

export default CreateQuiz;
