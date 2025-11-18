/**
 * Load and display project details from JSON file
 * Reads project ID from URL parameter: project.html?id=<projectID>
 * Loads data from: data/projects/<projectID>.json
 */

document.addEventListener('DOMContentLoaded', function() {
  const contentEl = document.getElementById('project-details-content');
  if (!contentEl) {
    console.warn('Project details content element not found');
    return;
  }

  // Get project ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    contentEl.innerHTML = `
      <div style="padding: var(--space-8); text-align: center; color: var(--color-muted);">
        <h1>Project Not Found</h1>
        <p>No project ID specified. Please select a project from the <a href="projects.html">Projects page</a>.</p>
      </div>
    `;
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
      renderProjectDetails(project, contentEl);
      // Update page title
      document.title = `${project.title} - NEBULIS Lab`;
    })
    .catch(error => {
      console.error('Failed to load project:', error);
      contentEl.innerHTML = `
        <div style="padding: var(--space-8); text-align: center; color: var(--color-muted);">
          <h1>Project Not Found</h1>
          <p>Failed to load project: ${error.message}</p>
          <p><a href="projects.html">← Back to Projects</a></p>
        </div>
      `;
    });
});

/**
 * Render project details
 */
function renderProjectDetails(project, container) {
  container.innerHTML = '';

  // Title (H1)
  const title = document.createElement('h1');
  title.className = 'project-title';
  title.textContent = project.title || 'Untitled Project';
  container.appendChild(title);

  // Authors
  if (project.authors) {
    const authors = document.createElement('p');
    authors.className = 'project-authors';
    authors.textContent = project.authors;
    container.appendChild(authors);
  }

  // Venue/Year (separate line)
  if (project.venue || project.year) {
    const venueYear = document.createElement('p');
    venueYear.className = 'project-year';
    let venueYearText = '';
    if (project.venue && project.year) {
      venueYearText = `${project.venue} ${project.year}`;
    } else if (project.venue) {
      venueYearText = project.venue;
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

  addButton('[PDF]', project.pdf);
  addButton('[Code]', project.code);
  addButton('[Slides]', project.slides);
  addButton('[Project Page]', project.project_page);

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
      sectionTitle.textContent = section.title || '';
      sectionDiv.appendChild(sectionTitle);

      const sectionText = document.createElement('div');
      sectionText.className = 'project-section-text';
      // Preserve line breaks
      sectionText.innerHTML = section.text.replace(/\n/g, '<br>');
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
      img.alt = figure.caption || '';
      img.loading = 'lazy';
      figureDiv.appendChild(img);

      if (figure.caption) {
        const caption = document.createElement('p');
        caption.className = 'project-figure-caption';
        caption.textContent = figure.caption;
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
        caption.textContent = table.caption;
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
    bibtexTitle.textContent = 'BibTeX';
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
    copyButton.textContent = 'Copy';
    copyButton.onclick = function() {
      navigator.clipboard.writeText(project.bibtex).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        copyButton.textContent = 'Failed';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    };
    bibtexWrapper.appendChild(copyButton);

    bibtexDiv.appendChild(bibtexWrapper);
    container.appendChild(bibtexDiv);
  }
}

