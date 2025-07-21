// Show/hide authentication forms
function showSignIn() {
    document.getElementById('signInForm').classList.add('active');
    document.getElementById('signUpForm').classList.remove('active');
}

function showSignUp() {
    document.getElementById('signUpForm').classList.add('active');
    document.getElementById('signInForm').classList.remove('active');
}

// Handle sign in
function handleSignIn(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // For demo purposes, accept any email/password
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle sign up
function handleSignUp(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // For demo purposes, accept any email/password
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check if user is already logged in
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
}
