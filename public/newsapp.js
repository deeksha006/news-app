// API Configuration
const API_BASE_URL = '/api';

// Get auth token dynamically
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Check authentication on page load
window.addEventListener('load', function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'landing.html';
        return;
    }
    // Load initial news
    fetchNews('Technology');

    // Initialize filters
    initializeFilters();
});

// Logo click handler - show all news
document.addEventListener('DOMContentLoaded', function() {
    const logoHome = document.getElementById('logo-home');
    if (logoHome) {
        logoHome.addEventListener('click', function(e) {
            e.preventDefault();

            // Clear active states from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Fetch all news (mixed categories)
            fetchAllNews();
        });
    }
});

// Remove the old sample data since we're now using the backend
// Sample data for when API is not available (kept for reference but not used)
const sampleNews = {
    "Technology": [
        {
            title: "Latest Tech Innovations Reshape Industry",
            description: "Discover the cutting-edge technologies that are transforming how we work and live in the digital age.",
            urlToImage: "https://via.placeholder.com/400x200/3498db/ffffff?text=Technology",
            url: "#",
            source: { name: "Tech Today" },
            publishedAt: new Date().toISOString()
        },
        {
            title: "AI Revolution: What's Next?",
            description: "Artificial Intelligence continues to evolve rapidly, bringing new possibilities and challenges to various industries.",
            urlToImage: "https://via.placeholder.com/400x200/2ecc71/ffffff?text=AI+News",
            url: "#",
            source: { name: "AI Weekly" },
            publishedAt: new Date().toISOString()
        },
        {
            title: "Cybersecurity Trends for 2025",
            description: "Stay ahead of cyber threats with the latest security measures and best practices for protecting digital assets.",
            urlToImage: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=Security",
            url: "#",
            source: { name: "Security Focus" },
            publishedAt: new Date().toISOString()
        }
    ],
    "Business": [
        {
            title: "Global Markets Show Strong Growth",
            description: "International markets demonstrate resilience with steady growth across multiple sectors this quarter.",
            urlToImage: "https://via.placeholder.com/400x200/f39c12/ffffff?text=Business",
            url: "#",
            source: { name: "Business Daily" },
            publishedAt: new Date().toISOString()
        }
    ],
    "Cricket": [
        {
            title: "Championship Series Begins",
            description: "The highly anticipated cricket championship series kicks off with exciting matches between top teams.",
            urlToImage: "https://via.placeholder.com/400x200/9b59b6/ffffff?text=Cricket",
            url: "#",
            source: { name: "Sports Central" },
            publishedAt: new Date().toISOString()
        }
    ],
    "India": [
        {
            title: "India's Digital Revolution: UPI Transactions Cross 10 Billion Monthly",
            description: "India's Unified Payments Interface (UPI) has achieved a historic milestone, processing over 10 billion transactions in a single month, showcasing the country's digital payment revolution.",
            urlToImage: "https://via.placeholder.com/400x200/FF6B35/ffffff?text=UPI+Digital+India",
            url: "https://example.com/india-upi-milestone",
            source: { name: "Economic Times India" },
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Monsoon Update: Heavy Rainfall Expected Across Northern India",
            description: "The India Meteorological Department has issued weather warnings for heavy to very heavy rainfall across northern states including Delhi, Punjab, and Haryana.",
            urlToImage: "https://via.placeholder.com/400x200/4A90E2/ffffff?text=Monsoon+India",
            url: "https://example.com/india-monsoon-update",
            source: { name: "India Today" },
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Indian Space Program: Chandrayaan-4 Mission Approved by Government",
            description: "The Indian government has approved the ambitious Chandrayaan-4 lunar mission, marking another milestone in India's space exploration journey.",
            urlToImage: "https://via.placeholder.com/400x200/8E44AD/ffffff?text=ISRO+Space+Mission",
            url: "https://example.com/chandrayaan-4-approved",
            source: { name: "The Hindu" },
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Bollywood Box Office: Latest Releases Show Strong Performance",
            description: "Recent Bollywood releases are showing encouraging box office numbers, indicating a recovery in the Indian film industry post-pandemic.",
            urlToImage: "https://via.placeholder.com/400x200/E74C3C/ffffff?text=Bollywood+News",
            url: "https://example.com/bollywood-box-office",
            source: { name: "Filmfare" },
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "India's Renewable Energy Milestone: Solar Capacity Reaches 70 GW",
            description: "India has achieved a significant milestone in renewable energy with solar power capacity reaching 70 gigawatts, moving closer to its 2030 targets.",
            urlToImage: "https://via.placeholder.com/400x200/27AE60/ffffff?text=Solar+Energy+India",
            url: "https://example.com/india-solar-milestone",
            source: { name: "Business Standard" },
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            title: "Cricket Update: India Prepares for Upcoming Test Series",
            description: "The Indian cricket team is gearing up for the upcoming Test series with intensive training sessions and strategic planning.",
            urlToImage: "https://via.placeholder.com/400x200/F39C12/ffffff?text=Cricket+India",
            url: "https://example.com/india-cricket-test-series",
            source: { name: "ESPN Cricinfo" },
            publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
        }
    ],
    "Politics": [
        {
            title: "Policy Updates and Reforms",
            description: "Latest political developments and policy changes affecting citizens nationwide.",
            urlToImage: "https://via.placeholder.com/400x200/34495e/ffffff?text=Politics",
            url: "#",
            source: { name: "Political Times" },
            publishedAt: new Date().toISOString()
        }
    ],
    "Entertainment": [
        {
            title: "Box Office Hits This Season",
            description: "Entertainment industry sees record-breaking performances with new releases captivating audiences.",
            urlToImage: "https://via.placeholder.com/400x200/e91e63/ffffff?text=Entertainment",
            url: "#",
            source: { name: "Entertainment Weekly" },
            publishedAt: new Date().toISOString()
        }
    ]
};

