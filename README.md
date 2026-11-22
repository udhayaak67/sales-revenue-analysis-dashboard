# Sales & Revenue Analysis Dashboard

A responsive, interactive sales dashboard built with **HTML, CSS, and vanilla JavaScript**. It helps explore sales performance through KPIs, charts, category breakdowns, product rankings, and quick insights.

## Features

- KPI cards: total revenue, total orders, units sold, and average order value.
- Monthly revenue trend line chart.
- Revenue contribution by category (doughnut chart).
- Top five products ranked by revenue.
- Quick insights generated from the currently selected data.
- Date range and category filters, plus reset.
- Import a custom CSV file and export the filtered data.
- Responsive layout for desktop, tablet, and mobile.
- No backend, installation, or build step required.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. The dashboard opens with the included demo dataset.

Chart.js is loaded from a CDN, so an internet connection is required for charts to render.

## Import your own data

Use the **Import CSV** button. The CSV must contain these column headers:

| Column | Required | Description |
|---|---|---|
| `date` | Yes | Date in `YYYY-MM-DD` format |
| `product` | Yes | Product name |
| `category` | Yes | Product category |
| `units` | Yes | Number of units sold |
| `price` | Yes | Selling price per unit |
| `segment` | No | Optional segment or sub-category |
| `orderId` | No | Optional order identifier; if omitted, each row is counted as one order |

A sample file is available at `data/sales_data.csv`. Keep product names and category values comma-free in this simple CSV importer.

**Revenue calculation:** `units × price`.

**Order count:** distinct `orderId` values. When no `orderId` column is supplied, each row is treated as a separate order.

## Deploy with GitHub Pages

1. Create a new repository on GitHub.
2. Upload all files and folders from this project.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. Your dashboard URL will appear in the Pages section.

## Project structure

```text
sales-revenue-analysis-dashboard/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── sales_data.csv
├── assets/
└── README.md
```

## Tech stack

- HTML5
- CSS3 (responsive layout)
- JavaScript (ES6)
- Chart.js

## Notes

- The included records are **sample/demo data**, not actual company sales.
- Currency is displayed in Indian Rupees (INR). Update the `money()` formatter in `app.js` if you need another currency.
- This is a static frontend project. It does not store uploaded data on a server; imported data stays in the current browser session.
