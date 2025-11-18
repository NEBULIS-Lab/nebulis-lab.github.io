/**
 * Load and display all news from JSON files
 * Used on news.html page to show all news items
 */

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
        listEl.innerHTML = '<li style="padding: var(--space-4); color: var(--color-muted);">No news available.</li>';
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
      
      // Filter out failed loads
      const validNews = newsItems.filter(item => item !== null);
      
      if (validNews.length === 0) {
        listEl.innerHTML = '<li style="padding: var(--space-4); color: var(--color-muted);">No news available.</li>';
        return;
      }

      // Sort by date (newest first) if date exists
      // Dates with format YYYY-MM-DD are prioritized over "TBD" or other text
      validNews.sort((a, b) => {
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

      // Clear existing content
      listEl.innerHTML = '';

      // Generate news list items (show all)
      validNews.forEach(newsItem => {
        const li = createNewsListItem(newsItem);
        listEl.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Failed to load news:', error);
      listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">
        Failed to load news. Error: ${error.message}
      </li>`;
    });
});

/**
 * Create a news list item element
 */
function createNewsListItem(newsItem) {
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
    img.alt = newsItem.title || 'News image';
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
    tagSpan.textContent = newsItem.tag;
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
  title.textContent = newsItem.title || 'Untitled News';

  // Excerpt
  if (newsItem.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.className = 'news-list-excerpt';
    excerpt.textContent = newsItem.excerpt;
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