// Initial news loading is handled in the main load event listener above

async function fetchNews(query) {
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        loadingSpinner.style.display = 'block';

        // Get current filter values
        const { dateRange, sortBy } = getCurrentFilters();

        // Fetch from backend API
        const headers = {
            'Content-Type': 'application/json'
        };

        const authToken = getAuthToken();
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(`${API_BASE_URL}/news?category=${query.toLowerCase()}&dateRange=${dateRange}&sortBy=${sortBy}`, {
            headers
        });

        const data = await res.json();

        if (res.ok && data.articles && data.articles.length > 0) {
            currentArticles = data.articles;
            displayNews(currentArticles);

            // Show fallback message if using sample data
            if (data.fallback) {
                const newsCardContainer = document.getElementById("cardscontainer");
                const fallbackMessage = document.createElement('div');
                fallbackMessage.innerHTML = `
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 12px; margin-bottom: 20px; text-align: center;">
                        <span style="color: #856404;">📰 Showing sample articles - Live news temporarily unavailable</span>
                    </div>
                `;
                newsCardContainer.insertBefore(fallbackMessage, newsCardContainer.firstChild);
            }
        } else if (res.status === 503 || res.status === 500) {
            // Service unavailable or server error - try to show any articles returned
            if (data.articles && data.articles.length > 0) {
                currentArticles = data.articles;
                displayNews(currentArticles);

                // Show fallback message
                const newsCardContainer = document.getElementById("cardscontainer");
                const fallbackMessage = document.createElement('div');
                fallbackMessage.innerHTML = `
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 12px; margin-bottom: 20px; text-align: center;">
                        <span style="color: #856404;">📰 Showing sample articles - Live news temporarily unavailable</span>
                    </div>
                `;
                newsCardContainer.insertBefore(fallbackMessage, newsCardContainer.firstChild);
            } else {
                // No articles available - show error message
                const newsCardContainer = document.getElementById("cardscontainer");
                newsCardContainer.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: var(--primary-text-color);">
                        <h2>📰 News Service Temporarily Unavailable</h2>
                        <p style="font-size: 18px; margin: 20px 0;">We're having trouble connecting to our news sources right now.</p>
                        <p style="color: var(--secondary-text-color); margin-bottom: 30px;">This usually resolves quickly. Please try again in a few moments.</p>
                        <button onclick="fetchNews('${query}')" style="padding: 12px 24px; background-color: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
                            🔄 Try Again
                        </button>
                    </div>
                `;
            }
        } else {
            throw new Error(data.error || 'No articles found');
        }
    } catch (error) {
        console.error('News fetch failed:', error.message);

        // Show error message
        const newsCardContainer = document.getElementById("cardscontainer");
        newsCardContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--primary-text-color);">
                <h2>Unable to load news</h2>
                <p>There was an error loading news for "${query}". Please try again later.</p>
                <button onclick="fetchNews('${query}')" style="margin-top: 20px; padding: 10px 20px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function showNotice(message) {
    const newsCardContainer = document.getElementById("cardscontainer");
    const existingNotice = newsCardContainer.querySelector('.news-notice');
    if (existingNotice) {
        existingNotice.remove();
    }

    const notice = document.createElement('div');
    notice.className = 'news-notice';
    notice.style.cssText = `
        background-color: var(--accent-color);
        color: white;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 4px;
        text-align: center;
        font-size: 0.9em;
    `;
    notice.innerHTML = message;
    newsCardContainer.insertBefore(notice, newsCardContainer.firstChild);
}

let currentArticles = [];

function displayNews(articles) {
    const newsCardContainer = document.getElementById("cardscontainer");
    newsCardContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        newsCardContainer.innerHTML = '<h2>No articles found</h2>';
        return;
    }

    // Filter articles to only show those with valid images
    const articlesWithImages = articles.filter(article => {
        const imageUrl = article.urlToImage || article.image_url;

        // Strict image validation
        if (!imageUrl) return false;
        if (!imageUrl.startsWith('http')) return false;
        if (imageUrl.length < 30) return false;

        // Allow our sample placeholder images but block generic placeholders
        if (imageUrl.includes('placeholder') && !imageUrl.includes('via.placeholder.com')) return false;
        if (imageUrl.includes('default') && !imageUrl.includes('via.placeholder.com')) return false;
        if (imageUrl.includes('logo') && !imageUrl.includes('via.placeholder.com')) return false;
        if (imageUrl.includes('avatar')) return false;
        if (imageUrl.endsWith('.svg')) return false;

        // Must have proper image extension or be from known image hosts
        const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(imageUrl);
        const isFromImageHost = /\.(amazonaws\.com|cloudfront\.net|imgur\.com|unsplash\.com|pexels\.com|shutterstock\.com|gettyimages\.com|newsweek\.com|cnn\.com|bbc\.com|reuters\.com|videoCardz\.com)/i.test(imageUrl);

        return hasImageExtension || isFromImageHost;
    });

    if (articlesWithImages.length === 0) {
        newsCardContainer.innerHTML = '<h2>No articles with images found</h2>';
        return;
    }

    articlesWithImages.forEach((article) => {
        const cardClone = createNewsCard(article);
        newsCardContainer.appendChild(cardClone);
    });
}

// Fetch all news from multiple categories
async function fetchAllNews() {
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        loadingSpinner.style.display = 'block';

        // Fetch articles from multiple categories
        const categories = ['technology', 'business', 'entertainment', 'politics', 'sports', 'india'];
        const promises = categories.map(category =>
            fetch(`${API_BASE_URL}/news?category=${category}&pageSize=5`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => data.articles || [])
                .catch(() => [])
        );

        const results = await Promise.all(promises);

        // Combine all articles and shuffle them
        let allArticles = results.flat();

        if (allArticles.length > 0) {
            // Shuffle articles for variety
            allArticles = shuffleArray(allArticles);

            // Limit to 30 articles for better performance
            currentArticles = allArticles.slice(0, 30);
            displayNews(currentArticles);
        } else {
            throw new Error('No articles found');
        }
    } catch (error) {
        console.error('Error fetching all news:', error);
        const newsCardContainer = document.getElementById("cardscontainer");
        newsCardContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--primary-text-color);">
                <h2>Unable to load news</h2>
                <p>There was an error loading news. Please try again later.</p>
                <button onclick="fetchAllNews()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize filters
function initializeFilters() {
    const dateRangeSelect = document.getElementById('date-range');
    const sortBySelect = document.getElementById('sort-by');

    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', handleFilterChange);
    }

    if (sortBySelect) {
        sortBySelect.addEventListener('change', handleFilterChange);
    }
}

// Handle filter changes
function handleFilterChange() {
    const activeNavItem = document.querySelector('.nav-item.active');
    if (activeNavItem) {
        const category = activeNavItem.getAttribute('data-category');
        fetchNews(category);
    } else {
        // If no category is active, fetch all news
        fetchAllNews();
    }
}

// Get current filter values
function getCurrentFilters() {
    const dateRange = document.getElementById('date-range')?.value || 'month';
    const sortBy = document.getElementById('sort-by')?.value || 'latest';
    return { dateRange, sortBy };
}

function createNewsCard(article) {
    const div = document.createElement('div');
    div.className = 'card';

    const bookmarkIcon = document.createElement('span');
    bookmarkIcon.className = 'bookmark-icon';

    // Store the article URL as a data attribute for easy access
    const articleUrl = article.url;
    bookmarkIcon.setAttribute('data-article-url', articleUrl);

    // Check if article is bookmarked (handle both formats)
    const isBookmarked = bookmarks.some(b => (b.url || b.article_url) === articleUrl);
    bookmarkIcon.textContent = isBookmarked ? '★' : '☆';
    bookmarkIcon.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';

    bookmarkIcon.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('Bookmark icon clicked for article:', article.title);

        // Add visual feedback
        bookmarkIcon.style.transform = 'scale(0.8)';
        setTimeout(() => {
            bookmarkIcon.style.transform = '';
        }, 150);

        try {
            const isNowBookmarked = await toggleBookmark(article);
            bookmarkIcon.textContent = isNowBookmarked ? '★' : '☆';
            bookmarkIcon.title = isNowBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
            console.log('Bookmark toggled successfully:', isNowBookmarked ? 'added' : 'removed');
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    });

    // Handle different article formats (API vs Database)
    const imageUrl = article.urlToImage || article.image_url;
    const sourceName = article.source?.name || article.source_name || 'Unknown Source';
    const publishedDate = article.publishedAt || article.published_at;
    const formattedDate = publishedDate ? new Date(publishedDate).toLocaleDateString() : 'Unknown Date';
    const description = article.description || '';

    // Since we now filter for articles with real images, we can directly use them
    // But add error handling to hide cards if images fail to load
    const imageHtml = `<img src="${imageUrl}" alt="news-image" style="width:100%; height:230px; object-fit:cover;"
                       onerror="this.parentElement.parentElement.style.display='none';">`;

    div.innerHTML = `
        <div class="card-header">
            ${imageHtml}
        </div>
        <div class="card-content">
            <h3 id="news-title">${article.title}</h3>
            <h6 class="news-source" id="news-source">${sourceName} • ${formattedDate}</h6>
            <p class="news-desc" id="news-desc">${description}</p>
        </div>
    `;

    div.insertBefore(bookmarkIcon, div.firstChild);

    div.addEventListener('click', () => {
        window.open(article.url, '_blank');
    });

    return div;
}

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);

    console.log('Theme switched to:', newTheme);
    console.log('Body data-theme attribute:', document.body.getAttribute('data-theme'));
});

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

console.log('Initial theme loaded:', savedTheme);
console.log('Body data-theme attribute:', document.body.getAttribute('data-theme'));

// Bookmarks functionality
let bookmarks = [];
let filteredBookmarks = [];
const bookmarksModal = document.getElementById('bookmarks-modal');
const closeModal = document.querySelector('.close-modal');
const showBookmarksBtn = document.getElementById('show-bookmarks');
const clearAllBtn = document.getElementById('clear-all-bookmarks');
const exportBtn = document.getElementById('export-bookmarks');
const bookmarkSearchInput = document.getElementById('bookmark-search-input');

// Load bookmarks on page load
console.log('Loading bookmarks on page load...');
console.log('Auth token present:', !!getAuthToken());
console.log('User logged in:', localStorage.getItem('isLoggedIn'));
loadBookmarks();

showBookmarksBtn.addEventListener('click', () => {
    displayBookmarks();
    updateBookmarkStats();
    bookmarksModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    bookmarksModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === bookmarksModal) {
        bookmarksModal.style.display = 'none';
    }
});

// Clear all bookmarks
clearAllBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
        await clearAllBookmarks();
        displayBookmarks();
        updateBookmarkStats();
        refreshBookmarkIcons(); // Update all bookmark icons on main page
    }
});

// Export bookmarks
exportBtn.addEventListener('click', () => {
    exportBookmarks();
});

// Search bookmarks
bookmarkSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterBookmarks(searchTerm);
});

async function loadBookmarks() {
    const authToken = getAuthToken();
    if (!authToken) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/bookmarks`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            bookmarks = data.bookmarks || [];
        } else {
            // Fallback to localStorage
            bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        }
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    }
}

