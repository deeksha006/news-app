const Database = require('./utils/database');

async function clearSampleData() {
    try {
        const db = Database.getInstance();
        
        console.log('🧹 Clearing all sample/fake articles from database...');
        
        // Delete all articles that were manually inserted (sample data)
        // Keep only articles that came from real NewsAPI (have proper URLs)
        const result = await db.run(`
            DELETE FROM articles 
            WHERE url LIKE 'https://example.com/%' 
            OR url LIKE '%placeholder%'
            OR source_name IN ('Tech Today', 'AI Weekly', 'Business Daily', 'Sports Central', 'India Today', 'Political Times', 'Entertainment Weekly')
        `);
        
        console.log(`✅ Deleted ${result.changes} sample articles`);
        
        // Show remaining articles count
        const remaining = await db.get('SELECT COUNT(*) as count FROM articles');
        console.log(`📊 Remaining real articles in database: ${remaining.count}`);
        
        // Show sample of remaining articles
        const realArticles = await db.all(`
            SELECT title, source_name, url 
            FROM articles 
            WHERE url NOT LIKE 'https://example.com/%'
            LIMIT 5
        `);
        
        if (realArticles.length > 0) {
            console.log('\n📰 Sample of real articles:');
            realArticles.forEach((article, index) => {
                console.log(`${index + 1}. ${article.title}`);
                console.log(`   Source: ${article.source_name}`);
                console.log(`   URL: ${article.url.substring(0, 60)}...`);
                console.log('');
            });
        } else {
            console.log('\n🔄 No cached articles - fresh news will be fetched from NewsAPI');
        }
        
    } catch (error) {
        console.error('❌ Error clearing sample data:', error);
    }
}

clearSampleData();
