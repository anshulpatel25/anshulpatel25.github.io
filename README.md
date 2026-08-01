# Anshul Patel's Personal Website

This repository contains the source code for
[anshulpatel.in](https://www.anshulpatel.in), a personal website and blog built
with [Hugo](https://gohugo.io/).

## Overview

The website serves as a portfolio and blog for Anshul Patel, a Geek, Tinkerer,
and Techie. It features technical blog posts, open-source contributions, meetup
presentations, and 3D model visualizations.

## Tech Stack

- **Static Site Generator:** [Hugo](https://gohugo.io/)
- **Theme:** [Hugo Coder](https://github.com/luizdepra/hugo-coder) (as a Hugo
  module)
- **Icons:** [Fork Awesome](https://forkaweso.me/) (Web fonts located in
  `static/fonts/`)
- **3D Visualization:** [Three.js](https://threejs.org/) for rendering STL
  models.
- **Search:** [Lunr.js](https://lunrjs.com/)
- **CDN:** [esm.sh](https://esm.sh/) for ESM library imports.
- **Privacy First:** Free of third-party tracking cookies (No Google Analytics,
  GTM, etc.)

## Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version >= 0.124.0 required)
- [Go](https://golang.org/doc/install) (for Hugo modules)

### Development

Use the included `perform` script for common tasks:

- **Run local development server:**

  ```bash
  ./perform server
  ```

  The site will be available at `http://localhost:1313`.

- **Update Hugo modules:**

  ```bash
  ./perform update_modules
  ```

## Repository Structure

- `content/`: Markdown files for posts, about page, and other sections.
- `assets/`: Custom CSS and JavaScript (e.g., STL viewer).
- `static/`: Static assets like images and favicons.
- `layouts/`: Custom Hugo layouts and shortcodes.
- `data/`: Dynamic data sources (e.g., `oss.yaml` for Open Source
  contributions).
- `config.yaml`: Hugo configuration file.
- `.csslintrc`: CSSLint configuration for style enforcement.
- `llms.txt`: Machine-readable summary for LLMs (served at root).

## Guidelines

For instructions on contributing or working with this repository as an AI agent,
please refer to [AGENTS.md](./AGENTS.md).

## License

This project is for personal use. Content is © Anshul Patel.
