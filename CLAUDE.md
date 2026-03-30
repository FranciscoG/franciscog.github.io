# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog (franciscog.com) built with **Eleventy (11ty)** static site generator. Deployed to GitHub Pages via the `/docs` output folder. Main branch for deployment is `master`.

## Commands

- `npm start` — Dev server with file watching
- `npm run build` — Production build (outputs to `docs/`)
- `npm run debug` — Eleventy with debug logging
- `node post.js` — Scaffold a new blog post (interactive CLI, creates in `src/content/drafts/`)

Requires Node 22+, npm 9+.

## Architecture

**Eleventy config** is split across three files:
- `eleventy.config.js` — Main config: plugins, filters, markdown setup, CSS processing (PostCSS + cssnano in prod), HTML minification in prod
- `eleventy.config.drafts.js` — Draft system: files in `src/content/drafts/` are auto-marked as drafts, shown only in dev (serve/watch), hidden from production builds
- `eleventy.config.images.js` — Image optimization shortcode (AVIF, WebP, auto)

**Directory mapping:**
- `src/content/` → Site pages and blog posts (Markdown + Nunjucks)
- `src/_includes/layouts/` → Page layouts: `base.njk` (shell), `post.njk` (articles), `home.njk`
- `src/_data/` → Global data (`metadata.js` for site info, `isDev.js` for environment)
- `src/public/` → Static assets copied as-is (CSS, JS, images)
- `docs/` → Build output (served by GitHub Pages)

**Template engine:** Nunjucks preprocesses all Markdown and HTML templates.

## Blog Post Workflow

Posts are Markdown files with YAML frontmatter. New posts start as drafts in `src/content/drafts/`. When ready to publish, move to `src/content/blog/` and ensure:
- `date` field is present in YYYY-MM-DD format
- `draft: true` is removed

A pre-commit hook (`validate-post.js` via lefthook) enforces these rules on staged files in `src/content/blog/`.

## Key Conventions

- CSS uses PostCSS with nesting; variables handle theming (light/dark/auto via `theme-switcher.js`)
- Syntax highlighting is opt-in per post (`syntax: true` in frontmatter)
- Table of contents auto-generated from headings via eleventy-plugin-toc
- External links in markdown automatically get `target="_blank"`
- GitHub Actions CI triggers on pushes to `main` for files in `src/`, eleventy configs, or package files
