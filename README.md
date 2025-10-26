# USOF Backend

A robust backend API for a Question & Answer platform inspired by StackOverflow, built with Node.js, Express, and MySQL.

## Description

USOF Backend is a RESTful API service that powers a full-featured Q&A platform. It provides comprehensive user management, authentication, post creation and interaction, commenting, voting, and administrative capabilities. The backend features role-based access control, file uploads, email notifications, and real-time subscription management.

### Key Features
- **User Authentication & Authorization**: JWT-based auth with access and refresh tokens, email confirmation, password reset
- **Role-Based Access Control**: Two user roles (user/admin) with protected endpoints
- **Post Management**: Full CRUD operations, image uploads, status management, banning
- **Engagement System**: Like/dislike for posts and comments, favorites, subscriptions
- **Commenting System**: Nested comments with full CRUD capabilities
- **Notification System**: Real-time notifications for subscribed post updates
- **Category Organization**: Categorize and filter posts by topics
- **Image Upload**: File system-based image storage with automatic cleanup
- **Admin Panel**: Kottster-based UI for backend data management
- **Request Validation**: Zod schema validation for all endpoints
- **Pagination & Filtering**: Advanced query options for list endpoints
- **Database Management**: Automated initialization and migration system

## Requirements and Dependencies

### System Requirements
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MySQL**: v8.0 or higher

### Key Dependencies
- **express**: ^5.1.0 - Web framework
- **mysql2**: ^3.14.4 - MySQL client with Promise support
- **jsonwebtoken**: ^9.0.2 - JWT token generation and validation
- **bcrypt**: ^6.0.0 - Password hashing
- **zod**: ^4.1.5 - Schema validation
- **dotenv**: ^17.2.2 - Environment variable management
- **cors**: ^2.8.5 - Cross-Origin Resource Sharing
- **cookie-parser**: ^1.4.7 - Cookie parsing middleware
- **multer**: ^2.0.2 - Multipart/form-data handling for file uploads
- **resend**: ^6.0.3 - Email service integration

### Development Dependencies
- **nodemon**: Automatic server restart on file changes

## How to Run the Solution

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd USOF/UsofB
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Configure your `.env` file** with the following variables:

```env
# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Resend API (for email notifications)
RESEND_API_KEY=re_your_api_key_here

# Application URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=usof
DB_PORT=3306

# MySQL Root Password (for db:init command only)
ROOT_PASSWORD=your_mysql_root_password
```

