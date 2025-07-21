# 📰 News Flow

A modern, responsive news application with beautiful glassmorphism design and real-time news from multiple categories.

![News Flow Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🌍 **Real-time News** - Latest articles from NewsAPI
- 🎨 **Glassmorphism UI** - Modern glass-effect design
- 🌙 **Light/Dark Mode** - Toggle between themes
- 📚 **Bookmark System** - Save articles for later
- 🔍 **Search & Filter** - Find specific news
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Cached articles & optimized loading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- NewsAPI key (free at [newsapi.org](https://newsapi.org))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/news-flow.git
   cd news-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your NewsAPI key to .env file
   NEWS_API_KEY=your_api_key_here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3001
   ```

## 🎯 Categories

- **Technology** - Latest tech news and innovations
- **Sports** - Sports updates and scores
- **Business** - Market news and finance
- **Entertainment** - Movies, music, and celebrity news
- **Politics** - Political news and updates
- **India** - India-specific news and events

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: NewsAPI
- **Design**: Glassmorphism, CSS Grid, Flexbox

## 📱 Screenshots

### Light Mode
Beautiful gradient background with glass-effect cards

### Dark Mode
Elegant dark theme with subtle glass elements

## 🔧 Configuration

### Environment Variables
```env
NEWS_API_KEY=your_newsapi_key
PORT=3001
NODE_ENV=development
```

### Database
- **Type**: SQLite
- **File**: `news_app.db`
- **Auto-created**: On first run

## 📖 API Endpoints

- `GET /api/news?category=technology` - Get news by category
- `GET /api/news/search?q=query` - Search news
- `POST /api/bookmarks` - Add bookmark
- `GET /api/bookmarks` - Get user bookmarks
- `DELETE /api/bookmarks/:id` - Remove bookmark

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org) for providing news data
- [Poppins Font](https://fonts.google.com/specimen/Poppins) for typography
- Glassmorphism design inspiration

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

⭐ **Star this repository if you found it helpful!**
