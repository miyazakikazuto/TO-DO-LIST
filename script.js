document.addEventListener('DOMContentLoaded', () => {
    // Device detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
        document.body.classList.add('ios-device');
    } else if (isAndroid) {
        document.body.classList.add('android-device');
    }

    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');

    // Set default due date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('due-date-input').value = today;

    // Load tasks from localStorage
    refreshTaskList();
    updateTaskSummary();

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
        updateTaskSummary();

        taskInput.value = '';
        // Keep today's date as default instead of clearing
        document.getElementById('due-date-input').value = today;
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
            updateTaskSummary();
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
            updateTaskSummary();
        }
    }

    function deleteTask(id) {
        const tasks = loadTasks().filter(t => t.id !== id);
        saveTasks(tasks);
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) {
            taskList.removeChild(li);
        }
        updateTaskSummary();
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

    function updateTaskSummary() {
        const tasks = loadTasks();
        
        let total = tasks.length;
        let done = tasks.filter(task => task.completed).length;
        let pending = total - done;
        let overdue = 0;
        
        const today = new Date().toISOString().split('T')[0];
        tasks.forEach(task => {
            if (!task.completed && task.dueDate && task.dueDate < today) {
                overdue++;
            }
        });
        
        // Update the display
        document.getElementById('total-count').textContent = total;
        document.getElementById('done-count').textContent = done;
        document.getElementById('pending-count').textContent = pending;
        document.getElementById('overdue-count').textContent = overdue;
    }
});