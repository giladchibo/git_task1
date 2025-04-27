
let users = JSON.parse(localStorage.getItem('users')) || [];
const signupForm = document.querySelector('.signup form');
const loginForm = document.querySelector('.login form');

const profilePicInput = document.createElement('input');
profilePicInput.type = 'file';
profilePicInput.accept = 'image/*';
profilePicInput.className = 'profile-pic-input';
profilePicInput.style.padding = '8px';
signupForm.insertBefore(profilePicInput, signupForm.querySelector('button'));

let profilePicDataUrl = '';
profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicDataUrl = e.target.result;
            const preview = document.createElement('img');
            preview.src = profilePicDataUrl;
            preview.className = 'preview-pic';
            const existingPreview = signupForm.querySelector('.preview-pic');
            if (existingPreview) {
                existingPreview.remove();
            }
            signupForm.insertBefore(preview, profilePicInput.nextSibling);
        };
        reader.readAsDataURL(file);
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = signupForm.querySelector('input[name="name"]').value;
    const email = signupForm.querySelector('input[name="email"]').value;
    const phone = signupForm.querySelector('input[name="phone"]').value;
    // const Position = signupForm.querySelector('input[name="Position"]').value;
    const password = signupForm.querySelector('input[name="pswd"]').value;
    const user_config = document.getElementsByName("user_config");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (users.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }

    let selectedConfig = "";
    for(let i = 0; i < user_config.length; i++){
        if(user_config[i].checked){
            selectedConfig = user_config[i].value;
            console.log(selectedConfig)
        }
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        phone,
        // gender,
        password,
        selectedConfig,
        profilePic: profilePicDataUrl
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Clear form
    signupForm.reset();
    const preview = signupForm.querySelector('.preview-pic');
    if (preview) {
        preview.remove();
    }
    profilePicDataUrl = '';

    alert('Signup successful! Please login.');
    document.getElementById('chk').checked = true;
});

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="pswd"]').value;

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store logged in user
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
     
        window.location.href = '../pages/tasks.html';
    } else {
        alert('No such user!');
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = '../pages/tasks.html';
    }
});