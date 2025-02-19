// public/js/index.js

// Проверяем, авторизован ли пользователь
function isUserLoggedIn() {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "";
}

// Функция выполнения fetch-запросов с токеном
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("Пользователь не авторизован");
        throw new Error("Нет доступа: авторизуйтесь");
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Ошибка ${response.status}: ${errorMessage}`);
        throw new Error(errorMessage || response.statusText);
    }

    return response.json();
}

// Функция загрузки книг
async function loadBooks() {
    const bookContainer = document.getElementById("book-list");

    if (!isUserLoggedIn()) {
        bookContainer.innerHTML = "<p class='error'>Чтобы увидеть книги, пожалуйста, <a href='/login'>войдите</a> или <a href='/register'>зарегистрируйтесь</a>.</p>";
        return;
    }

    try {
        const books = await fetchWithAuth("/api/books");
        bookContainer.innerHTML = "";

        if (books.length === 0) {
            bookContainer.innerHTML = "<p>Нет доступных книг</p>";
            return;
        }

        books.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book-item");
            bookElement.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author}</p>
                <p>${book.description || "Описание отсутствует"}</p>
                <p><strong>Жанр:</strong> ${book.genre || "Не указан"}</p>
                <p><strong>Цена:</strong> ${book.price}₽</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
            `;
            bookContainer.appendChild(bookElement);
        });
    } catch (error) {
        console.error("Ошибка при загрузке книг:", error);
        bookContainer.innerHTML = "<p class='error'>Ошибка при загрузке книг</p>";
    }
}

// Обработчик загрузки страницы
document.addEventListener("DOMContentLoaded", loadBooks);
