#!/usr/bin/env node

/**
 * Add sample India news articles to fix the India category
 */

const Database = require('./utils/database');

async function addIndiaSampleData() {
    console.log('🇮🇳 Adding sample India news articles...\n');

    try {
        const db = Database.getInstance();

        // Get India category ID
        const indiaCategory = await db.get('SELECT id FROM categories WHERE name = ?', ['india']);
        
        if (!indiaCategory) {
            console.log('❌ India category not found, creating it...');
            await db.run(`
                INSERT INTO categories (name, display_name, description, sort_order, is_active)
                VALUES ('india', 'India', 'News from India and Indian affairs', 4, 1)
            `);
            const newCategory = await db.get('SELECT id FROM categories WHERE name = ?', ['india']);
            indiaCategory.id = newCategory.id;
        }

        // Sample India news articles
        const indiaArticles = [
            {
                title: "India's Digital Revolution: UPI Transactions Cross 10 Billion Monthly",
                description: "India's Unified Payments Interface (UPI) has achieved a historic milestone, processing over 10 billion transactions in a single month, showcasing the country's digital payment revolution.",
                content: "The digital payments landscape in India continues to evolve rapidly with UPI leading the charge...",
                url: "https://example.com/india-upi-milestone",
                image_url: "https://via.placeholder.com/400x200/FF6B35/ffffff?text=UPI+Digital+India",
                source_name: "Economic Times India",
                author: "Tech Reporter",
                published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            },
            {
                title: "Monsoon Update: Heavy Rainfall Expected Across Northern India",
                description: "The India Meteorological Department has issued weather warnings for heavy to very heavy rainfall across northern states including Delhi, Punjab, and Haryana.",
                content: "The monsoon season brings crucial rainfall to India's agricultural regions...",
                url: "https://example.com/india-monsoon-update",
                image_url: "https://via.placeholder.com/400x200/4A90E2/ffffff?text=Monsoon+India",
                source_name: "India Today",
                author: "Weather Desk",
                published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
            },
            {
                title: "Indian Space Program: Chandrayaan-4 Mission Approved by Government",
                description: "The Indian government has approved the ambitious Chandrayaan-4 lunar mission, marking another milestone in India's space exploration journey.",
                content: "ISRO's continued success in space missions has positioned India as a major space power...",
                url: "https://example.com/chandrayaan-4-approved",
                image_url: "https://via.placeholder.com/400x200/8E44AD/ffffff?text=ISRO+Space+Mission",
                source_name: "The Hindu",
                author: "Science Correspondent",
                published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
            },
            {
                title: "Bollywood Box Office: Latest Releases Show Strong Performance",
                description: "Recent Bollywood releases are showing encouraging box office numbers, indicating a recovery in the Indian film industry post-pandemic.",
                content: "The entertainment industry in India is bouncing back with renewed vigor...",
                url: "https://example.com/bollywood-box-office",
                image_url: "https://via.placeholder.com/400x200/E74C3C/ffffff?text=Bollywood+News",
                source_name: "Filmfare",
                author: "Entertainment Editor",
                published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
            },
            {
                title: "India's Renewable Energy Milestone: Solar Capacity Reaches 70 GW",
                description: "India has achieved a significant milestone in renewable energy with solar power capacity reaching 70 gigawatts, moving closer to its 2030 targets.",
                content: "The renewable energy sector in India is experiencing unprecedented growth...",
                url: "https://example.com/india-solar-milestone",
                image_url: "https://via.placeholder.com/400x200/27AE60/ffffff?text=Solar+Energy+India",
                source_name: "Business Standard",
                author: "Energy Reporter",
                published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
            },
            {
                title: "Cricket Update: India Prepares for Upcoming Test Series",
                description: "The Indian cricket team is gearing up for the upcoming Test series with intensive training sessions and strategic planning.",
                content: "Cricket remains the most popular sport in India with millions of passionate fans...",
                url: "https://example.com/india-cricket-test-series",
                image_url: "https://via.placeholder.com/400x200/F39C12/ffffff?text=Cricket+India",
                source_name: "ESPN Cricinfo",
                author: "Sports Correspondent",
                published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() // 16 hours ago
            }
        ];

        // Insert sample articles
        for (const article of indiaArticles) {
            await db.run(`
                INSERT OR REPLACE INTO articles 
                (title, description, content, url, image_url, source_name, author, published_at, category_id, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
            `, [
                article.title,
                article.description,
                article.content,
                article.url,
                article.image_url,
                article.source_name,
                article.author,
                article.published_at,
                indiaCategory.id
            ]);
        }

        console.log(`✅ Added ${indiaArticles.length} sample India articles`);
        console.log('🇮🇳 India category is now ready with sample data!');
        console.log('\n🎯 Test the India category now - it should show sample articles');

    } catch (error) {
        console.error('❌ Failed to add India sample data:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    addIndiaSampleData();
}

module.exports = { addIndiaSampleData };
