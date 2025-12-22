# Backend Server - Quiz Application

REST API server для Quiz Application з MongoDB базою даних.

## Технології

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL база даних
- **Mongoose** - ODM для MongoDB

## API Endpoints

### Quizzes
- `GET /api/quizzes` - Всі квізи
- `GET /api/quizzes/:id` - Квіз за ID
- `POST /api/quizzes` - Створити квіз
- `PUT /api/quizzes/:id` - Оновити квіз
- `DELETE /api/quizzes/:id` - Видалити квіз

### Results
- `GET /api/results` - Всі результати
- `GET /api/results/:id` - Результат за ID
- `POST /api/results` - Зберегти результат
- `DELETE /api/results/:id` - Видалити результат
- `DELETE /api/results` - Видалити всі результати

## Встановлення

```bash
npm install
```

## Конфігурація

Створіть `.env` файл:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
NODE_ENV=development
```

## Запуск

```bash
# Development
npm run dev

# Production
npm start

# Seed database
npm run seed
```

## Структура

```
server/
├── models/       # Mongoose моделі
├── routes/       # API маршрути
├── server.js     # Express app
└── seed.js       # Заповнення БД
```
