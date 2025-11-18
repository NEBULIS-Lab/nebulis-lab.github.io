# Projects Management System Documentation

## Overview

This project uses a JSON-driven system to manage research projects. All project data is stored in the `data/projects/` directory, and project images are stored in the `image/projects/` directory. The system has been successfully implemented to convert static project cards into dynamically loaded content. The system is fully compatible with GitHub Pages static hosting.

## File Structure

```
NEBULIS_LAB/
├── data/
│   └── projects/
│       ├── manifest.json          # Project manifest (required)
│       ├── <id>-<year>.json      # Project data files
│       ├── ei-robotics-2025.json # Example project 1 (complete example)
│       ├── gpu-scheduling-2024.json # Example project 2 (with tables)
│       └── distributed-rl-2023.json # Example project 3 (minimal example)
├── image/
│   └── projects/                 # Project images directory
│       └── <id>-<year>.png       # Project images
├── js/
│   ├── projects.js               # Project list loader
│   └── project-details.js        # Project details loader
├── initiatives.html              # Projects list page (updated)
├── project.html                  # Project details page
└── styles/
    └── main.css                  # Stylesheet (updated with project details styles)
```

## Implementation Details

### 1. Data Files

#### Project Data Directory
- `data/projects/` - Directory for storing project JSON files
- `data/projects/manifest.json` - Project manifest file (lists all project JSON filenames)

#### Example Project JSON Files
- `data/projects/ei-robotics-2025.json` - Complete example (contains all fields)
- `data/projects/gpu-scheduling-2024.json` - Example with tables
- `data/projects/distributed-rl-2023.json` - Minimal example

### 2. JavaScript Files

#### Project List Loader
- `js/projects.js` - Loads project list from manifest.json and dynamically generates project cards
  - Automatically sorts by year in descending order (newest first)
  - Extracts year from filename for sorting
  - Error handling and graceful degradation

#### Project Details Loader
- `js/project-details.js` - Reads project ID from URL parameters, loads and renders project details
  - Supports all fields: title, authors, year, buttons, sections, figures, tables, BibTeX
  - Automatically hides buttons for missing fields
  - BibTeX copy functionality

### 3. HTML Files

#### Updated Projects Page
- `initiatives.html` - Updated
  - Removed static project cards
  - Added `js/projects.js` script reference
  - Preserved original HTML structure and CSS classes

#### New Project Details Page
- `project.html` - New project details page
  - Consistent navigation bar and footer (matches other pages)
  - Dynamic content loading area
  - Responsive design

### 4. CSS Styles

#### Project Details Page Styles
- `styles/main.css` - Added project details page styles (lines 3981-4185)
  - `.project-details-section` - Main container
  - `.project-title` - Title styles
  - `.project-meta` - Authors and year
  - `.project-buttons` - Action buttons
  - `.project-section` - Section styles
  - `.project-figure` - Images and captions
  - `.project-table` - Table styles
  - `.project-bibtex` - BibTeX code block and copy button

## Features

### Implemented Features

1. **JSON-Driven Project List**
   - Automatically loads project list from manifest.json
   - Dynamically generates project cards
   - Automatically sorts by year (descending order)
   - Preserves original card styles and layout

2. **Project Details Page**
   - Reads project ID from URL parameters
   - Renders all project information
   - Conditionally displays buttons (only shows buttons with links)
   - Supports multiple sections, figures, and tables
   - BibTeX copy functionality

3. **Easy Maintenance**
   - To add a new project:
     1. Create JSON file
     2. Upload image
     3. Update manifest.json
   - No HTML code modification needed

4. **GitHub Pages Compatible**
   - Fully static, no server required
   - Uses relative paths
   - Uses fetch API to load JSON

## Adding a New Project

### Step 1: Create Project JSON File

1. Create a new JSON file in the `data/projects/` directory
2. Filename format must be: `<id>-<year>.json`
   - Example: `ei-robotics-2025.json`
   - `id` should be a unique identifier for the project (lowercase, hyphen-separated)
   - `year` must be a 4-digit year

3. The JSON file must contain the following fields:

```json
{
  "id": "project-id-2025",
  "title": "Project Title",
  "authors": "Author Names",
  "year": 2025,
  "thumbnail": "image/projects/project-id-2025.png",
  "short_description": "Short description (for project card)",
  "tags": ["Tag1", "Tag2"],
  "pdf": "https://example.com/paper.pdf",
  "code": "https://github.com/example/repo",
  "slides": "https://example.com/slides.pdf",
  "project_page": "https://example.com/project",
  "sections": [
    {
      "title": "Section Title",
      "text": "Section content..."
    }
  ],
  "figures": [
    {
      "src": "image/projects/fig1.png",
      "caption": "Figure caption"
    }
  ],
  "tables": [
    {
      "html": "<table>...</table>",
      "caption": "Table caption"
    }
  ],
  "bibtex": "@article{...}"
}
```

