const API_KEY = "60947cac199341f9a8e2bf4fa7bc6d50";
const url = "https://newsapi.org/v2/everything?q=";

// Sample data for when API is not available
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
            title: "Economic Growth Continues",
            description: "India's economy shows robust growth with positive indicators across multiple sectors.",
            urlToImage: "https://via.placeholder.com/400x200/e67e22/ffffff?text=India+News",
            url: "#",
            source: { name: "India Today" },
            publishedAt: new Date().toISOString()
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

window.addEventListener("load", () => fetchNews("Technology"));

async function fetchNews(query) {
    const loadingSpinner = document.getElementById('loading-spinner');
    try {
        loadingSpinner.style.display = 'block';

        // Try to fetch from API first
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();

        if (data.status === "ok" && data.articles && data.articles.length > 0) {
            currentArticles = data.articles;
            displayNews(currentArticles);
        } else {
            throw new Error(data.message || 'No articles found');
        }
    } catch (error) {
        console.warn('API fetch failed, using sample data:', error.message);

        // Fallback to sample data
        const fallbackArticles = sampleNews[query] || sampleNews["Technology"];
        if (fallbackArticles && fallbackArticles.length > 0) {
            currentArticles = fallbackArticles;
            displayNews(currentArticles);

            // Show a notice that we're using sample data
            const newsCardContainer = document.getElementById("cardscontainer");
            const notice = document.createElement('div');
            notice.style.cssText = `
                background-color: var(--accent-color);
                color: white;
                padding: 10px;
                margin-bottom: 20px;
                border-radius: 4px;
                text-align: center;
                font-size: 0.9em;
            `;
            notice.innerHTML = '📰 Showing sample news (API unavailable)';
            newsCardContainer.insertBefore(notice, newsCardContainer.firstChild);
        } else {
            // If no sample data available
            const newsCardContainer = document.getElementById("cardscontainer");
            newsCardContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--primary-text-color);">
                    <h2>No news available</h2>
                    <p>Unable to load news for "${query}". Please try a different category.</p>
                </div>
            `;
        }
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

let currentArticles = [];

function displayNews(articles) {
    const newsCardContainer = document.getElementById("cardscontainer");
    newsCardContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        newsCardContainer.innerHTML = '<h2>No articles found</h2>';
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = createNewsCard(article);
        newsCardContainer.appendChild(cardClone);
    });
}

function createNewsCard(article) {
    const div = document.createElement('div');
    div.className = 'card';
    
    const bookmarkIcon = document.createElement('span');
    bookmarkIcon.className = 'bookmark-icon';
    bookmarkIcon.textContent = bookmarks.some(b => b.url === article.url) ? '★' : '☆';
    bookmarkIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isNowBookmarked = toggleBookmark(article);
        bookmarkIcon.textContent = isNowBookmarked ? '★' : '☆';
    });

    div.innerHTML = `
        <div class="card-header">
            <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="news-image" id="news-img">
        </div>
        <div class="card-content">
            <h3 id="news-title">${article.title}</h3>
            <h6 class="news-source" id="news-source">${article.source.name} • ${new Date(article.publishedAt).toLocaleDateString()}</h6>
            <p class="news-desc" id="news-desc">${article.description || ''}</p>
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
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Bookmarks functionality
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
const bookmarksModal = document.getElementById('bookmarks-modal');
const closeModal = document.querySelector('.close-modal');
const showBookmarksBtn = document.getElementById('show-bookmarks');

showBookmarksBtn.addEventListener('click', () => {
    displayBookmarks();
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

function displayBookmarks() {
    const container = document.getElementById('bookmarks-container');
    container.innerHTML = '';
    
    if (bookmarks.length === 0) {
        container.innerHTML = '<p>No bookmarks yet!</p>';
        return;
    }

    bookmarks.forEach(article => {
        const articleElement = createNewsCard(article);
        container.appendChild(articleElement);
    });
}

function toggleBookmark(article) {
    const index = bookmarks.findIndex(b => b.url === article.url);
    if (index === -1) {
        bookmarks.push(article);
    } else {
        bookmarks.splice(index, 1);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return index === -1;
}

// Navigation
let curSelectedNav = null;
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
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});

searchText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
    }
});

// reponsive design 

document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'landing.html';
}
