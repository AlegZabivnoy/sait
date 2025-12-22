# 🚀 BACKEND INTEGRATION GUIDE

## 📦 Що додано до проекту

### Backend (Node.js + Express + MongoDB)

**Структура backend:**
```
server/
├── models/           # Mongoose моделі
│   ├── Quiz.js      # Модель квізу
│   └── Result.js    # Модель результату
├── routes/          # API маршрути
│   ├── quizzes.js   # CRUD для квізів
│   └── results.js   # CRUD для результатів
├── server.js        # Express сервер
├── seed.js          # Заповнення БД тестовими даними
├── package.json     # Залежності
├── .env.example     # Приклад конфігурації
└── .gitignore
```

**Frontend оновлення:**
```
src/
├── services/              # API сервіси
│   ├── api.ts            # Базовий API клієнт
│   ├── quizService.ts    # Сервіс для квізів
│   └── resultService.ts  # Сервіс для результатів
└── store/                # Оновлені Redux слайси
    ├── quizzesSlice.ts   # Async thunks для квізів
    └── resultsSlice.ts   # Async thunks для результатів
```

---

## 🛠 Налаштування і запуск

### 1. Встановлення MongoDB

**Windows:**
```powershell
# Завантажте MongoDB Community Server з офіційного сайту
# https://www.mongodb.com/try/download/community

# Або через chocolatey:
choco install mongodb

# Запустіть MongoDB:
mongod
```

**Alternative - MongoDB Atlas (Cloud):**
1. Створіть безкоштовний акаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Створіть кластер
3. Отримайте connection string
4. Використайте його в `.env`

### 2. Налаштування Backend

```powershell
# Перейдіть в папку server
cd server

# Встановіть залежності
npm install

# Створіть файл .env (скопіюйте з .env.example)
copy .env.example .env

# Відредагуйте .env файл:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/quiz-app
# NODE_ENV=development
```

### 3. Заповнення БД тестовими даними

```powershell
# В папці server:
npm run seed
```

Ви побачите:
```
🌱 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️  Clearing existing quizzes...
📝 Creating sample quizzes...
✅ Successfully created 2 quizzes:
   - JavaScript Basics (3 questions)
   - React Fundamentals (2 questions)
✅ Database seeded successfully!
```

### 4. Запуск Backend сервера

```powershell
# Development режим (з автоперезапуском):
npm run dev

# Production режим:
npm start
```

Сервер запуститься на `http://localhost:5000`

### 5. Налаштування Frontend

```powershell
# В корені проекту (не в server/):
# Додайте змінну оточення для API URL
```

Створіть файл `.env` в корені проекту:
```
VITE_API_URL=http://localhost:5000/api
```

### 6. Запуск Frontend

```powershell
# В корені проекту:
npm run dev
```

Frontend запуститься на `http://localhost:3000`

---

## 🌐 API Endpoints

### Quizzes API

| Method | Endpoint | Опис | Body |
|--------|----------|------|------|
| GET | `/api/quizzes` | Отримати всі квізи | - |
| GET | `/api/quizzes/:id` | Отримати квіз за ID | - |
| POST | `/api/quizzes` | Створити новий квіз | Quiz object |
| PUT | `/api/quizzes/:id` | Оновити квіз | Quiz object |
| DELETE | `/api/quizzes/:id` | Видалити квіз | - |

### Results API

| Method | Endpoint | Опис | Body |
|--------|----------|------|------|
| GET | `/api/results` | Отримати всі результати | - |
| GET | `/api/results/:id` | Отримати результат за ID | - |
| POST | `/api/results` | Зберегти новий результат | Result object |
| DELETE | `/api/results/:id` | Видалити результат | - |
| DELETE | `/api/results` | Видалити всі результати | - |

### Health Check

```
GET /api/health
```

Відповідь:
```json
{
  "status": "ok",
  "message": "Quiz API Server is running",
  "timestamp": "2025-12-22T10:30:00.000Z"
}
```

---

## 📝 Приклади використання API

### Створення квізу

```javascript
POST /api/quizzes
Content-Type: application/json

{
  "name": "My New Quiz",
  "description": "Test your knowledge",
  "questions": [
    {
      "id": 1,
      "text": "What is 2+2?",
      "type": "single",
      "options": [
        { "text": "3", "isCorrect": false },
        { "text": "4", "isCorrect": true },
        { "text": "5", "isCorrect": false }
      ]
    }
  ]
}
```

### Збереження результату

```javascript
POST /api/results
Content-Type: application/json

{
  "quizId": "676834a6e1234567890abcde",
  "quizName": "JavaScript Basics",
  "score": 8,
  "totalQuestions": 10,
  "answers": [...]
}
```

---

## 🔄 Зміни в Redux

### Нові Async Thunks

**quizzesSlice.ts:**
- `fetchQuizzes()` - завантажити квізи з API
- `createQuiz(quiz)` - створити новий квіз
- `updateQuizAsync({ id, quiz })` - оновити квіз
- `deleteQuizAsync(id)` - видалити квіз

