# Quiz Application - Full Stack React + Node.js

Повноцінний Full Stack додаток для створення та проходження квізів з **React 19**, **TypeScript**, **Redux Toolkit**, **Node.js**, **Express** та **MongoDB**.

## 🚀 Технології

### Frontend
- **React 19** - UI бібліотека
- **TypeScript** - типізація
- **Redux Toolkit (RTK)** - управління станом
- **React Router 7** - клієнтська навігація
- **Vite** - швидка збірка та HMR

### Backend
- **Node.js** - JavaScript runtime
- **Express** - веб-фреймворк
- **MongoDB** - NoSQL база даних
- **Mongoose** - ODM для MongoDB
- **express-validator** - валідація даних

## 📁 Структура проекту

```
sait/
├── src/
│   ├── components/        # React компоненти
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── QuizCard.tsx
│   │   ├── QuizzesSection.tsx
│   │   └── WelcomeSection.tsx
│   ├── pages/             # Сторінки
│   │   ├── Home.tsx
│   │   ├── CreateQuiz.tsx
│   │   ├── ManageQuizzes.tsx
│   │   ├── TakeQuiz.tsx
│   │   └── Results.tsx
│   ├── store/             # Redux store
│   │   ├── index.ts       # Конфігурація store
│   │   ├── hooks.ts       # Типізовані хуки
│   │   ├── quizzesSlice.ts
│   │   └── resultsSlice.ts
│   ├── types/             # TypeScript типи
│   │   └── index.ts
│   ├── css/               # Стилі
│   ├── App.tsx
│   └── main.tsx           # Точка входу
├── index.html
├── vite.config.ts         # Конфігурація Vite
```
sait/
├── src/                   # Frontend код
│   ├── components/        # React компоненти
│   ├── pages/             # Сторінки
│   ├── store/             # Redux store з async thunks
│   ├── services/          # API сервіси
│   ├── types/             # TypeScript типи
│   └── css/               # Стилі
├── server/                # Backend код
│   ├── models/            # Mongoose моделі
│   ├── routes/            # Express routes
│   ├── server.js          # Express app
│   └── package.json       # Backend залежності
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json           # Frontend залежності
```

## 🛠 Встановлення та запуск

### 1. Встановлення MongoDB

**Windows:**
```powershell
# Завантажте з https://www.mongodb.com/try/download/community
# Або через chocolatey:
choco install mongodb

# Запустіть MongoDB:
mongod
```

**Або використовуйте MongoDB Atlas (Cloud):**
- Створіть безкоштовний акаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Отримайте connection string

### 2. Backend Setup

```bash
# Перейдіть в папку server
cd server

# Встановіть залежності
npm install

# Створіть .env файл
copy .env.example .env

# Відредагуйте .env:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/quiz-app

# Заповніть БД тестовими даними
npm run seed

# Запустіть сервер
npm run dev
```

Backend буде доступний на `http://localhost:5000`

### 3. Frontend Setup

```bash
# Поверніться в кореневу папку
cd ..

# Встановіть залежності (якщо ще не встановлені)
npm install

# Створіть .env файл
VITE_API_URL=http://localhost:5000/api

# Запустіть frontend
npm run dev
```

Frontend буде доступний на `http://localhost:3000`

## 🎮 Команди

### Frontend
```bash
npm run dev      # Запуск dev сервера
npm run build    # Production збірка
npm run preview  # Перегляд production збірки
```

### Backend
```bash
cd server
npm run dev      # Запуск з nodemon
npm start        # Production запуск
npm run seed     # Заповнити БД тестовими даними
```

## 🌐 API Endpoints

### Quizzes
- `GET /api/quizzes` - Отримати всі квізи
- `GET /api/quizzes/:id` - Отримати квіз за ID
- `POST /api/quizzes` - Створити новий квіз
- `PUT /api/quizzes/:id` - Оновити квіз
- `DELETE /api/quizzes/:id` - Видалити квіз

### Results
- `GET /api/results` - Отримати всі результати
- `POST /api/results` - Зберегти результат
- `DELETE /api/results/:id` - Видалити результат
- `DELETE /api/results` - Видалити всі результати

## 🗺 Маршрути

| Шлях | Опис |
|------|------|
| `/` | Головна сторінка з переліком квізів |
| `/create` | Створення нового квізу |
| `/manage` | Управління існуючими квізами |
| `/quiz` | Проходження квізу |
| `/results` | Історія результатів |

## 🏗 Архітектура

### State Management (Redux Toolkit)

```typescript
// store/index.ts
const store = configureStore({
  reducer: {
    quizzes: quizzesReducer,  // Квізи та вибраний квіз
    results: resultsReducer,   // Результати проходження
  },
});
```

**Slices:**
- `quizzesSlice` - CRUD операції з квізами
- `resultsSlice` - збереження та видалення результатів

### Типи даних

```typescript
interface Quiz {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options: QuestionOption[];
  correctAnswer?: string;
}

interface QuizResult {
  id: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  date: string;
}
```

## ✨ Особливості

- ✅ **TypeScript** - повна типізація проекту
- ✅ **Redux Toolkit** - сучасний state management
- ✅ **Vite** - блискавична збірка та HMR
- ✅ **Три типи питань**: одна правильна, кілька правильних, розгорнута відповідь
- ✅ **CRUD операції** з квізами
- ✅ **Збереження в LocalStorage** - дані зберігаються між сесіями
- ✅ **Responsive дизайн** - адаптивний інтерфейс
- ✅ **SPA** - навігація без перезавантаження

## 👥 Автори

Банда "Вуличні Койоти" 🐺
