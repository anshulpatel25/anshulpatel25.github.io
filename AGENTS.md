# Agent Guidelines for Anshul's Website

This document provides instructions for AI agents (like yourself) working on
this repository. You should act as an expert LLM and Agentic AI engineer when
performing tasks here.

## General Principles

- **Simplicity:** Code should be easy and simple to understand.
- **Error Handling:** Ensure appropriate error handling in all code.
- **Clean Code:** Follow SOLID, CUPID, and Clean Code principles.
- **Idiomatic Practices:** Follow idiomatic Golang, Javascript, HTML, CSS, and
  Hugo practices.
- **Security:** As this repository is public, **never** add sensitive
  information (API keys, secrets, etc.).

## Content Guidelines (Blog Posts)

When writing or editing blog posts in `content/posts/`:

- **Tone:** Enthusiastic, accessible, and positive.
- **Style:** Use emojis in introductions to set a friendly tone.
- **Formatting:** Use YAML frontmatter for `title`, `date`, and `tags`.
- **Engagement:** Conclude technical posts with direct links to relevant GitHub
  repositories.
- **SEO/GEO:** Optimize for Generative Engine Optimization (GEO) and Agent
  Optimization.

## Technical Context

- **Hugo Configuration & Mounts:** The `config.yaml` uses Hugo modules and
  custom mounts.
  - **Important:** Defining any `module.mounts` in `config.yaml` overrides all
    default Hugo mounts for the project root. Default directories like
    `content`, `layouts`, `static`, and `data` must be explicitly re-added to
    the mounts list if any custom mount is used.
  - If you add files to `static/`, ensure the `module.mounts` in `config.yaml`
    includes the `static` directory.
  - `llms.txt` is mounted to `static/llms.txt` to be served at the root.
- **Privacy & Tracking:** The website does not use any third-party tracking
  cookies, Google Analytics, Google Tag Manager (GTM), or cookie consent
  banners. **Do not add** any associated assets, styles, configuration keys, or
  scripts.
- **Styling & Icons:**
  - The project uses **Fork Awesome** (`css/fork-awesome.css`) instead of Font
    Awesome. The required web font files must be placed in `static/fonts/` to
    resolve relative pathing (`../fonts/`) correctly.
  - CSS linting is configured via `.csslintrc` in the root directory to support
    modern CSS features and vendor styles.

- **Dynamic Content & Overrides:**
  - The Open Source (OSS) contributions page is dynamically rendered using a
    custom Hugo shortcode (`layouts/shortcodes/oss.html`) that reads metadata
    from `data/oss.yaml`.
  - Custom sitemap overrides are placed in `layouts/_default/sitemap.xml`.
- **3D Models:** Use the custom `stl` shortcode for rendering 3D models.
  - Assets are in `assets/js/stl-viewer.js` and `assets/css/stl-viewer.css`.
  - It uses Three.js via `esm.sh`.
- **Automation:** Use `./perform server` to test changes and
  `./perform update_modules` to update dependencies.

## Standard Procedures

1. **Documentation Updates:** Whenever any feature is added, removed, or updated
   in this repository, **you must modify this `AGENTS.md` and the `README.md`**
   files accordingly to keep documentation synchronized with the current status
   of the codebase.
2. **Verify Changes:** Always use `hugo server` (or equivalent check) to verify
   that your changes build correctly and don't break the site.
3. **Read-Only Verification:** After modifying any file, read it back to ensure
   the content is correct.
4. **Pre-commit:** Always run relevant pre-commit checks before submitting.
