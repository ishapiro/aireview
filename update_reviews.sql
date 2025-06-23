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