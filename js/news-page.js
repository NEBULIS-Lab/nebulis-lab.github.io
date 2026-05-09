/**
 * Load and display all news from JSON files
 * Used on news.html page to show all news items
 */

let loadedNewsItems = [];

const newsMessages = {
  en: {
    noNews: 'No news available.',
    loadError: 'Failed to load news.',
    untitled: 'Untitled News'
  },
  zh: {
    noNews: '暂无动态。',
    loadError: '动态加载失败。',
    untitled: '未命名动态'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const listEl = document.getElementById('news-list');
  if (!listEl) {
    console.warn('News list element not found');
    return;
  }

  const newsPath = 'data/news/';
  const manifestPath = `${newsPath}manifest.json`;
  
  // Load the manifest to get list of news files
  // Use cache: 'no-cache' to ensure we always get the latest data
  fetch(manifestPath, { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      return response.json();
    })
    .then(manifest => {
      const newsFiles = manifest.news || [];
      
      if (newsFiles.length === 0) {
        renderNews([], listEl, getNewsPageLanguage(), 'empty');
        return;
      }

      // Load all news items with cache: 'no-cache' to ensure fresh data
      return Promise.all(
        newsFiles.map(filename => 
          fetch(`${newsPath}${filename}`, { cache: 'no-cache' })
            .then(response => {
              if (response.status === 404) {
                console.warn(`News file not found: ${filename}, skipping...`);
                return null;
              }
              if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
              }
              return response.json();
            })
            .catch(error => {
              if (!error.message.includes('404')) {
                console.error(`Error loading ${filename}:`, error);
              }
              return null;
            })
        )
      );
    })
    .then(newsItems => {
      if (!newsItems) return;
      
      loadedNewsItems = newsItems.filter(item => item !== null);

      if (loadedNewsItems.length === 0) {
        renderNews([], listEl, getNewsPageLanguage(), 'empty');
        return;
      }

      loadedNewsItems.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        
        // Check if dates are in YYYY-MM-DD format
        const isDateA = /^\d{4}-\d{2}-\d{2}$/.test(dateA);
        const isDateB = /^\d{4}-\d{2}-\d{2}$/.test(dateB);
        
        // If both are dates, compare them
        if (isDateA && isDateB) {
          return dateB.localeCompare(dateA);
        }
        // If only A is a date, A comes first
        if (isDateA && !isDateB) {
          return -1;
        }
        // If only B is a date, B comes first
        if (!isDateA && isDateB) {
          return 1;
        }
        // If neither is a date, use string comparison
        return dateB.localeCompare(dateA);
      });

      renderNews(loadedNewsItems, listEl, getNewsPageLanguage());
    })
    .catch(error => {
      console.error('Failed to load news:', error);
      renderNews([], listEl, getNewsPageLanguage(), 'error', error.message);
    });

  document.addEventListener('languageChanged', function(event) {
    renderNews(loadedNewsItems, listEl, event.detail.lang);
  });
});

/**
 * Create a news list item element
 */
function createNewsListItem(newsItem, lang) {
  const messages = newsMessages[lang] || newsMessages.en;
  const li = document.createElement('li');
  li.className = 'news-list-item';

  const content = document.createElement('div');
  content.className = 'news-list-content';

  // Image - only show if image path exists and is valid
  let imageDiv = null;
  const imagePath = newsItem.image;
  // Debug: log if image path exists
  if (imagePath) {
    console.log('News item has image path:', imagePath, 'for:', newsItem.title);
  }
  if (imagePath && typeof imagePath === 'string' && imagePath.trim() !== '') {
    imageDiv = document.createElement('div');
    imageDiv.className = 'news-list-image';
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = getLocalizedField(newsItem, lang, ['titleZh', 'title_zh'], newsItem.title || messages.untitled);
    img.loading = 'lazy';
    imageDiv.appendChild(img);
  } else {
    // Debug: confirm no image is being created
    console.log('No image created for:', newsItem.title, 'imagePath:', imagePath);
  }

  // Text content
  const textWrapper = document.createElement('div');
  textWrapper.className = 'news-list-text';

  // Meta (tag and date)
  const meta = document.createElement('div');
  meta.className = 'news-list-meta';

  if (newsItem.tag) {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'news-tag';
    tagSpan.textContent = getLocalizedTag(newsItem, lang);
    meta.appendChild(tagSpan);
  }

  if (newsItem.date) {
    const dateSpan = document.createElement('span');
    dateSpan.className = 'news-date';
    dateSpan.textContent = newsItem.date;
    meta.appendChild(dateSpan);
  }

  // Title
  const title = document.createElement('h3');
  title.className = 'news-list-title';
  title.textContent = getLocalizedField(newsItem, lang, ['titleZh', 'title_zh'], newsItem.title || messages.untitled);

  // Excerpt
  const excerptHtml = getLocalizedField(newsItem, lang, ['excerptHtmlZh', 'excerpt_html_zh'], newsItem.excerptHtml || newsItem.excerpt_html);
  if (excerptHtml || newsItem.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.className = 'news-list-excerpt';
    if (excerptHtml) {
      excerpt.innerHTML = excerptHtml;
    } else {
      excerpt.textContent = getLocalizedField(newsItem, lang, ['excerptZh', 'excerpt_zh'], newsItem.excerpt);
    }
    textWrapper.appendChild(meta);
    textWrapper.appendChild(title);
    textWrapper.appendChild(excerpt);
  } else {
    textWrapper.appendChild(meta);
    textWrapper.appendChild(title);
  }

  // Link wrapper - only create link if link exists and is not "#" or empty
  if (newsItem.link && newsItem.link !== '#' && newsItem.link.trim() !== '') {
    const link = document.createElement('a');
    link.href = newsItem.link;
    link.className = 'news-list-link-wrapper';
    if (/^https?:\/\//.test(newsItem.link)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    if (imageDiv) link.appendChild(imageDiv);
    link.appendChild(textWrapper);
    content.appendChild(link);
  } else {
    if (imageDiv) content.appendChild(imageDiv);
    content.appendChild(textWrapper);
  }

  li.appendChild(content);
  return li;
}

function renderNews(newsItems, listEl, lang, state, errorMessage) {
  const messages = newsMessages[lang] || newsMessages.en;
  listEl.innerHTML = '';

  if (state === 'empty') {
    listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">${messages.noNews}</li>`;
    return;
  }

  if (state === 'error') {
    listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">${messages.loadError} ${errorMessage || ''}</li>`;
    return;
  }

  newsItems.forEach(newsItem => {
    listEl.appendChild(createNewsListItem(newsItem, lang));
  });
}

function getLocalizedField(item, lang, zhKeys, fallback) {
  if (lang === 'zh') {
    for (const key of zhKeys) {
      if (item[key]) return item[key];
    }
  }
  return fallback;
}

function getLocalizedTag(newsItem, lang) {
  if (lang === 'zh') {
    if (newsItem.tagZh || newsItem.tag_zh) {
      return newsItem.tagZh || newsItem.tag_zh;
    }
    const tagMap = {
      Announcement: '公告'
    };
    return tagMap[newsItem.tag] || newsItem.tag;
  }
  return newsItem.tag;
}

function getNewsPageLanguage() {
  if (window.LanguageSwitch && typeof window.LanguageSwitch.getCurrentLanguage === 'function') {
    return window.LanguageSwitch.getCurrentLanguage();
  }
  return localStorage.getItem('nebulis-lang') || 'en';
}
