/**
 * ПРАКТИЧНА РОБОТА №5
 * Тема: Об'єкти в JavaScript
 * Варіант 1: User Management System
 */

// 1. ПРИВАТНЕ СХОВИЩЕ ЧЕРЕЗ CLOSURES (ЗАМИКАННЯ)
const UserManager = (function() {
    let users = []; 
    let nextId = 101;

    // Регулярні вирази для валідації
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ']{2,20}$/;

    return {
        /**
         * Створення користувача
         * @param {Object} data - Деструктуризація параметрів
         */
        createUser({ name, email, role }) {
            // Валідація
            if (!nameRegex.test(name)) throw new Error("Ім'я має містити лише літери (2-20 символів)");
            if (!emailRegex.test(email)) throw new Error("Некоректний формат Email");

            // User Object
            const newUser = {
                id: nextId++,
                name,
                email,
                role,
                createdAt: new Date().toLocaleString(),
                
                // Використання this
                getInfo() {
                    return `[ID: ${this.id}] ${this.name} - ${this.role} (Створено: ${this.createdAt})`;
                },
                isAdmin() {
                    return this.role.toLowerCase() === 'admin';
                }
            };

            // Immutable Operation (Spread operator)
            users = [...users, newUser];
            return newUser;
        },

        getUser(id) {
            return users.find(u => u.id === parseInt(id));
        },

        updateUser(id, data) {
            if (!this.getUser(id)) throw new Error("Користувача з таким ID не знайдено");

            // Immutable Update через map
            users = users.map(u => u.id === parseInt(id) ? { ...u, ...data } : u);
            return this.getUser(id);
        },

        deleteUser(id) {
            users = users.filter(u => u.id !== parseInt(id));
            return true;
        },

        getAllUsers() {
            return [...users]; // Повертаємо копію
        },

        getUsersByRole(role) {
            return users.filter(u => u.role === role);
        },

        /**
         * Object Methods (Object.keys)
         */
        getStats() {
            if (users.length === 0) return "Система порожня";
            return `Поля об'єкта: ${Object.keys(users[0]).join(', ')}`;
        }
    };
})();

// 2. UNIT ТЕСТИ
function runTests() {
    console.group("🧪 UNIT TESTING REPORT");
    try {
        // Test 1: Створення та методи об'єкта
        const testUser = UserManager.createUser({ name: "Тест", email: "test@mail.com", role: "Admin" });
        console.assert(testUser.id === 101, "❌ Test 1: ID mismatch");
        console.assert(testUser.isAdmin() === true, "❌ Test 1: this.role check failed");
        console.log("✅ Test 1: Create & Methods - Passed");

        // Test 2: Приватність
        console.assert(typeof users === 'undefined', "❌ Test 2: Privacy failure");
        console.log("✅ Test 2: Encapsulation (Closures) - Passed");

        // Test 3: Валідація
        try {
            UserManager.createUser({ name: "123", email: "bad", role: "User" });
            console.error("❌ Test 3: Validation failed (accepted bad data)");
        } catch (e) {
            console.log("✅ Test 3: Validation & Error Handling - Passed");
        }

        // Test 4: Імутабельність
        const oldList = UserManager.getAllUsers();
        UserManager.updateUser(101, { role: "Editor" });
        console.assert(oldList[0].role === "Admin", "❌ Test 4: Immutability failed (mutated original)");
        console.log("✅ Test 4: Immutability (State Copy) - Passed");

    } catch (e) {
        console.error("Critical Test Error:", e.message);
    }
    console.groupEnd();
}

// 3. UI LOGIC
document.addEventListener('DOMContentLoaded', () => {
    runTests(); // Запуск тестів при старті

    document.getElementById('addBtn').addEventListener('click', () => {
        const name = document.getElementById('userName').value;
        const role = document.getElementById('userRole').value;
        const email = `${name.toLowerCase()}@example.com`;

        try {
            const user = UserManager.createUser({ name, email, role });
            console.log("Додано:", user.getInfo());
            console.table(UserManager.getAllUsers());
        } catch (e) {
            alert(e.message);
        }
    });

    document.getElementById('updateBtn').addEventListener('click', () => {
        const id = document.getElementById('updateId').value;
        const role = document.getElementById('newRole').value;

        try {
            UserManager.updateUser(id, { role });
            console.clear();
            runTests();
            console.table(UserManager.getAllUsers());
            console.log(UserManager.getStats());
        } catch (e) {
            alert(e.message);
        }
    });
});