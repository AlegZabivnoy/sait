# Quiz Application - React SPA

Повноцінна Single Page Application для створення та проходження квізів на **React 19** з **TypeScript**, **Redux Toolkit** та **Vite**.

## 🚀 Технології

- **React 19** - UI бібліотека
- **TypeScript** - типізація
- **Redux Toolkit (RTK)** - управління станом
- **React Router 7** - клієнтська навігація
- **Vite** - швидка збірка та HMR
- **LocalStorage** - збереження даних (без бекенду)

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
├── tsconfig.json          # Конфігурація TypeScript
└── package.json
```

## 🛠 Встановлення

1. Клонуйте репозиторій:
```bash
git clone https://github.com/AlegZabivnoy/sait.git
cd sait
```

2. Встановіть залежності:
```bash
npm install
```

## 🎮 Команди

```bash
npm run dev      # Запуск dev сервера (http://localhost:3000)
npm run build    # Production збірка
npm run preview  # Перегляд production збірки
```

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
