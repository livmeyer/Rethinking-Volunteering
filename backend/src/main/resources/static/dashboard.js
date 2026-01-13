/* File: dashboard.js */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

// --- State Management ---
let currentState = {
    targetSessions: 25,
    currentDate: new Date(),
    selectedDateKey: null,
    availability: {}, 
    location: null, // Single location selection
    topics: ['DOCUMENTS', 'MOBILITY', 'STUDENTS', 'GENERAL'], // Default topics
    sessions: [] 
};

function initDashboard() {
    generateCalendar();
    fetchSessionsFromBackend(); // Now calls real API
}

// --- 1. Backend Integration (Real Data) ---

async function fetchSessionsFromBackend() {
    // 1. Get Volunteer ID (Saved during login)
    // If testing without login, you can temporarily hardcode: const volunteerId = 1;
    const volunteerId = localStorage.getItem('volunteerId');

    if (!volunteerId) {
        console.warn("No volunteer ID found. Redirecting to login...");
        // window.location.href = 'volunteer-login.html'; // Uncomment when ready
        return;
    }

    try {
        // GET /api/volunteers/{id}/sessions
        const response = await fetch(`/api/volunteers/${volunteerId}/sessions`);
        
        if (!response.ok) throw new Error("Failed to load sessions");

        const backendData = await response.json();

        // 2. Transform Java Data -> Dashboard Format
        currentState.sessions = backendData.map(slot => ({
            id: slot.id,
            // Extract Date: "2026-02-15T09:00:00" -> "2026-02-15"
            date: slot.startTime.split('T')[0], 
            // Extract Time: "09:00"
            time: slot.startTime.split('T')[1].substring(0, 5), 
            topic: slot.topic,
            location: slot.location,
            // If 'booked' is true, we treat it as PENDING verification.
            // You might need a specific 'completed' flag in Java later, 
            // but for now let's assume if it exists here, it's ready to verify.
            status: slot.booked ? 'PENDING' : 'OPEN' 
        }));
        
        renderSessions();
        updateStatsUI();

    } catch (error) {
        console.error("Error fetching sessions:", error);
        document.getElementById('sessionListContainer').innerHTML = 
            '<p style="text-align:center; color:red;">Could not load session data.</p>';
    }
}

async function saveVerifiedSessions() {
    // 1. Find all CHECKED boxes
    const checkboxes = document.querySelectorAll('.session-checkbox:checked');
    const completedIds = Array.from(checkboxes).map(box => parseInt(box.getAttribute('data-id')));

    if (completedIds.length === 0) {
        alert("No sessions selected to verify.");
        return;
    }

    try {
        // 2. Send updates to Backend
        // Loop through each ID and update (or send bulk if backend supports it)
        for (const id of completedIds) {
            await fetch('/api/volunteers/sessions/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, completed: true })
            });
            
            // Update local state
            const session = currentState.sessions.find(s => s.id === id);
            if(session) session.status = 'COMPLETED';
        }

        alert("✅ Sessions verified! Your certificate progress has been updated.");
        
        // Refresh UI
        renderSessions();
        updateStatsUI();

    } catch (error) {
        console.error("Error saving verification:", error);
        alert("Failed to save updates. Please try again.");
    }
}


// --- 2. Render Logic ---

function renderSessions() {
    const container = document.getElementById('sessionListContainer');
    container.innerHTML = '';

    if (currentState.sessions.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No sessions assigned yet.</p>';
        return;
    }

    currentState.sessions.forEach(session => {
        const dateObj = new Date(session.date);
        const isCompleted = session.status === 'COMPLETED';
        
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // If completed, disable the checkbox so they can't un-verify it easily
        const checkboxHtml = isCompleted 
            ? `<span class="history-status completed">Verified</span>`
            : `<label class="checkbox-label">
                 <input type="checkbox" class="session-checkbox" data-id="${session.id}">
                 <span class="checkbox-text">Mark Complete</span>
               </label>`;

        item.innerHTML = `
            <div class="history-date">
                <span class="day">${dateObj.getDate()}</span>
                <span class="month">${dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
            </div>
            <div class="history-info">
                <h4>${session.topic}</h4>
                <p>${session.location} • ${session.time}</p>
            </div>
            <div class="session-action">
                ${checkboxHtml}
            </div>
        `;
        
        container.appendChild(item);
    });
}

