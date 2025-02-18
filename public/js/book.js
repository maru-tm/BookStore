// Функция для выполнения fetch-запросов с токеном
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("authToken");
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };
    const response = await fetch(url, options);
    
    if (!response.ok) {
        console.error(`Ошибка при запросе: ${response.statusText}`);
        throw new Error(response.statusText);
    }

    return response.json();
}

// Функция для получения списка всех книг
async function getBooks() {
    try {
        const books = await fetchWithAuth('/api/books');
        const booksTableBody = document.getElementById('books-table-body');
        booksTableBody.innerHTML = '';  // Очистить таблицу перед вставкой новых данных

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book._id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${new Date(book.releaseDate).toLocaleDateString()}</td>
                <td>${book.price}₽</td>
                <td>${book.isbn}</td>
                <td>
                    <button onclick="editBook('${book._id}')">Редактировать</button>
                    <button onclick="deleteBook('${book._id}')">Удалить</button>
                </td>
            `;
            booksTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Ошибка при загрузке книг:", error);
        alert('Ошибка при загрузке книг');
    }
}

// Функция для добавления новой книги
async function addBook(event) {
    event.preventDefault();

    const formData = getFormData('add-book-form');
    console.log("Данные для добавления книги:", formData);

    try {
        await fetchWithAuth('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        alert('Книга успешно добавлена');
        getBooks();  // Перезагружаем список книг
    } catch (error) {
        console.error("Ошибка при добавлении книги:", error);
        alert('Ошибка при добавлении книги');
    }
}

// Функция для редактирования данных книги
async function editBook(bookId) {
    console.log("Запрос на редактирование книги с ID:", bookId);
    try {
        const book = await fetchWithAuth(`/api/books/${bookId}`);
        populateUpdateForm(book);
        document.getElementById('update-book-form').style.display = 'block';  // Показываем форму для обновления
    } catch (error) {
        console.error("Ошибка при загрузке данных книги для редактирования:", error);
        alert('Ошибка при загрузке данных книги');
    }
}

// Функция для обновления данных книги
async function updateBook(event) {
    event.preventDefault();

    const bookId = document.getElementById('update-book-id').value;
    const formData = getFormData('update-book-form');
    console.log("Данные для обновления книги:", formData);

    try {
        await fetchWithAuth(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        alert('Данные книги успешно обновлены');
        getBooks();  // Перезагружаем список книг
        document.getElementById('update-book-form').style.display = 'none';  // Скрываем форму
    } catch (error) {
        console.error("Ошибка при обновлении книги:", error);
        alert('Ошибка при обновлении данных книги');
    }
}

// Функция для удаления книги
async function deleteBook(bookId) {
    console.log("Запрос на удаление книги с ID:", bookId);
    try {
        await fetchWithAuth(`/api/books/${bookId}`, { method: 'DELETE' });
        alert('Книга успешно удалена');
        getBooks();  // Перезагружаем список книг
    } catch (error) {
        console.error("Ошибка при удалении книги:", error);
        alert('Ошибка при удалении книги');
    }
}

// Функция для получения данных из формы
function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

// Функция для заполнения формы для редактирования книги
function populateUpdateForm(book) {
    document.getElementById('update-book-id').value = book._id;
    document.getElementById('update-book-title').value = book.title;
    document.getElementById('update-book-author').value = book.author;
    document.getElementById('update-book-release-date').value = new Date(book.releaseDate).toISOString().split('T')[0];
    document.getElementById('update-book-description').value = book.description;
    document.getElementById('update-book-genre').value = book.genre;
    document.getElementById('update-book-price').value = book.price;
    document.getElementById('update-book-isbn').value = book.isbn;
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    getBooks();  // Загружаем список книг при загрузке страницы

    // Обработчики для форм
    document.getElementById('add-book-form').addEventListener('submit', addBook);
    document.getElementById('update-book-form').addEventListener('submit', updateBook);
});
