// dashboard.js (minimal)


async function saveTimeSlots() {
    // Validation
    const selectedTimes = Array.from(document.querySelectorAll('.time-slot.selected')).map(el => el.textContent + ":00");
    
    if (!state.selectedDateKey) return alert("Please select a date first.");
    if (selectedTimes.length === 0) return alert("Select at least one time slot.");
    if (!state.volunteerId) return alert("Error: User ID not loaded. Please refresh.");

    // Payload
    const payload = {
        volunteerId: state.volunteerId,
        topics: state.topics,
        location: state.location,
        day: state.selectedDateKey,
        timeSlots: selectedTimes
    };

    try {
        const res = await fetch('/api/volunteers/createTimeSlots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await res.json();
        if (result.success) {
            alert("Availability Saved!");
            location.reload();
        } else {
            alert("Save failed. Check backend logs.");
        }
    } catch (e) {
        console.error(e);
        alert("Network Error");
    }
}


function updateStats(data) {
    const pastCount = (data.past || []).length;
    const upcomingCount = (data.upcoming || []).length;
    const remaining = Math.max(0, state.targetSessions - pastCount);
    
    // // Text Counters
    // setText('upcomingSessions', upcomingCount);
    // setText('completedSessions', pastCount);
    // setText('sessionsToGo', remaining);

    // // Progress Bar
    // const progress = Math.round((data.progress || 0) * 100);
    // setText('statsProgressText', `${progress}% to Certificate`);
    // setStyle('statsProgressFill', 'width', `${progress}%`);
    // setStyle('certProgressFill', 'width', `${progress}%`);
    // setText('certProgress', pastCount);

    // Certificate Button
    const btn = document.getElementById('claimCertBtn');
    if (btn) {
        btn.disabled = pastCount < state.targetSessions;
        btn.classList.toggle('disabled', pastCount < state.targetSessions);
        setText('certMessage', pastCount >= state.targetSessions ? "Eligible! Click to claim." : `${remaining} more needed.`);
    }
}
function renderSessionList(upcoming, past) {
    const container = document.getElementById('sessionListContainer');
    container.innerHTML = '';
    
    const allSessions = [
        ...upcoming.map(s => ({ ...s, status: 'Upcoming' })),
        ...past.map(s => ({ ...s, status: 'Completed' }))
    ].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Newest first

    if (allSessions.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No sessions found.</p>';
        return;
    }

    allSessions.forEach(session => {
        const date = new Date(session.startTime);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = session.startTime.split('T')[1].substring(0, 5);
        const isComplete = session.status === 'Completed';

        const html = `
            <div class="history-item">
                <div class="history-date">
                    <span class="day">${date.getDate()}</span>
                    <span class="month">${date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div class="history-info">
                    <h4>${session.topic || 'General'}</h4>
                    <p>${session.location || 'Online'} • ${timeStr}</p>
                </div>
                <div class="session-action">
                    <span class="history-status ${isComplete ? 'completed' : 'upcoming'}">${session.status}</span>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// --- 4. Calendar & Interactions ---

function generateCalendar() {
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('currentMonth');
    if (!grid) return;

    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    label.textContent = `${months[month]} ${year}`;
    grid.innerHTML = '';

    // Simple 30-day view
    for (let i = 1; i <= 30; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.onclick = () => selectDate(year, month, i, day);
        grid.appendChild(day);
    }
}

function selectDate(year, month, day, el) {
    // Visuals
    document.querySelectorAll('.calendar-day').forEach(d => d.style.border = '1px solid #eee');
    el.style.border = '2px solid var(--primary-color)';
    
    // Logic
    const date = new Date(year, month, day);
    state.selectedDateKey = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    setText('selectedDateText', date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
    document.getElementById('timeSlotsContainer').style.display = 'block';
}


// dashboard.kons:
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

// --- Helpers ---
function setText(id, val) { const el = document.getElementById(id); if(el) el.textContent = val; }
function setStyle(id, prop, val) { const el = document.getElementById(id); if(el) el.style[prop] = val; }

// --- Event Handlers (Called from HTML) ---
function previousMonth() { state.currentDate.setMonth(state.currentDate.getMonth() - 1); generateCalendar(); }
function nextMonth() { state.currentDate.setMonth(state.currentDate.getMonth() + 1); generateCalendar(); }
function toggleTimeSlot(el) { el.classList.toggle('selected'); }
function logout() { localStorage.removeItem('currentUserEmail'); window.location.href = "volunteer-login.html"; }
function switchTab(name) {
    document.querySelectorAll('.dashboard-section').forEach(el => el.style.display = 'none');
    const target = document.getElementById(name + 'Tab');
    if (target) target.style.display = 'block';
}
function selectSingleLocation(el, loc) { state.location = loc; }
function claimCertificate() { alert("Request sent!"); }
