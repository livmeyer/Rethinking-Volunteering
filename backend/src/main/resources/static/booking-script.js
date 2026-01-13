/* File: booking-script.js */

// State variables
let selectedCategoryEnum = null;
let selectedLocationEnum = null;     
let selectedSlotId = null;           
let availableSlots = []; // Stores the raw data from backend

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category'); 

    // Optional: Just for display purposes
    if(catParam) {
        const displayCategory = catParam.replace(/([A-Z])/g, ' $1').trim();
        selectedCategoryEnum = displayCategory;
        document.getElementById('selectedCategoryDisplay').textContent = "Service: " + displayCategory;
    } else {
        document.getElementById('selectedCategoryDisplay').textContent = "General Assistance";
    }
    switch(selectedCategoryEnum) {
        case "New in Munich": selectedCategoryEnum = "NEW_IN_MUNICH"; break;
        case "Travel": selectedCategoryEnum = "TRAVEL"; break;
        case "Documents": selectedCategoryEnum = "DOCUMENTS"; break;
        case "General": selectedCategoryEnum = "GENERAL"; break; 
        default: selectedCategoryEnum = null;
    }
});

// --- Step 1: Location Selection ---
function selectLocation(element, backendEnum, prettyName) {
    // UI Update
    document.querySelectorAll('.location-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    // State Update
    selectedLocationEnum = backendEnum;

    
    // Reset & Disable subsequent steps
    resetSteps();

    // Fetch Data
    fetchAvailableSlots();
}

function resetSteps() {
    selectedSlotId = null;
    document.getElementById('calendar').innerHTML = '<p style="padding:1rem; color:#666;">Loading availability...</p>';
    document.getElementById('timeSlots').innerHTML = '';
    document.getElementById('confirmBtn').disabled = true;
    
    // Re-lock steps
    document.getElementById('dateStep').classList.add('disabled-step');
    document.getElementById('timeStep').classList.add('disabled-step');
}

// --- Step 2: Fetch Data from Backend ---
async function fetchAvailableSlots() {
    try {
        // CALLING THE BACKEND
        // We fetch ALL available slots for this location
            const response = await fetch(`/api/timeslots/dates?topic=${selectedCategoryEnum}&location=${selectedLocationEnum}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        // if (!response.ok) throw new Error("Network response was not ok");
        
        availableSlots = await response.json();

        // Unlock Step 2
        document.getElementById('dateStep').classList.remove('disabled-step');
        
        renderCalendar();

   } catch (error) {
        console.error("Error fetching slots:", error);
        
        // Better looking error UI with a Retry button
        document.getElementById('calendar').innerHTML = `
            <div class="calendar-error">
                <p>⚠️ Could not load appointments.</p>
                <button class="retry-btn-small" onclick="fetchAvailableSlots()">Try Again</button>
            </div>
        `;
    }
}

// --- Step 3: Render 30-Day Calendar ---
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    
    // Generate exactly 30 days
    for (let i = 0; i < 30; i++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);
        
        // Format YYYY-MM-DD for comparison with backend data
        const dateKey = dateObj.toISOString().split('T')[0];
        
        // CHECK AVAILABILITY: Does our backend data contain this date?
        // We look for ANY slot in availableSlots that starts on this date
            const hasSlots = availableSlots.some(slot => slot.startTime.startsWith(dateKey));

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        // Content
        dayEl.innerHTML = `
            <div>${dateObj.toLocaleDateString('en-US', {weekday: 'short'})}</div>
            <div>${dateObj.getDate()}</div>
        `;

        // Interaction Logic
        if (hasSlots) {
            dayEl.onclick = function() {
                // UI Selection
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
                
                // Unlock Step 3
                document.getElementById('timeStep').classList.remove('disabled-step');
                
                // Render Times for this specific date
                renderTimeSlots(dateKey);
            };
        } else {
            // Disable if no slots
            dayEl.classList.add('disabled');
            dayEl.title = "No appointments available";
        }

        calendar.appendChild(dayEl);
    }
}

// --- Step 4: Render Time Slots ---
function renderTimeSlots(selectedDateKey) {
    const timeDiv = document.getElementById('timeSlots');
    timeDiv.innerHTML = '';
    
    // Filter slots for the selected date
    const slotsForDay = availableSlots.filter(slot => 
        slot.startTime.startsWith(selectedDateKey) && !slot.booked
    );

    // Sort by time
    slotsForDay.sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (slotsForDay.length === 0) {
        timeDiv.innerHTML = '<p>No slots available.</p>';
        return;
    }

    slotsForDay.forEach(slot => {
        // Extract "09:00" from ISO string
        const timeStr = slot.startTime.split('T')[1].substring(0, 5);

        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = timeStr;

        slotEl.onclick = function() {
            document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            
            // SAVE THE ID FOR BOOKING
            selectedSlotId = slot.id; 
            document.getElementById('confirmBtn').disabled = false;
        };

        timeDiv.appendChild(slotEl);
    });
}

// --- Step 5: Confirm Booking ---
async function confirmBooking() {
    if (!selectedSlotId) return;

    const btn = document.getElementById('confirmBtn');
    const originalText = btn.textContent;
    btn.textContent = "Processing...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/appointments/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                slotId: selectedSlotId,
                customerName: "Guest Citizen" 
            })
        });

        const success = await response.json(); 

        if (success) {
            alert("✅ Appointment Confirmed!\n\nThe slot has been booked. Please check your email.");
            window.location.href = 'Index.html';
        } else {
            alert("❌ Booking Failed.\nThis slot might have just been taken. Please try another.");
            // Refresh data to show updated availability
            fetchAvailableSlots(); 
        }
    } catch (error) {
        console.error("Booking Error:", error);
        alert("Connection Error. Please check your internet.");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