function displayBookmarks(bookmarksToShow = null) {
    const container = document.getElementById('bookmarks-container');
    const noBookmarksDiv = document.getElementById('no-bookmarks');
    const bookmarksToDisplay = bookmarksToShow || bookmarks;

    container.innerHTML = '';

    // Filter bookmarks to only show those with valid images
    const bookmarksWithImages = bookmarksToDisplay.filter(bookmark => {
        const imageUrl = bookmark.image_url;
        return imageUrl &&
               imageUrl.startsWith('http') &&
               imageUrl.length > 30 &&
               !(imageUrl.includes('placeholder') && !imageUrl.includes('via.placeholder.com')) &&
               !(imageUrl.includes('default') && !imageUrl.includes('via.placeholder.com')) &&
               !(imageUrl.includes('logo') && !imageUrl.includes('via.placeholder.com')) &&
               !imageUrl.includes('avatar') &&
               !imageUrl.endsWith('.svg');
    });

    if (bookmarksWithImages.length === 0) {
        container.style.display = 'none';
        noBookmarksDiv.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noBookmarksDiv.style.display = 'none';

    bookmarksWithImages.forEach(bookmark => {
        // Convert bookmark format to article format
        const article = {
            title: bookmark.title,
            description: bookmark.description,
            url: bookmark.url || bookmark.article_url,
            urlToImage: bookmark.image_url,
            source: { name: bookmark.source_name },
            publishedAt: bookmark.published_at
        };

        const articleElement = createBookmarkCard(article, bookmark);
        container.appendChild(articleElement);
    });
}

function createBookmarkCard(article, bookmark) {
    const div = document.createElement('div');
    div.className = 'card bookmark-card';

    const removeIcon = document.createElement('span');
    removeIcon.className = 'bookmark-remove';
    removeIcon.innerHTML = '🗑️';
    removeIcon.title = 'Remove bookmark';

    removeIcon.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Remove this bookmark?')) {
            await toggleBookmark(article);
            displayBookmarks();
            updateBookmarkStats();
            refreshBookmarkIcons(); // Update bookmark icons on main page
        }
    });

    // Handle different article formats
    const imageUrl = article.urlToImage || article.image_url;
    const sourceName = article.source?.name || article.source_name || 'Unknown Source';
    const publishedDate = article.publishedAt || article.published_at;
    const formattedDate = publishedDate ? new Date(publishedDate).toLocaleDateString() : 'Unknown Date';
    const description = article.description || '';

    const imageHtml = `<img src="${imageUrl}" alt="news-image" style="width:100%; height:150px; object-fit:cover;">`;

    div.innerHTML = `
        <div class="card-header">
            ${imageHtml}
        </div>
        <div class="card-content">
            <h3 class="bookmark-title">${article.title}</h3>
            <h6 class="news-source">${sourceName} • ${formattedDate}</h6>
            <p class="news-desc bookmark-desc">${description}</p>
            <div class="bookmark-actions">
                <button class="read-btn" onclick="window.open('${article.url}', '_blank')">📖 Read Article</button>
            </div>
        </div>
    `;

    div.insertBefore(removeIcon, div.firstChild);
    return div;
}

