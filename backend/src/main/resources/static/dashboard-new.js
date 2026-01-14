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

    const response = await fetch(`/api/volunteers/dashboard?id=${volunteerId}`, {
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