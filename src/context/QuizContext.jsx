import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within QuizProvider');
    }
    return context;
};

export const QuizProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [results, setResults] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        loadQuizzes();
        loadResults();
    }, []);

    const loadQuizzes = () => {
        try {
            const stored = localStorage.getItem('quizzes');
            setQuizzes(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error('Error loading quizzes:', error);
            setQuizzes([]);
        }
    };

    const loadResults = () => {
        try {
            const stored = localStorage.getItem('results');
            setResults(stored ? JSON.parse(stored) : []);
        } catch (error) {
            console.error('Error loading results:', error);
            setResults([]);
        }
    };

    const saveQuizzes = (newQuizzes) => {
        try {
            localStorage.setItem('quizzes', JSON.stringify(newQuizzes));
            setQuizzes(newQuizzes);
        } catch (error) {
            console.error('Error saving quizzes:', error);
        }
    };

    const saveResults = (newResults) => {
        try {
            localStorage.setItem('results', JSON.stringify(newResults));
            setResults(newResults);
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    const addQuiz = (quiz) => {
        const newQuizzes = [...quizzes, quiz];
        saveQuizzes(newQuizzes);
    };

    const updateQuiz = (oldName, updatedQuiz) => {
        const newQuizzes = quizzes.map(q => q.name === oldName ? updatedQuiz : q);
        saveQuizzes(newQuizzes);
    };

    const deleteQuiz = (quizName) => {
        const newQuizzes = quizzes.filter(q => q.name !== quizName);
        saveQuizzes(newQuizzes);
    };

    const addResult = (result) => {
        const newResults = [result, ...results];
        saveResults(newResults);
    };

    const deleteResult = (index) => {
        const newResults = results.filter((_, i) => i !== index);
        saveResults(newResults);
    };

    const clearAllResults = () => {
        saveResults([]);
    };

    const value = {
        quizzes,
        results,
        selectedQuiz,
        setSelectedQuiz,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        addResult,
        deleteResult,
        clearAllResults,
        loadQuizzes,
        loadResults
    };

    return (
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    );
};
