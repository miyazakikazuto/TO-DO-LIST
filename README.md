# Local To-Do List

A simple To-Do List web application that saves tasks to the browser's local storage.

## Features

- Add new tasks with priority levels (High, Medium, Low)
- Set due dates for tasks with visual overdue indicators
- Edit task text after creation
- Mark tasks as completed
- Delete tasks
- Persistent storage using localStorage

## How to Run

1. Open `index.html` in your web browser.
2. Alternatively, start a local server:
   - If you have Python installed: `python -m http.server 8000`
   - Then open `http://localhost:8000` in your browser.

## Files

- `index.html`: The main HTML structure
- `style.css`: CSS styling
- `script.js`: Main JavaScript functionality for UI interactions
- `storage.js`: Separate module for local storage operations
