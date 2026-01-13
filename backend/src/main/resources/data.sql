-- ===== VOLUNTEERS =====
-- Passwort ist jeweils "password123"
INSERT INTO volunteer (id, email, password, name, appointment_count) VALUES
        (1, 'anna@example.com', '', 'Anna Schmidt', 0),
        (2, 'max@example.com', '', 'Max Müller', 8),
        (3, 'lisa@example.com', '', 'Lisa Weber', 5);

-- ===== TIMESLOTS =====
-- Verfügbare Termine
INSERT INTO time_slot (id, start_time, volunteer_id, topic, location, is_booked, customer_name) VALUES
        (1, '2025-01-20 09:00:00', 1, 'DOCUMENTS_REGISTRATION', 'CENTRAL_LIBRARY', false, NULL),
        (2, '2025-01-20 10:00:00', 1, 'DOCUMENTS_REGISTRATION', 'CENTRAL_LIBRARY', false, NULL),
        (3, '2025-01-20 11:00:00', 1, 'TICKETS_TRAVEL', 'MOOSACH_LIBRARY', false, NULL),
        (4, '2025-01-21 14:00:00', 2, 'NEW_IN_MUNICH', 'SENDLING_SENIOR_CENTER', false, NULL),
        (5, '2025-01-21 15:00:00', 2, 'NEW_IN_MUNICH', 'CENTRAL_LIBRARY', false, NULL),
        (6, '2025-01-21 16:00:00', 2, 'GENERAL_QUESTIONS', 'MOOSACH_LIBRARY', false, NULL),
        (7, '2025-01-22 09:00:00', 3, 'GENERAL_QUESTIONS', 'SENDLING_SENIOR_CENTER', false, NULL),
        (8, '2025-01-22 10:00:00', 3, 'TICKETS_TRAVEL', 'CENTRAL_LIBRARY', false, NULL),
        (9, '2025-01-23 11:00:00', 1, 'NEW_IN_MUNICH', 'MOOSACH_LIBRARY', false, NULL),
        (10, '2025-01-23 14:00:00', 2, 'DOCUMENTS_REGISTRATION', 'CENTRAL_LIBRARY', false, NULL);

-- Bereits gebuchte Termine
INSERT INTO time_slot (id, start_time, volunteer_id, topic, location, is_booked, customer_name) VALUES
        (11, '2025-01-18 09:00:00', 1, 'GENERAL_QUESTIONS', 'CENTRAL_LIBRARY', true, 'Peter Huber'),
        (12, '2025-01-18 10:00:00', 2, 'TICKETS_TRAVEL', 'MOOSACH_LIBRARY', true, 'Maria Klein'),
        (13, '2025-01-19 14:00:00', 3, 'NEW_IN_MUNICH', 'SENDLING_SENIOR_CENTER', true, 'Thomas Braun');

ALTER TABLE volunteer ALTER COLUMN id RESTART WITH 100;
ALTER TABLE time_slot ALTER COLUMN id RESTART WITH 100