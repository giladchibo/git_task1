// Check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve current user from Local Storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login page if no user is logged in
        window.location.href = '../pages/register-login.html';
        return;
    }

    // Populate user details in form
    const profilePicPreview = document.getElementById('profilePicPreview');
    profilePicPreview.src = currentUser.profilePic || ''; // Set profile picture
    document.getElementById('username').value = currentUser.username; // Set username
    document.getElementById('email').value = currentUser.email; // Set email
    document.getElementById('phone').value = currentUser.phone; // Set phone
    const configRadios = document.getElementsByName('user_config'); // User config radios
    for (let radio of configRadios) {
        if (radio.value === currentUser.selectedConfig) {
            radio.checked = true; // Select current config
        }
    }

    // Handle profile picture upload
    let profilePicDataUrl = currentUser.profilePic;
    document.getElementById('profilePicInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicDataUrl = e.target.result; // Store image as Data URL
                profilePicPreview.src = profilePicDataUrl; // Update preview
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission for updating details
    document.getElementById('accountForm').addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const selectedConfig = Array.from(configRadios).find(radio => radio.checked).value;
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address !');
            return;
        }

        // Check if email is taken by another user
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email && user.id !== currentUser.id)) {
            alert('This email is already being used by another account.');
            return;
        }

        // Update user details
        const updatedUser = {
            ...currentUser,
            username,
            email,
            phone,
            selectedConfig,
            profilePic: profilePicDataUrl
        };
        // Update users array in Local Storage
        users = users.map(user => user.id === currentUser.id ? { ...user, ...updatedUser } : user);
        localStorage.setItem('users', JSON.stringify(users));
        // Update current user
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Details have been updated successfully!');
    });

//     // Display user tasks
//     const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     const userTasks = tasks.filter(task => task.createdBy === currentUser.email); // Filter tasks by creator
//     const tasksList = document.getElementById('tasksList');
//     if (userTasks.length === 0) {
//         // Show message if no tasks are assigned
//         tasksList.innerHTML = '<p>There are no tasks associated with you.</p>';
//     } else {
//         // Display each task
//         userTasks.forEach(task => {
//             const taskDiv = document.createElement('div');
//             taskDiv.className = 'task-item';
//             taskDiv.style.background = getPriorityColor(task.priority); // Set color based on priority
//             taskDiv.innerHTML = `
//                 <strong>${task.description}</strong><br>
//                 Date: ${task.date}<br>
//                 Hour: ${task.time}<br>
//                 Priority: ${task.priority}<br>
//                 Status: ${task.status}
//             `;
//             tasksList.appendChild(taskDiv);
//         });
//     }

//     // Function to get color based on task priority
//     function getPriorityColor(priority) {
//         switch (priority) {
//             case 'High': return '#e74c3c'; // Red for high priority
//             case 'Medium': return '#e67e22'; // Orange for medium priority
//             case 'Low': return '#2ecc71'; // Green for low priority
//             default: return '#573b8a'; // Purple as default
//         }
//     }

//     // Handle logout
//     document.getElementById('logout').addEventListener('click', (e) => {
//         e.preventDefault();
//         localStorage.removeItem('currentUser'); // Remove current user
//         window.location.href = '../pages/register-login.html'; // Redirect to login page
//     });
// });