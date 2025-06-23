-- This script migrates data from the old single-category setup to the new many-to-many setup.
-- It moves the category_id from the 'reviews' table to the new 'review_categories' join table.

-- Start a transaction
BEGIN;

-- Insert records into review_categories based on the existing category_id in the reviews table.
-- This will only apply to reviews that have a category assigned.
INSERT INTO public.review_categories (review_id, category_id)
SELECT id, category_id
FROM public.reviews
WHERE category_id IS NOT NULL
ON CONFLICT (review_id, category_id) DO NOTHING;

-- After running this migration and verifying the data, you can run the following command
-- to remove the old 'category_id' column from the 'reviews' table.
-- It is commented out by default to prevent accidental data loss.

-- ALTER TABLE public.reviews
-- DROP COLUMN category_id;

-- End transaction
COMMIT;

-- Migration script to fix existing category slugs
-- This script will regenerate slugs for all categories to ensure they meet the new requirements

-- First, let's see what we have
SELECT id, name, slug FROM categories ORDER BY name;

-- Update all category slugs using the improved slugify function
UPDATE categories 
SET slug = public.slugify(name)
WHERE slug IS NULL OR slug = '';

-- For categories that might have duplicate slugs after regeneration, add random suffixes
WITH duplicate_slugs AS (
  SELECT slug, COUNT(*) as count
  FROM categories 
  GROUP BY slug 
  HAVING COUNT(*) > 1
),
slug_updates AS (
  SELECT 
    c.id,
    c.slug,
    CASE 
      WHEN ds.slug IS NOT NULL THEN 
        -- Add random 4-character suffix for duplicates
        CASE 
          WHEN length(c.slug) <= 21 THEN 
            c.slug || '-' || substr(md5(random()::text), 1, 4)
          ELSE 
            substr(c.slug, 1, 21) || '-' || substr(md5(random()::text), 1, 4)
        END
      ELSE c.slug
    END as new_slug
  FROM categories c
  LEFT JOIN duplicate_slugs ds ON c.slug = ds.slug
)
UPDATE categories 
SET slug = su.new_slug
FROM slug_updates su
WHERE categories.id = su.id AND categories.slug != su.new_slug;

-- Verify the results
SELECT id, name, slug, length(slug) as slug_length 
FROM categories 
ORDER BY name; 