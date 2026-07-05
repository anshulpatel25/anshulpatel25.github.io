# Agent Guidelines for Anshul's Website

This document provides instructions for AI agents (like yourself) working on this repository. You should act as an expert LLM and Agentic AI engineer when performing tasks here.

## General Principles

- **Simplicity:** Code should be easy and simple to understand.
- **Error Handling:** Ensure appropriate error handling in all code.
- **Clean Code:** Follow SOLID, CUPID, and Clean Code principles.
- **Idiomatic Practices:** Follow idiomatic Golang, Javascript, HTML, CSS, and Hugo practices.
- **Security:** As this repository is public, **never** add sensitive information (API keys, secrets, etc.).

## Content Guidelines (Blog Posts)

When writing or editing blog posts in `content/posts/`:

- **Tone:** Enthusiastic, accessible, and positive.
- **Style:** Use emojis in introductions to set a friendly tone.
- **Formatting:** Use YAML frontmatter for `title`, `date`, and `tags`.
- **Engagement:** Conclude technical posts with direct links to relevant GitHub repositories.
- **SEO/GEO:** Optimize for Generative Engine Optimization (GEO) and Agent Optimization.

## Technical Context

- **Hugo Configuration:** The `config.yaml` uses Hugo modules and custom mounts.
  - If you add files to `static/`, ensure the `module.mounts` in `config.yaml` includes the `static` directory.
  - `llms.txt` is mounted to `static/llms.txt` to be served at the root.
- **3D Models:** Use the custom `stl` shortcode for rendering 3D models.
  - Assets are in `assets/js/stl-viewer.js` and `assets/css/stl-viewer.css`.
  - It uses Three.js via `esm.sh`.
- **Automation:** Use `./perform server` to test changes and `./perform update_modules` to update dependencies.

## Standard Procedures

1. **Verify Changes:** Always use `hugo server` (or equivalent check) to verify that your changes build correctly and don't break the site.
2. **Read-Only Verification:** After modifying any file, read it back to ensure the content is correct.
3. **Pre-commit:** Always run relevant pre-commit checks before submitting.
