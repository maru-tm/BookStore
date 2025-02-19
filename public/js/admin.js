// public/js/admin.js

document.addEventListener("DOMContentLoaded", async () => {
    const usersTable = document.getElementById("users-table");

    // Функция для загрузки списка пользователей
    async function loadUsers() {
        try {
            const res = await fetch("/api/admin/users", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            if (!res.ok) {
                throw new Error(`Ошибка загрузки: ${res.status}`);
            }

            const users = await res.json();

            if (!Array.isArray(users)) {
                throw new Error("Полученные данные не являются массивом");
            }

            usersTable.innerHTML = ""; // Очищаем перед заполнением

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="role-select" data-id="${user._id}">
                            <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                        </select>
                    </td>
                    <td>
                        <button class="delete-btn" data-id="${user._id}">Удалить</button>
                    </td>
                `;
                usersTable.appendChild(row);
            });

            // Добавляем обработчики событий для изменения роли
            document.querySelectorAll(".role-select").forEach(select => {
                select.addEventListener("change", async (e) => {
                    const userId = e.target.dataset.id;
                    const newRole = e.target.value;

                    try {
                        const res = await fetch(`/api/admin/users/${userId}/role`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ role: newRole })
                        });

                        if (!res.ok) {
                            throw new Error("Ошибка при обновлении роли");
                        }

                        alert("Роль обновлена");
                    } catch (error) {
                        console.error("Ошибка:", error);
                        alert("Не удалось обновить роль");
                    }
                });
            });

            // Добавляем обработчики событий для удаления пользователей
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async () => {
                    const userId = button.dataset.id;

                    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
                        try {
                            const res = await fetch(`/api/admin/users/${userId}`, {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                                }
                            });

                            if (!res.ok) {
                                throw new Error("Ошибка при удалении пользователя");
                            }

                            alert("Пользователь удалён");
                            loadUsers(); // Обновляем таблицу после удаления
                        } catch (error) {
                            console.error("Ошибка:", error);
                            alert("Не удалось удалить пользователя");
                        }
                    }
                });
            });

        } catch (error) {
            console.error("Ошибка при загрузке пользователей:", error);
            alert("Ошибка загрузки пользователей. Проверьте авторизацию.");
        }
    }

    loadUsers(); // Загружаем пользователей при загрузке страницы
});
