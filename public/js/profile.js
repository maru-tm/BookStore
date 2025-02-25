document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Вы не авторизованы!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/users/profile", { 
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Ошибка при получении данных профиля");

        const user = await response.json();

        // Заполняем информацию о пользователе
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("role").textContent = user.role;

    } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        document.getElementById("user-info").innerHTML = "<p>Ошибка загрузки данных профиля.</p>";
    }
});

// Открыть модальное окно при нажатии на кнопку редактирования
document.getElementById("edit-profile").addEventListener("click", () => {
    const username = document.getElementById("username").textContent;

    // Предзаполнение полей модального окна текущими данными
    document.getElementById("new-username").value = username;

    // Открыть модальное окно
    document.getElementById("edit-profile-modal").style.display = "block";
});

// Закрыть модальное окно при нажатии на кнопку "Закрыть"
document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("edit-profile-modal").style.display = "none";
});

document.getElementById("edit-profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;
    const oldPassword = document.getElementById("old-password").value; // Старый пароль

    if (!newUsername) {
        alert("Имя пользователя не может быть пустым.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Вы не авторизованы!");
        return;
    }

    const requestBody = { username: newUsername };
    if (newPassword && oldPassword) {
        requestBody.oldPassword = oldPassword; // Добавляем старый пароль
        requestBody.newPassword = newPassword; // Добавляем новый пароль
    }

    console.log("Отправляемые данные:", requestBody);

    try {
        const response = await fetch("/api/users/profile", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        console.log("Ответ сервера:", result);

        if (response.ok) {
            alert("Профиль успешно обновлён!");
            document.getElementById("username").textContent = newUsername;

            // Если обновляли пароль, то выходим из системы
            if (newPassword) {
                alert("Пароль обновлен, выполните повторный вход.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }

            document.getElementById("edit-profile-modal").style.display = "none";
        } else {
            alert(result.message || "Ошибка обновления профиля");
        }
    } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        alert("Ошибка при обновлении данных.");
    }
});
