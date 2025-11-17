/**
 * Load and display projects from JSON files
 * Projects are loaded from data/projects/ directory
 * Files should follow format: <id>-<year>.json
 */

document.addEventListener('DOMContentLoaded', function() {
  const gridEl = document.querySelector('.initiatives-grid');
  if (!gridEl) {
    console.warn('Projects grid element not found');
    return;
  }

  const projectsPath = 'data/projects/';
  const manifestPath = `${projectsPath}manifest.json`;
  
  // First, load the manifest to get list of project files
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
        gridEl.innerHTML = '<div style="padding: var(--space-4); color: var(--color-muted);">No projects configured.</div>';
        return;
      }

      // Load all projects
      // Files that don't exist will be gracefully skipped (return null)
      return Promise.all(
        projectFiles.map(filename => 
          fetch(`${projectsPath}${filename}`)
            .then(response => {
              // If file doesn't exist (404), skip it silently
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
              // If data is null (file not found), return null
              if (!data) return null;
              
              // Extract year from filename for sorting
              const yearMatch = filename.match(/-(\d{4})\.json$/);
              const fileYear = yearMatch ? parseInt(yearMatch[1]) : data.year || 0;
              return { ...data, _fileYear: fileYear };
            })
            .catch(error => {
              // Only log non-404 errors
              if (!error.message.includes('404')) {
                console.error(`Error loading ${filename}:`, error);
              }
              return null;
            })
        )
      );
    })
    .then(projects => {
      if (!projects) return; // Already handled empty case
      
      // Filter out failed loads
      const validProjects = projects.filter(p => p !== null);
      
      if (validProjects.length === 0) {
        gridEl.innerHTML = '<div style="padding: var(--space-4); color: var(--color-muted);">No projects available.</div>';
        return;
      }

      // Sort by year (from filename) in descending order (newest first)
      validProjects.sort((a, b) => b._fileYear - a._fileYear);

      // Clear existing content
      gridEl.innerHTML = '';

      // Generate project cards
      validProjects.forEach(project => {
        const card = createProjectCard(project);
        gridEl.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Failed to load projects:', error);
      gridEl.innerHTML = `<div style="padding: var(--space-4); color: var(--color-muted);">
        Failed to load projects. Error: ${error.message}
      </div>`;
    });
});

/**
 * Create a project card element
 */
function createProjectCard(project) {
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
  title.textContent = project.title || 'Untitled Project';
  contentDiv.appendChild(title);

  // Description
  const description = document.createElement('p');
  description.textContent = project.short_description || '';
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
  detailLink.textContent = 'View Project Details →';
  linksDiv.appendChild(detailLink);
  contentDiv.appendChild(linksDiv);

  card.appendChild(imageDiv);
  card.appendChild(contentDiv);

  return card;
}

