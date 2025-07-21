const Database = require('./utils/database');

async function fixPlaceholderImages() {
    try {
        const db = Database.getInstance();
        
        // Update all via.placeholder.com URLs to null so they use our CSS placeholder
        const result = await db.run(
            "UPDATE articles SET image_url = NULL WHERE image_url LIKE '%via.placeholder.com%'"
        );
        
        console.log(`Updated ${result.changes} articles to remove placeholder URLs`);
        
        // Show some sample articles
        const articles = await db.all(
            "SELECT title, image_url FROM articles LIMIT 5"
        );
        
        console.log('\nSample articles:');
        articles.forEach(article => {
            console.log(`- ${article.title}: ${article.image_url || 'No image (will use CSS placeholder)'}`);
        });
        
    } catch (error) {
        console.error('Error fixing images:', error);
    }
}

fixPlaceholderImages();
