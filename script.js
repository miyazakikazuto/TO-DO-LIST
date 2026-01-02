document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage
    refreshTaskList();

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
        const dueDate = document.getElementById('due-date-input').value;
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: priority,
            dueDate: dueDate || null
        };

        displayTask(task);
        saveTask(task);

        taskInput.value = '';
        document.getElementById('due-date-input').value = '';
    }

    function displayTask(task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.classList.add(`priority-${task.priority}`);
        
        // Check if overdue
        if (task.dueDate && !task.completed) {
            const today = new Date().toISOString().split('T')[0];
            if (task.dueDate < today) {
                li.classList.add('overdue');
            }
        }
        
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

        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'due-date';
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            dueDateSpan.textContent = date.toLocaleDateString();
        }

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(priorityBadge);
        li.appendChild(dueDateSpan);
        li.appendChild(editBtn);
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

    function editTask(id) {
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks(tasks);
            refreshTaskList();
        }
    }

    function saveTask(task) {
        const tasks = loadTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    function refreshTaskList() {
        taskList.innerHTML = '';
        const tasks = loadTasks();
        tasks.forEach(displayTask);
    }
});