**Important Notes:**
- **JWT Secrets**: Generate strong random strings (at least 32 characters). You can use: `openssl rand -base64 32`
- **Resend API Key**: Sign up at [resend.com](https://resend.com) to get an API key for email functionality
- **Root Password**: Only needed for the `db:init` command to create the database and user

### Step 4: Database Setup

#### Option A: Initialize Database (First Time)
This command creates the database, user, and all tables:
```bash
npm run db:init
```

This will:
1. Connect to MySQL using root credentials
2. Create the database specified in `DB_NAME`
3. Create the database user specified in `DB_USER` with the password from `DB_PASSWORD`
4. Grant all privileges on the database to the user
5. Execute all SQL files in `/db/sql/` to create tables

#### Option B: Reset Database (Development)
**⚠️ WARNING: This will DROP ALL TABLES and DATA!**
```bash
npm run db:reset
```

Use this command only during development when you need a fresh database.

### Step 5: Start the Backend Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8080`.

You should see:
```
Server is running on port 8080
Database connection pool created successfully
```

### Step 6: (Optional) Start the Admin Panel

The project includes a Kottster admin panel for managing backend data through a UI:

```bash
npm run kottster
```

This will start the admin panel on `http://localhost:5173` (same port as frontend when run separately).

## Available Commands

```bash
# Start server with nodemon (development mode with auto-reload)
npm run dev

# Initialize database (create DB, user, and tables)
npm run db:init

# Reset database (DROP ALL TABLES and recreate - DESTRUCTIVE!)
npm run db:reset

# Start Kottster admin panel
npm run kottster
```

## Project Structure

```
UsofB/
├── app.js                    # Express app configuration and middleware setup
├── db/
│   ├── sql/                  # SQL schema files (executed in order)
│   │   ├── users.sql
│   │   ├── posts.sql
│   │   ├── categories.sql
│   │   ├── comments.sql
│   │   ├── likes.sql
│   │   ├── favorites.sql
│   │   ├── refresh_tokens.sql
│   │   ├── subscription.sql
│   │   └── notification.sql
│   ├── init.js               # Database initialization script
│   └── mysql_pool.js         # MySQL connection pool configuration
├── models/                   # Database models (data access layer)
│   ├── BaseModel.js          # Generic CRUD operations factory
│   ├── UserModel.js
│   ├── PostModel.js
│   ├── CommentModel.js
│   ├── CategoryModel.js
│   ├── LikeModel.js
│   ├── FavoriteModel.js
│   ├── RefreshTokenModel.js
│   ├── SubscriptionModel.js
│   └── NotificationModel.js
├── routes/                   # Express route definitions (API endpoints)
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── categoryRoutes.js
│   └── notificationRoutes.js
├── controllers/              # Request handlers (business logic entry point)
│   ├── AuthController.js
│   ├── UserController.js
│   ├── PostController.js
│   ├── CommentController.js
│   ├── CategoryController.js
│   └── NotificationController.js
├── services/                 # Business logic and orchestration
│   ├── AuthService.js
│   ├── UserService.js
│   ├── PostService.js
│   ├── CommentService.js
│   ├── CategoryService.js
│   └── NotificationService.js
├── schemas/                  # Zod validation schemas
│   ├── authSchema.js
│   ├── userSchema.js
│   ├── postSchema.js
│   ├── commentSchema.js
│   └── categorySchema.js
├── middlewares/              # Express middlewares
│   ├── tokenMiddleware.js    # JWT validation (validateAccess, validateRefresh, validateOptionalAccess)
│   ├── baseMiddleware.js     # Request body validation
│   ├── requireRole.js        # Role-based access control
│   ├── avatarMiddleware.js   # Avatar upload handling (single file)
│   └── postImagesMiddleware.js # Post image upload handling (multiple files)
├── public/                   # Static files served by Express
│   └── uploads/              # Uploaded files (avatars, post images)
│       ├── avatars/
│       └── posts/{post_id}/
├── utils/                    # Utility functions
├── kottster-admin/           # Admin panel UI
├── docs/                     # Documentation
│   ├── DOCUMENTATION.md      # Comprehensive technical documentation
│   └── db-diagram.png        # Database schema diagram
├── .env.example              # Example environment variables
├── .env                      # Your environment variables (not in git)
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Technology Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express 5** - Fast, minimalist web framework
- **MySQL 8** - Relational database management system
- **ES Modules** - Modern JavaScript module system

### Authentication & Security
- **jsonwebtoken** - JWT token generation and validation
- **bcrypt** - Secure password hashing with salt
- **cookie-parser** - HTTP cookie parsing
- **cors** - Cross-Origin Resource Sharing configuration

### Validation & Data Processing
- **Zod** - TypeScript-first schema validation
- **multer** - Multipart/form-data file upload handling

### Communication
- **resend** - Modern email API service
- **mysql2/promise** - Promise-based MySQL client

### Development Tools
- **dotenv** - Environment variable management
- **nodemon** - Development server with hot reload
- **Kottster** - Admin panel UI framework

## Architecture & Design Patterns

### Layer Pattern
```
Routes → Controllers → Services → Models → Database
```

- **Routes**: Define API endpoints and attach middlewares
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Contain business logic, orchestrate operations
- **Models**: Database access layer with CRUD operations
- **Middlewares**: Request processing (auth, validation, uploads)

### Key Design Patterns
- **Factory Pattern**: BaseModel creates generic CRUD operations
- **Dependency Injection**: Services receive model instances
- **Middleware Chain**: Express middleware for request processing
- **Repository Pattern**: Models abstract database operations

### Authentication Flow
1. User submits credentials → `POST /api/auth/login`
2. Controller validates input → Service checks credentials
3. Service generates JWT access token (short-lived) + refresh token (long-lived)
4. Access token sent in response body
5. Refresh token stored as httpOnly cookie + hash stored in database
6. Protected routes validate access token via `validateAccess()` middleware
7. Token refresh via `POST /api/auth/refresh` using refresh token

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
Most endpoints require authentication. Include the access token in the `Authorization` header:
```
Authorization: Bearer <your-access-token>
```

Refresh tokens are automatically sent via httpOnly cookies.

### Endpoint Categories

#### Authentication Endpoints (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login and receive tokens
- `POST /logout` - Logout (invalidates refresh token)
- `POST /password-reset` - Request password reset email
- `POST /password-reset/:confirm_token` - Confirm password reset
- `POST /email-confirm/:confirm_token` - Confirm email address
- `POST /refresh` - Refresh access token

#### User Endpoints (`/api/users`)
- `GET /` - List all users (paginated)
- `GET /:user_id` - Get user by ID (public data)
- `POST /` - Create user (admin only)
- `PATCH /avatar` - Upload/update avatar
- `PATCH /:user_id` - Update user (self or admin)
- `DELETE /admin/users/:user_id` - Delete user (admin only)

#### Post Endpoints (`/api/posts`)
- `GET /` - List posts (supports pagination, filters, sorting)
- `GET /:post_id` - Get single post with images
- `GET /myposts/:user_id` - Get user's posts
- `GET /:post_id/comments` - Get post comments
- `GET /:post_id/categories` - Get post categories
- `GET /:post_id/like` - Get like stats
- `GET /:post_id/images` - Get post images
- `POST /` - Create post with images (multipart/form-data)
- `POST /:post_id/comments` - Add comment
- `POST /:post_id/like` - Like/dislike post
- `POST /:post_id/favorite` - Favorite post
- `POST /:post_id/subscribe` - Subscribe to updates
- `POST /admin/posts/:post_id/ban` - Ban/unban post (admin)
- `PATCH /:post_id` - Update post (author only)
- `DELETE /:post_id` - Delete post (author or admin)
- `DELETE /:post_id/like` - Remove like
- `DELETE /:post_id/favorite` - Remove favorite
- `DELETE /:post_id/subscribe` - Unsubscribe

#### Comment Endpoints (`/api/comments`)
- `GET /:comment_id` - Get comment by ID
- `GET /:comment_id/like` - Get comment like stats
- `POST /:comment_id/like` - Like/dislike comment
- `PATCH /:comment_id` - Update comment (author only)
- `DELETE /:comment_id` - Delete comment (author or admin)
- `DELETE /:comment_id/like` - Remove like from comment

#### Category Endpoints (`/api/categories`)
- `GET /` - List all categories
- `GET /admin/categories/:category_id` - Get category (admin)
- `GET /admin/categories/:category_id/posts` - Get category posts (admin)
- `POST /admin/categories` - Create category (admin)
- `PATCH /admin/categories/:category_id` - Update category (admin)
- `DELETE /admin/categories/:category_id` - Delete category (admin)

#### Notification Endpoints (`/api/notifications`)
- `GET /` - Get user notifications
- `DELETE /posts/:post_id` - Delete specific notification
- `DELETE /` - Delete all notifications

For detailed API documentation including request/response examples, see [DOCUMENTATION.md](./docs/DOCUMENTATION.md)

## Database Schema

The application uses a MySQL relational database with 10 interconnected tables designed to support a full-featured Q&A platform.

### Database Structure

![Database Schema Diagram](./docs/db-diagram.png)

### Tables Overview

The database consists of the following tables:

- **users** - User accounts with authentication, roles (user/admin), avatars, and reputation ratings
- **posts** - User-created posts/questions with content, status (active/inactive), ban status, and rating
- **categories** - Topic categorization for organizing posts
- **post_categories** - Many-to-many junction table linking posts to categories
- **comments** - Nested comment system supporting threaded discussions on posts
- **likes** - Like/dislike reactions for both posts and comments with vote type tracking
- **favorite** - User bookmarks for saving favorite posts
- **refresh_tokens** - Secure session management with hashed refresh tokens and expiration
- **subscription** - Post subscription system for users to follow updates
- **notification** - User notification queue for subscribed post updates

### Key Relationships

- Users can create multiple posts and comments (one-to-many)
- Posts can belong to multiple categories (many-to-many via post_categories)
- Comments support nesting through self-referential parent_id relationship
- Likes can target either posts or comments (polymorphic association)
- Users can subscribe to posts and receive notifications on updates
- All foreign keys use CASCADE deletion for referential integrity

For detailed table schemas, field descriptions, indexes, and constraints, see the [comprehensive documentation](./docs/DOCUMENTATION.md#database-structure).

## Documentation

For comprehensive documentation including:
- CBL progress stages (6 stages of development)
- Detailed architecture explanation
- Algorithm descriptions
- Complete database schema with field specifications
- API endpoint specifications with request/response examples
- Implementation patterns and best practices
- Security considerations
- Performance optimizations
- Testing strategies

Please refer to [DOCUMENTATION.md](./docs/DOCUMENTATION.md)

## Frontend Integration

This backend is designed to work with the USOF Frontend (React SPA). To run the full stack:

1. Start the backend: `npm run dev` (in UsofB/)
2. Start the frontend: `npm run dev` (in UsofF/)
3. Access the application at `http://localhost:5173`

The backend is configured to:
- Accept CORS requests from `http://localhost:5173`
- Send cookies with `SameSite=None` for cross-origin requests
- Serve static files from `/public` directory

## Author

- **Name:** Rostyslav Bryhynets
- **Project:** USOF Backend - Q&A Platform API
- **GitHub:** [RofaBR](https://github.com/RofaBR)

## License

This project is part of an educational assignment.

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)
- [Zod Documentation](https://zod.dev/)
- [Full Project Documentation](./docs/DOCUMENTATION.md)