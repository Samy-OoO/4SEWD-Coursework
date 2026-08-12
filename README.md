# 4SEWD Coursework — Inventory Management System (Full-Stack)

A full-stack conversion of the Inventory Management System, built following the
Week 3 tutorial: **Express (layered architecture) + Sequelize + SQLite** on the
backend, talking to the existing **React + Vite** frontend over a REST API
with **express-validator** and **CORS**.

```
4SEWD-Coursework/
├── client/     React + Vite frontend  (http://localhost:5173)
└── server/     Express + Sequelize API (http://localhost:3000)
```

## Prerequisites

- Node.js 18+ and npm

## Setup

From the project root:

```bash
npm run install:all   # installs dependencies in both client/ and server/
npm run dev            # starts the API and the React dev server together
```

- API: http://localhost:3000/api
- App: http://localhost:5173

The first time the server starts it creates `server/database.sqlite`
(code-first, via `sequelize.sync()`) and seeds it with the original sample
products and suppliers. After that, your data persists between restarts.

Environment variables already have working defaults in `client/.env` and
`server/.env` for local development — `.env.example` files are included in
both folders as a reference if you ever need to point at a different port or
API URL.

### Running client/server separately

```bash
npm run dev:server   # nodemon src/server.js  (server/)
npm run dev:client   # vite                    (client/)
```

### Re-seeding the database

Delete `server/database.sqlite` and restart the server, or run:

```bash
npm run seed
```

(only seeds if the suppliers table is currently empty — it never duplicates
or overwrites existing data)

## Backend architecture

Follows the structure from slide 7 of the tutorial:

```
server/src/
├── config/       env loading (dotenv) + the Sequelize/SQLite connection
├── models/       Product, Supplier, and their hasMany/belongsTo association
├── validators/   express-validator rule chains for each resource
├── middleware/   validate() (400 on bad input), centralized error handler
├── services/     business logic + Sequelize queries
├── controllers/  thin HTTP layer that calls the service functions
├── routes/       maps URLs to controllers, mounted under /api
├── app.js        configures Express (middleware, routes) - no listen()
└── server.js     connects, syncs the DB, seeds, then listens
```

`Product` and `Supplier` are related with `Supplier.hasMany(Product)` /
`Product.belongsTo(Supplier)` — a product stores a `supplierId` foreign key
rather than a duplicated supplier name string. Deleting a supplier that still
has products is blocked (409) instead of silently orphaning rows.

Product images are still handled the same way the original frontend did it —
read client-side as a base64 data URL and stored as `TEXT` in SQLite — since
file-upload middleware wasn't part of this tutorial's scope.

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint            | Body                                                    | Notes                              |
|--------|----------------------|-----------------------------------------------------------|-------------------------------------|
| GET    | `/health`             | —                                                          | Health check                        |
| GET    | `/products`           | —                                                          | Includes each product's `Supplier`  |
| GET    | `/products/:id`       | —                                                          | 404 if not found                    |
| POST   | `/products`           | `name, desc, price, quantity, supplierId, sku?, category?, costPrice?, minStock?, image?, alt?` | 400 on validation failure |
| PUT    | `/products/:id`       | same as POST                                               | `image` omitted = keep existing one |
| DELETE | `/products/:id`       | —                                                          | 204 on success                      |
| GET    | `/products/:id/stock-movements` | —                                                 | This product's ledger, newest first |
| POST   | `/products/:id/stock-movements` | `change, reason`                                  | Atomic adjust + log; 400 if it would go below zero |
| GET    | `/products/stock-movements` | —                                                      | Every movement across every product, oldest first (powers the trend chart) |
| GET    | `/suppliers`           | —                                                          |                                      |
| GET    | `/suppliers/:id`       | —                                                          | 404 if not found                    |
| POST   | `/suppliers`           | `name, desc?, email, phone`                                | 400 on validation failure           |
| PUT    | `/suppliers/:id`       | same as POST                                               |                                      |
| DELETE | `/suppliers/:id`       | —                                                          | 409 if the supplier still has products |

Validation errors return `400` with `{ errors: [{ msg, path, ... }] }`,
matching the express-validator format from the slides.

## Frontend changes

### Full-stack wiring
- `src/services/api.js` — shared `fetch` wrapper (base URL from
  `VITE_API_BASE_URL`, JSON parsing, error normalization)
- `src/services/productService.js`, `src/services/supplierService.js` — one
  function per endpoint, isolating API calls from UI code (slide 31)
- `src/context/DataContext.jsx` — no longer reads/writes `localStorage`;
  fetches from the API on mount and exposes `loading` / `error` plus
  `addProduct/updateProduct/deleteProduct` and the supplier equivalents
- `ProductForm.jsx` / `SupplierForm.jsx` handle both create and edit
  (routes: `/products/new` & `/products/edit/:id`, `/suppliers/new` &
  `/suppliers/edit/:id`)
- `ViewProduct.jsx`'s "Edit Product" button now links to the correct
  product instead of always going to the blank "new product" form

Login (`Login.jsx`) is still a client-side credential check
(`admin@gmail.com` / `admin@123`), since authentication wasn't covered in
the Express/Sequelize tutorial. Everything behind it talks to the real API
instead of `localStorage`.

### UI redesign

The frontend follows a sidebar + topbar "internal business tool" design,
per a separate design brief. **Both phases are done:**

