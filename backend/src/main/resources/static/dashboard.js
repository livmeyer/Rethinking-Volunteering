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
    location: null, 
    topics: ['DOCUMENTS', 'MOBILITY', 'STUDENTS', 'GENERAL'], 
    sessions: [] // Will store combined Upcoming + Past
};

function initDashboard() {
    generateCalendar();
    fetchDashboardData(); // Centralized fetch
}

//NEW
async function fetchDashboardData() {
    // 1. Get User Email (Saved during login)
    const email = localStorage.getItem('currentUserEmail');

    if (!email) {
        console.warn("No user email found. Redirecting to login...");
        // window.location.href = 'volunteer-login.html'; 
        return;
    }

    try {
        // 2. Fetch from the Dashboard Endpoint
        const response = await fetch(`/api/volunteers/dashboard?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        
        if (!response.ok) throw new Error("Failed to load dashboard data");

        const data = await response.json();

        // --- NEW: Update Header with Name ---
        if (data.name) {
            // Finds the <span class="user-name"> and updates text
            document.querySelector('.user-name').textContent = `Welcome, ${data.name}`;
        }
        // ------------------------------------

        // 3. Process Stats (Counters & Progress)
        updateDashboardStats(data);

        // 4. Process Session List... (rest of your code remains the same)
        const upcoming = Array.isArray(data.upcoming) ? data.upcoming : [];
        const past = Array.isArray(data.past) ? data.past : [];
        
        const upcomingMapped = upcoming.map(s => normalizeSessionData(s, 'OPEN'));
        const pastMapped = past.map(s => normalizeSessionData(s, 'COMPLETED'));

        currentState.sessions = [...upcomingMapped, ...pastMapped];
        
        renderSessions();

    } catch (error) {
        console.error("Error fetching dashboard:", error);
        document.getElementById('sessionListContainer').innerHTML = 
            '<p style="text-align:center; color:red;">Could not load session data.</p>';
    }
}
// --- 1. Backend Integration ---

async function fetchDashboardData() {
    // 1. Get User Email (Saved during login)
    const email = localStorage.getItem('currentUserEmail');

    if (!email) {
        console.warn("No user email found. Redirecting to login...");
        // window.location.href = 'volunteer-login.html'; 
        return;
    }

    try {
        // 2. Fetch from the Dashboard Endpoint
        const response = await fetch(`/api/volunteers/dashboard?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        
        if (!response.ok) throw new Error("Failed to load dashboard data");

        const data = await response.json();

        // 3. Process Stats (Counters & Progress)
        updateDashboardStats(data);

        // 4. Process Session List (Combine Upcoming & Past for the list view)
        const upcoming = Array.isArray(data.upcoming) ? data.upcoming : [];
        const past = Array.isArray(data.past) ? data.past : [];
        
        // Map backend data to frontend structure
        const upcomingMapped = upcoming.map(s => normalizeSessionData(s, 'OPEN'));
        const pastMapped = past.map(s => normalizeSessionData(s, 'COMPLETED'));

        currentState.sessions = [...upcomingMapped, ...pastMapped];
        
        renderSessions();

    } catch (error) {
        console.error("Error fetching dashboard:", error);
        document.getElementById('sessionListContainer').innerHTML = 
            '<p style="text-align:center; color:red;">Could not load session data.</p>';
    }
}

// Helper: Standardize backend data for the UI
function normalizeSessionData(slot, defaultStatus) {
    // Guard against missing start time
    if(!slot.startTime) return slot; 

    return {
        id: slot.id,
        // Extract Date: "2026-02-15T09:00:00" -> "2026-02-15"
        date: slot.startTime.split('T')[0], 
        // Extract Time: "09:00"
        time: slot.startTime.split('T')[1].substring(0, 5), 
        topic: slot.topic || "General",
        location: slot.location || "Online",
        status: defaultStatus // 'OPEN', 'PENDING', or 'COMPLETED'
    };
}

// --- 2. Render Logic (Stats) ---

function updateDashboardStats(data) {
    const upcomingCount = Array.isArray(data.upcoming) ? data.upcoming.length : 0;
    const pastCount = Array.isArray(data.past) ? data.past.length : 0;

    // Update Text Counters
    const upcomingEl = document.getElementById("upcomingSessions");
    const pastEl = document.getElementById("completedSessions");
    
    if (upcomingEl) upcomingEl.textContent = upcomingCount;
    if (pastEl) pastEl.textContent = pastCount;

    // Update Progress Bar
    const rawProgress = typeof data.progress === "number" ? data.progress : 0;
    const progressPercent = rawProgress <= 1 ? Math.round(rawProgress * 100) : Math.round(rawProgress);

    const progressText = document.getElementById("statsProgressText");
    const progressFill = document.getElementById("statsProgressFill");
    const certFill = document.getElementById("certProgressFill");
    const certCount = document.getElementById("certProgress");

    if(progressText) progressText.textContent = `${progressPercent}% to Certificate`;
    if(progressFill) progressFill.style.width = `${progressPercent}%`;
    
    // Certificate specific elements
    if(certFill) certFill.style.width = `${progressPercent}%`;
    if(certCount) certCount.textContent = pastCount;

    // Update "Sessions to Go"
    const totalNeeded = currentState.targetSessions;
    const remaining = Math.max(0, totalNeeded - pastCount);
    const toGoEl = document.getElementById("sessionsToGo");
    if(toGoEl) toGoEl.textContent = remaining;

    // Certificate Button Logic
    const claimBtn = document.getElementById('claimCertBtn');
    const certMsg = document.getElementById('certMessage');

    if (claimBtn && certMsg) {
        if (pastCount >= totalNeeded) {
            claimBtn.classList.remove('disabled');
            claimBtn.disabled = false;
            certMsg.textContent = "You are eligible! Click above to claim.";
            certMsg.style.color = "green";
        } else {
            claimBtn.classList.add('disabled');
            claimBtn.disabled = true;
            certMsg.textContent = `${remaining} more sessions needed.`;
            certMsg.style.color = "#888";
        }
    }
}

// --- 3. Render Logic (Session List) ---

function renderSessions() {
    const container = document.getElementById('sessionListContainer');
    container.innerHTML = '';

    if (currentState.sessions.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No sessions assigned yet.</p>';
        return;
    }

    // Sort by Date (Newest first)
    currentState.sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

    currentState.sessions.forEach(session => {
        const dateObj = new Date(session.date);
        const isCompleted = session.status === 'COMPLETED';
        
        const item = document.createElement('div');
        item.className = 'history-item';
        
        // Status Badge logic
        const statusHtml = isCompleted 
            ? `<span class="history-status completed">Completed</span>`
            : `<span class="history-status upcoming" style="color:#d97706; background:#fef3c7;">Upcoming</span>`;

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
                ${statusHtml}
            </div>
        `;
        
        container.appendChild(item);
    });
}

// --- 4. Interaction Handlers (Tabs, Calendar, etc.) ---

function switchTab(tabName) {
    document.querySelectorAll('.dashboard-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(tabName + 'Tab');
    if (target) target.style.display = 'block';

    const tabs = document.querySelectorAll('.tabs .tab');
    if(tabs.length >= 3) {
        if(tabName === 'availability') tabs[0].classList.add('active');
        if(tabName === 'sessions') tabs[1].classList.add('active');
        if(tabName === 'certificate') tabs[2].classList.add('active');
    }
}

function selectSingleLocation(inputElement, locationEnum) {
    currentState.location = locationEnum;
    document.querySelectorAll('.location-item').forEach(item => item.classList.remove('selected'));
    const parentLabel = inputElement.closest('.location-item');
    if (parentLabel) parentLabel.classList.add('selected');
}

function toggleTopic(topicEnum, isChecked) {
    if (isChecked) {
        if (!currentState.topics.includes(topicEnum)) currentState.topics.push(topicEnum);
    } else {
        currentState.topics = currentState.topics.filter(t => t !== topicEnum);
    }
}

// --- NEW: Function to Save Time Slots to Backend ---
async function saveTimeSlots() {
    // 1. Get selected times from UI
    const selectedTimeDivs = document.querySelectorAll('.time-slot.selected');
    const timeList = Array.from(selectedTimeDivs).map(div => div.textContent + ":00"); // Format "09:00:00"

    if (timeList.length === 0) {
        alert("Please select at least one time slot.");
        return;
    }

// dashboard.js (minimal)

document.addEventListener("DOMContentLoaded", async () => {

    const volunteerId = localStorage.getItem("volunteerId");
    if (!volunteerId) {
        console.warn("No volunteerId found. Redirecting to login...");
        window.location.href = "volunteer-login.html";
        return;
    }

    const volunteerName = localStorage.getItem("volunteerName");
    const nameEl = document.getElementById("volunteerName");
    if (nameEl && volunteerName) {
        nameEl.textContent = volunteerName;
    }

    const response = await fetch(`/api/volunteers/dashboard?id=${encodeURIComponent(volunteerId)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dashboard fetch failed (${response.status}): ${errorText}`);
    }

    const dashboardData = await response.json();

    const upcomingCount = Array.isArray(dashboardData.upcoming) ? dashboardData.upcoming.length : 0;
    const pastCount = Array.isArray(dashboardData.past) ? dashboardData.past.length : 0;

    // Confirmed from your HTML
    const upcomingEl = document.getElementById("upcomingSessions");
    const pastEl = document.getElementById("completedSessions");

    if (!upcomingEl || !pastEl) {
        throw new Error("Missing HTML elements. Expected ids: upcomingSessions and completedSessions.");
    }

    upcomingEl.textContent = String(upcomingCount);
    pastEl.textContent = String(pastCount);

    // progress: backend returns a number. We handle both cases:
// - 0..1 (recommended)
// - 0..100 (if backend already sends percent)
    const rawProgress = typeof dashboardData.progress === "number" ? dashboardData.progress : 0;
    const progressPercent = rawProgress <= 1 ? Math.round(rawProgress * 100) : Math.round(rawProgress);

    document.getElementById("statsProgressText").textContent = `${progressPercent}% to Certificate`;
    document.getElementById("statsProgressFill").style.width = `${progressPercent}%`;

// sessions remaining = 25 - past sessions
    const totalNeeded = 25;
    const remaining = Math.max(0, totalNeeded - pastCount);
    document.getElementById("sessionsToGo").textContent = String(remaining);

});

    // 2. Get User ID/Email (Currently using ID=1 for demo, ideally fetch by email)
    // Note: You need to update the backend to look up ID by Email if you want this dynamic.
    // For now, hardcoding ID 1 or we need an endpoint that accepts email.
    
    // Construct the payload
    const payload = {
        volunteerId: 1, // TODO: Update backend to accept email instead of ID for safety
        topics: currentState.topics.length > 0 ? currentState.topics : ["GENERAL"],
        location: currentState.location || "CENTRAL_LIBRARY",
        day: currentState.selectedDateKey, // "YYYY-MM-DD"
        timeSlots: timeList
    };

    try {
        const response = await fetch('/api/volunteers/createTimeSlots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            alert("Availability Saved Successfully!");
            location.reload(); 
        } else {
            alert("Error saving availability.");
        }
    } catch (error) {
        console.error(error);
        alert("Network error.");
    }
}

function claimCertificate() { 
    alert("Certificate Request Sent! We will email you shortly."); 
}

function logout() {
    localStorage.removeItem('currentUserEmail'); 
    window.location.href = "volunteer-login.html"; 
}

function saveAvailability() {
    // This is the "Save All" button
    alert("Please select specific days on the calendar to save slots.");
}




// --- 5. Calendar Logic ---
function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');
    if(!grid) return;

    const year = currentState.currentDate.getFullYear();
    const month = currentState.currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if(monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = '';

    for(let i=1; i<=30; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.onclick = () => {
            // UI Selection
            document.querySelectorAll('.calendar-day').forEach(d => d.style.border = '1px solid #eee');
            day.style.border = '2px solid var(--primary-color)';
            
            // Set State
            const dateObj = new Date(year, month, i);
            // Format YYYY-MM-DD
            const dateKey = dateObj.toISOString().split('T')[0]; 
            currentState.selectedDateKey = dateKey;

            const dateText = document.getElementById('selectedDateText');
            if(dateText) dateText.textContent = `${monthNames[month]} ${i}`;
            
            const timeSlots = document.getElementById('timeSlotsContainer');
            if(timeSlots) timeSlots.style.display = 'block';
        };
        grid.appendChild(day);
    }
}

function previousMonth() { currentState.currentDate.setMonth(currentState.currentDate.getMonth() - 1); generateCalendar(); }
function nextMonth() { currentState.currentDate.setMonth(currentState.currentDate.getMonth() + 1); generateCalendar(); }
function toggleTimeSlot(el) { el.classList.toggle('selected'); }
