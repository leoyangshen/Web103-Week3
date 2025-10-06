-- WARNING: These UPDATE statements assume the primary key of your locations table is named 'id'
-- and that the order of the locations matches the order in your previous SELECT query.
-- If the order is different, you should use WHERE clauses that match the location names 
-- (e.g., WHERE name = 'Hydroponics Dome') to be 100% safe.

-- Assuming IDs 1-4 match the order shown in your SELECT:

-- 1. Hydroponics Dome (ID 1)
UPDATE locations
SET image_url = 'https://placehold.co/400x300/6A5ACD/ffffff?text=Hydroponics+Dome'
WHERE id = 1;

-- 2. Command Spire (ID 2)
UPDATE locations
SET image_url = 'https://placehold.co/400x300/4682B4/ffffff?text=Command+Spire'
WHERE id = 2;

-- 3. Docking Bay Hangar (ID 3)
UPDATE locations
SET image_url = 'https://placehold.co/400x300/B0C4DE/ffffff?text=Docking+Bay+Hangar'
WHERE id = 3;

-- 4. Subterranean Geothermal Core (ID 4)
UPDATE locations
SET image_url = 'https://placehold.co/400x300/8B0000/ffffff?text=Geothermal+Core'
WHERE id = 4;

-- NOTE: If you are unsure of the IDs, you can use the location name:
-- UPDATE locations
-- SET image_url = 'https://placehold.co/400x300/6A5ACD/ffffff?text=Hydroponics+Dome'
-- WHERE name = 'Hydroponics Dome';

-- You can verify the changes with:
-- SELECT id, name, image_url FROM locations;

