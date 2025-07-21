const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Database = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters')
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', registerValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password, firstName, lastName } = req.body;
        const db = Database.getInstance();

        // Check if user already exists
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const result = await db.run(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
            [email, passwordHash, firstName || null, lastName || null]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.lastID, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Create session record
        await db.run(
            'INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [
                result.lastID,
                token,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                req.ip,
                req.get('User-Agent') || null
            ]
        );

        // Get user data (without password)
        const user = await db.get(
            'SELECT id, email, first_name, last_name, theme_preference, created_at FROM users WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { email, password } = req.body;
        const db = Database.getInstance();

        // Find user
        const user = await db.get(
            'SELECT id, email, password_hash, first_name, last_name, theme_preference, is_active FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.is_active) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Create session record
        await db.run(
            'INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
            [
                user.id,
                token,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                req.ip,
                req.get('User-Agent') || null
            ]
        );

        // Remove password from response
        delete user.password_hash;

        res.json({
            message: 'Login successful',
            user,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            // Remove session from database
            await db.run('DELETE FROM user_sessions WHERE session_token = ?', [token]);
        }

        res.json({ message: 'Logout successful' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error during logout' });
    }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();
        
        const user = await db.get(
            'SELECT id, email, first_name, last_name, theme_preference, created_at, updated_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
    try {
        const db = Database.getInstance();
        const oldToken = req.headers.authorization?.split(' ')[1];

        // Generate new token
        const newToken = jwt.sign(
            { userId: req.user.userId, email: req.user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Update session in database
        await db.run(
            'UPDATE user_sessions SET session_token = ?, expires_at = ? WHERE session_token = ?',
            [
                newToken,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                oldToken
            ]
        );

        res.json({
            message: 'Token refreshed successfully',
            token: newToken
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
