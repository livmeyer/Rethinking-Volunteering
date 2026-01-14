-- ===== VOLUNTEERS =====
-- Passwort ist jeweils "password123"
INSERT INTO volunteer (id, email, password, name, appointment_count) VALUES
        (1, 'anna@example.com', '', 'Anna Schmidt', 0),
        (2, 'max@example.com', '', 'Max Müller', 8),
        (3, 'lisa@example.com', '', 'Lisa Weber', 5);

-- ===== TIMESLOTS =====
-- Verfügbare Termine
INSERT INTO time_slot (id, start_time, volunteer_id, topics, location, is_booked, customer_name, completed) VALUES
                                                                                                               (1, '2026-01-20 09:00:00', 1, '[DOCUMENTS,TRAVEL]', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (2, '2026-01-20 10:00:00', 1, 'DOCUMENTS', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (3, '2026-01-20 11:00:00', 1, 'TRAVEL', 'MOOSACH', false, NULL, false),
                                                                                                               (4, '2026-01-21 14:00:00', 2, 'NEW_IN_MUNICH', 'SENDLING', false, NULL, false),
                                                                                                               (5, '2026-01-21 15:00:00', 2, 'NEW_IN_MUNICH', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (6, '2026-01-21 16:00:00', 2, 'GENERAL', 'MOOSACH', false, NULL, false),
                                                                                                               (7, '2026-01-22 09:00:00', 3, 'GENERAL', 'SENDLING', false, NULL, false),
                                                                                                               (8, '2026-01-22 10:00:00', 3, 'TRAVEL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (9, '2026-01-23 11:00:00', 1, 'NEW_IN_MUNICH', 'MOOSACH', false, NULL, false),
                                                                                                               (10, '2026-01-23 14:00:00', 2, 'DOCUMENTS', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (14, '2026-01-24 09:00:00', 1, 'TRAVEL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (15, '2026-01-24 10:30:00', 2, 'DOCUMENTS', 'MOOSACH', false, NULL, false),
                                                                                                               (17, '2026-01-24 15:00:00', 1, 'GENERAL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (18, '2026-01-25 08:30:00', 2, 'TRAVEL', 'MOOSACH', false, NULL, false),
                                                                                                               (19, '2026-01-25 11:00:00', 3, 'DOCUMENTS', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (20, '2026-01-25 14:30:00', 1, 'NEW_IN_MUNICH', 'SENDLING', false, NULL, false),
                                                                                                               (21, '2026-01-25 16:00:00', 2, 'GENERAL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (22, '2026-01-27 09:00:00', 3, 'TRAVEL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (23, '2026-01-27 10:00:00', 1, 'DOCUMENTS', 'MOOSACH', false, NULL, false),
                                                                                                               (24, '2026-01-27 13:30:00', 2, 'NEW_IN_MUNICH', 'SENDLING', false, NULL, false),
                                                                                                               (25, '2026-01-27 15:00:00', 3, 'GENERAL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (26, '2026-01-28 08:00:00', 1, 'TRAVEL', 'MOOSACH', false, NULL, false),
                                                                                                               (27, '2026-01-28 11:30:00', 2, 'DOCUMENTS', 'SENDLING', false, NULL, false),
                                                                                                               (28, '2026-01-28 14:00:00', 3, 'NEW_IN_MUNICH', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (29, '2026-01-28 16:30:00', 1, 'GENERAL', 'MOOSACH', false, NULL, false),
                                                                                                               (30, '2026-01-29 09:30:00', 2, 'TRAVEL', 'SENDLING', false, NULL, false),
                                                                                                               (31, '2026-01-29 12:00:00', 3, 'DOCUMENTS', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (32, '2026-01-29 15:00:00', 1, 'NEW_IN_MUNICH', 'MOOSACH', false, NULL, false),
                                                                                                               (33, '2026-01-30 10:00:00', 2, 'GENERAL', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (34, '2026-01-30 13:00:00', 3, 'TRAVEL', 'SENDLING', false, NULL, false),
                                                                                                               (35, '2026-01-30 14:30:00', 1, 'DOCUMENTS', 'MOOSACH', false, NULL, false),
                                                                                                               (36, '2026-01-31 09:00:00', 2, 'NEW_IN_MUNICH', 'CENTRAL_LIBRARY', false, NULL, false),
                                                                                                               (37, '2026-01-31 11:00:00', 3, 'GENERAL', 'SENDLING', false, NULL, false),
                                                                                                               (38, '2026-01-31 15:30:00', 1, 'TRAVEL', 'MOOSACH', false, NULL, false);

-- Bereits gebuchte Termine
INSERT INTO time_slot (id, start_time, volunteer_id, topics, location, is_booked, customer_name, completed) VALUES
        (11, '2026-01-18 09:00:00', 1, 'GENERAL', 'CENTRAL_LIBRARY', true, 'Peter Huber', true),
        (12, '2026-01-18 10:00:00', 2, 'TRAVEL', 'MOOSACH', true, 'Maria Klein', false),
        (13, '2026-01-19 14:00:00', 3, 'NEW_IN_MUNICH', 'SENDLING', true, 'Thomas Braun', true),
        (16, '2026-01-24 13:00:00', 3, 'NEW_IN_MUNICH', 'SENDLING', true, 'Hans P.', true);

ALTER TABLE volunteer ALTER COLUMN id RESTART WITH 100;
ALTER TABLE time_slot ALTER COLUMN id RESTART WITH 100