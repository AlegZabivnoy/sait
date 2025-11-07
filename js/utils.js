/**
 * utils.js - Спільні утилітні функції для всього проекту
 * 
 * Цей файл містить функції, які використовуються в різних модулях
 * для уникнення дублювання коду
 */

/**
 * Екранувати HTML для безпеки
 * 
 * Важлива функція для захисту від XSS (Cross-Site Scripting) атак!
 * Перетворює спеціальні символи HTML (<, >, &, ", ') у безпечні коди
 * 
 * Приклад: "<script>alert('hack')</script>" -> "&lt;script&gt;alert('hack')&lt;/script&gt;"
 * 
 * @param {string} text - Текст, який потрібно екранувати
 * @returns {string} - Безпечний текст для вставки в HTML
 * 
 * Навчальні концепції:
 * - Безпека веб-застосунків (XSS prevention)
 * - Використання textContent замість innerHTML для безпеки
 */
function escapeHtml(text) {
    // Створюємо тимчасовий div елемент
    const div = document.createElement('div');
    
    // textContent автоматично екранує всі HTML символи
    div.textContent = text || '';
    
    // innerHTML повертає екранований текст у форматі HTML
    return div.innerHTML;
}
