const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Database = require('../utils/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Get user bookmarks
router.get('/', authenticateToken, logActivity, async (req, res) => {
    try {
        const db = Database.getInstance();
        
        const bookmarks = await db.all(`
            SELECT 
                b.id as bookmark_id,
                b.created_at as bookmarked_at,
                b.notes,
                a.id as article_id,
                a.title,
                a.description,
                a.url,
                a.image_url,
                a.source_name,
                a.author,
                a.published_at,
                c.display_name as category_name
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.userId]);

        res.json({
            bookmarks,
            total: bookmarks.length
        });

    } catch (error) {
        console.error('Get bookmarks error:', error);
        res.status(500).json({ error: 'Unable to fetch bookmarks' });
    }
});

// Add bookmark
router.post('/', [
    body('articleUrl').isURL().withMessage('Valid article URL is required'),
    body('title').notEmpty().withMessage('Article title is required'),
    body('description').optional(),
    body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
    body('sourceName').optional(),
    body('author').optional(),
    body('publishedAt').optional().isISO8601().withMessage('Published date must be valid ISO date'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], authenticateToken, logActivity, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const {
            articleUrl,
            title,
            description,
            imageUrl,
            sourceName,
            author,
            publishedAt,
            notes
        } = req.body;

        const db = Database.getInstance();

        // Check if article already exists
        let article = await db.get('SELECT id FROM articles WHERE url = ?', [articleUrl]);
        
        if (!article) {
            // Create new article
            const result = await db.run(`
                INSERT INTO articles (title, description, url, image_url, source_name, author, published_at, category_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                title,
                description || null,
                articleUrl,
                imageUrl || null,
                sourceName || null,
                author || null,
                publishedAt || new Date().toISOString(),
                1 // Default to technology category
            ]);
            
            article = { id: result.lastID };
        }

        // Check if bookmark already exists
        const existingBookmark = await db.get(
            'SELECT id FROM bookmarks WHERE user_id = ? AND article_id = ?',
            [req.user.userId, article.id]
        );

        if (existingBookmark) {
            return res.status(409).json({ error: 'Article already bookmarked' });
        }

        // Create bookmark
        const bookmarkResult = await db.run(
            'INSERT INTO bookmarks (user_id, article_id, notes) VALUES (?, ?, ?)',
            [req.user.userId, article.id, notes || null]
        );

        // Get the created bookmark with article details
        const bookmark = await db.get(`
            SELECT 
                b.id as bookmark_id,
                b.created_at as bookmarked_at,
                b.notes,
                a.id as article_id,
                a.title,
                a.description,
                a.url,
                a.image_url,
                a.source_name,
                a.author,
                a.published_at,
                c.display_name as category_name
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE b.id = ?
        `, [bookmarkResult.lastID]);

        res.status(201).json({
            message: 'Bookmark added successfully',
            bookmark
        });

    } catch (error) {
        console.error('Add bookmark error:', error);
        res.status(500).json({ error: 'Unable to add bookmark' });
    }
});

// Update bookmark notes
router.put('/:id', [
    param('id').isInt().withMessage('Bookmark ID must be a number'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const bookmarkId = req.params.id;
        const { notes } = req.body;
        const db = Database.getInstance();

        // Check if bookmark exists and belongs to user
        const bookmark = await db.get(
            'SELECT id FROM bookmarks WHERE id = ? AND user_id = ?',
            [bookmarkId, req.user.userId]
        );

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Update bookmark
        await db.run(
            'UPDATE bookmarks SET notes = ? WHERE id = ?',
            [notes || null, bookmarkId]
        );

        // Get updated bookmark
        const updatedBookmark = await db.get(`
            SELECT 
                b.id as bookmark_id,
                b.created_at as bookmarked_at,
                b.notes,
                a.id as article_id,
                a.title,
                a.description,
                a.url,
                a.image_url,
                a.source_name,
                a.author,
                a.published_at,
                c.display_name as category_name
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE b.id = ?
        `, [bookmarkId]);

        res.json({
            message: 'Bookmark updated successfully',
            bookmark: updatedBookmark
        });

    } catch (error) {
        console.error('Update bookmark error:', error);
        res.status(500).json({ error: 'Unable to update bookmark' });
    }
});

// Remove bookmark
router.delete('/:id', [
    param('id').isInt().withMessage('Bookmark ID must be a number')
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const bookmarkId = req.params.id;
        const db = Database.getInstance();

        // Check if bookmark exists and belongs to user
        const bookmark = await db.get(
            'SELECT id FROM bookmarks WHERE id = ? AND user_id = ?',
            [bookmarkId, req.user.userId]
        );

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Delete bookmark
        await db.run('DELETE FROM bookmarks WHERE id = ?', [bookmarkId]);

        res.json({ message: 'Bookmark removed successfully' });

    } catch (error) {
        console.error('Remove bookmark error:', error);
        res.status(500).json({ error: 'Unable to remove bookmark' });
    }
});

// Remove bookmark by article URL (for frontend compatibility)
router.delete('/url/:encodedUrl', authenticateToken, logActivity, async (req, res) => {
    try {
        const articleUrl = decodeURIComponent(req.params.encodedUrl);
        const db = Database.getInstance();

        // Find and delete bookmark
        const result = await db.run(`
            DELETE FROM bookmarks 
            WHERE user_id = ? AND article_id IN (
                SELECT id FROM articles WHERE url = ?
            )
        `, [req.user.userId, articleUrl]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        res.json({ message: 'Bookmark removed successfully' });

    } catch (error) {
        console.error('Remove bookmark by URL error:', error);
        res.status(500).json({ error: 'Unable to remove bookmark' });
    }
});

// Check if article is bookmarked
router.get('/check/:encodedUrl', authenticateToken, async (req, res) => {
    try {
        const articleUrl = decodeURIComponent(req.params.encodedUrl);
        const db = Database.getInstance();

        const bookmark = await db.get(`
            SELECT b.id 
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            WHERE b.user_id = ? AND a.url = ?
        `, [req.user.userId, articleUrl]);

        res.json({ 
            isBookmarked: !!bookmark,
            bookmarkId: bookmark?.id || null
        });

    } catch (error) {
        console.error('Check bookmark error:', error);
        res.status(500).json({ error: 'Unable to check bookmark status' });
    }
});

// Get bookmark statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();

        const stats = await db.get(`
            SELECT 
                COUNT(*) as total_bookmarks,
                COUNT(DISTINCT a.category_id) as categories_bookmarked,
                MIN(b.created_at) as first_bookmark,
                MAX(b.created_at) as latest_bookmark
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            WHERE b.user_id = ?
        `, [req.user.userId]);

        // Get bookmarks by category
        const categoryStats = await db.all(`
            SELECT 
                c.display_name as category,
                COUNT(*) as count
            FROM bookmarks b
            JOIN articles a ON b.article_id = a.id
            JOIN categories c ON a.category_id = c.id
            WHERE b.user_id = ?
            GROUP BY c.id, c.display_name
            ORDER BY count DESC
        `, [req.user.userId]);

        res.json({
            ...stats,
            by_category: categoryStats
        });

    } catch (error) {
        console.error('Bookmark stats error:', error);
        res.status(500).json({ error: 'Unable to fetch bookmark statistics' });
    }
});

module.exports = router;
