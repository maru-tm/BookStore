// Локальная корзина
let cartItems = [];

// Проверка авторизации пользователя
function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'block';
        document.getElementById('cart-link').style.display = 'block';
        loadBooks();
    } else {
        document.getElementById('login-reminder').style.display = 'block';
        document.getElementById('book-list').style.display = 'none';
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('cart-link').style.display = 'none';
        document.getElementById('cart-section').style.display = 'none';
    }
}

// Выход из системы
document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem("token");
    checkAuth();
});

// Функция для выполнения fetch-запросов с токеном
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Ошибка ${response.status}: ${errorMessage}`);
        throw new Error(errorMessage || response.statusText);
    }
    return response.json();
}

// Загрузка книг
async function loadBooks() {
    try {
        const books = await fetchWithAuth('/api/books');
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';
        bookList.style.display = 'block';
        document.getElementById('login-reminder').style.display = 'none';

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author}</p>
                <p><strong>Цена:</strong> ${book.price}₽</p>
                <button class="add-to-cart-btn" data-book='${JSON.stringify(book)}'>Добавить в корзину</button>
            `;
            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error("Ошибка при загрузке книг:", error);
    }
}

// Обработчик кликов для кнопок "Добавить в корзину"
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const bookData = JSON.parse(event.target.dataset.book);
        addToCart(bookData); // Добавляем книгу в корзину
    }
});

// Добавление книги в корзину
function addToCart(book) {
    const existingItem = cartItems.find(item => item._id === book._id);
    if (existingItem) {
        existingItem.quantity += 1; // Увеличиваем количество
    } else {
        cartItems.push({ ...book, quantity: 1 }); // Добавляем новую книгу
    }
    updateCartSection(); // Обновляем отображение корзины

    // Логирование содержимого корзины
    console.log("Состояние корзины после добавления:", cartItems);
}

// Обновление блока корзины
function updateCartSection() {
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');

    if (cartItems.length === 0) {
        cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
        checkoutButton.disabled = true;
        document.getElementById('cart-section').style.display = 'none';
        return;
    }

    document.getElementById('cart-section').style.display = 'block';
    checkoutButton.disabled = false;

    cartItemsDiv.innerHTML = '';
    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <p><strong>${item.title}</strong> (${item.quantity} шт.) - ${item.price * item.quantity}₽</p>
            <button onclick="removeFromCart('${item._id}')">Удалить</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });

    // Логирование содержимого корзины
    console.log("Обновленное состояние корзины:", cartItems);
}

// Удаление книги из корзины
function removeFromCart(bookId) {
    cartItems = cartItems.filter(item => item._id !== bookId);
    updateCartSection(); // Обновляем отображение корзины

    // Логирование содержимого корзины
    console.log("Состояние корзины после удаления:", cartItems);
}

document.getElementById('checkout-button').addEventListener('click', async () => {
    try {
        console.log("Содержимое корзины перед отправкой:", cartItems);

        const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const token = localStorage.getItem("token");


        const orderData = { 
            orderItems: cartItems.map(item => ({ 
                bookId: item._id, 
                bookTitle: item.title, 
                bookPrice: item.price, 
                quantity: item.quantity 
            })),
            totalCost,
            token // Передаем токен внутри тела запроса
        };

        console.log("Данные для оформления заказа:", orderData);
        
        const response = await fetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const responseBody = await response.json();

        if (response.ok && responseBody.message === "Заказ успешно создан") {
            alert('Заказ успешно оформлен!');
            cartItems = [];
            updateCartSection();
        } else {
            console.error("Ошибка при оформлении заказа:", responseBody);
            alert('Не удалось оформить заказ');
        }
    } catch (error) {
        console.error("Ошибка при оформлении заказа:", error);
        alert('Не удалось оформить заказ');
    }
});



// Инициализация
window.onload = checkAuth;