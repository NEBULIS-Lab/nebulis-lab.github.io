let loadedPublications = [];

const publicationMessages = {
  en: {
    noPublications: 'No publications available.',
    loadError: 'Failed to load publications.',
    labels: {
      paper: 'Paper',
      project: 'Project',
      slides: 'Slides',
      code: 'Code'
    }
  },
  zh: {
    noPublications: '暂无论文成果。',
    loadError: '论文加载失败。',
    labels: {
      paper: '论文',
      project: '项目',
      slides: '幻灯片',
      code: '代码'
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const listEl = document.getElementById('publications-list');
  if (!listEl) {
    console.warn('Publications list element not found');
    return;
  }

  // Load publications from JSON file
  const jsonPath = 'data/publications.json';
  
  console.log('Loading publications from:', jsonPath);
  console.log('Current page URL:', window.location.href);

  // Use cache: 'no-cache' to ensure we always get the latest data
  fetch(jsonPath, { cache: 'no-cache' })
    .then(response => {
      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(publications => {
      console.log('Loaded publications:', publications.length);
      if (!Array.isArray(publications) || publications.length === 0) {
        console.warn('No publications found in JSON file');
        renderPublications([], listEl, getPublicationsPageLanguage(), 'empty');
        return;
      }

      loadedPublications = publications;
      renderPublications(loadedPublications, listEl, getPublicationsPageLanguage());
    })
    .catch(error => {
      console.error('Failed to load publications:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        attemptedPath: jsonPath,
        currentURL: window.location.href
      });
      renderPublications([], listEl, getPublicationsPageLanguage(), 'error', `${error.message} (${jsonPath})`);
    });

  document.addEventListener('languageChanged', function(event) {
    renderPublications(loadedPublications, listEl, event.detail.lang);
  });
});

function renderPublications(publications, listEl, lang, state, errorMessage) {
  const messages = publicationMessages[lang] || publicationMessages.en;
  listEl.innerHTML = '';

  if (state === 'empty') {
    listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">${messages.noPublications}</li>`;
    return;
  }

  if (state === 'error') {
    listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">${messages.loadError} ${errorMessage || ''}</li>`;
    return;
  }

  publications.forEach(pub => {
    const li = document.createElement('li');
    li.className = 'publication-list-item';

    const content = document.createElement('div');
    content.className = 'publication-list-content';

    const textWrapper = document.createElement('div');
    textWrapper.className = 'publication-list-text';

    const meta = document.createElement('div');
    meta.className = 'publication-list-meta';

    const yearSpan = document.createElement('span');
    yearSpan.className = 'publication-year';
    yearSpan.textContent = pub.year;
    meta.appendChild(yearSpan);

    const venueSpan = document.createElement('span');
    venueSpan.className = 'publication-venue';
    venueSpan.textContent = lang === 'zh' ? (pub.venueZh || pub.venue_zh || pub.venue) : pub.venue;
    meta.appendChild(venueSpan);

    if (pub.award) {
      const badge = document.createElement('span');
      badge.className = 'publication-badge';
      badge.textContent = lang === 'zh' ? (pub.awardZh || pub.award_zh || pub.award) : pub.award;
      meta.appendChild(badge);
    }

    const title = document.createElement('h3');
    title.className = 'publication-list-title';
    title.textContent = lang === 'zh' ? (pub.titleZh || pub.title_zh || pub.title) : pub.title;

    const authors = document.createElement('p');
    authors.className = 'publication-list-authors';
    authors.textContent = lang === 'zh' ? (pub.authorsZh || pub.authors_zh || pub.authors) : pub.authors;

    textWrapper.appendChild(meta);
    textWrapper.appendChild(title);
    textWrapper.appendChild(authors);

    const links = document.createElement('div');
    links.className = 'publication-list-links';

    const addLink = (label, url) => {
      if (!url) return;
      const link = document.createElement('a');
      link.className = 'publication-list-link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = label;
      links.appendChild(link);
    };

    addLink(messages.labels.paper, pub.pdf);
    addLink(messages.labels.project, pub.project);
    addLink(messages.labels.slides, pub.slides);
    addLink(messages.labels.code, pub.code);

    content.appendChild(textWrapper);
    content.appendChild(links);
    li.appendChild(content);
    listEl.appendChild(li);
  });
}

function getPublicationsPageLanguage() {
  if (window.LanguageSwitch && typeof window.LanguageSwitch.getCurrentLanguage === 'function') {
    return window.LanguageSwitch.getCurrentLanguage();
  }
  return localStorage.getItem('nebulis-lang') || 'en';
}