**resultsSlice.ts:**
- `fetchResults()` - завантажити результати з API
- `createResult(result)` - зберегти результат
- `deleteResultAsync(id)` - видалити результат
- `deleteAllResultsAsync()` - видалити всі результати

### Використання в компонентах

**Завантаження квізів:**
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizzes } from '../store/quizzesSlice';

function Home() {
  const dispatch = useAppDispatch();
  const { quizzes, loading, error } = useAppSelector(state => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render quizzes */}</div>;
}
```

**Створення квізу:**
```typescript
import { createQuiz } from '../store/quizzesSlice';

const handleSubmit = async () => {
  await dispatch(createQuiz({
    name: quizName,
    description: quizDescription,
    questions: questions
  }));
  navigate('/');
};
```

---

## ✅ Переваги Backend інтеграції

### 1. **Централізоване зберігання**
- Дані зберігаються на сервері
- Доступ з будь-якого пристрою
- Немає обмежень localStorage (5-10MB)

### 2. **Багатокористувацький режим**
- Спільний доступ до квізів
- Можливість додати автентифікацію
- Статистика по всіх користувачах

### 3. **Валідація на сервері**
- express-validator для перевірки даних
- Mongoose схеми з валідацією
- Захист від некоректних даних

### 4. **Масштабованість**
- MongoDB для великих обсягів даних
- Можливість додати кешування (Redis)
- Горизонтальне масштабування

### 5. **Додаткові можливості**
- Пошук та фільтрація на сервері
- Пагінація для великих списків
- Статистика та аналітика
- Експорт даних

---

## 🔒 Безпека

### Поточні заходи:
- CORS налаштований
- express-validator для валідації
- Mongoose schema validation
- Error handling middleware

### Майбутні покращення:
- [ ] JWT автентифікація
- [ ] Rate limiting
- [ ] Helmet.js для HTTP headers
- [ ] Input sanitization
- [ ] HTTPS в production

---

## 🧪 Тестування API

### Використовуючи curl:

```powershell
# Health check
curl http://localhost:5000/api/health

# Отримати всі квізи
curl http://localhost:5000/api/quizzes

# Отримати квіз за ID
curl http://localhost:5000/api/quizzes/676834a6e1234567890abcde

# Створити квіз
curl -X POST http://localhost:5000/api/quizzes `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test Quiz\",\"questions\":[...]}'
```

### Використовуючи Postman або Thunder Client:
1. Встановіть розширення для VS Code
2. Імпортуйте колекцію запитів
3. Тестуйте API endpoints

---

## 📊 MongoDB структура

### Quiz Collection
```javascript
{
  _id: ObjectId("..."),
  name: "JavaScript Basics",
  description: "Test your knowledge...",
  questions: [
    {
      id: 1,
      text: "What is...?",
      type: "single",
      options: [
        { text: "Answer 1", isCorrect: false },
        { text: "Answer 2", isCorrect: true }
      ]
    }
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Result Collection
```javascript
{
  _id: ObjectId("..."),
  quizId: ObjectId("..."),
  quizName: "JavaScript Basics",
  score: 8,
  totalQuestions: 10,
  date: ISODate("..."),
  answers: [...]
}
```

---

## 🚀 Розгортання (Production)

### Backend на Heroku:
```powershell
# Встановіть Heroku CLI
# Створіть Heroku app
heroku create quiz-app-api

# Додайте MongoDB Atlas
heroku addons:create mongolab

# Deploy
git subtree push --prefix server heroku main
```

### Backend на Render/Railway:
1. Підключіть GitHub репозиторій
2. Вкажіть папку `server`
3. Додайте змінні оточення
4. Deploy автоматично

### Frontend на Vercel/Netlify:
1. Підключіть GitHub репозиторій
2. Вкажіть build command: `npm run build`
3. Додайте `VITE_API_URL` в змінні оточення
4. Deploy

---

## 🎓 Для захисту проекту

### Ключові моменти:

**1. Архітектура:**
- RESTful API дизайн
- MVC pattern на backend
- Redux для state management
- Розділення frontend/backend

**2. Технології:**
- Express.js - швидкий мінімалістичний фреймворк
- MongoDB - NoSQL база для гнучких схем
- Mongoose - ODM для валідації та схем
- Async/await для асинхронного коду

**3. Best Practices:**
- Валідація на клієнті і сервері
- Error handling
- CORS для безпеки
- Environment variables для конфігурації
- Модульна структура коду

**4. Можливості розширення:**
- Автентифікація користувачів
- Ролі (admin, user)
- Соціальний функціонал
- Real-time оновлення (WebSockets)
- Статистика та аналітика

---

## 📚 Додаткові ресурси

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Redux Async Thunks](https://redux-toolkit.js.org/api/createAsyncThunk)

---

## ✨ Готово!

Тепер ваш проект має повноцінний backend з:
- ✅ REST API
- ✅ MongoDB база даних
- ✅ Валідація даних
- ✅ Error handling
- ✅ CORS підтримка
- ✅ Асинхронні Redux thunks
- ✅ TypeScript типізація

**Проект готовий до демонстрації на екзамені! 🚀**
