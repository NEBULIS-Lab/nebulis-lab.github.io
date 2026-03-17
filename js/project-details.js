/**
 * Load and display project details from JSON file
 * Reads project ID from URL parameter: project.html?id=<projectID>
 * Loads data from: data/projects/<projectID>.json
 */

let loadedProject = null;
let projectContainer = null;
let projectErrorState = null;
let projectErrorMessage = '';

const projectDetailMessages = {
  en: {
    projectNotFound: 'Project Not Found',
    noProjectId: 'No project ID specified. Please select a project from the Projects page.',
    backToProjects: '<- Back to Projects',
    loading: 'Loading project details...',
    failedToLoad: 'Failed to load project:',
    pdf: '[PDF]',
    code: '[Code]',
    slides: '[Slides]',
    projectPage: '[Project Page]',
    bibtex: 'BibTeX',
    copy: 'Copy',
    copied: 'Copied!',
    copyFailed: 'Failed'
  },
  zh: {
    projectNotFound: '未找到项目',
    noProjectId: '未指定项目 ID。请从项目页面选择一个项目。',
    backToProjects: '<- 返回项目列表',
    loading: '正在加载项目详情...',
    failedToLoad: '项目加载失败：',
    pdf: '[论文]',
    code: '[代码]',
    slides: '[幻灯片]',
    projectPage: '[项目主页]',
    bibtex: 'BibTeX',
    copy: '复制',
    copied: '已复制！',
    copyFailed: '失败'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const contentEl = document.getElementById('project-details-content');
  if (!contentEl) {
    console.warn('Project details content element not found');
    return;
  }

  projectContainer = contentEl;

  // Get project ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    renderProjectError('noProjectId');
    return;
  }

  // Load project data
  const projectPath = `data/projects/${projectId}.json`;
  
  fetch(projectPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(project => {
      loadedProject = project;
      projectErrorState = null;
      projectErrorMessage = '';
      renderProjectDetails(project, contentEl, getProjectDetailsLanguage());
    })
    .catch(error => {
      console.error('Failed to load project:', error);
      renderProjectError('loadError', error.message);
    });

  document.addEventListener('languageChanged', function(event) {
    if (loadedProject && projectContainer) {
      renderProjectDetails(loadedProject, projectContainer, event.detail.lang);
    } else if (projectContainer) {
      renderProjectError(projectErrorState || 'noProjectId', projectErrorMessage);
    }
  });
});

/**
 * Render project details
 */
