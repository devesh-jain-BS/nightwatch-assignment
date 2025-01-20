const fs = require('fs');
const path = './todos.json';

const readTodos = () => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        return JSON.parse(data);
    }
    return [];
};

const writeTodos = (todos) => {
    fs.writeFileSync(path, JSON.stringify(todos, null, 2));
};

const addTodo = (todoText) => {
    const todos = readTodos();
    todos.push({ text: todoText, completed: false });
    writeTodos(todos);
    console.log(`Added: ${todoText}`);
};

const listTodos = () => {
    const todos = readTodos();
    if (todos.length === 0) {
        console.log('No todos found.');
    } else {
        todos.forEach((todo, index) => {
            console.log(`${index + 1}. ${todo.text}`);
        });
    }
};

const deleteTodo = (index) => {
    const todos = readTodos();
    if (index >= 0 && index < todos.length) {
        const deleted = todos.splice(index, 1);
        writeTodos(todos);
        console.log(`Deleted: ${deleted[0].text}`);
    } else {
        console.log('Invalid index.');
    }
};

const command = process.argv[2];
const argument = process.argv.slice(3).join(' ');

switch (command) {
    case 'add':
        if (argument) {
            addTodo(argument);
        } else {
            console.log('Please provide a todo text.');
        }
        break;
    case 'list':
        listTodos();
        break;
    case 'delete':
        const index = parseInt(argument) - 1;
        if (!isNaN(index)) {
            deleteTodo(index);
        } else {
            console.log('Please provide a valid todo index to delete.');
        }
        break;
    default:
        console.log('Unknown command. Use "add", "list", or "delete".');
        break;
}
