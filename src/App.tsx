import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { fetchQuizzes } from './store/quizzesSlice';
import { fetchResults } from './store/resultsSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import ManageQuizzes from './pages/ManageQuizzes';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import './css/main.css';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Завантажуємо дані при старті
        dispatch(fetchQuizzes());
        dispatch(fetchResults());
    }, [dispatch]);

    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateQuiz />} />
                    <Route path="/manage" element={<ManageQuizzes />} />
                    <Route path="/quiz" element={<TakeQuiz />} />
                    <Route path="/results" element={<Results />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
