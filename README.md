# Valantis Product Listing App

A React single-page app for browsing, filtering, and paging through the Valantis product catalog.

## Overview

This project consumes the Valantis test API to list products and lets users narrow results by name, price, and brand while paging through the full catalog. Requests are authenticated with an MD5-hashed signature derived from a shared password and the current date, as required by the API.

## Features

- Fetches product IDs and details from the Valantis API (`get_ids` / `get_items`)
- Generates the required `X-Auth` header from an MD5 hash of the password and date
- Displays each product's ID, name, price, and brand
- Client-side filtering by name, price, and brand
- Pagination through the product list (50 items per page)
- Graceful error handling with a user-facing error message

## Tech stack

- React 18 (Create React App / `react-scripts`)
- Axios for HTTP requests
- `md5` for API authentication signatures
- React Testing Library / Jest for testing
- `gh-pages` for deployment to GitHub Pages

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run the test suite
npm test

# Create a production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

The app runs at `http://localhost:3000` by default.

## Project structure

```
Valantis_Test/
├── public/              # Static assets and HTML template
├── src/
│   ├── ProductList.js   # Main component: fetching, filtering, pagination
│   ├── App.css
│   ├── index.js         # App entry point
│   └── index.css
├── package.json
└── README.md
```
