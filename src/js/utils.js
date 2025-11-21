

(function() {
    'use strict';

    
    function escapeHtml(text) {
        // Створюємо тимчасовий div елемент
        const div = document.createElement('div');
        
        // textContent автоматично екранує всі HTML символи
        div.textContent = text || '';
        
        // innerHTML повертає екранований текст у форматі HTML
        return div.innerHTML;
    }

    // Експортуємо функцію у глобальний простір (потрібно для використання в інших модулях)
    window.escapeHtml = escapeHtml;
})();
