/* File: login-script.js
   Purpose: Handles interactions for the Volunteer Login/Signup page
   Backend Endpoints: /api/volunteers/login, /api/volunteers/registration
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Toggle Logic ---
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const showSignupBtn = document.getElementById('showSignupBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    // Switch to Signup View
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    // Switch to Login View
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // --- Form Submission Logic ---
    
    // 1. Handle Login
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button');
        const originalText = submitBtn.textContent;

        // UI Feedback
        submitBtn.textContent = "Verifying...";
        submitBtn.disabled = true;

        try {
            // UPDATED ENDPOINT
            const response = await fetch('/api/volunteers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to dashboard on success
                window.location.href = 'volunteer-dashboard.html'; 
            } else {
                alert(data.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Connection error. Please check if the backend is running.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // 2. Handle Signup (Registration)
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const phone = document.getElementById('signupPhone').value;
        
        const submitBtn = signupForm.querySelector('button');
        const originalText = submitBtn.textContent;

        // UI Feedback
        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;

        try {
            // UPDATED ENDPOINT
            const response = await fetch('/api/volunteers/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password,
                    phone 
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(`Account Created!\n\nWelcome, ${name}.\nPlease check your email (${email}) to verify your account.`);
                
                // Automatically switch back to login view
                signupSection.style.display = 'none';
                loginSection.style.display = 'block';
            } else {
                alert("Registration failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert("Connection error. Please check if the backend is running.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});