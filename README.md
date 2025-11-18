# NEBULIS Lab Website Maintenance Guide

**⚠️ 版权声明 / Copyright Notice**

本项目未基于其他开源网站框架，版权完全归属于 NEBULIS Lab，未经授权不得使用。详见 [LICENSE](LICENSE) 文件。

This project is not based on any other open-source website framework. All rights to this project are exclusively owned by NEBULIS Lab and may not be used without authorization. See [LICENSE](LICENSE) file for details.

---

This guide explains how to quickly maintain and update the NEBULIS Lab website. The website uses a pure static architecture where all content is managed through JSON files, without needing to modify HTML or JavaScript code.

## Table of Contents

- [Adding a New Project](#adding-a-new-project)
- [Editing Publications](#editing-publications)
- [Editing People Information](#editing-people-information)
- [Editing News](#editing-news)
- [Image Size Requirements](#image-size-requirements)

---

## Adding a New Project

### Step 1: Create Project JSON File

1. Create a new JSON file in the `data/projects/` directory
2. **Filename format**: `<id>-<year>.json`
   - Example: `my-project-2025.json`
   - `id` must be a unique identifier (lowercase, hyphen-separated)
   - `year` must be a 4-digit year

3. **Important**: The `id` field in the JSON file must exactly match the filename (without extension)
   - Filename: `my-project-2025.json`
   - `id` in JSON: `"my-project-2025"`

### Step 2: Fill in Project Information

Refer to the template file `data/projects/template-project-2025.json`. The JSON file must contain the following fields:

```json
{
  "id": "project-id-2025",
  "title": "Project Title",
  "authors": "Author Names",
  "venue": "Conference/Journal",
  "year": 2025,
  "thumbnail": "image/projects/project-id/thumbnail.jpg",
  "short_description": "Short description (for project card display)",
  "tags": ["Tag1", "Tag2", "Tag3"],
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
      "src": "image/projects/project-id/figure1.jpg",
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

- `id`: **Must** match the filename (without extension)
- `title`: Project title (required)
- `authors`: Author information (optional)
- `venue`: Conference/journal (optional)
- `year`: Project year (recommended)
- `thumbnail`: Thumbnail image path (for project card)
- `short_description`: Short description (for project card, automatically justified)
- `tags`: Array of tags (optional)
- `pdf`, `code`, `slides`, `project_page`: Links (optional, buttons will not display if field is empty string `""`)
- `sections`: Array of sections, each containing `title` and `text`
- `figures`: Array of figures, each containing `src` and `caption`
- `tables`: Array of tables, each containing `html` and `caption`
- `bibtex`: BibTeX citation (optional, BibTeX section will not display if empty string `""`)

### Step 3: Upload Project Images

1. Upload project images to the `image/projects/<project-id>/` directory
2. Ensure the path in the `thumbnail` field correctly points to the image file
3. See [Image Size Requirements](#image-size-requirements) below for image specifications

### Step 4: Update manifest.json

**Important**: Since GitHub Pages is a pure static environment, JavaScript cannot automatically list directory contents. Therefore, you must manually add new projects to the manifest file.

1. Open `data/projects/manifest.json`
2. Add the new project's filename (including `.json` extension) to the `projects` array

```json
{
  "projects": [
    "new-project-2025.json",
    "existing-project-2025.json",
    ...
  ]
}
```

**Note**: Projects will be displayed in the order specified in manifest.json, but will ultimately be sorted by year in descending order.

---

## Editing Publications

**File path**: `data/publications.json`

This file is a JSON array, where each publication contains the following fields:

```json
{
  "year": "2024",
  "title": "Paper Title",
  "authors": "Author Names",
  "venue": "Conference/Journal Name",
  "pdf": "https://example.com/paper.pdf",
  "code": "https://github.com/example/repo",
  "project": "https://example.com/project",
  "slides": "https://example.com/slides.pdf",
  "award": "Award information (optional)"
}
```

**Editing Methods:**
- Directly edit the `data/publications.json` file
- Add new publication: Add a new object to the array
- Modify existing publication: Edit the corresponding object
- Delete publication: Remove the corresponding object from the array

---

## Editing People Information

**File path**: `data/people.json`

This file is a JSON array, where each person contains the following fields:

```json
{
  "name": "Chinese Name",
  "nameEn": "English Name",
  "role": "faculty|phd|master|undergraduate|alumni",
  "program": "Faculty|PhD|Master|Undergraduate|Alumni",
  "advisors": ["Advisor Name"],
  "description": "English description",
  "descriptionZh": "Chinese description",
  "avatar": "image/user/avatar.jpg",
  "homepage": "https://example.com",
  "scholar": "https://scholar.google.com/...",
  "github": "https://github.com/...",
  "email": "email@example.com",
  "status": "current|alumni",
  "cohort": 2025,
  "affiliation": "NEBULIS Lab"
}
```

**Editing Methods:**
- Directly edit the `data/people.json` file
- Add new member: Add a new object to the array
- Modify existing member: Edit the corresponding object
- Delete member: Remove the corresponding object from the array

**Avatar Images:**
- Upload to `image/user/` directory
- Recommended size: Square, at least 280x280 pixels

---

## Editing News

**File path**: `data/news/`

### Adding New News

1. Create a new JSON file in the `data/news/` directory
2. **Filename format**: `news-<YYYY-MM-DD>.json` or `news-<YYYY-MM>.json`
   - Example: `news-2025-10-29.json` or `news-2025-01.json`

3. JSON file content:

```json
{
  "id": "news-2025-10-29",
  "title": "News Title",
  "tag": "Tag (e.g., Announcement, Research, Infrastructure)",
  "excerpt": "News excerpt",
  "image": "image/news/20251029.jpg",
  "date": "2025-10-29",
  "link": "https://example.com/news-page"
}
```

**Field Descriptions:**
- `id`: Unique identifier, usually matches the filename
- `title`: News title (required)
- `tag`: News tag (optional)
- `excerpt`: News excerpt (optional)
- `image`: News image path (optional, image will not display if empty)
- `date`: Publication date (optional)
- `link`: News detail page link (optional, use `"#"` to indicate no link)

4. **Update manifest.json**:
   - Open `data/news/manifest.json`
   - Add the new news filename (including `.json` extension) to the `news` array

```json
{
  "news": [
    "news-2025-10-29.json",
    "news-2025-10-27.json",
    ...
  ]
}
```

**Note**: News will be displayed in the order specified in manifest.json, but will ultimately be sorted by date in descending order.

### Modifying Existing News

Simply edit the corresponding JSON file.

---

## Image Size Requirements

### Project Images (Projects)

**Thumbnail:**
- **Recommended size**: 1920×1080 pixels (16:9 aspect ratio)
- **Minimum size**: 1280×720 pixels
- **File format**: JPG, PNG
- **File path**: `image/projects/<project-id>/thumbnail.jpg`

**Project Detail Page Images (figures):**
- **Recommended size**: 1920×1080 pixels or higher (16:9 aspect ratio)
- **File format**: JPG, PNG
- **File path**: `image/projects/<project-id>/figure1.jpg`

**Notes:**
- Project cards use a 16:9 aspect ratio for display
- Images will be automatically cropped to fit the container. It is recommended to use a 16:9 aspect ratio to avoid important content being cropped

### News Images (News)

**Recommended size:**
- **Primary size**: 1920×1080 pixels (16:9 aspect ratio)
- **Minimum size**: 1280×720 pixels
- **File format**: JPG, PNG
- **File path**: `image/news/<YYYYMMDD>.jpg`

**Notes:**
- News list page displays at 160×110 pixels (approximately 1.45:1 aspect ratio)
- News detail page (feature card) uses 16:9 aspect ratio for display
- Images will be automatically cropped to fit the container. It is recommended to use a 16:9 aspect ratio

### People Avatars (People)

**Recommended size:**
- **Recommended size**: 280×280 pixels (square)
- **Minimum size**: 140×140 pixels
- **File format**: JPG, PNG
- **File path**: `image/user/<name>.jpg`

**Notes:**
- Avatars will be displayed as circles. It is recommended to use square images
- Ensure faces are centered in the image

---

## Important Notes

1. **JSON Format**: Ensure all JSON files are correctly formatted. You can use online JSON validation tools to check
2. **File Paths**: All image paths use relative paths, starting from the website root directory
3. **manifest.json**: After adding a new project or news, you **must** update the corresponding manifest.json file
4. **ID Consistency**: The `id` field in the project JSON file must exactly match the filename (without extension)
5. **Empty Field Handling**:
   - If link fields (`pdf`, `code`, `slides`, `project_page`) are empty strings `""`, the corresponding buttons will not display
   - If `bibtex` is an empty string `""`, the BibTeX section will not display
   - If the news `image` field is empty or missing, images will not display in the news list

---

## Verifying Changes

1. Commit changes to the Git repository
2. Push to GitHub
3. Wait for GitHub Pages to automatically deploy (usually takes a few minutes)
4. Visit the website to check the results

---

## Template Files

- **Project Template**: `data/projects/template-project-2025.json`
- When creating a new project, you can copy this template and modify the content

---

If you have any questions, please refer to the JSON file structure of existing projects or contact the website maintainer.
