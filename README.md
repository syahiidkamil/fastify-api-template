# Fastify API Template

Modern, modular Fastify API template with JWT authentication, PostgreSQL, and Prisma ORM. Features a clean architecture with service layers, route validation, comprehensive error handling, and role-based access control.

## Features

- **Modular Architecture**: Domain-based structure for better maintainability
- **JWT Authentication**: Built-in auth with register, login, and protected routes
- **Role-Based Access Control (RBAC)**: Three user roles (CUSTOMER, ADMIN, SUPER_ADMIN) with different permissions
- **PostgreSQL + Prisma ORM**: Type-safe database access with easy migrations
- **Schema Validation**: Request and response validation using JSON Schema
- **Swagger Documentation**: Auto-generated API docs available at `/documentation`
- **Error Handling**: Standardized error responses
- **Logging**: Structured logging with Logtail support
- **Environment Configuration**: Easy environment management
- **API Prefix**: All endpoints are prefixed with `/api` for clarity
- **Clean Separation**: Routes, handlers, services, and schemas are separated for better code organization

## Prerequisites

- Node.js 16+
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fastify-api-template.git
cd fastify-api-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the `.env.example` file to `.env` and update it with your configuration:

```bash
cp .env.example .env
```

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/fastify_db"

# JWT
JWT_SECRET="your-secret-jwt-token-for-authentication"

# Logger
LOGTAIL_SOURCE_TOKEN=
LOGTAIL_INGESTING_HOST=logs.betterstack.com
LOGGER_FILE=server.log

# Server
PORT=3000

# RBAC
SUPER_ADMIN_KEY="your-super-secret-key-for-creating-super-admin"
```

Make sure to set a secure, random value for JWT_SECRET and SUPER_ADMIN_KEY.

### 4. Set up the database

Make sure PostgreSQL is running and create a database:

```bash
createdb fastify_db
```

Run the Prisma migrations:

```bash
npm run db:migrate
```

### 5. Start the server

Development mode with hot reloading:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Role-Based Access Control

This template implements role-based access control with three user roles:

- **CUSTOMER**: Regular users with basic permissions
- **ADMIN**: Administrative users with elevated permissions
- **SUPER_ADMIN**: Top-level administrators with full access

### Creating a Super Admin

To create a Super Admin, send a POST request to `/api/auth/super-admin` with the special header:

```bash
X-Super-Admin-Key: your-super-secret-key-from-env
```

This header must match the SUPER_ADMIN_KEY value in your .env file.

### Role Permissions

| Action | CUSTOMER | ADMIN | SUPER_ADMIN |
|--------|----------|-------|-------------|
| Register/Login | ✓ | ✓ | ✓ |
| View Products | ✓ | ✓ | ✓ |
| Create/Edit Products | ✗ | ✓ | ✓ |
| Delete Products | ✗ | ✗ | ✓ |
| Create Admins | ✗ | ✗ | ✓ |
| List Users | ✗ | ✓ | ✓ |
| Change User Roles | ✗ | Limited | ✓ |

## Project Structure

```
src/
├── modules/              # Business domain modules
│   ├── auth/             # Authentication module
│   │   ├── routes.js     # Route definitions
│   │   ├── handlers.js   # Request handlers
│   │   ├── service.js    # Business logic
│   │   └── schemas/      # Validation schemas
│   │       └── index.js
│   └── products/         # Products module
│       ├── routes.js
│       ├── handlers.js
│       ├── service.js
│       └── schemas/
│           └── index.js
├── plugins/              # Fastify plugins
│   ├── prisma.js         # Database connection
│   ├── jwt.js            # JWT authentication
│   ├── rbac.js           # Role-based access control
│   └── logger.js         # Logging configuration
├── utils/                # Utilities
│   └── errors.js         # Error handling
├── prisma/               # Prisma ORM files
│   └── schema.prisma     # Database schema
├── app.js                # Application setup
└── server.js             # Server entry point
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

- `POST /api/auth/register` - Register as a customer (public)
- `POST /api/auth/login` - Login and get JWT token (public)
- `GET /api/auth/me` - Get current user info (requires authentication)
- `POST /api/auth/admin` - Create admin user (requires SUPER_ADMIN role)
- `POST /api/auth/super-admin` - Create super admin (requires special header)
- `POST /api/auth/role` - Update user role (requires ADMIN or SUPER_ADMIN role)
- `GET /api/auth/users` - List all users (requires ADMIN or SUPER_ADMIN role)

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create a new product (requires ADMIN or SUPER_ADMIN role)
- `PUT /api/products/:id` - Update a product (requires ADMIN or SUPER_ADMIN role)
- `DELETE /api/products/:id` - Delete a product (requires SUPER_ADMIN role)

### Other Endpoints

- `GET /health` - Health check endpoint (not prefixed with /api)
- `GET /documentation` - API documentation

## Documentation

The API documentation is available at `/documentation` when the server is running.

## License

MIT
