const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, '..', 'database', 'newsapp.db');
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Database connection error:', err.message);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    // Enable foreign keys
                    this.db.run('PRAGMA foreign_keys = ON');
                    resolve(this.db);
                }
            });
        });
    }

    async get(sql, params = []) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('Database GET error:', err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(sql, params = []) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Database ALL error:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async run(sql, params = []) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('Database RUN error:', err.message);
                    reject(err);
                } else {
                    resolve({
                        lastID: this.lastID,
                        changes: this.changes
                    });
                }
            });
        });
    }

    async exec(sql) {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    console.error('Database EXEC error:', err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // Transaction support
    async beginTransaction() {
        await this.run('BEGIN TRANSACTION');
    }

    async commit() {
        await this.run('COMMIT');
    }

    async rollback() {
        await this.run('ROLLBACK');
    }

    // Helper method for transactions
    async transaction(callback) {
        try {
            await this.beginTransaction();
            const result = await callback(this);
            await this.commit();
            return result;
        } catch (error) {
            await this.rollback();
            throw error;
        }
    }

    // Close database connection
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Database close error:', err.message);
                        reject(err);
                    } else {
                        console.log('Database connection closed');
                        this.db = null;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    // Health check
    async healthCheck() {
        try {
            const result = await this.get('SELECT 1 as health');
            return result && result.health === 1;
        } catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }

    // Get database statistics
    async getStats() {
        try {
            const tables = await this.all(`
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name NOT LIKE 'sqlite_%'
            `);

            const stats = {};
            for (const table of tables) {
                const count = await this.get(`SELECT COUNT(*) as count FROM ${table.name}`);
                stats[table.name] = count.count;
            }

            return stats;
        } catch (error) {
            console.error('Error getting database stats:', error);
            return {};
        }
    }

    // Clean up expired sessions
    async cleanupExpiredSessions() {
        try {
            const result = await this.run(
                'DELETE FROM user_sessions WHERE expires_at < ?',
                [new Date().toISOString()]
            );
            console.log(`Cleaned up ${result.changes} expired sessions`);
            return result.changes;
        } catch (error) {
            console.error('Error cleaning up expired sessions:', error);
            return 0;
        }
    }

    // Get user session count
    async getUserSessionCount(userId) {
        try {
            const result = await this.get(
                'SELECT COUNT(*) as count FROM user_sessions WHERE user_id = ? AND expires_at > ?',
                [userId, new Date().toISOString()]
            );
            return result.count;
        } catch (error) {
            console.error('Error getting user session count:', error);
            return 0;
        }
    }
}

module.exports = Database;