function updateBookmarkStats() {
    const countElement = document.getElementById('bookmark-count');
    const count = bookmarks.length;
    countElement.textContent = `${count} bookmark${count !== 1 ? 's' : ''}`;
}

function filterBookmarks(searchTerm) {
    if (!searchTerm) {
        displayBookmarks();
        return;
    }

    const filtered = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.source_name?.toLowerCase().includes(searchTerm)
    );

    displayBookmarks(filtered);
}

async function clearAllBookmarks() {
    const authToken = getAuthToken();
    if (!authToken) {
        bookmarks = [];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        return;
    }

    try {
        // Clear all bookmarks from server
        const promises = bookmarks.map(bookmark =>
            fetch(`${API_BASE_URL}/bookmarks/${bookmark.bookmark_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
        );

        await Promise.all(promises);
        bookmarks = [];
    } catch (error) {
        console.error('Error clearing bookmarks:', error);
        // Fallback to localStorage
        bookmarks = [];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

function exportBookmarks() {
    if (bookmarks.length === 0) {
        alert('No bookmarks to export!');
        return;
    }

    const exportData = bookmarks.map(bookmark => ({
        title: bookmark.title,
        url: bookmark.url || bookmark.article_url,
        source: bookmark.source_name,
        date: bookmark.published_at,
        description: bookmark.description
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `news-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Refresh all bookmark icons on the main page
function refreshBookmarkIcons() {
    const allBookmarkIcons = document.querySelectorAll('.bookmark-icon');

    allBookmarkIcons.forEach(icon => {
        const articleUrl = icon.getAttribute('data-article-url');

        if (articleUrl) {
            const isBookmarked = bookmarks.some(b => (b.url || b.article_url) === articleUrl);
            icon.textContent = isBookmarked ? '★' : '☆';
            icon.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
        }
    });
}

async function toggleBookmark(article) {
    const authToken = getAuthToken();
    console.log('toggleBookmark called, authToken:', authToken ? 'present' : 'missing');

    if (!authToken) {
        // Fallback to localStorage for non-authenticated users
        console.log('Using localStorage fallback for bookmarks');
        const index = bookmarks.findIndex(b => b.url === article.url);
        if (index === -1) {
            bookmarks.push(article);
            console.log('Added bookmark to localStorage');
        } else {
            bookmarks.splice(index, 1);
            console.log('Removed bookmark from localStorage');
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        return index === -1;
    }

    try {
        const existingBookmark = bookmarks.find(b => b.url === article.url);

        if (existingBookmark) {
            // Remove bookmark
            console.log('Removing bookmark from server');
            const response = await fetch(`${API_BASE_URL}/bookmarks/${existingBookmark.bookmark_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                bookmarks = bookmarks.filter(b => b.url !== article.url);
                return false;
            } else if (response.status === 401) {
                console.log('Authentication failed, falling back to localStorage');
                // Clear invalid token and fall back to localStorage
                localStorage.removeItem('authToken');
                const index = bookmarks.findIndex(b => b.url === article.url);
                if (index !== -1) {
                    bookmarks.splice(index, 1);
                    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                    return false;
                }
            }
        } else {
            // Add bookmark
            console.log('Adding bookmark to server');
            const response = await fetch(`${API_BASE_URL}/bookmarks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    articleUrl: article.url,
                    title: article.title,
                    description: article.description,
                    imageUrl: article.urlToImage || article.image_url,
                    sourceName: article.source?.name || article.source_name,
                    author: article.author,
                    publishedAt: article.publishedAt || article.published_at
                })
            });

            if (response.ok) {
                const data = await response.json();
                bookmarks.push(data.bookmark);
                return true;
            } else if (response.status === 401) {
                console.log('Authentication failed, falling back to localStorage');
                // Clear invalid token and fall back to localStorage
                localStorage.removeItem('authToken');
                bookmarks.push(article);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                return true;
            }
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        // Fallback to localStorage
        const index = bookmarks.findIndex(b => b.url === article.url);
        if (index === -1) {
            bookmarks.push(article);
        } else {
            bookmarks.splice(index, 1);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        return index === -1;
    }

    return false;
}

// Navigation
let curSelectedNav = null;

// Add event listeners to navigation items
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category') || this.id;
            onNavItemClick(category);
        });
    });

    // Add logout button event listener
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    performSearch(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});

