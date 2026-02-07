# 🏠 Apartment Project

Современный веб-проект для работы с объектами недвижимости, построенный на Next.js 16 с использованием React 19, TypeScript и Tailwind CSS.

## ✨ Возможности

- 🎨 Современный и адаптивный дизайн
- ⚡ Высокая производительность с Next.js 16 + Turbopack
- 🎭 Плавные анимации с Framer Motion
- 📱 Полностью responsive интерфейс
- 🔍 Поиск и фильтрация недвижимости
- 🖼️ Галерея изображений с Swiper
- 🌐 Поддержка Hebrew (RTL)
- 🚀 Готов к production деплою

## 🛠️ Технологии

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4.1
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Carousel**: Swiper
- **Build Tool**: Turbopack

## 📦 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/YOUR_USERNAME/apartment-project.git
cd apartment-project

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🚀 Команды

```bash
# Development
npm run dev          # Запустить dev сервер с Turbopack

# Production
npm run build        # Собрать для production
npm start            # Запустить production сервер

# Code Quality
npm run lint         # Проверить код с ESLint
```

## 📁 Структура проекта

```
apartment-project/
├── src/
│   ├── app/              # Next.js App Router страницы
│   ├── components/       # React компоненты
│   │   ├── properties/   # Компоненты недвижимости
│   │   └── ...
│   └── types/            # TypeScript типы
├── public/               # Статические файлы (изображения и т.д.)
├── scripts/              # Deployment скрипты
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── next.config.ts        # Next.js конфигурация
├── tailwind.config.ts    # Tailwind конфигурация
└── tsconfig.json         # TypeScript конфигурация
```

## 🚢 Деплой

### Быстрый старт (15 минут)

Смотрите [QUICKSTART.md](./QUICKSTART.md) для быстрого развертывания.

### Подробная документация

Полное руководство по развертыванию: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Автоматический деплой (GitHub Actions)

1. Настройте сервер с помощью `scripts/setup-server.sh`
2. Добавьте GitHub Secrets (SSH_HOST, SSH_USER, SSH_PRIVATE_KEY)
3. Push в `main` ветку запустит автоматический деплой

### Ручной деплой

```bash
SSH_HOST=your-server SSH_USER=user ./scripts/deploy-manual.sh
```

## 🔧 Конфигурация

### Environment Variables

Создайте `.env.local` для локальной разработки:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Для production см. `.env.production.example`

### Next.js Configuration

Проект настроен для standalone деплоя:

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',  // Для production деплоя
  // ...
}
```

## 📊 CI/CD

Проект использует GitHub Actions для автоматизации:

- **CI**: Проверка сборки на PR (`ci.yml`)
- **Deploy**: Автоматический деплой на main/master (`deploy.yml`)

## 🤝 Разработка

### Добавление новых компонентов

```typescript
// src/components/YourComponent.tsx
import React from 'react';

interface YourComponentProps {
  // props
}

const YourComponent: React.FC<YourComponentProps> = (props) => {
  return (
    <div>
      {/* component */}
    </div>
  );
};

export default YourComponent;
```

### Типизация

Все типы находятся в `src/types/`:

```typescript
// src/types/property.types.ts
export interface Property {
  id: number;
  title: string;
  // ...
}
```

## 📝 Git Workflow

```bash
# Создайте новую ветку для фичи
git checkout -b feature/your-feature

# Сделайте коммиты
git add .
git commit -m "Add: your feature"

# Push и создайте PR
git push origin feature/your-feature
```

## 🐛 Troubleshooting

### Build ошибки

```bash
# Очистите кеш и пересоберите
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript ошибки

```bash
# Проверьте типы
npx tsc --noEmit
```

### Deployment проблемы

```bash
# Проверьте готовность к деплою
./scripts/check-deployment.sh
```

Больше в [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## 📚 Документация

- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт деплоя
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Полное руководство по деплою
- [scripts/README.md](./scripts/README.md) - Документация скриптов

## 🔗 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [TypeScript](https://www.typescriptlang.org/docs)

## 📄 Лицензия

ISC

## 👥 Автор

Ваше имя - [GitHub](https://github.com/YOUR_USERNAME)

---

**Готов к деплою?** Начните с [QUICKSTART.md](./QUICKSTART.md) 🚀
