document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();  // Ждем, пока вернется весь JSON
    alert(data.message);  // Показываем сообщение

    if (res.ok) {
        // Перенаправляем на страницу логина
        window.location.href = "/login";  
    }
});

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Ошибка авторизации");
        }

        // Сохраняем токен
        localStorage.setItem("token", data.token);

        // Проверяем роль пользователя и перенаправляем его
        if (data.role === "admin") {
            window.location.href = "/admin";
        } else {
            window.location.href = "/";
        }

    } catch (error) {
        alert(error.message);
        console.error("Ошибка при входе:", error);
    }
});
