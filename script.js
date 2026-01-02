document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage
    loadTasksFromStorage();

    // Add task event
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = document.getElementById('priority-select').value;
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: priority
        };

        displayTask(task);
        saveTask(task);

        taskInput.value = '';
    }

    function displayTask(task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.classList.add(`priority-${task.priority}`);
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(task.id));

        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;

        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'priority-badge';
        priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(priorityBadge);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    }

    function toggleComplete(id) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.classList.toggle('completed');
        }
    }

    function deleteTask(id) {
        const tasks = loadTasks().filter(t => t.id !== id);
        saveTasks(tasks);
        const li = document.querySelector(`li[data-id="${id}"]`);
        taskList.removeChild(li);
    }

    function saveTask(task) {
        const tasks = loadTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    function loadTasksFromStorage() {
        const tasks = loadTasks();
        tasks.forEach(displayTask);
    }
});