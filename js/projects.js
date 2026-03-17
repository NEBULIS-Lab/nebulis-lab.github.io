/**
 * Load and display projects from JSON files
 * Projects are loaded from data/projects/ directory
 * Files should follow format: <id>-<year>.json
 */

let loadedProjects = [];

const projectMessages = {
  en: {
    noConfig: 'No projects configured.',
    noProjects: 'No projects available.',
    details: 'View Project Details ->',
    loadError: 'Failed to load projects.'
  },
  zh: {
    noConfig: '未配置项目。',
    noProjects: '暂无项目。',
    details: '查看项目详情 ->',
    loadError: '项目加载失败。'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const gridEl = document.querySelector('.initiatives-grid');
  if (!gridEl) {
    console.warn('Projects grid element not found');
    return;
  }

  const projectsPath = 'data/projects/';
  const manifestPath = `${projectsPath}manifest.json`;
  const currentLang = getProjectsPageLanguage();

  fetch(manifestPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      return response.json();
    })
    .then(manifest => {
      const projectFiles = manifest.projects || [];

      if (projectFiles.length === 0) {
        renderProjects([], gridEl, currentLang, 'noConfig');
        return null;
      }

      return Promise.all(
        projectFiles.map(filename =>
          fetch(`${projectsPath}${filename}`)
            .then(response => {
              if (response.status === 404) {
                console.warn(`Project file not found: ${filename}, skipping...`);
                return null;
              }
              if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              if (!data) return null;

              const yearMatch = filename.match(/-(\d{4})\.json$/);
              const fileYear = yearMatch ? parseInt(yearMatch[1], 10) : data.year || 0;
              return { ...data, _fileYear: fileYear };
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
    .then(projects => {
      if (!projects) return;

      loadedProjects = projects.filter(project => project !== null);
      loadedProjects.sort((a, b) => b._fileYear - a._fileYear);
      renderProjects(loadedProjects, gridEl, getProjectsPageLanguage());
    })
    .catch(error => {
      console.error('Failed to load projects:', error);
      renderProjects([], gridEl, getProjectsPageLanguage(), 'loadError', error.message);
    });

  document.addEventListener('languageChanged', function(event) {
    renderProjects(loadedProjects, gridEl, event.detail.lang);
  });
});

/**
 * Create a project card element
 */
function createProjectCard(project, lang) {
  const messages = projectMessages[lang] || projectMessages.en;
  const card = document.createElement('div');
  card.className = 'initiative-card';

  // Image
  const imageDiv = document.createElement('div');
  imageDiv.className = 'initiative-image';
  const img = document.createElement('img');
  img.src = project.thumbnail || 'image/project/example1.png';
  img.alt = project.title || 'Project image';
  img.loading = 'lazy';
  imageDiv.appendChild(img);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'initiative-content';

  // Title
  const title = document.createElement('h2');
  title.textContent = getProjectField(project, lang, ['titleZh', 'title_zh'], project.title || 'Untitled Project');
  contentDiv.appendChild(title);

  // Description
  const description = document.createElement('p');
  description.textContent = getProjectField(
    project,
    lang,
    ['shortDescriptionZh', 'short_description_zh', 'short_descriptionZh'],
    project.short_description || ''
  );
  contentDiv.appendChild(description);

  // Tags
  if (project.tags && project.tags.length > 0) {
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'initiative-tags';
    project.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsDiv.appendChild(tagSpan);
    });
    contentDiv.appendChild(tagsDiv);
  }

  // Links
  const linksDiv = document.createElement('div');
  linksDiv.className = 'initiative-links';
  const detailLink = document.createElement('a');
  detailLink.href = `project.html?id=${project.id}`;
  detailLink.className = 'initiative-link';
  detailLink.textContent = messages.details;
  linksDiv.appendChild(detailLink);
  contentDiv.appendChild(linksDiv);

  card.appendChild(imageDiv);
  card.appendChild(contentDiv);

  return card;
}

function renderProjects(projects, gridEl, lang, state, errorMessage) {
  const messages = projectMessages[lang] || projectMessages.en;
  gridEl.innerHTML = '';

  if (state === 'noConfig') {
    gridEl.innerHTML = `<div style="padding: var(--space-4); color: var(--color-muted);">${messages.noConfig}</div>`;
    return;
  }

  if (state === 'loadError') {
    gridEl.innerHTML = `<div style="padding: var(--space-4); color: var(--color-muted);">${messages.loadError} ${errorMessage || ''}</div>`;
    return;
  }

  if (!projects.length) {
    gridEl.innerHTML = `<div style="padding: var(--space-4); color: var(--color-muted);">${messages.noProjects}</div>`;
    return;
  }

  projects.forEach(project => {
    const card = createProjectCard(project, lang);
    gridEl.appendChild(card);
  });
}

function getProjectField(project, lang, zhKeys, fallback) {
  if (lang === 'zh') {
    for (const key of zhKeys) {
      if (project[key]) return project[key];
    }
  }
  return fallback;
}

function getProjectsPageLanguage() {
  if (window.LanguageSwitch && typeof window.LanguageSwitch.getCurrentLanguage === 'function') {
    return window.LanguageSwitch.getCurrentLanguage();
  }
  return localStorage.getItem('nebulis-lang') || 'en';
}
