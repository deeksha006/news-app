const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '..', 'database', 'newsapp.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        console.log('🗄️  Initializing database...');
        
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
                return;
            }
            console.log('✅ Connected to SQLite database');
        });

        // Read and execute schema
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        
        db.exec(schema, (err) => {
            if (err) {
                console.error('❌ Error executing schema:', err.message);
                reject(err);
                return;
            }
            console.log('✅ Database schema created successfully');
            
            // Insert sample data
            insertSampleData(db)
                .then(() => {
                    db.close((err) => {
                        if (err) {
                            console.error('❌ Error closing database:', err.message);
                            reject(err);
                        } else {
                            console.log('✅ Database initialization completed');
                            resolve();
                        }
                    });
                })
                .catch(reject);
        });
    });
}

// Insert sample data
function insertSampleData(db) {
    return new Promise((resolve, reject) => {
        console.log('📝 Inserting sample data...');
        
        const sampleArticles = [
            {
                title: 'Latest Tech Innovations Reshape Industry',
                description: 'Discover the cutting-edge technologies that are transforming how we work and live in the digital age.',
                url: 'https://example.com/tech-innovations',
                image_url: 'https://via.placeholder.com/400x200/3498db/ffffff?text=Technology',
                source_name: 'Tech Today',
                author: 'John Smith',
                published_at: new Date().toISOString(),
                category_id: 1
            },
            {
                title: 'AI Revolution: What\'s Next?',
                description: 'Artificial Intelligence continues to evolve rapidly, bringing new possibilities and challenges to various industries.',
                url: 'https://example.com/ai-revolution',
                image_url: 'https://via.placeholder.com/400x200/2ecc71/ffffff?text=AI+News',
                source_name: 'AI Weekly',
                author: 'Sarah Johnson',
                published_at: new Date().toISOString(),
                category_id: 1
            },
            {
                title: 'Global Markets Show Strong Growth',
                description: 'International markets demonstrate resilience with steady growth across multiple sectors this quarter.',
                url: 'https://example.com/market-growth',
                image_url: 'https://via.placeholder.com/400x200/f39c12/ffffff?text=Business',
                source_name: 'Business Daily',
                author: 'Michael Brown',
                published_at: new Date().toISOString(),
                category_id: 2
            },
            {
                title: 'Championship Series Begins',
                description: 'The highly anticipated cricket championship series kicks off with exciting matches between top teams.',
                url: 'https://example.com/cricket-championship',
                image_url: 'https://via.placeholder.com/400x200/9b59b6/ffffff?text=Cricket',
                source_name: 'Sports Central',
                author: 'David Wilson',
                published_at: new Date().toISOString(),
                category_id: 3
            },
            {
                title: "India's Digital Revolution: UPI Transactions Cross 10 Billion Monthly",
                description: "India's Unified Payments Interface (UPI) has achieved a historic milestone, processing over 10 billion transactions in a single month.",
                url: 'https://example.com/india-upi-milestone',
                image_url: 'https://via.placeholder.com/400x200/FF6B35/ffffff?text=UPI+Digital+India',
                source_name: 'Economic Times India',
                author: 'Tech Reporter',
                published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                category_id: 4
            },
            {
                title: 'Monsoon Update: Heavy Rainfall Expected Across Northern India',
                description: 'The India Meteorological Department has issued weather warnings for heavy to very heavy rainfall across northern states.',
                url: 'https://example.com/india-monsoon-update',
                image_url: 'https://via.placeholder.com/400x200/4A90E2/ffffff?text=Monsoon+India',
                source_name: 'India Today',
                author: 'Weather Desk',
                published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                category_id: 4
            },
            {
                title: 'Indian Space Program: Chandrayaan-4 Mission Approved by Government',
                description: 'The Indian government has approved the ambitious Chandrayaan-4 lunar mission, marking another milestone in India\'s space exploration.',
                url: 'https://example.com/chandrayaan-4-approved',
                image_url: 'https://via.placeholder.com/400x200/8E44AD/ffffff?text=ISRO+Space+Mission',
                source_name: 'The Hindu',
                author: 'Science Correspondent',
                published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                category_id: 4
            },
            {
                title: 'Government Announces New Infrastructure Development Plan',
                description: 'The administration unveils a comprehensive infrastructure development plan focusing on transportation, digital connectivity, and sustainable energy projects.',
                url: 'https://example.com/infrastructure-plan',
                image_url: 'https://via.placeholder.com/400x200/34495e/ffffff?text=Infrastructure+Policy',
                source_name: 'Political Times',
                author: 'Policy Reporter',
                published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                category_id: 5
            },
            {
                title: 'Legislative Session: Key Bills Under Review',
                description: 'Parliament is reviewing several important bills including healthcare reform, education funding, and environmental protection measures.',
                url: 'https://example.com/legislative-session',
                image_url: 'https://via.placeholder.com/400x200/8E44AD/ffffff?text=Legislative+Session',
                source_name: 'Government Gazette',
                author: 'Legislative Correspondent',
                published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                category_id: 5
            }
        ];

        const insertArticle = db.prepare(`
            INSERT OR IGNORE INTO articles 
            (title, description, url, image_url, source_name, author, published_at, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let completed = 0;
        sampleArticles.forEach(article => {
            insertArticle.run([
                article.title,
                article.description,
                article.url,
                article.image_url,
                article.source_name,
                article.author,
                article.published_at,
                article.category_id
            ], (err) => {
                if (err) {
                    console.error('❌ Error inserting article:', err.message);
                } else {
                    completed++;
                    if (completed === sampleArticles.length) {
                        insertArticle.finalize();
                        console.log(`✅ Inserted ${completed} sample articles`);
                        resolve();
                    }
                }
            });
        });
    });
}

// Run initialization if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('🎉 Database setup complete!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('💥 Database setup failed:', err);
            process.exit(1);
        });
}

module.exports = { initializeDatabase };
