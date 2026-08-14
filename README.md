# 4SEWD Coursework — Inventory Management System (Full-Stack)

A full-stack Inventory Management System built with **React + Vite** on the client and **Node.js + Express + Sequelize + SQLite** on the server. The application provides CRUD management for products and suppliers, JWT-based admin authentication, validation, image upload, stock movement tracking, dashboard analytics, search/filtering, and responsive UI.

## Project Structure

```text
4SEWD-Coursework/
├── client/     React + Vite frontend
└── server/     Express + Sequelize REST API
```

## Technology Stack

- **Frontend:** React, Vite, React Router, CSS
- **Backend:** Node.js, Express
- **Database:** SQLite
- **ORM:** Sequelize
- **Validation:** express-validator + HTML5/client-side validation
- **Authentication:** JWT + bcrypt password hashing
- **Charts:** Recharts
- **HTTP:** Fetch API through a shared API service

## Prerequisites

- Node.js 18+
- npm

## Setup

From the project root:

```bash
npm run install:all
npm run dev
```

This starts:

- API: `http://localhost:3000/api`
- Client: `http://localhost:5173`

The application uses a **code-first Sequelize database setup**. On first startup, Sequelize creates `server/database.sqlite` and the application seeds the initial suppliers, products, and admin user when required. Data then persists between restarts.

### Run client/server separately

```bash
npm run dev:server
npm run dev:client
```

### Re-seed the database

To reset the local database, delete `server/database.sqlite` and restart the server. The seed process will recreate the database and initial data.

## Environment Variables

Environment-specific values should be stored in `.env` files and are excluded from version control. `.env.example` files are provided as templates.

Server variables include:

```text
PORT=3000
DB_PATH=./database.sqlite
API_BASE_URL=/api
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your-random-secret
JWT_EXPIRATION=8h
```

**Important:** `JWT_SECRET` is a server-side secret used to sign and verify JWTs. It must not be committed to GitHub, placed in frontend code, or exposed to the browser. For a deployed application, set `JWT_SECRET` in the hosting provider's environment/secrets settings rather than putting the production value in the repository.

## Authentication & Security

The application uses a dedicated `User` entity separate from the business entities.

Authentication flow:

```text
Login form
    ↓
POST /api/auth/login
    ↓
User lookup
    ↓
bcrypt password verification
    ↓
JWT generation
    ↓
Frontend stores the authentication token
    ↓
Protected API requests include Authorization: Bearer <token>
    ↓
Express authentication middleware verifies the JWT
```

Passwords are never stored as plaintext. They are hashed using bcrypt before being stored in the `User` table.

The Products and Suppliers API routes are protected by authentication middleware, so authentication is enforced at the API level as well as through the protected React routes.

Registration is also available and creates an admin user with a hashed password.

## Backend Architecture

The backend follows a layered architecture with separation of concerns:

```text
server/src/
├── config/        Environment configuration and Sequelize connection
├── models/        Sequelize models and relationships
├── validators/    Server-side validation rules
├── middleware/    Authentication, validation and error handling
├── services/      Business logic and database operations
├── controllers/   HTTP request/response handling
├── routes/        REST endpoint definitions
├── utils/         Shared backend utilities/errors
├── app.js         Express application configuration
└── server.js      Database setup, seeding and server startup
```

Controllers remain thin and delegate business logic to services. Sequelize handles communication with SQLite.

## Database Entities & Relationships

The main entities are:

- **User** — authentication/admin account
- **Supplier** — supplier information
- **Product** — inventory products
- **StockMovement** — append-only record of inventory quantity changes

Relationships:

```text
Supplier 1 ──────── * Product
                         │
                         │ 1
                         │
                         *
                  StockMovement
```

A Product stores a `supplierId` foreign key and uses a Sequelize `belongsTo` relationship with Supplier. A Supplier can have many Products. Supplier deletion is prevented while products still reference it.

Stock movements belong to a Product. Quantity changes and their corresponding ledger entries are performed in a database transaction so the inventory quantity and movement history remain consistent.

## REST API

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/login` | Authenticate a user and return a JWT |
| POST | `/auth/register` | Register a new admin user |
| GET | `/products` | List products, including supplier information |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| GET | `/products/:id/stock-movements` | Get a product's stock history |
| POST | `/products/:id/stock-movements` | Adjust stock and record the movement |
| GET | `/products/stock-movements` | Get the global stock-movement feed |
| GET | `/suppliers` | List suppliers |
| GET | `/suppliers/:id` | Get one supplier |
| POST | `/suppliers` | Create a supplier |
| PUT | `/suppliers/:id` | Update a supplier |
| DELETE | `/suppliers/:id` | Delete a supplier |

Validation failures return HTTP 400 responses with specific field-level error messages. Authentication failures use appropriate 401/403 responses, and missing resources return 404 responses.

## Frontend Architecture

The frontend uses a shared `DataContext` and service layer rather than putting API calls directly inside page components.

```text
Products.jsx / Dashboard.jsx / Forms
            ↓
        DataContext
            ↓
 productService / supplierService / authService
            ↓
          api.js
            ↓
       Fetch API
            ↓
      Express REST API
```

`DataContext` keeps shared product/supplier state. When a product is created, updated or deleted successfully, the context updates its React state so pages such as Products and Dashboard re-render with the latest data.

## Main Features

### Dashboard

- Total products KPI
- Total inventory/value statistics
- Products-by-supplier summary
- Low-stock alerts
- Inventory value trend chart based on recorded stock movements
- Profit margin analysis
- Responsive dashboard cards and panels

### Products

- Create, read, update and delete products
- Product image upload from the user's device
- Search
- Stock filtering
- Supplier filtering
- Sorting
- Stock status badges
- Product detail page
- Supplier information displayed with each product
- Stock adjustment action

### Suppliers

- Full CRUD functionality
- Supplier search
- Product count per supplier
- Supplier detail page showing supplied products
- Supplier deletion protection when products still reference the supplier

### Stock Movement Ledger

Every inventory quantity change is recorded in `StockMovement`:

- Initial stock when a product is created
- Manual quantity edits
- Dedicated stock adjustments with reasons such as stock received, sale or damaged stock
- Product-level stock history
- Global movement feed for the dashboard trend chart

Stock updates and their ledger entries are performed atomically in a database transaction.

### Validation

Client-side validation provides immediate feedback for required fields, numeric ranges, email formats and other form constraints.

Server-side validation using `express-validator` is the source of truth and validates incoming API data independently of the client. Invalid requests return specific field-level messages rather than a generic error.

### Image Upload

Products use an actual file input. The selected image is read client-side as a base64 data URL and stored as text in SQLite. A text-only image URL is not used as the upload mechanism.

### Responsive UI & Dark Mode

The React interface is responsive across desktop, tablet and mobile layouts. The application also supports light/dark themes using CSS custom properties, with the selected theme persisted in local storage.

## Low-Stock Behaviour

Products use a configurable `minStock` threshold. The default value is 5 and the UI uses the product's threshold to determine stock status badges and dashboard alerts.

## Legacy Files

The `client/` directory still contains some original vanilla HTML/CSS/JS files from before the React conversion. They are retained for reference and are **not part of the active application**. The running application starts from Vite's `index.html` and `src/main.jsx`.

## Version Control

The project uses Git with multiple incremental commits documenting development, feature additions and fixes. The repository contains separate client and server projects within the coursework repository.

## Deployment

For production deployment, configure the required environment variables in the hosting platform, including a strong unique `JWT_SECRET`. Do not commit production secrets to the repository.

The production application URL should be provided in the coursework report/submission.
