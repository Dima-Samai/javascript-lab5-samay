# User Management System (JS Homework 05)

Система для управління користувачами з використанням принципів імутабельності.

### Структури даних:
- **User Object**: Містить `id` (number), `name` (string), `role` (string).
- **Users Array**: Масив об'єктів користувачів.

### Основні методи:
- `handleCreate`: додавання нового об'єкта через spread-оператор.
- `handleUpdate`: зміна ролі через метод `.map()`.
- `deleteUser`: видалення об'єкта через метод `.filter()`.
