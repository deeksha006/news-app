const Database = require('../utils/database');

// Additional news articles for categories that need more content
const additionalNews = {
    business: [
        {
            title: "Amazon Announces $100 Billion Investment in Green Technology",
            description: "Amazon commits to massive investment in renewable energy and sustainable logistics, aiming for carbon neutrality by 2030.",
            url: "https://example.com/amazon-green-investment",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Amazon+Green",
            source_name: "Bloomberg",
            author: "Rachel Green",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Microsoft Acquires Leading AI Startup for $15 Billion",
            description: "Microsoft's largest acquisition this year focuses on advanced machine learning capabilities for enterprise solutions.",
            url: "https://example.com/microsoft-ai-acquisition",
            image_url: "https://via.placeholder.com/400x200/3498db/ffffff?text=Microsoft+AI",
            source_name: "TechCrunch",
            author: "Mark Stevens",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Global Supply Chain Disruption Costs Reach $2 Trillion",
            description: "New study reveals the massive economic impact of supply chain disruptions on global trade and manufacturing.",
            url: "https://example.com/supply-chain-costs",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Supply+Chain",
            source_name: "Wall Street Journal",
            author: "Lisa Chang",
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Startup Unicorns Hit Record High with 200 New Companies",
            description: "The number of billion-dollar startups reaches unprecedented levels, driven by AI, fintech, and clean energy sectors.",
            url: "https://example.com/startup-unicorns-record",
            image_url: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=Startup+Unicorns",
            source_name: "Forbes",
            author: "Jennifer Walsh",
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        }
    ],
    india: [
        {
            title: "India Becomes World's Largest Solar Panel Manufacturer",
            description: "India overtakes China to become the global leader in solar panel production, boosting renewable energy sector employment.",
            url: "https://example.com/india-solar-manufacturing-leader",
            image_url: "https://via.placeholder.com/400x200/f39c12/ffffff?text=Solar+India",
            source_name: "Economic Times",
            author: "Vikram Gupta",
            published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Indian Railways Completes Electrification of Entire Network",
            description: "Historic milestone achieved as Indian Railways becomes the world's largest fully electrified railway network, reducing carbon emissions significantly.",
            url: "https://example.com/indian-railways-electrification",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Railway+Electric",
            source_name: "Railway Gazette",
            author: "Suresh Reddy",
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Bangalore Emerges as Global AI Research Hub",
            description: "India's Silicon Valley attracts major tech giants and startups, establishing itself as a leading center for artificial intelligence research.",
            url: "https://example.com/bangalore-ai-research-hub",
            image_url: "https://via.placeholder.com/400x200/3498db/ffffff?text=Bangalore+AI",
            source_name: "Tech India",
            author: "Priya Nair",
            published_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "India's Space Program Launches 50 Satellites in Single Mission",
            description: "ISRO sets new record with successful deployment of 50 satellites, showcasing India's growing capabilities in space technology.",
            url: "https://example.com/isro-50-satellites-launch",
            image_url: "https://via.placeholder.com/400x200/2c3e50/ffffff?text=ISRO+Launch",
            source_name: "Space India",
            author: "Dr. Kiran Rao",
            published_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
        }
    ],
    politics: [
        {
            title: "G20 Summit Addresses Global Economic Recovery Plan",
            description: "World leaders gather to discuss coordinated response to economic challenges and sustainable development goals.",
            url: "https://example.com/g20-economic-recovery-plan",
            image_url: "https://via.placeholder.com/400x200/34495e/ffffff?text=G20+Summit",
            source_name: "International Herald",
            author: "Thomas Anderson",
            published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Historic Peace Agreement Signed in Middle East",
            description: "Breakthrough diplomatic negotiations result in comprehensive peace accord, ending decades of regional conflict.",
            url: "https://example.com/middle-east-peace-agreement",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Peace+Agreement",
            source_name: "Global News",
            author: "Sarah Mitchell",
            published_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "International Cybersecurity Treaty Ratified by 100 Nations",
            description: "Landmark agreement establishes global standards for cybersecurity cooperation and digital crime prevention.",
            url: "https://example.com/cybersecurity-treaty-ratified",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Cyber+Treaty",
            source_name: "Diplomatic Times",
            author: "Ambassador John Clarke",
            published_at: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Women's Leadership Initiative Launches Globally",
            description: "International program aims to increase women's representation in government and corporate leadership roles worldwide.",
            url: "https://example.com/womens-leadership-initiative",
            image_url: "https://via.placeholder.com/400x200/e91e63/ffffff?text=Women+Leadership",
            source_name: "Women's Global Network",
            author: "Dr. Maria Santos",
            published_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
        }
    ],
    entertainment: [
        {
            title: "Virtual Reality Cinema Revolutionizes Movie Experience",
            description: "New VR theaters offer immersive 360-degree movie experiences, allowing viewers to step inside their favorite films.",
            url: "https://example.com/vr-cinema-revolution",
            image_url: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=VR+Cinema",
            source_name: "Cinema Today",
            author: "Ryan Cooper",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "AI-Generated Music Wins Grammy Award for First Time",
            description: "Artificial intelligence composition takes home prestigious Grammy, sparking debate about creativity and technology in music.",
            url: "https://example.com/ai-music-grammy-award",
            image_url: "https://via.placeholder.com/400x200/f39c12/ffffff?text=AI+Grammy",
            source_name: "Music Industry News",
            author: "Jessica Taylor",
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Streaming Wars: New Platform Challenges Netflix Dominance",
            description: "Revolutionary streaming service with interactive content and AI-powered recommendations gains 100 million subscribers in first year.",
            url: "https://example.com/streaming-wars-new-platform",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Streaming+Wars",
            source_name: "Digital Entertainment",
            author: "Michael Brown",
            published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Celebrity Hologram Concerts Sell Out Worldwide",
            description: "Deceased music legends perform again through advanced hologram technology, creating unprecedented entertainment experiences.",
            url: "https://example.com/hologram-concerts-worldwide",
            image_url: "https://via.placeholder.com/400x200/1abc9c/ffffff?text=Hologram+Concert",
            source_name: "Entertainment Weekly",
            author: "Amanda Davis",
            published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
        }
    ]
};

