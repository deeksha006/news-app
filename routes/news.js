const express = require('express');
const axios = require('axios');
const { query, validationResult } = require('express-validator');
const Database = require('../utils/database');
const { optionalAuth, logActivity } = require('../middleware/auth');

const router = express.Router();

// NewsAPI configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || '60947cac199341f9a8e2bf4fa7bc6d50';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Cache duration in minutes
const CACHE_DURATION = 5;

// Get news articles
router.get('/', [
    query('category').optional().isIn(['technology', 'business', 'cricket', 'india', 'politics', 'entertainment', 'health', 'science', 'sports', 'world']),
    query('page').optional().isInt({ min: 1, max: 10 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sortBy').optional().isIn(['latest', 'popular', 'relevant']),
    query('dateRange').optional().isIn(['today', 'week', 'month'])
], optionalAuth, logActivity, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }

    const {
        category = 'technology',
        page = 1,
        pageSize = 20,
        sortBy = 'latest',
        dateRange = 'week'
    } = req.query;

    try {

        const db = Database.getInstance();

        // Log search if user is authenticated
        if (req.user) {
            await db.run(
                'INSERT INTO search_history (user_id, search_query, created_at, ip_address) VALUES (?, ?, ?, ?)',
                [req.user.userId, category, new Date().toISOString(), req.ip]
            );
        }

        // Try to get cached articles first
        const cachedArticles = await getCachedArticles(category, page, pageSize, sortBy, dateRange);

        // Filter cached articles to ensure they have real images
        const validCachedArticles = cachedArticles.filter(article => {
            if (!article.image_url) return false;
            if (!article.image_url.startsWith('http')) return false;
            if (article.image_url.length < 30) return false;
            if (article.image_url.includes('placeholder')) return false;
            if (article.image_url.includes('default')) return false;
            if (article.image_url.includes('logo')) return false;
            if (article.image_url.includes('avatar')) return false;
            if (article.image_url.endsWith('.svg')) return false;

            const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(article.image_url);
            const isFromImageHost = /\.(amazonaws\.com|cloudfront\.net|imgur\.com|unsplash\.com|pexels\.com|shutterstock\.com|gettyimages\.com|newsweek\.com|cnn\.com|bbc\.com|reuters\.com)/i.test(article.image_url);

            return hasImageExtension || isFromImageHost;
        });

        if (validCachedArticles.length > 0) {
            return res.json({
                articles: validCachedArticles,
                totalResults: validCachedArticles.length,
                page,
                pageSize,
                category,
                cached: true
            });
        }

        // If no cached articles, fetch from API
        const apiArticles = await fetchFromNewsAPI(category, page, pageSize, sortBy, dateRange);

        if (apiArticles.length > 0) {
            // Cache the articles
            await cacheArticles(apiArticles, category);

            return res.json({
                articles: apiArticles,
                totalResults: apiArticles.length,
                page,
                pageSize,
                category,
                cached: false
            });
        }

        // If API fails, try to return sample data as fallback
        console.log(`API failed for category: ${category}, trying sample data...`);
        const sampleArticles = await getSampleArticles(category);

        if (sampleArticles.length > 0) {
            res.json({
                articles: sampleArticles.slice(0, pageSize),
                totalResults: sampleArticles.length,
                page,
                pageSize,
                category,
                cached: false,
                fallback: true
            });
        } else {
            res.status(503).json({
                error: 'Unable to fetch news at this time. Please try again later.',
                articles: [],
                totalResults: 0,
                page,
                pageSize,
                category
            });
        }

    } catch (error) {
        console.error('News fetch error:', error);
        console.error('Environment:', process.env.NODE_ENV);
        console.error('API Key present:', !!NEWS_API_KEY);

        // Try sample data as fallback
        try {
            const sampleArticles = await getSampleArticles(category);
            if (sampleArticles.length > 0) {
                res.json({
                    articles: sampleArticles.slice(0, pageSize),
                    totalResults: sampleArticles.length,
                    page,
                    pageSize,
                    category,
                    fallback: true
                });
                return;
            }
        } catch (sampleError) {
            console.error('Sample data fallback failed:', sampleError);
        }

        res.status(500).json({
            error: 'Unable to fetch news articles at this time. Please try again later.',
            articles: [],
            totalResults: 0
        });
    }
});

