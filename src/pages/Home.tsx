import React from 'react';
import WelcomeSection from '../components/WelcomeSection';
import QuizzesSection from '../components/QuizzesSection';
import '../css/home.css';
import '../css/quiz-card.css';

function Home() {
    return (
        <div className="container main-container">
            <WelcomeSection />
            <QuizzesSection />
        </div>
    );
}

export default Home;
