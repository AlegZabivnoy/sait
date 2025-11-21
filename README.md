# Quiz Application - React SPA

Повноцінна Single Page Application для створення та проходження квізів на React з Context API та React Router.

## Структура проекту

```
sait/
├── src/                    # Вихідний код
│   ├── components/         # React компоненти (Header, Footer, QuizCard, etc.)
│   ├── pages/             # Сторінки (Home, CreateQuiz, ManageQuizzes, TakeQuiz, Results)
│   ├── context/           # Context API (QuizContext)
│   ├── css/               # CSS стилі
│   └── index.js           # Точка входу
├── dist/                  # Скомпільовані файли (генерується автоматично)
├── webpack.config.js      # Конфігурація Webpack
└── package.json           # Залежності та скрипти

```

## Встановлення

1. Клонуйте репозиторій:
```bash
git clone https://github.com/AlegZabivnoy/sait.git
cd sait
```

2. Встановіть залежності:
```bash
npm install
```

## Запуск проекту

### Режим розробки (Development)

Запустити dev server на `http://localhost:3000`:

```bash
npm run dev
```

Або альтернативно:

```bash
npx webpack serve
```

Dev server автоматично перезавантажує сторінку при змінах в коді.

### Збірка для продакшну (Production)

Створити оптимізовану збірку в папці `dist/`:

```bash
npm run build
```

## Архітектура

### SPA (Single Page Application)
Весь додаток - це єдина сторінка з React Router для навігації між різними розділами.

### Маршрути

- `/` - Головна сторінка з переліком квізів
- `/create` - Створення нового квізу
- `/manage` - Управління існуючими квізами
- `/quiz` - Проходження квізу
- `/results` - Історія результатів

### State Management

Використовується **Context API** для глобального управління станом:
- `QuizContext` - управління квізами та результатами
- LocalStorage - постійне збереження даних

### Компоненти

**Pages:**
- `Home` - головна сторінка
- `CreateQuiz` - створення/редагування квізів
- `ManageQuizzes` - список квізів з можливістю редагування
- `TakeQuiz` - проходження квізу
- `Results` - історія результатів

**Components:**
- `Header` - шапка з навігацією
- `Footer` - підвал
- `QuizCard` - картка квізу
- `QuizzesSection` - список квізів
- `WelcomeSection` - вітальна секція

## Технології

- **React 19** - UI бібліотека
- **React Router 7** - клієнтська навігація
- **Context API** - управління станом
- **Webpack 5** - збірка модулів
- **Babel** - транспіляція JSX
- **LocalStorage** - збереження даних (без бекенду)

## Особливості

- ✅ Повноцінна SPA без перезавантаження сторінок
- ✅ Три типи питань: одна правильна, кілька правильних, розгорнута відповідь
- ✅ Створення та редагування квізів
- ✅ Збереження результатів в LocalStorage
- ✅ Responsive дизайн
- ✅ Hot Module Replacement
- ✅ Context API для глобального стану

## Команди

```bash
npm install      # Встановити залежності
npm run dev      # Запуск dev сервера
npm run build    # Збірка для продакшну
```

## Автори

Банда "Вуличні Койоти"
