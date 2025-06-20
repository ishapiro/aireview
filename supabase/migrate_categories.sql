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