import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="site-title">Our first quiz site</h1>
                <nav className="header-nav">
                    <button onClick={() => navigate('/results')} className="nav-btn">
                        Результати
                    </button>
                    <button onClick={() => navigate('/manage')} className="nav-btn manage-btn">
                        Керування
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
