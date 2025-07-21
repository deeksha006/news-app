const Database = require('./utils/database');

async function clearCache() {
    try {
        const db = Database.getInstance();
        
        console.log('🧹 Clearing all cached articles to fetch fresh ones with real images...');
        
        // Delete all cached articles so fresh ones with real images will be fetched
        const result = await db.run('DELETE FROM articles');
        
        console.log(`✅ Deleted ${result.changes} cached articles`);
        console.log('🔄 Fresh articles with real images will be fetched on next request');
        
    } catch (error) {
        console.error('❌ Error clearing cache:', error);
    }
}

clearCache();
