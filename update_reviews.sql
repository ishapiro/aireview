UPDATE reviews
SET category_id = (
  SELECT id FROM categories WHERE slug = 'business-solutions'
)
WHERE category_id IS NULL;

-- Update review slugs using the improved slugify function
UPDATE reviews 
SET slug = public.slugify(title)
WHERE slug IS NULL OR slug = '';

-- For reviews that might have duplicate slugs after regeneration, add random suffixes
WITH duplicate_slugs AS (
  SELECT slug, COUNT(*) as count
  FROM reviews 
  GROUP BY slug 
  HAVING COUNT(*) > 1
),
slug_updates AS (
  SELECT 
    r.id,
    r.slug,
    CASE 
      WHEN ds.slug IS NOT NULL THEN 
        -- Add random 4-character suffix for duplicates
        CASE 
          WHEN length(r.slug) <= 21 THEN 
            r.slug || '-' || substr(md5(random()::text), 1, 4)
          ELSE 
            substr(r.slug, 1, 21) || '-' || substr(md5(random()::text), 1, 4)
        END
      ELSE r.slug
    END as new_slug
  FROM reviews r
  LEFT JOIN duplicate_slugs ds ON r.slug = ds.slug
)
UPDATE reviews 
SET slug = su.new_slug
FROM slug_updates su
WHERE reviews.id = su.id AND reviews.slug != su.new_slug;

-- Verify the results
SELECT id, title, slug, length(slug) as slug_length 
FROM reviews 
ORDER BY title
LIMIT 10;

-- Migration script to update rating field from integer to numeric(2,1)
-- This allows for decimal ratings in X.X format

-- Step 1: Add a new rating_new column
ALTER TABLE public.reviews ADD COLUMN rating_new numeric(2,1);

-- Step 2: Copy existing integer ratings to the new column (they will be converted to decimal)
UPDATE public.reviews SET rating_new = rating::numeric(2,1);

-- Step 3: Drop the old rating column
ALTER TABLE public.reviews DROP COLUMN rating;

-- Step 4: Rename the new column to rating
ALTER TABLE public.reviews RENAME COLUMN rating_new TO rating;

-- Step 5: Add the constraint for the new numeric column
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1.0 AND rating <= 5.0);

-- Step 6: Make the rating column NOT NULL
ALTER TABLE public.reviews ALTER COLUMN rating SET NOT NULL; 