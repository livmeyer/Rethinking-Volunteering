
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
            const response = await fetch('/api/volunteers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = { success: response.ok, message: await response.text() };
            }

            if (response.ok && (data.success || data.id)) {
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
        
        
        const submitBtn = signupForm.querySelector('button');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/volunteers/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Only sending fields that exist in your Volunteer.java
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    password: password
                })
            });

            // Handle response
            if (response.ok) {
                alert(`Account Created!\n\nWelcome, ${name}.\nPlease login with your new credentials.`);
                
                // Automatically switch back to login view
                signupSection.style.display = 'none';
                loginSection.style.display = 'block';
            } else {
                const errorData = await response.text(); // Get server error message
                alert("Registration failed: " + errorData);
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
