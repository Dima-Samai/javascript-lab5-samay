// Використовуємо IIFE (Immediately Invoked Function Expression) для створення замикання.
// Тепер масив users недоступний ззовні через консоль.
const UserSystem = (function() {
    // Приватні дані (інкапсуляція)
    let users = [
        { id: 101, name: 'Олександр', role: 'Admin' },
        { id: 102, name: 'Марія', role: 'Editor' }
    ];

    // Регулярний вираз для валідації імені: лише літери (українські та латинські), від 2 до 20 символів
    const nameRegex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ']{2,20}$/;

    return {
        // Додавання користувача з валідацією
        addUser: function(name, role) {
            if (!nameRegex.test(name)) {
                console.error(`Помилка: Ім'я "${name}" містить цифри або некоректні символи!`);
                return false;
            }
            if (!role) {
                console.error("Помилка: Роль має бути заповнена!");
                return false;
            }

            const newUser = {
                id: Math.floor(Math.random() * 1000), // Генерація ID
                name: name,
                role: role
            };

            // Імутабельність: створюємо новий масив замість push
            users = [...users, newUser];
            console.log(`Користувача ${name} додано!`);
            return true;
        },

        // Оновлення ролі через імутабельний метод map
        updateRole: function(id, newRole) {
            const userExists = users.some(u => u.id === parseInt(id));
            if (!userExists) {
                console.error(`Помилка: Користувача з ID ${id} не знайдено!`);
                return false;
            }

            // Створюємо новий масив, замінюючи лише потрібний об'єкт
            users = users.map(user => 
                user.id === parseInt(id) ? { ...user, role: newRole } : user
            );

            console.log(`Дані користувача з ID ${id} оновлено.`);
            return true;
        },

        // Метод для отримання копії списку (щоб не пошкодити оригінал)
        getUsers: function() {
            return [...users];
        }
    };
})();

// Функції для зв'язку з вашим інтерфейсом (HTML)
function handleAdd() {
    const nameInput = document.querySelector('input[placeholder="Ім\'я користувача"]');
    const roleInput = document.querySelector('input[placeholder="Роль (напр. Admin)"]');
    
    const success = UserSystem.addUser(nameInput.value, roleInput.value);
    
    if (success) {
        nameInput.value = '';
        roleInput.value = '';
        console.table(UserSystem.getUsers()); // Гарний вивід у консоль
    }
}

function handleUpdate() {
    const idInput = document.querySelector('input[placeholder="ID для зміни"]');
    const roleInput = document.querySelector('input[placeholder="Нова роль"]');
    
    const success = UserSystem.updateRole(idInput.value, roleInput.value);
    
    if (success) {
        idInput.value = '';
        roleInput.value = '';
        console.table(UserSystem.getUsers());
    }
}

// Прив'язка до кнопок (переконайтеся, що у вашому HTML кнопкам додано відповідні id або класи)
document.querySelector('.btn-success')?.addEventListener('click', handleAdd);
document.querySelector('.btn-primary')?.addEventListener('click', handleUpdate);