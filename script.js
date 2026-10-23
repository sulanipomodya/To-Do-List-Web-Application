document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');
    const taskCounter = document.getElementById('taskCounter');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // State Variables
    // Optional Challenge: Load initial tasks from Local Storage
    let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
    let currentFilter = 'all';

    // Helper: Save tasks array to Local Storage
    function saveTasksToStorage() {
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    }

    // Task 6: Add Task with Input Validation
    function addTask() {
        const text = taskInput.value.trim();

        // Validation check (empty or space-only)
        if (text === '') {
            errorMessage.classList.remove('d-none');
            taskInput.classList.add('is-invalid');
            return;
        }

        // Hide error message on valid input
        errorMessage.classList.add('d-none');
        taskInput.classList.remove('is-invalid');

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasksToStorage();

        taskInput.value = '';
        render();
    }

    // Task 4: Toggle Task Completed State
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasksToStorage();
        render();
    }

    // Task 5: Delete Single Task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage();
        render();
    }

    // Task 8: Clear All Completed Tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasksToStorage();
        render();
    }

    // Task 8: Update Active Task Counter
    function updateCounter() {
        const activeCount = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = activeCount;
    }

    // Task 7: Filter Logic
    function getFilteredTasks() {
        if (currentFilter === 'active') {
            return tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            return tasks.filter(task => task.completed);
        }
        return tasks; // 'all'
    }

    // Main Render Function
    function render() {
        taskList.innerHTML = '';
        const filteredTasks = getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<li class="list-group-item text-center text-muted p-3">No tasks found</li>`;
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'completed' : ''}`;
                li.dataset.id = task.id;

                li.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <input class="form-check-input mt-0 toggle-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text ${task.completed ? 'text-decoration-line-through text-muted' : ''}">${task.text}</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm delete-btn">Delete</button>
                `;

                // Event Listeners for Checkbox and Delete Button
                const checkbox = li.querySelector('.toggle-checkbox');
                checkbox.addEventListener('change', () => toggleTask(task.id));

                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                taskList.appendChild(li);
            });
        }

        updateCounter();
    }

    // Event Listeners for Input & Adding Tasks
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    taskInput.addEventListener('input', () => {
        if (taskInput.value.trim() !== '') {
            errorMessage.classList.add('d-none');
            taskInput.classList.remove('is-invalid');
        }
    });

    // Event Listeners for Filter Buttons (Task 7)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // Event Listener for Clear Completed Button (Task 8)
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Initial render call on load
    render();
});