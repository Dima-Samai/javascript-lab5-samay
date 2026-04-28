/**
 * @typedef {Object} UserData
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

/**
 * Функція-менеджер користувачів (використовує замикання для приватності даних)
 */
const UserManager = (() => {
    // Приватне сховище (доступне лише через методи менеджера)
    let _users = [];
    let _nextId = 1;

    /**
     * Валідація email
     * @param {string} email 
     * @returns {boolean}
     */
    const _isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return {
        /**
         * Створення нового користувача
         * @param {UserData} data - Деструктуризація в параметрах
         */
        createUser({ name, email, role = 'user' }) {
            if (!name || !_isValidEmail(email)) {
                throw new Error("Невалідні дані: ім'я обов'язкове, email має бути коректним.");
            }

            const newUser = {
                id: _nextId++,
                name,
                email,
                role,
                createdAt: new Date().toISOString(),

                // Методи об'єкта User
                getInfo() {
                    return `ID: ${this.id} | ${this.name} (${this.role})`;
                },

                isAdmin() {
                    return this.role.toLowerCase() === 'admin';
                }
            };

            _users = [..._users, newUser]; // Immutable operation (spread)
            return { ...newUser }; // Повертаємо копію
        },

        /**
         * Отримання користувача за ID
         */
        getUser(id) {
            const user = _users.find(u => u.id === id);
            return user ? { ...user } : null;
        },

        /**
         * Оновлення профілю (Immutable)
         */
        updateUser(id, newData) {
            const index = _users.findIndex(u => u.id === id);
            if (index === -1) return null;

            if (newData.email && !_isValidEmail(newData.email)) {
                throw new Error("Невалідний новий email");
            }

            // Створюємо новий об'єкт користувача, поєднуючи старі та нові дані
            const updatedUser = { ..._users[index], ...newData };
            
            // Оновлюємо масив (створюємо новий масив)
            _users = [
                ..._users.slice(0, index),
                updatedUser,
                ..._users.slice(index + 1)
            ];

            return { ...updatedUser };
        },

        /**
         * Видалення користувача
         */
        deleteUser(id) {
            const initialLength = _users.length;
            _users = _users.filter(u => u.id !== id);
            return _users.length < initialLength;
        },

        /**
         * Отримання всіх користувачів
         */
        getAllUsers() {
            return _users.map(user => ({ ...user }));
        },

        /**
         * Фільтрація за роллю
         */
        getUsersByRole(role) {
            return _users
                .filter(u => u.role === role)
                .map(u => ({ ...u }));
        }
    };
})();

// --- ДЕМОНСТРАЦІЯ ТА ТЕСТИ (Console Unit Tests) ---

console.log("--- Тестування User Management System ---");

try {
    // 1. Створення
    const user1 = UserManager.createUser({ name: "Дмитро", email: "dmytro@test.com", role: "admin" });
    const user2 = UserManager.createUser({ name: "Іван", email: "ivan@test.com", role: "user" });
    console.log("Користувачі створені:", user1.getInfo(), "|", user2.getInfo());

    // 2. Перевірка валідації (має видати помилку)
    // UserManager.createUser({ name: "Error", email: "wrong-email" });

    // 3. Отримання за ID
    console.log("Пошук ID 1:", UserManager.getUser(1).name);

    // 4. Оновлення (Immutable check)
    const updated = UserManager.updateUser(1, { name: "Дмитро Самай" });
    console.log("Після оновлення:", updated.name);
    console.log("Чи залишився оригінал в UserManager незмінним (через getUser)?", UserManager.getUser(1).name === "Дмитро Самай");

    // 5. Фільтрація за роллю
    console.log("Адміни:", UserManager.getUsersByRole("admin").length);

    // 6. Видалення
    UserManager.deleteUser(2);
    console.log("Кількість користувачів після видалення:", UserManager.getAllUsers().length);

} catch (error) {
    console.error("Помилка тестування:", error.message);
}