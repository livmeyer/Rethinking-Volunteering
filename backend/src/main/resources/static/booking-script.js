let selectedLocation = null;
let selectedDate = null;
let selectedTime = null;
let currentCategory = "General"; // Default

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Category from URL (e.g., appointment.html?category=Documents)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    
    if(catParam) {
        currentCategory = catParam.replace(/([A-Z])/g, ' $1').trim(); // Add spaces if needed
    }
    
    document.getElementById('selectedCategoryDisplay').textContent = "Category: " + currentCategory;

    // 2. Initialize Calendar
    generateCalendar();
});

// --- Selection Logic ---

function selectLocation(element, locationName) {
    // Visual selection
    document.querySelectorAll('.location-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    // State update
    selectedLocation = locationName;
    checkConfirmButton();
}

function selectTime(element) {
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    element.classList.add('selected');
    selectedTime = element.textContent;
    checkConfirmButton();
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const today = new Date();
    
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip weekends for bureaucracy? (Optional: remove if weekends allowed)
        if(date.getDay() === 0 || date.getDay() === 6) continue;

        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.innerHTML = `<div>${date.toLocaleDateString('en-US', {weekday: 'short'})}</div><div>${date.getDate()}</div>`;
        
        day.onclick = function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            selectedDate = date.toLocaleDateString('de-DE'); // DD.MM.YYYY
            checkConfirmButton();
        };
        calendar.appendChild(day);
    }
}

function checkConfirmButton() {
    const btn = document.getElementById('confirmBtn');
    btn.disabled = !(selectedLocation && selectedDate && selectedTime);
}

// --- Backend Submission ---

async function confirmBooking() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.textContent = "Processing...";
    confirmBtn.disabled = true;

    const bookingData = {
        category: currentCategory,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime
    };

    try {
        // Send to your generic booking endpoint
        // NOTE: Ensure your Java controller has an endpoint for this, 
        // e.g. @PostMapping("/api/appointments")
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Appointment Confirmed!\n\nCategory: ${currentCategory}\nLocation: ${selectedLocation}\nDate: ${selectedDate}\nTime: ${selectedTime}`);
            window.location.href = 'Index.html'; // Return to home
        } else {
            alert('Booking failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Booking Error:', error);
        // Fallback for demo if backend isn't ready
        alert("Demo Confirmation:\nBackend not connected, but your request looks good!");
        window.location.href = 'Index.html';
    } finally {
        confirmBtn.textContent = "Confirm Appointment";
        confirmBtn.disabled = false;
    }
}
