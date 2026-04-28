// Початковий масив даних (Initial State)
let users = [
    { id: 101, name: "Олександр", role: "Admin" },
    { id: 102, name: "Марія", role: "Editor" }
];

console.log("Система завантажена. Початковий список:");
console.table(users);

// 1. Функція додавання (Create) з використанням Spread
function handleCreate() {
    const nameInput = document.getElementById('userName');
    const roleInput = document.getElementById('userRole');

    if (!nameInput.value || !roleInput.value) {
        console.error("Помилка: Поля не можуть бути порожніми!");
        return;
    }

    const newUser = {
        id: Math.floor(Math.random() * 1000), // Генерація ID
        name: nameInput.value,
        role: roleInput.value
    };

    // Імутабельне додавання
    users = [...users, newUser];

    console.log(`Користувача ${newUser.name} додано!`);
    console.table(users);

    // Очищення полів
    nameInput.value = '';
    roleInput.value = '';
}

// 2. Функція оновлення (Update) через .map()
function handleUpdate() {
    const idInput = document.getElementById('updateId');
    const roleInput = document.getElementById('newRole');
    const id = parseInt(idInput.value);

    if (!id || !roleInput.value) {
        console.error("Помилка: Введіть ID та нову роль");
        return;
    }

    // Імутабельне оновлення
    users = users.map(user => 
        user.id === id ? { ...user, role: roleInput.value } : user
    );

    console.log(`Дані користувача з ID ${id} оновлено.`);
    console.table(users);

    idInput.value = '';
    roleInput.value = '';
}

// 3. Функція видалення (Delete) через .filter()
// Ви можете викликати її прямо з консолі для демонстрації: deleteUser(101)
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    console.log(`Користувача з ID ${id} видалено.`);
    console.table(users);
}