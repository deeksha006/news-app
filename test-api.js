// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
    console.log('🧪 Testing News Flow API...\n');
    
    try {
        // Test health check
        console.log('1. Testing health check...');
        const health = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check passed:', health.data.status);
        
        // Test news endpoint
        console.log('\n2. Testing news endpoint...');
        const news = await axios.get(`${BASE_URL}/news?category=technology`);
        console.log('✅ News endpoint passed:', news.data.articles.length, 'articles found');
        
        // Test categories
        console.log('\n3. Testing categories endpoint...');
        const categories = await axios.get(`${BASE_URL}/news/categories`);
        console.log('✅ Categories endpoint passed:', categories.data.categories.length, 'categories found');
        
        // Test user registration
        console.log('\n4. Testing user registration...');
        const testUser = {
            email: `test${Date.now()}@example.com`,
            password: 'testpassword123',
            firstName: 'Test',
            lastName: 'User'
        };
        
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('✅ Registration passed for:', testUser.email);
        
        const token = registerResponse.data.token;
        
        // Test authenticated endpoints
        console.log('\n5. Testing authenticated endpoints...');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Test getting user info
        const userInfo = await axios.get(`${BASE_URL}/auth/me`, { headers });
        console.log('✅ User info endpoint passed:', userInfo.data.user.email);
        
        // Test bookmarks
        const bookmark = {
            articleUrl: 'https://example.com/test-article',
            title: 'Test Article',
            description: 'This is a test article',
            sourceName: 'Test Source'
        };
        
        const bookmarkResponse = await axios.post(`${BASE_URL}/bookmarks`, bookmark, { headers });
        console.log('✅ Bookmark creation passed:', bookmarkResponse.data.bookmark.title);
        
        const bookmarks = await axios.get(`${BASE_URL}/bookmarks`, { headers });
        console.log('✅ Bookmark retrieval passed:', bookmarks.data.bookmarks.length, 'bookmarks found');
        
        console.log('\n🎉 All API tests passed successfully!');
        
    } catch (error) {
        console.error('❌ API test failed:', error.response?.data || error.message);
    }
}

// Run tests if called directly
if (require.main === module) {
    testAPI();
}

module.exports = { testAPI };