function renderProjectDetails(project, container, lang) {
  const messages = projectDetailMessages[lang] || projectDetailMessages.en;
  container.innerHTML = '';

  // Title (H1)
  const title = document.createElement('h1');
  title.className = 'project-title';
  title.textContent = getLocalizedProjectField(project, lang, ['titleZh', 'title_zh'], project.title || 'Untitled Project');
  container.appendChild(title);

  // Authors
  if (project.authors) {
    const authors = document.createElement('p');
    authors.className = 'project-authors';
    authors.textContent = getLocalizedProjectField(project, lang, ['authorsZh', 'authors_zh'], project.authors);
    container.appendChild(authors);
  }

  // Venue/Year (separate line)
  if (project.venue || project.year) {
    const venueYear = document.createElement('p');
    venueYear.className = 'project-year';
    let venueYearText = '';
    if (project.venue && project.year) {
      venueYearText = `${getLocalizedProjectField(project, lang, ['venueZh', 'venue_zh'], project.venue)} ${project.year}`;
    } else if (project.venue) {
      venueYearText = getLocalizedProjectField(project, lang, ['venueZh', 'venue_zh'], project.venue);
    } else if (project.year) {
      venueYearText = project.year.toString();
    }
    venueYear.textContent = venueYearText;
    container.appendChild(venueYear);
  }

  // Action buttons (aligned on same baseline as text)
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'project-buttons';

  const addButton = (label, url) => {
    if (!url) return;
    const button = document.createElement('a');
    button.href = url;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.className = 'project-button';
    button.textContent = label;
    buttonsDiv.appendChild(button);
  };

  addButton(messages.pdf, project.pdf);
  addButton(messages.code, project.code);
  addButton(messages.slides, project.slides);
  addButton(messages.projectPage, project.project_page);

  if (buttonsDiv.children.length > 0) {
    container.appendChild(buttonsDiv);
  }

  // Sections
  if (project.sections && project.sections.length > 0) {
    project.sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'project-section';

      const sectionTitle = document.createElement('h2');
      sectionTitle.className = 'project-section-title';
      sectionTitle.textContent = getLocalizedProjectField(section, lang, ['titleZh', 'title_zh'], section.title || '');
      sectionDiv.appendChild(sectionTitle);

      const sectionText = document.createElement('div');
      sectionText.className = 'project-section-text';
      // Preserve line breaks
      sectionText.innerHTML = getLocalizedProjectField(section, lang, ['textZh', 'text_zh'], section.text || '').replace(/\n/g, '<br>');
      sectionDiv.appendChild(sectionText);

      container.appendChild(sectionDiv);
    });
  }

  // Figures
  if (project.figures && project.figures.length > 0) {
    project.figures.forEach(figure => {
      const figureDiv = document.createElement('div');
      figureDiv.className = 'project-figure';

      const img = document.createElement('img');
      img.src = figure.src;
      img.alt = getLocalizedProjectField(figure, lang, ['captionZh', 'caption_zh'], figure.caption || '');
      img.loading = 'lazy';
      figureDiv.appendChild(img);

      if (figure.caption) {
        const caption = document.createElement('p');
        caption.className = 'project-figure-caption';
        caption.textContent = getLocalizedProjectField(figure, lang, ['captionZh', 'caption_zh'], figure.caption);
        figureDiv.appendChild(caption);
      }

      container.appendChild(figureDiv);
    });
  }

  // Tables
  if (project.tables && project.tables.length > 0) {
    project.tables.forEach(table => {
      const tableDiv = document.createElement('div');
      tableDiv.className = 'project-table';

      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'project-table-wrapper';
      tableWrapper.innerHTML = table.html || '';
      tableDiv.appendChild(tableWrapper);

      if (table.caption) {
        const caption = document.createElement('p');
        caption.className = 'project-table-caption';
        caption.textContent = getLocalizedProjectField(table, lang, ['captionZh', 'caption_zh'], table.caption);
        tableDiv.appendChild(caption);
      }

      container.appendChild(tableDiv);
    });
  }

  // BibTeX
  if (project.bibtex) {
    const bibtexDiv = document.createElement('div');
    bibtexDiv.className = 'project-bibtex';

    const bibtexTitle = document.createElement('h2');
    bibtexTitle.className = 'project-section-title';
    bibtexTitle.textContent = messages.bibtex;
    bibtexDiv.appendChild(bibtexTitle);

    const bibtexWrapper = document.createElement('div');
    bibtexWrapper.className = 'project-bibtex-wrapper';

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = project.bibtex;
    pre.appendChild(code);
    bibtexWrapper.appendChild(pre);

    // Copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'project-bibtex-copy';
    copyButton.textContent = messages.copy;
    copyButton.onclick = function() {
      navigator.clipboard.writeText(project.bibtex).then(() => {
        copyButton.textContent = messages.copied;
        setTimeout(() => {
          copyButton.textContent = messages.copy;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        copyButton.textContent = messages.copyFailed;
        setTimeout(() => {
          copyButton.textContent = messages.copy;
        }, 2000);
      });
    };
    bibtexWrapper.appendChild(copyButton);

    bibtexDiv.appendChild(bibtexWrapper);
    container.appendChild(bibtexDiv);
  }

  document.title = `${title.textContent} - NEBULIS Lab`;
}

function renderProjectError(type, errorMessage) {
  if (!projectContainer) return;

  const lang = getProjectDetailsLanguage();
  const messages = projectDetailMessages[lang] || projectDetailMessages.en;
  projectErrorState = type;
  projectErrorMessage = errorMessage || '';
  let bodyText = messages.noProjectId;
  if (type === 'loadError') {
    bodyText = `${messages.failedToLoad} ${errorMessage || ''}`;
  }

  projectContainer.innerHTML = `
    <div style="padding: var(--space-8); text-align: center; color: var(--color-muted);">
      <h1>${messages.projectNotFound}</h1>
      <p>${bodyText}</p>
      <p><a href="projects.html">${messages.backToProjects}</a></p>
    </div>
  `;
}

function getLocalizedProjectField(item, lang, zhKeys, fallback) {
  if (lang === 'zh') {
    for (const key of zhKeys) {
      if (item[key]) return item[key];
    }
  }
  return fallback;
}

function getProjectDetailsLanguage() {
  if (window.LanguageSwitch && typeof window.LanguageSwitch.getCurrentLanguage === 'function') {
    return window.LanguageSwitch.getCurrentLanguage();
  }
  return localStorage.getItem('nebulis-lang') || 'en';
}
