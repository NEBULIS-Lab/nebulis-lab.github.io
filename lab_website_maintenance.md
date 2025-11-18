# NEBULIS Lab 网站维护指南

本指南介绍如何快速维护和更新 NEBULIS Lab 网站。所有内容通过 JSON 文件管理，无需修改代码。

## 目录

- [添加新项目](#添加新项目)
- [编辑出版物](#编辑出版物)
- [编辑人员信息](#编辑人员信息)
- [编辑新闻](#编辑新闻)
- [图片尺寸要求](#图片尺寸要求)

---

## 添加新项目

### 步骤 1: 创建项目 JSON 文件

1. 在 `data/projects/` 目录下创建新文件
2. **文件名格式**：`<id>-<year>.json`（如：`my-project-2025.json`）
3. **重要**：JSON 中的 `id` 字段必须与文件名（不含扩展名）完全一致

### 步骤 2: 填写项目信息

参考模板文件 `data/projects/template-project-2025.json`，必须包含以下字段：

- `id`: 必须与文件名一致
- `title`: 项目标题（必需）
- `authors`, `venue`, `year`: 可选
- `thumbnail`: 缩略图路径
- `short_description`: 简短描述（用于卡片）
- `tags`: 标签数组（可选）
- `pdf`, `code`, `slides`, `project_page`: 链接（可选，空字符串 `""` 时按钮不显示）
- `sections`: 章节数组，每个包含 `title` 和 `text`
- `figures`: 图片数组，每个包含 `src` 和 `caption`
- `tables`: 表格数组，每个包含 `html` 和 `caption`
- `bibtex`: BibTeX 引用（可选，空字符串 `""` 时不显示）

### 步骤 3: 上传图片

将图片上传到 `image/projects/<project-id>/` 目录，确保路径正确。

### 步骤 4: 更新 manifest.json

**必须**：打开 `data/projects/manifest.json`，在 `projects` 数组中添加新文件名（含 `.json` 扩展名）。

---

## 编辑出版物

**文件路径**：`data/publications.json`

直接编辑该 JSON 数组文件，每个出版物包含：
- `year`, `title`, `authors`, `venue`
- `pdf`, `code`, `project`, `slides`, `award`（可选）

---

## 编辑人员信息

**文件路径**：`data/people.json`

直接编辑该 JSON 数组文件，每个人员包含：
- `name`, `nameEn`, `role`, `program`
- `description`, `descriptionZh`
- `avatar`, `homepage`, `scholar`, `github`, `email`
- `status`, `cohort`, `affiliation`

**头像**：上传到 `image/user/` 目录，推荐 280×280 像素（正方形）。

---

## 编辑新闻

**文件路径**：`data/news/`

### 添加新新闻

1. 创建 JSON 文件，文件名格式：`news-<YYYY-MM-DD>.json` 或 `news-<YYYY-MM>.json`
2. 文件内容包含：`id`, `title`, `tag`, `excerpt`, `image`, `date`, `link`
3. **必须**：在 `data/news/manifest.json` 的 `news` 数组中添加新文件名

### 修改现有新闻

直接编辑对应的 JSON 文件。

---

## 图片尺寸要求

### 项目图片

- **缩略图**：推荐 1920×1080 像素（16:9），最小 1280×720
- **详情页图片**：推荐 1920×1080 或更高（16:9）
- **路径**：`image/projects/<project-id>/`

### 新闻图片

- **推荐尺寸**：1920×1080 像素（16:9），最小 1280×720
- **路径**：`image/news/<YYYYMMDD>.jpg`

### 人员头像

- **推荐尺寸**：280×280 像素（正方形），最小 140×140
- **路径**：`image/user/<name>.jpg`

---

## 注意事项

1. **JSON 格式**：确保格式正确，可使用在线工具验证
2. **文件路径**：使用相对路径，从网站根目录开始
3. **manifest.json**：添加新项目或新闻后必须更新对应的 manifest.json
4. **ID 一致性**：项目 `id` 字段必须与文件名（不含扩展名）完全一致
5. **空字段**：链接字段为空字符串 `""` 时，对应按钮/部分不会显示

---

## 验证更改

1. 提交到 Git 仓库
2. 推送到 GitHub
3. 等待 GitHub Pages 自动部署（通常几分钟）
4. 访问网站查看效果

---

## 模板文件

- **项目模板**：`data/projects/template-project-2025.json`
- 创建新项目时可复制此模板并修改

---

如有问题，请参考现有项目的 JSON 文件结构或联系网站维护人员。

---

# NEBULIS Lab Website Maintenance Guide

This guide explains how to quickly maintain and update the NEBULIS Lab website. All content is managed through JSON files without needing to modify code.

## Table of Contents

- [Adding a New Project](#adding-a-new-project)
- [Editing Publications](#editing-publications)
- [Editing People Information](#editing-people-information)
- [Editing News](#editing-news)
- [Image Size Requirements](#image-size-requirements)

---

## Adding a New Project

### Step 1: Create Project JSON File

1. Create a new file in the `data/projects/` directory
2. **Filename format**: `<id>-<year>.json` (e.g., `my-project-2025.json`)
3. **Important**: The `id` field in JSON must exactly match the filename (without extension)

### Step 2: Fill in Project Information

Refer to the template file `data/projects/template-project-2025.json`. Must include the following fields:

- `id`: Must match the filename
- `title`: Project title (required)
- `authors`, `venue`, `year`: Optional
- `thumbnail`: Thumbnail image path
- `short_description`: Short description (for card display)
- `tags`: Array of tags (optional)
- `pdf`, `code`, `slides`, `project_page`: Links (optional, buttons won't display if empty string `""`)
- `sections`: Array of sections, each containing `title` and `text`
- `figures`: Array of figures, each containing `src` and `caption`
- `tables`: Array of tables, each containing `html` and `caption`
- `bibtex`: BibTeX citation (optional, won't display if empty string `""`)

### Step 3: Upload Images

Upload images to the `image/projects/<project-id>/` directory, ensure paths are correct.

### Step 4: Update manifest.json

**Required**: Open `data/projects/manifest.json`, add the new filename (including `.json` extension) to the `projects` array.

---

## Editing Publications

**File path**: `data/publications.json`

Directly edit this JSON array file. Each publication contains:
- `year`, `title`, `authors`, `venue`
- `pdf`, `code`, `project`, `slides`, `award` (optional)

---

## Editing People Information

**File path**: `data/people.json`

Directly edit this JSON array file. Each person contains:
- `name`, `nameEn`, `role`, `program`
- `description`, `descriptionZh`
- `avatar`, `homepage`, `scholar`, `github`, `email`
- `status`, `cohort`, `affiliation`

**Avatars**: Upload to `image/user/` directory, recommended 280×280 pixels (square).

---

## Editing News

**File path**: `data/news/`

### Adding New News

1. Create JSON file with filename format: `news-<YYYY-MM-DD>.json` or `news-<YYYY-MM>.json`
2. File content includes: `id`, `title`, `tag`, `excerpt`, `image`, `date`, `link`
3. **Required**: Add the new filename to the `news` array in `data/news/manifest.json`

### Modifying Existing News

Simply edit the corresponding JSON file.

---

## Image Size Requirements

### Project Images

- **Thumbnail**: Recommended 1920×1080 pixels (16:9), minimum 1280×720
- **Detail page images**: Recommended 1920×1080 or higher (16:9)
- **Path**: `image/projects/<project-id>/`

### News Images

- **Recommended size**: 1920×1080 pixels (16:9), minimum 1280×720
- **Path**: `image/news/<YYYYMMDD>.jpg`

### People Avatars

- **Recommended size**: 280×280 pixels (square), minimum 140×140
- **Path**: `image/user/<name>.jpg`

---

## Important Notes

1. **JSON Format**: Ensure correct format, use online tools to validate
2. **File Paths**: Use relative paths, starting from website root directory
3. **manifest.json**: Must update corresponding manifest.json after adding new projects or news
4. **ID Consistency**: Project `id` field must exactly match filename (without extension)
5. **Empty Fields**: Link fields as empty string `""` will not display corresponding buttons/sections

---

## Verifying Changes

1. Commit to Git repository
2. Push to GitHub
3. Wait for GitHub Pages to automatically deploy (usually takes a few minutes)
4. Visit the website to check results

---

## Template Files

- **Project Template**: `data/projects/template-project-2025.json`
- Copy this template and modify when creating new projects

---

If you have any questions, please refer to the JSON file structure of existing projects or contact the website maintainer.