**Phase 1** — foundation:
- Design tokens (color palette, spacing, radius, Inter typeface) in
  `src/index.css`
- `components/layout/` — `Sidebar`, `Topbar`, `AppShell`, `PageHeader`
- `components/ui/` — `Button`, `Badge`, `EmptyState`, `ActionMenu`
- `components/dashboard/` — `StatCard`, `StockAlerts`
- `components/landing/` — `DashboardPreview` (a live, non-fake preview
  built from real data, reused in the hero and the preview section)
- Protected **Dashboard** page (`/dashboard`) — KPI cards, a
  dependency-free "Products by Supplier" summary panel standing in for a
  full chart, and a live Stock Alerts panel
- Public **Home** landing page (`/`) — nav, hero, features, "how it
  works" steps, dashboard preview, CTA, footer
- Redesigned **Login** page (centered card)

**Phase 2** — Products, Suppliers, and forms:
- `components/products/` — `ProductFilters` (search/stock/supplier/sort),
  `ProductRow`, `ProductTable` (with an `EmptyState` for zero results)
- Redesigned **Products** page — search, stock/supplier filters, sort,
  result count, a data table with SKU, thumbnail, stock badge, and a
  `•••` action menu (View / Edit / Delete) instead of stacked text links
- Redesigned **Product detail** page — breadcrumb, image + info card,
  Inventory Information / Description / Supplier Information panels
- Redesigned **Add/Edit Product** form — sectioned into Basic Information,
  Inventory, Pricing, Supplier, and Product Image
- Redesigned **Suppliers** page — search, a table with a live product
  count per supplier and a `•••` action menu
- New **Supplier Details** page (`/suppliers/:id`) — contact info and the
  list of products that supplier provides
- Redesigned **Add/Edit Supplier** form, matching the same sectioned style

Two small additive fields were added to support this (non-breaking -
`sequelize.sync({ alter: true })` preserves existing data):
- `sku` and `category` (both optional strings) on Product
- `minStock` (integer, defaults to 5) - drives the Low/Critical stock
  badges everywhere, instead of a number hardcoded in the UI
- `costPrice` (optional float) alongside the existing `price`, so the
  Pricing section can show Cost Price vs. Selling Price

A few deliberate simplifications from the original design brief, to avoid
adding backend complexity the coursework didn't call for:
- No separate Category *table* - it's a plain optional text field, and the
  Products filter/form use it as freeform text rather than a fixed list
- No bulk-select checkboxes in the product table (no bulk actions were
  specified for them to trigger)
- No "Adjust Stock" quick-action - editing a product already covers
  changing its quantity
- Supplier "Status" is a static "Active" badge - there's no
  activate/deactivate feature behind it
- Stock History is left out entirely, since there's no backend
  transaction log to source it from (per the brief's own guidance not to
  invent fake data)

### Stock Movement Ledger + Inventory Trend Chart

Every quantity change is now recorded, not just silently applied:

- **`StockMovement`** — a new append-only table (`change`, `quantityAfter`,
  `reason`, `createdAt`) linked to `Product`. Creating a product logs an
  "Initial stock" entry; editing a product's quantity through the normal
  form logs a "Manual edit" entry; a dedicated **Adjust Stock** action
  (available from the Products table's `•••` menu and the product detail
  page) logs a chosen reason (e.g. "Stock received", "Sale", "Damaged").
  The quantity update and the ledger entry are written in a single
  database transaction, so they can never drift apart.
- **Stock History** — the product detail page now shows the full ledger
  for that product (this was explicitly left out in an earlier pass for
  lack of data - it isn't anymore).
- **Inventory Value Trend chart** — the Dashboard's "Products by Supplier"
  bar panel is now joined by a real line chart (via `recharts`), built by
  walking every recorded movement chronologically and computing a running
  total inventory value. This is a genuine chart fed by real data, not a
  fabricated demo series - simplification worth knowing: since movements
  don't store historical price, each step is valued at the product's
  *current* price rather than its price at the time. The chart is
  code-split (`React.lazy`) so `recharts` only loads when the Dashboard is
  visited, not on every page.
- New endpoints: `POST /products/:id/stock-movements` (adjust),
  `GET /products/:id/stock-movements` (one product's history),
  `GET /products/stock-movements` (global feed, powers the chart).

### Profit Margins panel

A new Dashboard panel ranks products by margin % using the existing
`price`/`costPrice` fields - no backend changes needed.

### Dark mode

Every color in `index.css` is a CSS custom property, so dark mode is just
a second set of variable values under `:root[data-theme="dark"]` - no
component-level changes required. A `useTheme` hook persists the choice to
`localStorage`, falls back to the OS preference on first visit, and an
inline script in `index.html` applies it before React mounts (no flash of
the wrong theme). Toggle button lives in the Topbar, the landing page nav,
and the Login page.

While auditing colors for dark-mode correctness, the entire pre-redesign
legacy stylesheet (~200 lines of unused `nav`/`button`/`.card`/old badge
styles, dead since every page was migrated to the new design in Phase 2)
was confirmed unused and removed.

## Note on legacy files

`client/` still contains the original vanilla HTML/CSS/JS pages (`home.htm`,
`products.htm`, `js/*.js`, root-level `style.css`, etc.) from before the React
conversion. They aren't part of the running app (Vite serves `index.html` →
`src/main.jsx`) and were left in place rather than deleted, in case they're
still wanted for reference or grading — feel free to remove them if not.
