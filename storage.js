// storage.js - Handles local storage operations for tasks

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        const parsedTasks = JSON.parse(tasks);
        // Migrate old priority system to new one
        return parsedTasks.map(task => {
            if (task.priority === 'low') {
                task.priority = 'easy';
            } else if (task.priority === 'medium' || task.priority === 'high') {
                task.priority = 'hard';
            }
            return task;
        });
    }
    return [];
}