// Search news articles
router.get('/search', [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1, max: 10 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sortBy').optional().isIn(['latest', 'popular', 'relevant']),
    query('dateRange').optional().isIn(['today', 'week', 'month'])
], optionalAuth, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            q: searchQuery,
            page = 1,
            pageSize = 20,
            sortBy = 'latest',
            dateRange = 'week'
        } = req.query;

        const db = Database.getInstance();

        // Log search
        if (req.user) {
            await db.run(
                'INSERT INTO search_history (user_id, search_query, created_at, ip_address) VALUES (?, ?, ?, ?)',
                [req.user.userId, searchQuery, new Date().toISOString(), req.ip]
            );
        }

        // Search in cached articles first
        const cachedResults = await searchCachedArticles(searchQuery, page, pageSize);
        if (cachedResults.length > 0) {
            return res.json({
                articles: cachedResults,
                totalResults: cachedResults.length,
                page,
                pageSize,
                query: searchQuery,
                cached: true
            });
        }

        // Search via API
        const apiResults = await searchNewsAPI(searchQuery, page, pageSize, sortBy, dateRange);
        
        if (apiResults.length > 0) {
            return res.json({
                articles: apiResults,
                totalResults: apiResults.length,
                page,
                pageSize,
                query: searchQuery,
                cached: false
            });
        }

        // No results found
        res.json({
            articles: [],
            totalResults: 0,
            page,
            pageSize,
            query: searchQuery,
            message: 'No articles found for your search'
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Get news categories
router.get('/categories', async (req, res) => {
    try {
        const db = Database.getInstance();
        const categories = await db.all(
            'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, display_name'
        );

        res.json({ categories });
    } catch (error) {
        console.error('Categories fetch error:', error);
        res.status(500).json({ error: 'Unable to fetch categories' });
    }
});

// Helper functions
async function getCachedArticles(category, page, pageSize, sortBy, dateRange) {
    const db = Database.getInstance();
    
    // Calculate cache expiry time
    const cacheExpiry = new Date(Date.now() - CACHE_DURATION * 60 * 1000);
    
    let orderBy = 'published_at DESC';
    if (sortBy === 'popular') orderBy = 'id DESC'; // Placeholder for popularity
    if (sortBy === 'relevant') orderBy = 'published_at DESC';

    const offset = (page - 1) * pageSize;

    const articles = await db.all(`
        SELECT a.*, c.display_name as category_name 
        FROM articles a 
        LEFT JOIN categories c ON a.category_id = c.id 
        WHERE c.name = ? AND a.updated_at > ? AND a.is_active = 1
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
    `, [category, cacheExpiry.toISOString(), pageSize, offset]);

    return articles;
}

async function fetchFromNewsAPI(category, page, pageSize, sortBy, dateRange) {
    try {
        let query = '';
        let useTopHeadlines = false;

        // Map categories to better search queries
        switch (category.toLowerCase()) {
            case 'technology':
                query = 'technology OR tech OR AI OR software OR startup OR innovation';
                break;
            case 'business':
                query = 'business OR economy OR finance OR market OR stock OR company';
                break;
            case 'sports':
                query = '(sports OR football OR basketball OR tennis OR olympics OR FIFA OR cricket OR IPL OR "world cup" OR soccer OR baseball OR hockey OR NFL OR NBA OR MLB OR NHL OR "premier league" OR golf OR boxing OR swimming OR athletics) AND NOT (Trump OR politics OR election OR government OR Epstein OR scandal OR investigation)';
                break;
            case 'india':
                query = 'India OR Indian OR Delhi OR Mumbai OR "Prime Minister" OR Bollywood OR cricket';
                // Use everything endpoint with query for better results
                useTopHeadlines = false;
                break;
            case 'politics':
                query = 'politics OR government OR election OR policy OR parliament';
                break;
            case 'entertainment':
                query = 'entertainment OR movie OR film OR celebrity OR music OR Hollywood OR Bollywood';
                break;
            case 'health':
                query = 'health OR medical OR medicine OR hospital OR disease OR vaccine';
                break;
            case 'science':
                query = 'science OR research OR discovery OR space OR climate OR environment';
                break;
            case 'world':
                useTopHeadlines = true;
                break;
            default:
                query = category;
        }

        let params = {
            apiKey: NEWS_API_KEY,
            pageSize: Math.min(pageSize * 2, 100), // Fetch more to filter for images
            page,
            language: 'en',
            sortBy: sortBy === 'latest' ? 'publishedAt' : (sortBy === 'popular' ? 'popularity' : 'publishedAt'),
            excludeDomains: 'reddit.com,twitter.com' // Exclude domains that often don't have good images
        };

        // Use NewsAPI categories for better accuracy
        if (category === 'sports') {
            params.category = 'sports';
            useTopHeadlines = true;
        } else if (category === 'technology') {
            params.category = 'technology';
            useTopHeadlines = true;
        } else if (category === 'business') {
            params.category = 'business';
            useTopHeadlines = true;
        } else if (category === 'entertainment') {
            params.category = 'entertainment';
            useTopHeadlines = true;
        } else {
            // Add date range (only for everything endpoint)
            if (!useTopHeadlines) {
                params.q = query;
                if (dateRange === 'today') {
                    params.from = new Date().toISOString().split('T')[0];
                } else if (dateRange === 'week') {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    params.from = weekAgo.toISOString().split('T')[0];
                } else {
                    // Default to last 30 days for better results
                    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    params.from = monthAgo.toISOString().split('T')[0];
                }
            } else {
                // For world news, use top headlines
                params.category = 'general';
                params.country = 'us'; // or 'in' for India
            }
        }

        const endpoint = useTopHeadlines ? 'top-headlines' : 'everything';
        const response = await axios.get(`${NEWS_API_BASE_URL}/${endpoint}`, { params });

        if (response.data.status === 'ok' && response.data.articles) {
            // Filter out articles with [Removed] content, ensure they have proper URLs AND real images
            const validArticles = response.data.articles.filter(article => {
                // Basic content validation
                if (!article.title || article.title === '[Removed]' || article.title.trim() === '') return false;
                if (!article.description || article.description === '[Removed]' || article.description.trim() === '') return false;
                if (!article.url || !article.url.startsWith('http') || article.url.includes('removed.com')) return false;

                // Strict image validation
                if (!article.urlToImage) return false;
                if (!article.urlToImage.startsWith('http')) return false;
                if (article.urlToImage.length < 30) return false; // Very short URLs are likely placeholders
                if (article.urlToImage.includes('placeholder')) return false;
                if (article.urlToImage.includes('default')) return false;
                if (article.urlToImage.includes('logo')) return false;
                if (article.urlToImage.includes('avatar')) return false;
                if (article.urlToImage.endsWith('.svg')) return false; // SVGs are often logos/icons

                // Must have common image extensions or be from known image hosting services
                const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(article.urlToImage);
                const isFromImageHost = /\.(amazonaws\.com|cloudfront\.net|imgur\.com|unsplash\.com|pexels\.com|shutterstock\.com|gettyimages\.com|newsweek\.com|cnn\.com|bbc\.com|reuters\.com|videocardz\.com|techcrunch\.com|theverge\.com)/i.test(article.urlToImage);

                // Additional validation: URL must be substantial and not just a domain
                if (article.urlToImage.split('/').length < 4) return false; // Must have path beyond domain

                return hasImageExtension || isFromImageHost;
            });

            // Return only the requested number of articles after filtering
            const articlesToReturn = validArticles.slice(0, pageSize);

            return articlesToReturn.map(article => ({
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                image_url: article.urlToImage,
                source_name: article.source.name,
                author: article.author,
                published_at: article.publishedAt,
                category_name: category.charAt(0).toUpperCase() + category.slice(1)
            }));
        }

        return [];
    } catch (error) {
        console.error('NewsAPI fetch error:', error.response?.data || error.message);
        console.error('Error details:', {
            category,
            useTopHeadlines,
            params: JSON.stringify(params, null, 2)
        });
        return [];
    }
}

async function cacheArticles(articles, category) {
    const db = Database.getInstance();
    
    // Get category ID
    const categoryRow = await db.get('SELECT id FROM categories WHERE name = ?', [category]);
    const categoryId = categoryRow?.id || 1;

    for (const article of articles) {
        try {
            await db.run(`
                INSERT OR REPLACE INTO articles 
                (title, description, content, url, image_url, source_name, author, published_at, category_id, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                article.title,
                article.description,
                article.content,
                article.url,
                article.image_url,
                article.source_name,
                article.author,
                article.published_at,
                categoryId,
                new Date().toISOString()
            ]);
        } catch (error) {
            console.error('Cache article error:', error);
        }
    }
}

async function getSampleArticles(category) {
    const db = Database.getInstance();
    
    const articles = await db.all(`
        SELECT a.*, c.display_name as category_name 
        FROM articles a 
        LEFT JOIN categories c ON a.category_id = c.id 
        WHERE c.name = ? AND a.is_active = 1
        ORDER BY a.published_at DESC
        LIMIT 10
    `, [category]);

    return articles;
}

async function searchCachedArticles(searchQuery, page, pageSize) {
    const db = Database.getInstance();
    const offset = (page - 1) * pageSize;

    const articles = await db.all(`
        SELECT a.*, c.display_name as category_name 
        FROM articles a 
        LEFT JOIN categories c ON a.category_id = c.id 
        WHERE (a.title LIKE ? OR a.description LIKE ?) AND a.is_active = 1
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
    `, [`%${searchQuery}%`, `%${searchQuery}%`, pageSize, offset]);

    return articles;
}

async function searchNewsAPI(searchQuery, page, pageSize, sortBy, dateRange) {
    try {
        const params = {
            q: searchQuery,
            apiKey: NEWS_API_KEY,
            page,
            pageSize: Math.min(pageSize * 2, 100), // Fetch more to filter for images
            sortBy: sortBy === 'latest' ? 'publishedAt' : (sortBy === 'popular' ? 'popularity' : 'publishedAt'),
            language: 'en',
            excludeDomains: 'reddit.com,twitter.com' // Exclude domains that often don't have good images
        };

        if (dateRange === 'today') {
            params.from = new Date().toISOString().split('T')[0];
        } else if (dateRange === 'week') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            params.from = weekAgo.toISOString().split('T')[0];
        } else {
            // Default to last 30 days for better search results
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            params.from = monthAgo.toISOString().split('T')[0];
        }

        const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, { params });

        if (response.data.status === 'ok' && response.data.articles) {
            // Filter out removed articles, ensure valid URLs AND real images
            const validArticles = response.data.articles.filter(article => {
                // Basic content validation
                if (!article.title || article.title === '[Removed]' || article.title.trim() === '') return false;
                if (!article.description || article.description === '[Removed]' || article.description.trim() === '') return false;
                if (!article.url || !article.url.startsWith('http') || article.url.includes('removed.com')) return false;

                // Strict image validation
                if (!article.urlToImage) return false;
                if (!article.urlToImage.startsWith('http')) return false;
                if (article.urlToImage.length < 30) return false; // Very short URLs are likely placeholders
                if (article.urlToImage.includes('placeholder')) return false;
                if (article.urlToImage.includes('default')) return false;
                if (article.urlToImage.includes('logo')) return false;
                if (article.urlToImage.includes('avatar')) return false;
                if (article.urlToImage.endsWith('.svg')) return false; // SVGs are often logos/icons

                // Must have common image extensions or be from known image hosting services
                const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(article.urlToImage);
                const isFromImageHost = /\.(amazonaws\.com|cloudfront\.net|imgur\.com|unsplash\.com|pexels\.com|shutterstock\.com|gettyimages\.com|newsweek\.com|cnn\.com|bbc\.com|reuters\.com)/i.test(article.urlToImage);

                return hasImageExtension || isFromImageHost;
            });

            // Return only the requested number of articles after filtering
            const articlesToReturn = validArticles.slice(0, pageSize);

            return articlesToReturn.map(article => ({
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                image_url: article.urlToImage,
                source_name: article.source.name,
                author: article.author,
                published_at: article.publishedAt
            }));
        }

        return [];
    } catch (error) {
        console.error('NewsAPI search error:', error.response?.data || error.message);
        return [];
    }
}

module.exports = router;
