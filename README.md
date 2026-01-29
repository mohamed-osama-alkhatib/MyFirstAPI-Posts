# JS_Website

A small static JavaScript website that demonstrates posts listing, post details, user profile, and simple auth-related UI behavior. This repository contains the frontend pages, API helper modules, and utility scripts used in the project.

## Features

- Static HTML pages: home (`index.html`), post details (`postDetails.html`), and profile (`profile.html`).
- Modular JavaScript under `js/`, `api/`, `auth/`, `pages/`, and `utils/` folders.
- Simple client-side APIs for auth and posts.
- Lightweight CSS in `css/style.css`.

## Project Structure

- `index.html` — Main landing page showing posts.
- `postDetails.html` — Shows detailed view of a single post.
- `profile.html` — User profile page.
- `css/` — Stylesheets (`style.css`).
- `js/` — Main JavaScript entry files (`main.js`, `profile.js`).
- `api/` — API helper modules (`authApi.js`, `postsApi.js`).
- `auth/` — Authentication utilities and UI (`auth.js`, `uiAuth.js`).
- `config/` — Configuration values (`config.js`).
- `pages/` — Page-specific logic (`postDetails.js`, `posts.js`).
- `utils/` — Small utilities (`alert.js`, `loader.js`, `storage.js`).
- `library/package.json` — Optional package manifest (if using Node-based dev tools).