async function addMoreNews() {
    console.log('📰 Adding more news articles to balance categories...');
    
    try {
        const db = Database.getInstance();
        
        // Get category mappings
        const categories = await db.all('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });
        
        let totalAdded = 0;
        
        for (const [categoryName, articles] of Object.entries(additionalNews)) {
            const categoryId = categoryMap[categoryName];
            if (!categoryId) {
                console.log(`⚠️  Category '${categoryName}' not found, skipping...`);
                continue;
            }
            
            console.log(`📝 Adding ${articles.length} more articles for ${categoryName}...`);
            
            for (const article of articles) {
                try {
                    await db.run(`
                        INSERT OR REPLACE INTO articles 
                        (title, description, url, image_url, source_name, author, published_at, category_id, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        article.title,
                        article.description,
                        article.url,
                        article.image_url,
                        article.source_name,
                        article.author,
                        article.published_at,
                        categoryId,
                        new Date().toISOString()
                    ]);
                    totalAdded++;
                } catch (error) {
                    console.error(`❌ Error adding article: ${article.title}`, error.message);
                }
            }
        }
        
        console.log(`✅ Successfully added ${totalAdded} more news articles!`);
        
        // Show final summary by category
        console.log('\n📊 Final articles count by category:');
        const allCategories = await db.all('SELECT name FROM categories ORDER BY name');
        for (const category of allCategories) {
            const count = await db.get(`
                SELECT COUNT(*) as count 
                FROM articles a 
                JOIN categories c ON a.category_id = c.id 
                WHERE c.name = ?
            `, [category.name]);
            console.log(`   ${category.name}: ${count.count} articles`);
        }
        
    } catch (error) {
        console.error('💥 Error adding more news:', error);
    }
}

// Run if called directly
if (require.main === module) {
    addMoreNews()
        .then(() => {
            console.log('🎉 Additional news data added successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('💥 Failed to add additional news:', err);
            process.exit(1);
        });
}

module.exports = { addMoreNews };