**Field Descriptions:**
- `id`: Must match the filename (without extension)
- `title`: Project title (required)
- `authors`: Author information (optional)
- `year`: Project year (optional, but recommended)
- `thumbnail`: Thumbnail image path (for project card)
- `short_description`: Short description (for project card)
- `tags`: Array of tags (optional)
- `pdf`, `code`, `slides`, `project_page`: Links (optional, buttons will not display if field is missing or empty)
- `sections`: Array of sections, each containing `title` and `text`
- `figures`: Array of figures, each containing `src` and `caption`
- `tables`: Array of tables, each containing `html` (raw HTML) and `caption`
- `bibtex`: BibTeX citation (optional)

### Step 2: Upload Project Image

1. Upload project image to the `image/projects/` directory
2. Image filename should match the `thumbnail` field in the JSON file
3. Recommended formats: PNG or JPG
4. Recommended thumbnail size: 16:9 aspect ratio

### Step 3: Update manifest.json

Add the new project JSON filename to the `projects` array in `data/projects/manifest.json`:

```json
{
  "projects": [
    "existing-project-2024.json",
    "new-project-2025.json"
  ]
}
```

**Important Notes:**
- Projects are automatically sorted by year in descending order (newest first) based on the filename, so manual sorting is not needed.
- **Adding a project:** You need to both create the JSON file AND add its filename to `manifest.json`.
- **Removing a project:** You can either:
  1. Delete the JSON file AND remove it from `manifest.json` (recommended)
  2. Or just delete the JSON file - the system will gracefully skip missing files, but it's better to also remove from manifest to keep it clean.

### Step 4: Commit to Git

- Commit all changes to the Git repository
- GitHub Pages will automatically update the website

## Accessing Project Details

Project details page URL format:
```
project.html?id=<project-id>
```

Example:
```
project.html?id=ei-robotics-2025
```

The project details page (`project.html`) automatically loads all information from the JSON file:
- Title, authors, year
- Action buttons (PDF, Code, Slides, Project Page)
- All section content
- Images and captions
- Tables
- BibTeX citation (with copy button)

## Technical Details

### Sorting Mechanism
- Extracts year from filename: `<id>-<year>.json`
- Uses regular expression: `/-(\d{4})\.json$/`
- Sorts by year in descending order (newest projects first)
- Does not rely on the year field in JSON for sorting

### Error Handling
- Displays friendly error messages when project loading fails
- Automatically hides UI elements for missing fields
- Outputs detailed error information to console for debugging

### Performance Optimization
- Uses `loading="lazy"` for image lazy loading
- Uses Promise.all to load all projects in parallel
- Minimizes DOM operations

## Design Constraints

**Observed Constraints:**
- Did not change page layout, color scheme, fonts, or overall design
- Preserved all original CSS classes and styles
- Did not add new frameworks (pure HTML+CSS+JavaScript)
- Did not modify `.join-hero-visual` section
- Did not change global site theme
- Preserved all unrelated sections

## Important Notes

1. **Filename Format:** Must follow `<id>-<year>.json` format, year is used for automatic sorting
2. **ID Matching:** The `id` field in the JSON file must match the filename (without extension)
3. **Paths:** All image paths use relative paths from the website root
4. **Optional Fields:** If a link field is empty string or missing, the corresponding button will not be displayed
5. **GitHub Pages:** All files must be committed to the Git repository, GitHub Pages will automatically update

## Examples

Refer to the following files as examples:
- `ei-robotics-2025.json` - Complete example
- `gpu-scheduling-2024.json` - Example with tables
- `distributed-rl-2023.json` - Minimal example

## Troubleshooting

If a project is not displaying:

1. Check if the project filename is included in `manifest.json`
2. Check if the JSON file format is correct (can use a JSON validator)
3. Check if the filename format is correct (`<id>-<year>.json`)
4. Check browser console for error messages
5. Ensure image paths are correct and files exist

## Testing Recommendations

1. **Test Project List Page**
   - Visit `initiatives.html`
   - Verify project cards display correctly
   - Verify sorting is correct (newest first)
   - Click cards to navigate to details page

2. **Test Project Details Page**
   - Visit `project.html?id=ei-robotics-2025`
   - Verify all content displays correctly
   - Test button links
   - Test BibTeX copy functionality
   - Test table rendering

3. **Test Error Handling**
   - Visit a non-existent project ID
   - Verify friendly error message is displayed

## Future Improvement Suggestions

1. **Automatic Project Discovery**
   - If GitHub Pages supports it, add server-side script to automatically generate manifest.json
   - Or use GitHub Actions to automatically update manifest

2. **Image Optimization**
   - Add image lazy loading
   - Support WebP format
   - Responsive images

3. **Search and Filter**
   - Add project search functionality
   - Filter projects by tags

## Support

For issues, refer to:
- Example JSON files - Reference format
- Browser console - View error messages
