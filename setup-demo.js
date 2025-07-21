#!/usr/bin/env node

/**
 * Demo Setup Script for News Flow App
 * This script prepares the application for a perfect demo
 */

const Database = require('./utils/database');
const bcrypt = require('bcryptjs');

async function setupDemo() {
    console.log('🎬 Setting up News Flow App for demo...\n');

    try {
        const db = Database.getInstance();

        // 1. Create demo user
        console.log('👤 Creating demo user...');
        const hashedPassword = await bcrypt.hash('demo123456', 12);
        
        await db.run(`
            INSERT OR REPLACE INTO users (email, password_hash, first_name, last_name, is_active, created_at)
            VALUES (?, ?, ?, ?, 1, datetime('now'))
        `, ['demo@newsflow.com', hashedPassword, 'Demo', 'User']);
        
        console.log('✅ Demo user created: demo@newsflow.com / demo123456');

        // 2. Add sample bookmarks for demo user
        console.log('\n📚 Adding sample bookmarks...');
        const user = await db.get('SELECT id FROM users WHERE email = ?', ['demo@newsflow.com']);

        if (user) {
            // Get some existing articles to bookmark
            const articles = await db.all('SELECT id FROM articles LIMIT 3');

            if (articles.length > 0) {
                for (const article of articles) {
                    await db.run(`
                        INSERT OR REPLACE INTO bookmarks (user_id, article_id, created_at)
                        VALUES (?, ?, datetime('now'))
                    `, [user.id, article.id]);
                }
                console.log(`✅ ${articles.length} sample bookmarks added for demo user`);
            } else {
                console.log('⚠️ No articles found to bookmark');
            }
        }

        // 3. Ensure sample articles exist
        console.log('\n📰 Checking sample articles...');
        const articleCount = await db.get('SELECT COUNT(*) as count FROM articles');
        console.log(`✅ ${articleCount.count} sample articles available`);

        // 4. Check categories
        console.log('\n📂 Checking categories...');
        const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories WHERE is_active = 1');
        console.log(`✅ ${categoryCount.count} categories available`);

        // 5. Display demo information
        console.log('\n🎯 DEMO SETUP COMPLETE!\n');
        console.log('📋 Demo Information:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🌐 Local URL:     http://localhost:3001');
        console.log('🚀 Live URL:      https://news-app-qdcn.onrender.com');
        console.log('👤 Demo User:     demo@newsflow.com');
        console.log('🔑 Password:      demo123456');
        console.log('📚 Bookmarks:     3 sample bookmarks ready');
        console.log('📰 Articles:      Sample data available');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log('\n🎬 Demo Features to Showcase:');
        console.log('✅ User Authentication (Register/Login)');
        console.log('✅ News Categories (Technology, Business, India, etc.)');
        console.log('✅ Search Functionality');
        console.log('✅ Bookmark System');
        console.log('✅ Responsive Design (Desktop/Tablet/Mobile)');
        console.log('✅ Dark/Light Theme Toggle');
        console.log('✅ Real-time NewsAPI Integration');
        console.log('✅ Professional UI/UX');
        
        console.log('\n🚀 Ready for demo! Start the server with: npm start');

    } catch (error) {
        console.error('❌ Demo setup failed:', error);
        process.exit(1);
    }
}

// Run setup if called directly
if (require.main === module) {
    setupDemo();
}

module.exports = { setupDemo };
