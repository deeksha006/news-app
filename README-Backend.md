# News Flow Backend API

A robust Node.js backend API for the News Flow application with SQLite database, user authentication, and news management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **News Management**: Fetch, cache, and search news articles from NewsAPI
- **Bookmarks System**: Save and manage favorite articles
- **User Profiles**: Manage user preferences and settings
- **Database**: SQLite database with comprehensive schema
- **Security**: Rate limiting, CORS, helmet security headers
- **Caching**: Article caching to reduce API calls
- **Search**: Full-text search across articles
- **RESTful API**: Well-structured REST endpoints

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- NewsAPI key (optional - fallback data available)

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key
   NEWS_API_KEY=your-newsapi-key
   FRONTEND_URL=http://localhost:8000
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### News Endpoints

#### Get News Articles
```http
GET /api/news?category=technology&page=1&pageSize=20&sortBy=latest&dateRange=week
```

#### Search News
```http
GET /api/news/search?q=artificial%20intelligence&page=1&pageSize=20
```

#### Get Categories
```http
GET /api/news/categories
```

### Bookmark Endpoints

#### Get User Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer <jwt_token>
```

#### Add Bookmark
```http
POST /api/bookmarks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "articleUrl": "https://example.com/article",
  "title": "Article Title",
  "description": "Article description",
  "imageUrl": "https://example.com/image.jpg",
  "sourceName": "Source Name",
  "author": "Author Name",
  "publishedAt": "2024-01-01T00:00:00Z",
  "notes": "My notes about this article"
}
```

#### Remove Bookmark
```http
DELETE /api/bookmarks/:id
Authorization: Bearer <jwt_token>
```

#### Check Bookmark Status
```http
GET /api/bookmarks/check/:encodedUrl
Authorization: Bearer <jwt_token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com"
}
```

#### Change Password
```http
PUT /api/users/password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

#### Update Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "theme": "dark",
  "preferences": {
    "notifications": true,
    "autoRefresh": false
  }
}
```

## 🗄️ Database Schema

### Tables
- **users**: User accounts and authentication
- **user_sessions**: JWT session management
- **categories**: News categories
- **articles**: Cached news articles
- **bookmarks**: User bookmarks
- **user_preferences**: User settings
- **search_history**: Search analytics

### Key Features
- Foreign key constraints
- Indexes for performance
- Automatic timestamps
- Cascade deletes for data integrity

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers
- **Input Validation**: Request validation with express-validator
- **SQL Injection Protection**: Parameterized queries

## 📊 Monitoring & Health

#### Health Check
```http
GET /api/health
```

#### API Documentation
```http
GET /api
```

## 🚀 Deployment

### Environment Variables
Set these in production:
```env
NODE_ENV=production
JWT_SECRET=your-production-secret
NEWS_API_KEY=your-production-api-key
PORT=3001
```

### Database
The SQLite database file will be created at `./database/newsapp.db`

### Process Management
Use PM2 for production:
```bash
npm install -g pm2
pm2 start server.js --name "newsflow-api"
```

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run init-db`: Initialize database with schema and sample data
- `npm test`: Run tests
- `npm run lint`: Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, please check:
- API documentation at `/api`
- Health check at `/api/health`
- Server logs for debugging

## 🔄 Version History

- **v1.0.0**: Initial release with core features
  - User authentication
  - News fetching and caching
  - Bookmark management
  - User preferences
  - Search functionality
