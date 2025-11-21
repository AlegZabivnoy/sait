import React from 'react';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import QuizzesSection from './components/QuizzesSection';
import Footer from './components/Footer';
import './css/main.css';
import './css/home.css';
import './css/quiz-card.css';

function App() {
    return (
        <>
            <Header />
            <div className="container main-container">
                <WelcomeSection />
                <QuizzesSection />
            </div>
            <Footer />
        </>
    );
}

export default App;
