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
    fetchDashboardData(); // NEW: Centralized fetch
}

// --- 1. Backend Integration ---

async function fetchDashboardData() {
    // 1. Get User Email (Saved during login)
    const email = localStorage.getItem('currentUserEmail');

    if (!email) {
        console.warn("No user email found. Redirecting to login...");
        // window.location.href = 'index.html'; // Uncomment to enforce login
        return;
    }

    try {
        // 2. Fetch from the NEW Dashboard Endpoint
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
        
        // Map backend data to frontend structure if needed
        // We mark past sessions as 'COMPLETED' and upcoming as 'OPEN' or 'PENDING'
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
    // Backend might return 0.5 (50%) or 50 (50%). We handle both.
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

    // Simple index mapping for tabs (0=Availability, 1=Sessions, 2=Certificate)
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

function claimCertificate() { 
    alert("Certificate Request Sent! We will email you shortly."); 
}

function logout() {
    localStorage.removeItem('currentUserEmail'); // Clear session
    window.location.href = "index.html"; 
}

// --- 5. Calendar Logic (Display Only) ---
function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');
    if(!grid) return;

    const year = currentState.currentDate.getFullYear();
    const month = currentState.currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    if(monthLabel) monthLabel.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = '';

    // Generate 30 days for simplicity in this demo
    for(let i=1; i<=30; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.onclick = () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.style.border = '1px solid #eee');
            day.style.border = '2px solid var(--primary-color)';
            
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

function saveAvailability() {
    console.log("Saving availability:", {
        location: currentState.location,
        topics: currentState.topics
    });
    alert("Availability Settings Saved!");
}
