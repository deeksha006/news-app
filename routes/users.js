const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Database = require('../utils/database');
const { authenticateToken, logActivity } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, logActivity, async (req, res) => {
    try {
        const db = Database.getInstance();
        
        const user = await db.get(`
            SELECT 
                id, email, first_name, last_name, theme_preference, 
                created_at, updated_at, email_verified
            FROM users 
            WHERE id = ?
        `, [req.user.userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user statistics
        const stats = await db.get(`
            SELECT 
                (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?) as bookmark_count,
                (SELECT COUNT(*) FROM search_history WHERE user_id = ?) as search_count,
                (SELECT COUNT(*) FROM user_sessions WHERE user_id = ? AND expires_at > ?) as active_sessions
        `, [req.user.userId, req.user.userId, req.user.userId, new Date().toISOString()]);

        res.json({
            user: {
                ...user,
                stats
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Unable to fetch user profile' });
    }
});

// Update user profile
router.put('/profile', [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { firstName, lastName, email } = req.body;
        const db = Database.getInstance();

        // If email is being changed, check if it's already taken
        if (email) {
            const existingUser = await db.get(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, req.user.userId]
            );
            
            if (existingUser) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (firstName !== undefined) {
            updates.push('first_name = ?');
            values.push(firstName || null);
        }
        if (lastName !== undefined) {
            updates.push('last_name = ?');
            values.push(lastName || null);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(req.user.userId);

        await db.run(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Get updated user data
        const updatedUser = await db.get(`
            SELECT 
                id, email, first_name, last_name, theme_preference, 
                created_at, updated_at, email_verified
            FROM users 
            WHERE id = ?
        `, [req.user.userId]);

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Unable to update profile' });
    }
});

// Change password
router.put('/password', [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match');
        }
        return true;
    })
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;
        const db = Database.getInstance();

        // Get current user with password
        const user = await db.get(
            'SELECT password_hash FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await db.run(
            'UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?',
            [newPasswordHash, new Date().toISOString(), req.user.userId]
        );

        // Invalidate all other sessions (optional security measure)
        await db.run(
            'DELETE FROM user_sessions WHERE user_id = ? AND session_token != ?',
            [req.user.userId, req.headers.authorization?.split(' ')[1]]
        );

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Unable to change password' });
    }
});

// Update user preferences
router.put('/preferences', [
    body('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
    body('preferences').optional().isObject().withMessage('Preferences must be an object')
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { theme, preferences } = req.body;
        const db = Database.getInstance();

        // Update theme preference
        if (theme) {
            await db.run(
                'UPDATE users SET theme_preference = ?, updated_at = ? WHERE id = ?',
                [theme, new Date().toISOString(), req.user.userId]
            );
        }

        // Update other preferences
        if (preferences && typeof preferences === 'object') {
            for (const [key, value] of Object.entries(preferences)) {
                await db.run(`
                    INSERT OR REPLACE INTO user_preferences (user_id, preference_key, preference_value, updated_at)
                    VALUES (?, ?, ?, ?)
                `, [req.user.userId, key, JSON.stringify(value), new Date().toISOString()]);
            }
        }

        // Get updated preferences
        const userPrefs = await db.all(
            'SELECT preference_key, preference_value FROM user_preferences WHERE user_id = ?',
            [req.user.userId]
        );

        const prefsObject = {};
        userPrefs.forEach(pref => {
            try {
                prefsObject[pref.preference_key] = JSON.parse(pref.preference_value);
            } catch {
                prefsObject[pref.preference_key] = pref.preference_value;
            }
        });

        // Get updated user data
        const user = await db.get(
            'SELECT theme_preference FROM users WHERE id = ?',
            [req.user.userId]
        );

        res.json({
            message: 'Preferences updated successfully',
            theme: user.theme_preference,
            preferences: prefsObject
        });

    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Unable to update preferences' });
    }
});

// Get user preferences
router.get('/preferences', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();

        // Get theme preference
        const user = await db.get(
            'SELECT theme_preference FROM users WHERE id = ?',
            [req.user.userId]
        );

        // Get other preferences
        const userPrefs = await db.all(
            'SELECT preference_key, preference_value FROM user_preferences WHERE user_id = ?',
            [req.user.userId]
        );

        const prefsObject = {};
        userPrefs.forEach(pref => {
            try {
                prefsObject[pref.preference_key] = JSON.parse(pref.preference_value);
            } catch {
                prefsObject[pref.preference_key] = pref.preference_value;
            }
        });

        res.json({
            theme: user?.theme_preference || 'light',
            preferences: prefsObject
        });

    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Unable to fetch preferences' });
    }
});

// Get user search history
router.get('/search-history', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);

        const searchHistory = await db.all(`
            SELECT search_query, created_at, results_count
            FROM search_history 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `, [req.user.userId, limit]);

        // Get popular searches
        const popularSearches = await db.all(`
            SELECT search_query, COUNT(*) as count
            FROM search_history 
            WHERE user_id = ?
            GROUP BY search_query
            ORDER BY count DESC
            LIMIT 10
        `, [req.user.userId]);

        res.json({
            recent: searchHistory,
            popular: popularSearches
        });

    } catch (error) {
        console.error('Get search history error:', error);
        res.status(500).json({ error: 'Unable to fetch search history' });
    }
});

// Delete user account
router.delete('/account', [
    body('password').notEmpty().withMessage('Password is required to delete account'),
    body('confirmation').equals('DELETE').withMessage('Please type DELETE to confirm')
], authenticateToken, logActivity, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { password } = req.body;
        const db = Database.getInstance();

        // Verify password
        const user = await db.get(
            'SELECT password_hash FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Delete user account (cascade will handle related records)
        await db.run('DELETE FROM users WHERE id = ?', [req.user.userId]);

        res.json({ message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Unable to delete account' });
    }
});

module.exports = router;
