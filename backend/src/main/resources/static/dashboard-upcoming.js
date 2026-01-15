function renderUpcoming() {
    const container = document.getElementById('upcomingListContainer');
    container.innerHTML = '';

    if (currentState.sessions.upcoming.length=== 0) {
        container.innerHTML = '<p style="text-align:center;">No upcoming sessions.</p>';
        return;
    }

    currentState.sessions.upcoming.forEach(session => {
        const dateObj = new Date(session.date);
        const isBooked = session.status === 'PENDING';

        const item = document.createElement('div');
        item.className = 'history-item';
        item.style = "display: flex; align-items: center; gap: 2rem;";

        // If completed, disable the checkbox so they can't un-verify it easily
        const checkboxHtml = isBooked
            ? `<span class="history-status completed">Booked</span>`
            : `<span class="history-status upcoming">Open</span>`

        let locationName = "";
        switch(session.location) {
            case "CENTRAL_LIBRARY": locationName = "Central Library"; break;
            case "MOOSACH": locationName = "Moosach Library"; break;
            case "SENDLING": locationName = "Sendling Senior Center"; break;
            case "SCHWABING": locationName = "Schwabing Community Center"; break;
            default: locationName = "";
        }
        item.innerHTML = `
            <div class="history-date">
                <span class="day">${dateObj.getDate()}</span>
                <span class="month">${dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
            </div>
            <div class="history-info">
                <h4>${locationName}</h4>
                <p>${session.topic.replaceAll('_',' ')} • ${session.time}</p>
            </div>
            <div class="session-action" style="margin-left:auto;">
                ${checkboxHtml}
            </div>
        `;

        container.appendChild(item);
    });
}