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

  fetch(jsonPath)
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
        listEl.innerHTML = '<li style="padding: var(--space-4); color: var(--color-muted);">No publications available.</li>';
        return;
      }

      listEl.innerHTML = '';

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
        venueSpan.textContent = pub.venue;
        meta.appendChild(venueSpan);

        if (pub.award) {
          const badge = document.createElement('span');
          badge.className = 'publication-badge';
          badge.textContent = pub.award;
          meta.appendChild(badge);
        }

        const title = document.createElement('h3');
        title.className = 'publication-list-title';
        title.textContent = pub.title;

        const authors = document.createElement('p');
        authors.className = 'publication-list-authors';
        authors.textContent = pub.authors;

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

        addLink('Paper', pub.pdf);
        addLink('Project', pub.project);
        addLink('Slides', pub.slides);
        addLink('Code', pub.code);

        content.appendChild(textWrapper);
        content.appendChild(links);
        li.appendChild(content);
        listEl.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Failed to load publications:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        attemptedPath: jsonPath,
        currentURL: window.location.href
      });
      listEl.innerHTML = `<li style="padding: var(--space-4); color: var(--color-muted);">
        Failed to load publications. Error: ${error.message}<br>
        <small>Attempted path: ${jsonPath}</small>
      </li>`;
    });
});
