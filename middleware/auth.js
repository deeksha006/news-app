const jwt = require('jsonwebtoken');
const Database = require('../utils/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if user exists and is active
        const db = Database.getInstance();
        const user = await db.get(
            'SELECT id, email, is_active FROM users WHERE id = ? AND is_active = 1',
            [decoded.userId]
        );

        if (!user) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        // Check if session exists in database (optional - for session tracking)
        const session = await db.get(
            'SELECT id FROM user_sessions WHERE session_token = ? AND expires_at > ?',
            [token, new Date().toISOString()]
        );

        // Add user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            sessionId: session?.id || null
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        } else {
            console.error('Authentication error:', error);
            return res.status(500).json({ error: 'Authentication failed' });
        }
    }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const db = Database.getInstance();
        const session = await db.get(
            'SELECT s.*, u.is_active FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = ? AND s.expires_at > ?',
            [token, new Date().toISOString()]
        );

        if (session && session.is_active) {
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                sessionId: session.id
            };
        } else {
            req.user = null;
        }

        next();
    } catch (error) {
        // For optional auth, we don't fail on token errors
        req.user = null;
        next();
    }
};

// Middleware to check if user is admin (for future use)
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const db = Database.getInstance();
        const user = await db.get(
            'SELECT * FROM users WHERE id = ? AND is_active = 1',
            [req.user.userId]
        );

        if (!user) {
            return res.status(401).json({ error: 'User not found or inactive' });
        }

        // For now, we'll add admin functionality later
        // You can add an is_admin column to users table
        req.user.isAdmin = false; // Placeholder

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ error: 'Authorization check failed' });
    }
};

// Rate limiting per user
const createUserRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    const userRequests = new Map();

    return (req, res, next) => {
        const userId = req.user?.userId || req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean old entries
        if (userRequests.has(userId)) {
            const requests = userRequests.get(userId).filter(time => time > windowStart);
            userRequests.set(userId, requests);
        } else {
            userRequests.set(userId, []);
        }

        const requests = userRequests.get(userId);

        if (requests.length >= max) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
            });
        }

        requests.push(now);
        next();
    };
};

// Middleware to log user activity
const logActivity = async (req, res, next) => {
    try {
        if (req.user) {
            const db = Database.getInstance();
            
            // Log the activity (you can create an activity_log table)
            // For now, we'll just update the user's last_activity
            await db.run(
                'UPDATE users SET updated_at = ? WHERE id = ?',
                [new Date().toISOString(), req.user.userId]
            );
        }
        next();
    } catch (error) {
        console.error('Activity logging error:', error);
        // Don't fail the request if logging fails
        next();
    }
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAdmin,
    createUserRateLimit,
    logActivity
};
