const axios = require('axios');

async function testImages() {
    try {
        console.log('🖼️  Testing that all articles have real images...\n');
        
        const categories = ['technology', 'business', 'entertainment', 'politics', 'cricket', 'india'];
        
        for (const category of categories) {
            console.log(`📰 Testing ${category}...`);
            
            const response = await axios.get(`http://localhost:3001/api/news?category=${category}`);
            const articles = response.data.articles;
            
            if (articles && articles.length > 0) {
                let articlesWithImages = 0;
                let articlesWithoutImages = 0;
                
                articles.forEach((article, index) => {
                    if (article.image_url && article.image_url.startsWith('http')) {
                        articlesWithImages++;
                        if (index < 3) { // Show first 3 image URLs as samples
                            console.log(`   ✅ "${article.title.substring(0, 50)}..."`);
                            console.log(`      🖼️  Image: ${article.image_url.substring(0, 80)}...`);
                        }
                    } else {
                        articlesWithoutImages++;
                        console.log(`   ❌ No image: "${article.title.substring(0, 50)}..."`);
                    }
                });
                
                console.log(`   📊 Summary: ${articlesWithImages} with images, ${articlesWithoutImages} without images`);
                
                if (articlesWithoutImages === 0) {
                    console.log(`   🎉 Perfect! All ${category} articles have real images!\n`);
                } else {
                    console.log(`   ⚠️  ${articlesWithoutImages} articles missing images\n`);
                }
            } else {
                console.log(`   ❌ No articles found for ${category}\n`);
            }
        }
        
        console.log('🎯 Image testing completed!');
        
    } catch (error) {
        console.error('❌ Error testing images:', error.message);
    }
}

testImages();
