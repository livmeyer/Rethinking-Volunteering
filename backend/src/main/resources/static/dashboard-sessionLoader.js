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
        let topicName = session.topic.replaceAll('_',' ').replaceAll('[','').replaceAll(']','').replaceAll(',', ', ');
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
                <p>${topicName} • ${session.time}</p>
            </div>
            <div class="session-action" style="margin-left:auto;">
                ${checkboxHtml}
            </div>
        `;

        container.appendChild(item);
    });
}

function renderSessions() {
    const container = document.getElementById('sessionListContainer');
    container.innerHTML = '';

    if (currentState.sessions.upcoming.length + currentState.sessions.past.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888;">No sessions assigned yet.</p>';
        return;
    }

    currentState.sessions.past.forEach(session => {
        const dateObj = new Date(session.date);
        const isCompleted = session.status === 'COMPLETED';

        const item = document.createElement('div');
        item.className = 'history-item';
        item.style = "display: flex; align-items: center; gap: 2rem;";

        // If completed, disable the checkbox so they can't un-verify it easily
        const checkboxHtml = isCompleted
            ? `<span class="history-status completed">Verified</span>`
            : `<label class="checkbox-label">
                 <input type="checkbox" class="session-checkbox" data-id="${session.id}">
                 <span class="checkbox-text">Mark Complete</span>
               </label>`;

        let locationName = "";
        let topicName = session.topic.replaceAll('_',' ').replaceAll('[','').replaceAll(']','').replaceAll(',', ', ');
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
                <p>${topicName} • ${session.time}</p>
            </div>
            <div class="session-action" style="margin-left:auto;">
                ${checkboxHtml}
            </div>
        `;

        container.appendChild(item);
    });
    renderUpcoming()
}