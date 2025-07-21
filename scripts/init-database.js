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
