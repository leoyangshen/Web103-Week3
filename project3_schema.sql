-- Database Definition Language (DDL) and Data Manipulation Language (DML) for the Aura Nexus project.
-- 1. LOCATIONS TABLE (The clickable areas on the frontend)
CREATE TABLE locations (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
sector_code VARCHAR(50) UNIQUE NOT NULL, -- Used for URL paths/API requests (e.g., 'HYDRO', 'ADMIN')
description TEXT,
image_url TEXT -- Placeholder URL for the visual interface
);
-- 2. EVENTS TABLE (The data displayed on the detail pages)
CREATE TABLE events (
id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations(id), -- Foreign Key links the event to a specific location
title VARCHAR(255) NOT NULL,
start_date TIMESTAMP NOT NULL,
organizer VARCHAR(255),
details TEXT,
event_type VARCHAR(50) -- Categorization (e.g., 'MEETING', 'SOCIAL', 'SPORT')
);
-- 3. INITIAL DATA INSERTION (DML)
-- Insert the four required locations
INSERT INTO locations (name, sector_code, description, image_url) VALUES
('Hydroponics Dome', 'HYDRO', 'The primary food source and botanical research center. Surprisingly peaceful.', 'https://www.google.com/search?q=https://placehold.co/400x300/6A5ACD/ffffff%3Ftext%3DHydroponics%2BDome'),
('Central Command Spire', 'ADMIN', 'Where all operational decisions are made. Expect high-level briefings.', 'https://www.google.com/search?q=https://placehold.co/400x300/4682B4/ffffff%3Ftext%3DCommand%2BSpire'),
('Docking Bay Hangar', 'TRANSIT', 'The gateway to the stars. Always busy with cargo and personnel transfers.', 'https://www.google.com/search?q=https://placehold.co/400x300/B0C4DE/ffffff%3Ftext%3DDocking%2BBay'),
('Subterranean Geothermal Core', 'ENERGY', 'The core power source, deep below the surface. Safety gear required.', 'https://www.google.com/search?q=https://placehold.co/400x300/8B0000/ffffff%3Ftext%3DGeothermal%2BCore');
-- Insert events linked to the locations
INSERT INTO events (location_id, title, start_date, organizer, details, event_type) VALUES
-- Events in Hydroponics Dome (location_id: 1)
(1, 'Zero-G Yoga Session', '2025-10-10 10:00:00', 'Wellness Unit', 'A relaxing session among the terran ferns. RSVP required.', 'WELLNESS'),
(1, 'Botany Lunch-and-Learn', '2025-10-11 12:30:00', 'Lead Biologist', 'Discussing nitrogen cycle optimization in Sector C.', 'EDUCATION'),
-- Event in Central Command Spire (location_id: 2)
(2, 'Quarterly Colony Briefing', '2025-10-15 15:00:00', 'Director', 'Mandatory attendance for all sector leads.', 'MEETING'),
-- Event in Docking Bay Hangar (location_id: 3)
(3, 'Cargo Exchange Social', '2025-10-12 18:00:00', 'Transit Guild', 'Informal gathering of pilots and logistics staff.', 'SOCIAL'),
-- Event in Subterranean Geothermal Core (location_id: 4)
(4, 'Core Maintenance Scramble', '2025-10-13 08:00:00', 'Engineering Team', 'Volunteer effort to replace thermal regulators. High-risk.', 'SPORT');