/* File: login-script.js
   Purpose: Handles interactions for the Volunteer Login/Signup page
   Backend Endpoints: 
   1. Login: /api/volunteers/login (Returns { "success": true/false })
   2. Register: /api/volunteers/registration (Returns Volunteer Object)
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Toggle Logic ---
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const showSignupBtn = document.getElementById('showSignupBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // --- 1. Handle Login ---
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Verifying...";
        submitBtn.disabled = true;

        try {
            // FIX 1: URL matches @RequestMapping("/api/volunteers") + @PostMapping("/login")
            const response = await fetch('/api/volunteers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // FIX 2: Your controller returns Map<String, Boolean> -> { "success": true }
            const data = await response.json();

            if (data.success === true) {
                window.location.href = 'volunteer-dashboard.html'; 
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Connection error. Ensure Backend is running on port 8080.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // --- 2. Handle Registration ---
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        const submitBtn = signupForm.querySelector('button');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;

        try {
            // FIX 3: URL matches @RequestMapping("/api/volunteers") + @PostMapping("/registration")
            const response = await fetch('/api/volunteers/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // FIX 4: Keys match the VolunteerRegisterRequest record (name, email, password)
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                // Your controller returns the Volunteer object, which means success
                alert(`Account Created!\n\nWelcome, ${name}.\nPlease login with your new credentials.`);
                signupSection.style.display = 'none';
                loginSection.style.display = 'block';
            } else {
                alert("Registration failed. Email might already be in use.");
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert("Connection error. Ensure Backend is running on port 8080.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});
