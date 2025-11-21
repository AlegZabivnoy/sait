import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import ManageQuizzes from './pages/ManageQuizzes';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import './css/main.css';

function App() {
    return (
        <QuizProvider>
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
        </QuizProvider>
    );
}

export default App;
