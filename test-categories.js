// Test script to verify all categories have news articles
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Categories from the navigation bar
const navCategories = ['cricket', 'india', 'technology', 'politics', 'business', 'entertainment'];

async function testAllCategories() {
    console.log('🧪 Testing all navigation categories...\n');
    
    try {
        for (const category of navCategories) {
            console.log(`📰 Testing category: ${category}`);
            
            const response = await axios.get(`${BASE_URL}/news?category=${category}`);
            const data = response.data;
            
            if (data.articles && data.articles.length > 0) {
                console.log(`✅ ${category}: ${data.articles.length} articles found`);
                
                // Show first article as example
                const firstArticle = data.articles[0];
                console.log(`   📄 Sample: "${firstArticle.title}"`);
                console.log(`   📅 Published: ${new Date(firstArticle.published_at).toLocaleDateString()}`);
                console.log(`   📰 Source: ${firstArticle.source_name}`);
            } else {
                console.log(`❌ ${category}: No articles found`);
            }
            console.log('');
        }
        
        // Test search functionality
        console.log('🔍 Testing search functionality...');
        const searchResponse = await axios.get(`${BASE_URL}/news/search?q=technology`);
        const searchData = searchResponse.data;
        
        if (searchData.articles && searchData.articles.length > 0) {
            console.log(`✅ Search: ${searchData.articles.length} articles found for "technology"`);
        } else {
            console.log('❌ Search: No articles found');
        }
        
        console.log('\n🎉 Category testing completed!');
        
    } catch (error) {
        console.error('❌ Category test failed:', error.response?.data || error.message);
    }
}

// Run tests if called directly
if (require.main === module) {
    testAllCategories();
}

module.exports = { testAllCategories };
