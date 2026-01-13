-- ===== VOLUNTEERS =====
-- Passwort ist jeweils "password123"
INSERT INTO volunteer (id, email, password, name, appointment_count) VALUES
                                                                         (1, 'anna@example.com', '', 'Anna Schmidt', 0),
                                                                         (2, 'max@example.com', '', 'Max Müller', 8),
                                                                         (3, 'lisa@example.com', '', 'Lisa Weber', 5);

-- ===== TIMESLOTS =====
-- Verfügbare Termine
INSERT INTO time_slot (id, start_time, end_time, volunteer_id, topic, location, is_booked, customer_name) VALUES
                                                                                                              (1, '2025-01-20 09:00:00', '2025-01-20 09:30:00', 1, 'BUERGERSERVICE', 'MUENCHEN_ZENTRUM', false, NULL),
                                                                                                              (2, '2025-01-20 10:00:00', '2025-01-20 10:30:00', 1, 'BUERGERSERVICE', 'MUENCHEN_ZENTRUM', false, NULL),
                                                                                                              (3, '2025-01-20 11:00:00', '2025-01-20 11:30:00', 1, 'ANMELDUNG', 'MUENCHEN_NORD', false, NULL),
                                                                                                              (4, '2025-01-21 14:00:00', '2025-01-21 14:30:00', 2, 'MVV', 'MUENCHEN_SUED', false, NULL),
                                                                                                              (5, '2025-01-21 15:00:00', '2025-01-21 15:30:00', 2, 'MVV', 'MUENCHEN_ZENTRUM', false, NULL),
                                                                                                              (6, '2025-01-21 16:00:00', '2025-01-21 16:30:00', 2, 'TECHNIK', 'MUENCHEN_NORD', false, NULL),
                                                                                                              (7, '2025-01-22 09:00:00', '2025-01-22 09:30:00', 3, 'TECHNIK', 'MUENCHEN_SUED', false, NULL),
                                                                                                              (8, '2025-01-22 10:00:00', '2025-01-22 10:30:00', 3, 'ANMELDUNG', 'MUENCHEN_ZENTRUM', false, NULL),
                                                                                                              (9, '2025-01-23 11:00:00', '2025-01-23 11:30:00', 1, 'MVV', 'MUENCHEN_NORD', false, NULL),
                                                                                                              (10, '2025-01-23 14:00:00', '2025-01-23 14:30:00', 2, 'BUERGERSERVICE', 'MUENCHEN_SUED', false, NULL);

-- Bereits gebuchte Termine
INSERT INTO time_slot (id, start_time, end_time, volunteer_id, topic, location, is_booked, customer_name) VALUES
                                                                                                              (11, '2025-01-18 09:00:00', '2025-01-18 09:30:00', 1, 'TECHNIK', 'MUENCHEN_ZENTRUM', true, 'Peter Huber'),
                                                                                                              (12, '2025-01-18 10:00:00', '2025-01-18 10:30:00', 2, 'ANMELDUNG', 'MUENCHEN_NORD', true, 'Maria Klein'),
                                                                                                              (13, '2025-01-19 14:00:00', '2025-01-19 14:30:00', 3, 'MVV', 'MUENCHEN_SUED', true, 'Thomas Braun');

ALTER TABLE volunteer ALTER COLUMN id RESTART WITH 100;
ALTER TABLE time_slot ALTER COLUMN id RESTART WITH 100;