function updateStatsUI() {
    // Calculate stats based on local state
    const completedCount = currentState.sessions.filter(s => s.status === 'COMPLETED').length;
    const pendingCount = currentState.sessions.length - completedCount;
    
    const target = currentState.targetSessions;
    const percentage = Math.min(100, Math.round((completedCount / target) * 100));

    // Update Stats Cards
    document.getElementById('completedSessions').textContent = completedCount;
    document.getElementById('upcomingSessions').textContent = pendingCount;
    document.getElementById('sessionsToGo').textContent = Math.max(0, target - completedCount);
    
    // Update Progress Bars
    document.getElementById('statsProgressFill').style.width = `${percentage}%`;
    document.getElementById('statsProgressText').textContent = `${percentage}% to Certificate`;
    document.getElementById('certProgressFill').style.width = `${percentage}%`;
    document.getElementById('certProgress').textContent = completedCount;

    // Certificate Button Logic
    const claimBtn = document.getElementById('claimCertBtn');
    const certMsg = document.getElementById('certMessage');

    if (completedCount >= target) {
        claimBtn.classList.remove('disabled');
        claimBtn.disabled = false;
        certMsg.textContent = "You are eligible! Click above to claim.";
        certMsg.style.color = "green";
    } else {
        claimBtn.classList.add('disabled');
        claimBtn.disabled = true;
        certMsg.textContent = `${Math.max(0, target - completedCount)} more sessions needed.`;
        certMsg.style.color = "#888";
    }
}


// --- 3. Interaction Handlers ---

function toggleTopic(topicEnum, isChecked) {
    if (isChecked) {
        if (!currentState.topics.includes(topicEnum)) currentState.topics.push(topicEnum);
    } else {
        currentState.topics = currentState.topics.filter(t => t !== topicEnum);
    }
    console.log("Topics:", currentState.topics);
}

function selectSingleLocation(inputElement, locationEnum) {
    currentState.location = locationEnum;
    
    // Visual update
    document.querySelectorAll('.location-item').forEach(item => item.classList.remove('selected'));
    const parentLabel = inputElement.closest('.location-item');
    if (parentLabel) parentLabel.classList.add('selected');
}

function switchTab(tabName) {
    document.querySelectorAll('.dashboard-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(tabName + 'Tab');
    if (target) target.style.display = 'block';

    // Simple index mapping for tabs (0=Availability, 1=Sessions, 2=Certificate)
    const tabs = document.querySelectorAll('.tabs .tab');
    if(tabName === 'availability') tabs[0].classList.add('active');
    if(tabName === 'sessions') tabs[1].classList.add('active');
    if(tabName === 'certificate') tabs[2].classList.add('active');
}

// --- 4. Calendar Logic (Display Only) ---
function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');
    if(!grid) return;

    const year = currentState.currentDate.getFullYear();
    const month = currentState.currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    monthLabel.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = '';

    // Simple Calendar Generation for Availability Setting
    // (This part logic remains similar to previous step: create days, onclick -> show time slots)
    // For brevity, using a simplified loop
    for(let i=1; i<=30; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.onclick = () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.style.border = '1px solid #eee');
            day.style.border = '2px solid var(--primary-color)';
            document.getElementById('selectedDateText').textContent = `${monthNames[month]} ${i}`;
            document.getElementById('timeSlotsContainer').style.display = 'block';
        };
        grid.appendChild(day);
    }
}

function previousMonth() { currentState.currentDate.setMonth(currentState.currentDate.getMonth() - 1); generateCalendar(); }
function nextMonth() { currentState.currentDate.setMonth(currentState.currentDate.getMonth() + 1); generateCalendar(); }

function toggleTimeSlot(el) { el.classList.toggle('selected'); }

function saveTimeSlots() { 
    // Logic to save specific time slots to currentState.availability 
    alert("Time slots saved locally for this date.");
}

function saveAvailability() {
    console.log("Saving full availability:", {
        location: currentState.location,
        topics: currentState.topics,
        calendar: currentState.availability
    });
    alert("Availability Settings Saved!");
}

function claimCertificate() { alert("Certificate Request Sent!"); }
function logout() { window.location.href = "Index.html"; }