searchText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchText.value.trim();
        if (!query) return;
        performSearch(query);
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
    }
});

async function performSearch(query) {
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        loadingSpinner.style.display = 'block';

        const headers = {
            'Content-Type': 'application/json'
        };

        const authToken = getAuthToken();
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const res = await fetch(`${API_BASE_URL}/news/search?q=${encodeURIComponent(query)}`, {
            headers
        });

        const data = await res.json();

        if (res.ok && data.articles) {
            currentArticles = data.articles;
            displayNews(currentArticles);

            if (data.articles.length === 0) {
                const newsCardContainer = document.getElementById("cardscontainer");
                newsCardContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--primary-text-color);">
                        <h2>No results found</h2>
                        <p>No articles found for "${query}". Try a different search term.</p>
                    </div>
                `;
            } else if (data.cached) {
                showNotice(`📰 Found ${data.articles.length} cached results for "${query}"`);
            }
        } else {
            throw new Error(data.error || 'Search failed');
        }
    } catch (error) {
        console.error('Search failed:', error.message);

        const newsCardContainer = document.getElementById("cardscontainer");
        newsCardContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--primary-text-color);">
                <h2>Search failed</h2>
                <p>Unable to search for "${query}". Please try again later.</p>
                <button onclick="performSearch('${query}')" style="margin-top: 20px; padding: 10px 20px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry Search
                </button>
            </div>
        `;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Responsive design
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

async function handleLogout() {
    try {
        const authToken = getAuthToken();
        if (authToken) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'landing.html';
    }
}
