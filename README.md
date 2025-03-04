# Book Store Management System

## Описание проекта
Book Store Management System - это веб-приложение для управления книжным магазином, позволяющее пользователям просматривать, заказывать и управлять книгами. Проект построен на **Node.js** с использованием **Express.js** и подключением к базе данных **MongoDB**.

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd BookStore-main
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корневой директории и добавьте в него следующие переменные:
```
MONGO_URI=<MongoDB_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

### 4. Запуск сервера
```bash
npm start
```
Сервер запустится на `http://localhost:5000/`.

## Структура проекта
```
BookStore-main/
├── internal/
│   ├── config/            # Конфигурации (БД, настройки)
│   ├── controllers/       # Контроллеры (логика работы API)
│   ├── middleware/        # Middleware-функции
│   ├── models/            # Модели данных MongoDB
│   ├── routes/            # Определение маршрутов API
├── package.json           # Зависимости проекта
├── server.js              # Основной файл сервера
```

## API Маршруты
### 1. Аутентификация
- `POST /api/auth/register` – регистрация пользователя
- `POST /api/auth/login` – вход в систему

### 2. Управление книгами
- `GET /api/books` – получить список книг
- `POST /api/books` – добавить новую книгу (администратор)
- `PUT /api/books/:id` – обновить информацию о книге (администратор)
- `DELETE /api/books/:id` – удалить книгу (администратор)

### 3. Заказы
- `POST /api/orders` – оформить заказ
- `GET /api/orders` – получить список заказов

## Используемые технологии
- **Node.js** – серверная часть
- **Express.js** – обработка HTTP-запросов
- **MongoDB** – база данных
- **JWT (JSON Web Token)** – аутентификация пользователей

## Контакты
Если у вас есть вопросы, вы можете связаться с нами через email: `support@bookstore.com`.

---

Разработано DANA и ARU

