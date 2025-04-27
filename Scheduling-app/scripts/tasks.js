document.addEventListener('DOMContentLoaded', function () {
    // important HTML elements
    const taskForm = document.getElementById('taskForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const accountBtn = document.getElementById('accountbtn');
    const saveTaskBtn = document.getElementById('saveTask');
    const taskCounter = document.getElementById('taskCounter'); // Bubble that shows number of user's tasks
    const myTasksBtn = document.getElementById('my_tasks');
    
    // Get current logged-in user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Get all tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null;  
    let weekOffset = 0;     

    // If not logged in, redirect to login page
    if (!currentUser) {
        alert('Please log in first.');
        window.location.href = 'register-login.html';
    } else {
        logoutBtn.style.display = 'inline-block';
        accountBtn.style.display = 'inline-block';
        myTasksBtn.style.display = 'inline-block';
    }

    // Check if current user is an Admin
    const isAdmin = currentUser?.selectedConfig === 'admin';

    // Navigate to Previous Week
    document.getElementById('prevWeekBtn').addEventListener('click', () => {
        weekOffset--;
        displayTasks();
    });

    // Navigate to Next Week
    document.getElementById('nextWeekBtn').addEventListener('click', () => {
        weekOffset++;
        displayTasks();
    });

    // Open Account Page
    accountBtn.addEventListener('click', () => {
        window.location.href = 'account.html';
    });
    // Open my tasks Page
    myTasksBtn.addEventListener('click', () => {
        window.location.href = 'myTasks.html';
    });
    // Open Account Page
    accountBtn.addEventListener('click', () => {
        window.location.href = 'account.html';
    });

    // Open Create Task Modal
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', function () {
            editingTaskId = null;
            taskForm.reset();
            document.getElementById('taskCreator').value = currentUser.username;
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        });
    }

    // Get all dates for the current week
    function getWeekDates(offset = 0) {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
        const monday = new Date(today.setDate(diff));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    // Format date style
    function formatDateLabel(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Update the label showing current week range
    function updateWeekRangeLabel(weekDates) {
        const start = formatDateLabel(weekDates[0]);
        const end = formatDateLabel(weekDates[6]);
        document.getElementById('weekRangeLabel').textContent = `${start} - ${end}`;
    }

    // Generate the time slots grid based on selected week
    function generateTimeSlots() {
        const tbody = document.getElementById('scheduleBody');
        tbody.innerHTML = '';

        const weekDates = getWeekDates(weekOffset);
        updateWeekRangeLabel(weekDates);

        const headerRow = document.querySelector('thead tr:last-child');
        headerRow.innerHTML = `<th class="text-uppercase">Time</th>` +
            weekDates.map((date) => `
                <th class="text-uppercase">${date.toLocaleDateString('en-US', { weekday: 'long' })}<br>${formatDateLabel(date)}</th>
            `).join('');

        for (let hour = 8; hour <= 18; hour++) {
            const tr = document.createElement('tr');
            const time = `${hour.toString().padStart(2, '0')}:00`;
            tr.innerHTML = `<td class="align-middle">${time}</td>` +
                weekDates.map((_, i) =>
                    `<td class="task-cell" data-time="${time}" data-day="${i}"></td>`
                ).join('');
            tbody.appendChild(tr);
        }
    }

    // Check if the user can edit/delete a task (admin or owner)
    function canEditTask(task) {
        return isAdmin || task.creator === currentUser.username;
    }

    // load all tasks into the table
    function displayTasks() {
        generateTimeSlots();
    
        const weekDates = getWeekDates(weekOffset);
        let userTaskCount = 0;      // how many tasks belong to user
        let userCompletedCount = 0; // how many tasks completed by user
    
        tasks.forEach(task => {
            // Show all tasks for admin, only own tasks for normal user
            if (!isAdmin && task.creator !== currentUser.username) return;
    
            const taskDate = new Date(task.date);
            const matchIndex = weekDates.findIndex(d =>
                d.toDateString() === taskDate.toDateString()
            );
    
            if (matchIndex === -1) return;
    
            const cell = document.querySelector(`td[data-time="${task.startTime}"][data-day="${matchIndex}"]`);
            if (cell) {
                const isCompleted = task.status === 'completed';
                const canEdit = canEditTask(task);
                const editDeleteButtons = isCompleted || !canEdit ? '' : `
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary me-1 edit-task" data-task-id="${task.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-task" data-task-id="${task.id}">Delete</button>
                    </div>
                `;
    
                cell.innerHTML = `
                    <div class="task-item priority-${task.priority.toLowerCase()} ${isCompleted ? 'status-completed' : ''}" data-task-id="${task.id}">
                        <div class="task-title fw-bold">${task.title}</div>
                        <div class="task-description">${task.description}</div>
                        <div class="task-status">Status: ${task.status}</div>
                        <div class="task-time">${task.startTime} - ${task.endTime}</div>
                        <div class="task-creator">Created by: ${task.creator}</div>
                        ${editDeleteButtons}
                    </div>
                `;
            }
    
            //count user's own tasks
            if (task.creator === currentUser.username) {
                userTaskCount++;
                if (task.status === 'completed') {
                    userCompletedCount++;
                }
            }
        });
    
        // Update the counter
        if (taskCounter) {
            taskCounter.textContent = `${userTaskCount} (${userCompletedCount} ✅)`;
        }
    }
    

    // Save task (Create new or Update existing)
    saveTaskBtn.addEventListener('click', function () {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const date = document.getElementById('taskDate').value;
        const startTime = document.getElementById('taskStartTime').value;
        const endTime = document.getElementById('taskEndTime').value;
        const priority = document.getElementById('taskPriority').value;
        const status = document.getElementById('taskStatus').value;
        const creator = document.getElementById('taskCreator').value;

        if (!title || !description || !date || !startTime || !endTime || !creator) {
            alert('Please fill in all required fields.');
            return;
        }

        if (editingTaskId) {
            const taskToEdit = tasks.find(t => t.id === editingTaskId);
            if (!canEditTask(taskToEdit)) {
                alert('You do not have permission to edit this task.');
                return;
            }

            const index = tasks.findIndex(t => t.id === editingTaskId);
            if (index !== -1) {
                tasks[index] = {
                    ...tasks[index],
                    title,
                    description,
                    date,
                    startTime,
                    endTime,
                    priority,
                    status,
                    creator
                };
            }
            editingTaskId = null;
        } else {
            const task = {
                id: Date.now(),
                title,
                description,
                date,
                startTime,
                endTime,
                priority,
                status,
                creator
            };
            tasks.push(task);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        displayTasks();
    });

    // Edit/Delete Button Actions inside the Schedule
    document.getElementById('scheduleBody').addEventListener('click', function (e) {
        const taskId = Number(e.target.closest('.task-item')?.dataset.taskId);
        const task = tasks.find(t => t.id === taskId);

        // Edit Task
        if (e.target.classList.contains('edit-task') && task) {
            if (!canEditTask(task)) {
                alert('You do not have permission to edit this task.');
                return;
            }

            editingTaskId = taskId;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDate').value = task.date;
            document.getElementById('taskStartTime').value = task.startTime;
            document.getElementById('taskEndTime').value = task.endTime;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskCreator').value = task.creator;

            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        }

        // Delete Task
        if (e.target.classList.contains('delete-task') && task) {
            if (!canEditTask(task)) {
                alert('You do not have permission to delete this task.');
                return;
            }

            if (confirm('Are you sure you want to delete this task?')) {
                const index = tasks.findIndex(t => t.id === taskId);
                if (index !== -1) {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    displayTasks();
                }
            }
        }
    });
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'register-login.html';
    });
    displayTasks();
});
