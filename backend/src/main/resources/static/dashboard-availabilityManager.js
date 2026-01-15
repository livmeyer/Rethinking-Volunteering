// for adding availability
// -------------------------------

let availabilities = [];
let current = { topics: [], location: null, day: null, timeSlots: [] }

function toggleTopic(id) {
    const idx = current.topics.indexOf(id);
    idx > -1 ? current.topics.splice(idx, 1) : current.topics.push(id);
}

function setLocation(inputElement, id) {
    current.location = id;
    document.querySelectorAll('.location-item').forEach(item => item.classList.remove('selected'));
    const parentLabel = inputElement.closest('.location-item');
    if (parentLabel) parentLabel.classList.add('selected');
}

function setDate(date) {
    current.day = date;
    current.timeSlots = [];
    document.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('selected'));
}

function toggleTimeSlot(el, time) {
    el.classList.toggle('selected');
    const idx = current.timeSlots.indexOf(time);
    idx > -1 ? current.timeSlots.splice(idx, 1) : current.timeSlots.push(time);
}

function saveSlotsForDay() {
    console.log("Current State" + current);
    if (!current.topics.length || !current.location || !current.day || !current.timeSlots.length) {
        alert('Bitte alle Felder ausfüllen');
        return;
    }

    const availability = {
        volunteerId: parseInt(localStorage.getItem("volunteerId")),  // int, nicht String
        topics: [...current.topics],
        location: current.location,
        day: current.day,
        timeSlots: current.timeSlots.map(time => {
            if (typeof time === 'number') {
                return `${time.toString().padStart(2, '0')}:00:00`;
            }
            return time.includes(':00:00') ? time : `${time}:00`;
        })
    };

    availabilities.push(availability);

    // Reset
    current = { topics: [], location: null, day: null, timeSlots: [] };
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.checked = false);
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

    console.log('Gespeichert:', availability);
    console.log('Alle Verfügbarkeiten:', availabilities);
}

async function saveAllAvailabilities() {
    if (current.timeSlots.length) {
        saveSlotsForDay();
    }
    if (!availabilities.length) return;

    const response = await fetch('/api/volunteers/createTimeSlots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availabilities)
    });
    console.log('Response Status:', response.status);

    if (response.ok) {
        availabilities = [];
        initDashboard();
        alert('Gespeichert!');
    }
}