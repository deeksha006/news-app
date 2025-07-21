const axios = require('axios');

async function testTechnology() {
    try {
        console.log('🔍 Testing Technology section for relevance...\n');
        
        const response = await axios.get('http://localhost:3001/api/news?category=technology');
        const articles = response.data.articles;
        
        if (articles && articles.length > 0) {
            console.log(`📊 Found ${articles.length} articles in Technology section:\n`);
            
            articles.forEach((article, index) => {
                console.log(`${index + 1}. "${article.title}"`);
                console.log(`   Source: ${article.source_name}`);
                console.log(`   Description: ${article.description?.substring(0, 100)}...`);
                
                // Check if it's actually technology-related
                const title = article.title.toLowerCase();
                const desc = (article.description || '').toLowerCase();
                
                const techKeywords = [
                    'technology', 'tech', 'software', 'hardware', 'computer', 'internet', 
                    'digital', 'ai', 'artificial intelligence', 'machine learning', 'data',
                    'app', 'mobile', 'smartphone', 'iphone', 'android', 'google', 'apple',
                    'microsoft', 'amazon', 'facebook', 'meta', 'twitter', 'x', 'tesla',
                    'electric', 'battery', 'chip', 'processor', 'cloud', 'cyber', 'crypto',
                    'blockchain', 'bitcoin', 'startup', 'innovation', 'gadget', 'device',
                    'programming', 'coding', 'developer', 'gaming', 'video game', 'vr',
                    'virtual reality', 'augmented reality', 'ar', 'iot', 'robot', 'automation'
                ];
                
                const isTechRelated = techKeywords.some(keyword => 
                    title.includes(keyword) || desc.includes(keyword)
                );
                
                if (isTechRelated) {
                    console.log(`   ✅ RELEVANT: Technology-related content`);
                } else {
                    console.log(`   ❌ NOT RELEVANT: Doesn't appear to be technology news`);
                }
                console.log('');
            });
        } else {
            console.log('❌ No articles found in Technology section');
        }
        
    } catch (error) {
        console.error('❌ Error testing Technology section:', error.message);
    }
}

testTechnology();
