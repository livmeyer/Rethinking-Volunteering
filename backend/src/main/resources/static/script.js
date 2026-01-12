// Google Translate Integration
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

let selectedLocation = null;
let selectedDate = null;
let selectedTime = null;
let currentCategory = null;

function openBooking(category) {
    currentCategory = category;
    document.getElementById('modalCategory').textContent = category;
    document.getElementById('bookingModal').style.display = 'block';
    generateCalendar();
}

function selectLocation(element, location) {
    document.querySelectorAll('.location-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedLocation = location;
    checkConfirmButton();
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.innerHTML = `<div>${date.toLocaleDateString('en-US', {weekday: 'short'})}</div><div>${date.getDate()}</div>`;
        day.onclick = function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            selectedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
            checkConfirmButton();
        };
        calendar.appendChild(day);
    }
}

function selectTime(element) {
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    element.classList.add('selected');
    selectedTime = element.textContent;
    checkConfirmButton();
}

function checkConfirmButton() {
    const btn = document.getElementById('confirmBtn');
    // Only enable if all fields are selected
    btn.disabled = !(selectedLocation && selectedDate && selectedTime);
}

// --- UPDATED: Async Booking Submission ---
async function confirmBooking() {
    const confirmBtn = document.getElementById('confirmBtn');
    
    // UX: Show loading state
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = "Processing...";
    confirmBtn.disabled = true;

    const bookingData = {
        category: currentCategory,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime
    };

    try {
        // Send data to the backend
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (data.success) {
            // Success: Show confirmation and close modal
            alert(`Appointment Confirmed!\n\nReference ID: ${data.booking.id}\nCategory: ${currentCategory}\nLocation: ${selectedLocation}\nDate: ${selectedDate}\nTime: ${selectedTime}`);
            closeModal('bookingModal');
            resetBooking();
        } else {
            // Server error (e.g., validation failed)
            alert('Booking failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        // Network error
        console.error('Booking Error:', error);
        alert('Could not connect to the server. Please check your internet connection.');
    } finally {
        // Reset button state
        confirmBtn.textContent = originalText;
        checkConfirmButton(); // Re-evaluate disabled state
    }
}

function resetBooking() {
    selectedLocation = null;
    selectedDate = null;
    selectedTime = null;
    document.querySelectorAll('.location-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'bookingModal') resetBooking();
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

// --- UPDATED: Async Login Handling ---
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; // Ensure your HTML input has id="password"
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    // UX: Visual feedback
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Verifying...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Success: Redirect to dashboard
            alert(`Login successful! Welcome back, ${data.user.name}.`);
            window.location.href = '/dashboard'; 
        } else {
            // Failed: Show server message
            alert(data.message || "Invalid email or password.");
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred connecting to the server.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    // Note: For a real app, you would also convert this to an async fetch('/api/signup') call similar to handleLogin
    alert(`Account Created!\n\nWelcome ${name}!\n\nYour volunteer account has been created. Please check ${email} for verification.\n\nYou will be contacted by our team within 48 hours for orientation.`);
    closeModal('signupModal');
}

function toggleLanguage() {
    alert('Language switch functionality would be implemented here.\n\nThis would toggle between English and German versions of the entire site.');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
