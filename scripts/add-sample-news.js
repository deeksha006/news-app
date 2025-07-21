const Database = require('../utils/database');

// Comprehensive sample news data for all categories
const sampleNewsData = {
    technology: [
        {
            title: "AI Revolution: ChatGPT-5 Breaks New Ground in Reasoning",
            description: "The latest AI model demonstrates unprecedented capabilities in logical reasoning and creative problem-solving, marking a significant leap forward in artificial intelligence.",
            url: "https://example.com/ai-chatgpt5-breakthrough",
            image_url: "https://via.placeholder.com/400x200/3498db/ffffff?text=AI+Revolution",
            source_name: "Tech Today",
            author: "Sarah Chen",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
            title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
            description: "Scientists achieve a major breakthrough in quantum computing with the world's first stable 1000-qubit processor, promising revolutionary advances in cryptography and drug discovery.",
            url: "https://example.com/quantum-computing-milestone",
            image_url: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=Quantum+Computing",
            source_name: "Quantum Weekly",
            author: "Dr. Michael Rodriguez",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Apple Vision Pro 2: Enhanced AR Experience with Neural Interface",
            description: "Apple's next-generation mixed reality headset introduces groundbreaking neural interface technology, allowing users to control devices with thought patterns.",
            url: "https://example.com/apple-vision-pro-2",
            image_url: "https://via.placeholder.com/400x200/1abc9c/ffffff?text=Apple+Vision+Pro",
            source_name: "Apple Insider",
            author: "Jennifer Park",
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
    ],
    business: [
        {
            title: "Global Markets Surge as Tech Stocks Lead Recovery",
            description: "International markets show strong performance with technology stocks driving a broad-based rally, as investors show renewed confidence in growth prospects.",
            url: "https://example.com/global-markets-surge",
            image_url: "https://via.placeholder.com/400x200/f39c12/ffffff?text=Market+Surge",
            source_name: "Financial Times",
            author: "Robert Johnson",
            published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Tesla Announces Revolutionary Battery Technology",
            description: "Tesla unveils new solid-state battery technology promising 1000-mile range and 5-minute charging, potentially transforming the electric vehicle industry.",
            url: "https://example.com/tesla-battery-breakthrough",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Tesla+Battery",
            source_name: "Business Weekly",
            author: "Amanda Foster",
            published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Cryptocurrency Market Reaches New All-Time High",
            description: "Bitcoin and major altcoins surge to record levels as institutional adoption accelerates and regulatory clarity improves across major economies.",
            url: "https://example.com/crypto-all-time-high",
            image_url: "https://via.placeholder.com/400x200/f1c40f/ffffff?text=Crypto+High",
            source_name: "Crypto News",
            author: "David Kim",
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
    ],
    cricket: [
        {
            title: "India Dominates Australia in Thrilling Test Series Finale",
            description: "Team India secures a commanding victory in the final Test match, clinching the series 3-1 with outstanding performances from Kohli and Bumrah.",
            url: "https://example.com/india-australia-test-series",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Cricket+Victory",
            source_name: "ESPN Cricinfo",
            author: "Rajesh Sharma",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "IPL 2025: Record-Breaking Auction Sees Unprecedented Bids",
            description: "The IPL auction witnesses historic bidding wars with several players crossing the ₹20 crore mark, setting new benchmarks for cricket valuations.",
            url: "https://example.com/ipl-2025-auction-records",
            image_url: "https://via.placeholder.com/400x200/e67e22/ffffff?text=IPL+Auction",
            source_name: "Cricbuzz",
            author: "Priya Patel",
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Women's Cricket World Cup: England vs Australia Final Set",
            description: "The stage is set for an epic showdown as England and Australia advance to the Women's Cricket World Cup final after dominant semi-final victories.",
            url: "https://example.com/womens-cricket-world-cup-final",
            image_url: "https://via.placeholder.com/400x200/8e44ad/ffffff?text=Women+Cricket",
            source_name: "Cricket Australia",
            author: "Lisa Thompson",
            published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
    ],
    india: [
        {
            title: "India's Digital Infrastructure Reaches 1 Billion Users Milestone",
            description: "India's unified digital infrastructure, including UPI and Aadhaar, now serves over 1 billion users, showcasing the country's technological transformation.",
            url: "https://example.com/india-digital-infrastructure-milestone",
            image_url: "https://via.placeholder.com/400x200/2980b9/ffffff?text=Digital+India",
            source_name: "The Hindu",
            author: "Arjun Mehta",
            published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Chandrayaan-4 Mission Approved: India's Next Lunar Adventure",
            description: "ISRO receives government approval for Chandrayaan-4, an ambitious sample-return mission that will bring lunar soil back to Earth for detailed analysis.",
            url: "https://example.com/chandrayaan-4-mission-approved",
            image_url: "https://via.placeholder.com/400x200/34495e/ffffff?text=Chandrayaan+4",
            source_name: "Times of India",
            author: "Dr. Kavita Singh",
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Mumbai-Delhi Hyperloop Project Gets Green Signal",
            description: "The revolutionary hyperloop project connecting Mumbai and Delhi receives final environmental clearance, promising 45-minute travel time between the cities.",
            url: "https://example.com/mumbai-delhi-hyperloop-approved",
            image_url: "https://via.placeholder.com/400x200/16a085/ffffff?text=Hyperloop+India",
            source_name: "Indian Express",
            author: "Ravi Kumar",
            published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        }
    ],
    politics: [
        {
            title: "Global Climate Summit Reaches Historic Agreement",
            description: "World leaders unite at COP30 to sign the most comprehensive climate action plan in history, with binding commitments for carbon neutrality by 2040.",
            url: "https://example.com/global-climate-summit-agreement",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Climate+Summit",
            source_name: "Reuters",
            author: "Maria Gonzalez",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "EU Announces Major Digital Rights Legislation",
            description: "The European Union passes groundbreaking digital rights laws, establishing new standards for AI governance and data protection worldwide.",
            url: "https://example.com/eu-digital-rights-legislation",
            image_url: "https://via.placeholder.com/400x200/3498db/ffffff?text=EU+Digital+Rights",
            source_name: "BBC News",
            author: "James Wilson",
            published_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "UN Security Council Reforms: New Permanent Members Added",
            description: "The United Nations Security Council undergoes historic expansion with India, Brazil, and Nigeria joining as new permanent members.",
            url: "https://example.com/un-security-council-reforms",
            image_url: "https://via.placeholder.com/400x200/2c3e50/ffffff?text=UN+Reforms",
            source_name: "Associated Press",
            author: "Catherine Lee",
            published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
        }
    ],
    entertainment: [
        {
            title: "Marvel Announces Phase 6: Multiverse Saga Conclusion",
            description: "Marvel Studios reveals the epic conclusion to the Multiverse Saga with 8 new films and 6 Disney+ series, featuring the return of beloved characters.",
            url: "https://example.com/marvel-phase-6-announcement",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Marvel+Phase+6",
            source_name: "Entertainment Weekly",
            author: "Alex Turner",
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Bollywood's Biggest Blockbuster Breaks Global Box Office Records",
            description: "The latest Bollywood epic becomes the highest-grossing Indian film worldwide, earning over $500 million and captivating international audiences.",
            url: "https://example.com/bollywood-blockbuster-records",
            image_url: "https://via.placeholder.com/400x200/f39c12/ffffff?text=Bollywood+Hit",
            source_name: "Variety",
            author: "Neha Kapoor",
            published_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Netflix Greenlights 50 New International Original Series",
            description: "Netflix announces its largest content expansion with 50 new original series from 20 countries, emphasizing diverse storytelling and local talent.",
            url: "https://example.com/netflix-international-originals",
            image_url: "https://via.placeholder.com/400x200/e91e63/ffffff?text=Netflix+Originals",
            source_name: "The Hollywood Reporter",
            author: "Sophie Martinez",
            published_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
        }
    ],
    health: [
        {
            title: "Breakthrough Gene Therapy Cures Rare Genetic Disease",
            description: "Scientists successfully treat patients with a rare genetic disorder using revolutionary CRISPR gene editing technology, offering hope for similar conditions.",
            url: "https://example.com/gene-therapy-breakthrough",
            image_url: "https://via.placeholder.com/400x200/1abc9c/ffffff?text=Gene+Therapy",
            source_name: "Medical Journal",
            author: "Dr. Emily Watson",
            published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "New Alzheimer's Drug Shows 70% Effectiveness in Clinical Trials",
            description: "A promising new treatment for Alzheimer's disease demonstrates remarkable success in phase 3 trials, potentially changing the landscape of dementia care.",
            url: "https://example.com/alzheimers-drug-breakthrough",
            image_url: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=Alzheimer+Drug",
            source_name: "Health Today",
            author: "Dr. Michael Chang",
            published_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "AI-Powered Early Cancer Detection Achieves 95% Accuracy",
            description: "Artificial intelligence system can now detect 12 types of cancer in early stages with unprecedented accuracy, revolutionizing preventive healthcare.",
            url: "https://example.com/ai-cancer-detection",
            image_url: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=AI+Cancer+Detection",
            source_name: "Nature Medicine",
            author: "Dr. Sarah Kim",
            published_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
        }
    ],
    science: [
        {
            title: "James Webb Telescope Discovers Earth-Like Exoplanet with Water",
            description: "The James Webb Space Telescope identifies a potentially habitable exoplanet with clear signs of water vapor and oxygen in its atmosphere.",
            url: "https://example.com/james-webb-exoplanet-discovery",
            image_url: "https://via.placeholder.com/400x200/34495e/ffffff?text=Exoplanet+Discovery",
            source_name: "NASA News",
            author: "Dr. Lisa Rodriguez",
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Scientists Achieve Nuclear Fusion Energy Breakthrough",
            description: "Researchers at Lawrence Livermore achieve net energy gain from nuclear fusion reaction, marking a historic milestone in clean energy development.",
            url: "https://example.com/nuclear-fusion-breakthrough",
            image_url: "https://via.placeholder.com/400x200/f39c12/ffffff?text=Nuclear+Fusion",
            source_name: "Science Magazine",
            author: "Dr. Robert Chen",
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Antarctic Ice Sheet Reveals 2-Million-Year-Old Climate Data",
            description: "Scientists extract ice cores containing the oldest climate records ever found, providing crucial insights into Earth's ancient climate patterns.",
            url: "https://example.com/antarctic-ice-climate-data",
            image_url: "https://via.placeholder.com/400x200/3498db/ffffff?text=Antarctic+Research",
            source_name: "Climate Science Today",
            author: "Dr. Anna Petrov",
            published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
        }
    ],
    sports: [
        {
            title: "FIFA World Cup 2026: Revolutionary Stadium Technology Unveiled",
            description: "The upcoming World Cup will feature AI-powered stadiums with real-time player tracking and immersive fan experiences using augmented reality.",
            url: "https://example.com/fifa-2026-stadium-technology",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=FIFA+2026",
            source_name: "ESPN",
            author: "Carlos Martinez",
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Olympic Records Shattered at Paris 2024 Swimming Finals",
            description: "Multiple world records fall at the Paris Olympics as swimmers push the boundaries of human performance in thrilling final competitions.",
            url: "https://example.com/paris-2024-swimming-records",
            image_url: "https://via.placeholder.com/400x200/e67e22/ffffff?text=Olympic+Swimming",
            source_name: "Olympic Channel",
            author: "Michelle Thompson",
            published_at: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Tennis Grand Slam Introduces AI Umpiring System",
            description: "Professional tennis adopts advanced AI technology for line calls and match officiating, promising greater accuracy and faster decision-making.",
            url: "https://example.com/tennis-ai-umpiring-system",
            image_url: "https://via.placeholder.com/400x200/8e44ad/ffffff?text=Tennis+AI",
            source_name: "Tennis World",
            author: "David Wilson",
            published_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
        }
    ],
    world: [
        {
            title: "Global Renewable Energy Capacity Doubles in Record Year",
            description: "Worldwide renewable energy installations reach unprecedented levels, with solar and wind power leading the charge toward a sustainable future.",
            url: "https://example.com/global-renewable-energy-record",
            image_url: "https://via.placeholder.com/400x200/27ae60/ffffff?text=Renewable+Energy",
            source_name: "World Energy Council",
            author: "Elena Kowalski",
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "International Space Station Welcomes First Commercial Crew",
            description: "Private astronauts join the ISS crew for the first fully commercial space mission, marking a new era in space exploration and tourism.",
            url: "https://example.com/iss-commercial-crew-mission",
            image_url: "https://via.placeholder.com/400x200/2c3e50/ffffff?text=Space+Mission",
            source_name: "Space News",
            author: "Commander John Smith",
            published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Global Food Security Initiative Launches in 50 Countries",
            description: "United Nations launches comprehensive food security program addressing hunger and malnutrition through sustainable agriculture and technology.",
            url: "https://example.com/global-food-security-initiative",
            image_url: "https://via.placeholder.com/400x200/16a085/ffffff?text=Food+Security",
            source_name: "UN News",
            author: "Dr. Fatima Al-Rashid",
            published_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
        }
    ]
};

async function addSampleNews() {
    console.log('📰 Adding comprehensive sample news data...');
    
    try {
        const db = Database.getInstance();
        
        // Get category mappings
        const categories = await db.all('SELECT id, name FROM categories');
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });
        
        let totalAdded = 0;
        
        for (const [categoryName, articles] of Object.entries(sampleNewsData)) {
            const categoryId = categoryMap[categoryName];
            if (!categoryId) {
                console.log(`⚠️  Category '${categoryName}' not found, skipping...`);
                continue;
            }
            
            console.log(`📝 Adding ${articles.length} articles for ${categoryName}...`);
            
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
        
        console.log(`✅ Successfully added ${totalAdded} news articles!`);
        
        // Show summary by category
        console.log('\n📊 Articles by category:');
        for (const [categoryName] of Object.entries(sampleNewsData)) {
            const count = await db.get(`
                SELECT COUNT(*) as count 
                FROM articles a 
                JOIN categories c ON a.category_id = c.id 
                WHERE c.name = ?
            `, [categoryName]);
            console.log(`   ${categoryName}: ${count.count} articles`);
        }
        
    } catch (error) {
        console.error('💥 Error adding sample news:', error);
    }
}

// Run if called directly
if (require.main === module) {
    addSampleNews()
        .then(() => {
            console.log('🎉 Sample news data added successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('💥 Failed to add sample news:', err);
            process.exit(1);
        });
}

module.exports = { addSampleNews, sampleNewsData };
