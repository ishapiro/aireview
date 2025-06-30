# Category Populator Feature

## Overview

**Categories are now called TAGS for the users as this makes more sense given their use**

The Categories Populator is a powerful AI-driven feature that allows administrators to automatically populate categories with multiple product reviews. This feature streamlines the process of creating comprehensive review content for new or existing categories.

## Features

- **Category Management**: Automatically creates new categories or uses existing ones
- **AI Product Generation**: Uses AI to generate a list of popular products in a category
- **Duplicate Prevention**: Checks for existing reviews before generating new ones
- **Batch Processing**: Generates multiple reviews with progress tracking
- **Quality Control**: Each review includes title, summary, content, rating, and reasoning

## How to Use

### Step 1: Access the Feature

1. Navigate to the Admin Dashboard: `https://cogitations-reviews.vercel.app/admin`
2. In the Quick Actions section, click the "Populate a Category" button

### Step 2: Enter Category Name

1. Enter the name of the category you want to populate (e.g., "Smartphones", "Laptops", "Gaming")
2. Click "Continue"
3. The system will:
   - Check if the category already exists
   - Create a new category if it doesn't exist

### Step 3: Generate Product List

1. Review the category information
2. Click "Generate Product List"
3. The AI will generate a list of 10 popular products in that category

### Step 4: Generate Reviews

1. Review the list of products that will be reviewed
2. Click "Start Generating Reviews"
3. The system will:
   - Check for existing reviews to avoid duplicates
   - Generate detailed reviews for each product
   - Show progress with a progress bar
   - Create reviews with proper categories and metadata

### Step 5: Review Results

1. View the completion summary
2. See a list of all generated reviews with ratings
3. Click "View" on any review to edit or manage it
4. Click "Close" to finish

## Technical Details

### AI Integration

The feature uses the existing AI infrastructure:
- **Product List Generation**: Uses structured prompts to generate product lists
- **Review Generation**: Creates detailed reviews with consistent formatting
- **Rating System**: Generates realistic ratings with reasoning

### Database Integration

- **Categories**: Automatically creates or uses existing categories
- **Reviews**: Creates reviews with proper metadata and relationships
- **Categories**: Links reviews to the appropriate category
- **AI Flagging**: Marks all generated reviews as AI-generated

### Error Handling

- **Duplicate Detection**: Skips products that already have reviews
- **Rate Limiting**: Includes delays to avoid API rate limits
- **Error Recovery**: Continues processing even if individual reviews fail
- **Progress Tracking**: Shows real-time progress and current product

## Generated Review Format

Each AI-generated review includes:

- **Title**: Product name
- **Summary**: Brief overview of the product
- **Content**: Detailed review with pros, cons, features, and performance
- **Rating**: 1-5 star rating
- **Reasoning**: Explanation for the rating
- **Metadata**: AI-generated flag, category association, author information

## Best Practices

1. **Category Names**: Use specific, descriptive category names
2. **Review Quality**: All generated reviews are marked as AI-generated for transparency
3. **Manual Review**: Consider reviewing and editing generated content before publishing
4. **Category Management**: Use existing categories when possible to maintain consistency

## Limitations

- **API Dependencies**: Requires the AI service to be available
- **Rate Limits**: Includes delays to respect API rate limits
- **Content Quality**: Generated content should be reviewed for accuracy
- **Category Specificity**: Works best with well-defined product categories

## Troubleshooting

### Common Issues

1. **No Products Generated**: Check the category name and try again
2. **API Errors**: Verify the AI service is available
3. **Duplicate Reviews**: The system automatically skips existing reviews
4. **Progress Stuck**: Check the browser console for error messages

### Support

For issues or questions about the Category Populator feature, please contact the development team or check the application logs for detailed error information. 