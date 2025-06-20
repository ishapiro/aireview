UPDATE reviews
SET category_id = (
  SELECT id FROM categories WHERE slug = 'business-solutions'
)
WHERE category_id IS NULL; 