-- Add location fields to platforms table
ALTER TABLE platforms 
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_city TEXT;

-- Create index for location queries
CREATE INDEX IF NOT EXISTS idx_platforms_location ON platforms(location_country, location_city);
