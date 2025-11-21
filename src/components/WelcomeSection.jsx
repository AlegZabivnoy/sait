import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeSection() {
    const navigate = useNavigate();
    
    return (
        <section className="welcome-section">
            <h2>Система квізів</h2>
            <p className="welcome-text">
                Тут ви можете створювати, проходити та керувати своїми квізами.
            </p>
            <button 
                onClick={() => navigate('/create')} 
                className="create-quiz-cta"
            >
                Створити новий квіз
            </button>
        </section>
    );
}

export default WelcomeSection;
