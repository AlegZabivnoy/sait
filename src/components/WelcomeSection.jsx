import React from 'react';

function WelcomeSection() {
    return (
        <section className="welcome-section">
            <h2>Система квізів</h2>
            <p className="welcome-text">
                Тут ви можете створювати, проходити та керувати своїми квізами.
            </p>
            <button 
                onClick={() => window.location.href = '/create/index.html'} 
                className="create-quiz-cta"
            >
                Створити новий квіз
            </button>
        </section>
    );
}

export default WelcomeSection;
