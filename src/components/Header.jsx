import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <h1 className="site-title">Our first quiz site</h1>
                <nav className="header-nav">
                    <button onClick={() => window.location.href = '/results/index.html'} className="nav-btn">
                        Результати
                    </button>
                    <button onClick={() => window.location.href = '/manage/index.html'} className="nav-btn manage-btn">
                        Керування
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
