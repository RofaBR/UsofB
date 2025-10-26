# CBL Progress & Backend Documentation

## CBL Progress

### Stage 1: Requirements Analysis & Planning
- Defined the main features: user authentication, posts, comments, likes, categories, and admin panel.
- Designed the initial database schema for **users**, **posts**, **categories**, and **likes**.
- Selected the tech stack: **Node.js**, **Express**, **MySQL**, **Zod**, **JWT**.
- Established project architecture following **layered pattern** (Routes → Controllers → Services → Models).
- Created initial project structure with ES modules support.

### Stage 2: Database & Basic API
- Implemented SQL schema files for all main entities with proper foreign key relationships.
- Configured database connection pooling using **mysql2/promise** for better performance.
- Created **BaseModel** as a factory pattern for generic CRUD operations.
- Developed initial REST API endpoints for **users**, **posts**, and **categories**.
- Set up database initialization script (`db:init`) for automated schema creation.
- Implemented environment variable management with **dotenv**.

### Stage 3: Authentication & Authorization
- Added JWT-based authentication with **access tokens** (short-lived) and **refresh tokens** (long-lived).
- Implemented **role-based access control** with two roles: user and admin.
- Built comprehensive middlewares:
  - `validateAccess()` - Requires valid JWT in Authorization header
  - `validateRefresh()` - Validates refresh token from httpOnly cookies
  - `validateOptionalAccess()` - Optional authentication (sets req.user if authenticated)
  - `requireRole(role)` - Restricts endpoints to specific roles
- Created secure refresh token system with hashed tokens stored in database.
- Implemented email confirmation workflow using temporary tokens.
- Added password reset functionality with time-limited tokens.

### Stage 4: Advanced Features
- Created endpoints for **likes/dislikes** supporting both posts and comments.
- Implemented **favorites** system allowing users to bookmark posts.
- Added **post banning** functionality for admins.
- Implemented **pagination, filtering, and sorting** for posts:
  - Page-based pagination with configurable limit
  - Filter by status (active/inactive)
  - Filter by categories (multiple)
  - Sort by date or rating
  - Favorites-only filter
- Integrated **Zod** for comprehensive request validation with detailed error messages.
- Enhanced error handling with standardized JSON responses.

### Stage 5: Admin & User Experience
- Added **admin-only endpoints** for managing users, posts, and categories.
- Enhanced validation schemas with more detailed rules and custom error messages.
- Improved overall security with proper authorization checks.
- Implemented **password reset** workflow with email notifications.
- Created **email confirmation** system for new user registration.
- Added user avatar upload functionality.
- Implemented comprehensive user profile management.

### Stage 6: Advanced Features & Media Support
- Implemented **post subscription system** allowing users to follow post updates.
- Created **notification system** for alerting subscribers when posts are updated:
  - Automatic notification creation on post updates
  - Subscribers notified (except post author)
  - Simple deletion-based notification management
- Added **file system-based image upload** for posts:
  - Support for multiple images per post (up to 10)
  - Multipart/form-data handling with multer
  - Organized storage: `public/uploads/posts/{post_id}/`
  - Image format validation (JPG, PNG, GIF, WEBP, BMP)
  - File size limits (5MB per image)
- Enhanced post management:
  - Automatic image cleanup on post deletion
  - Image replacement on post update
  - Image URL generation for API responses
- Implemented directory structure management for uploaded files.

---

## Program Structure and Algorithm Overview

### Detailed Project Structure

```
UsofB/
├── app.js                          # Express app setup, middleware, routes
│
├── db/
│   ├── sql/                        # Database schema files (executed in order)
│   │   ├── users.sql
│   │   ├── posts.sql
│   │   ├── categories.sql
│   │   ├── post_categories.sql
│   │   ├── comments.sql
│   │   ├── likes.sql
│   │   ├── favorites.sql
│   │   ├── refresh_tokens.sql
│   │   ├── subscription.sql
│   │   └── notification.sql
│   ├── init.js                     # Database initialization script
│   └── mysql_pool.js               # Connection pool configuration
│
├── models/                         # Data access layer
│   ├── BaseModel.js                # Factory for generic CRUD operations
│   ├── UserModel.js                # User data access
│   ├── PostModel.js                # Post data access with joins
│   ├── CommentModel.js             # Comment data access
│   ├── CategoryModel.js            # Category data access
│   ├── LikeModel.js                # Like/dislike data access
│   ├── FavoriteModel.js            # Favorite data access
│   ├── RefreshTokenModel.js        # Token management
│   ├── SubscriptionModel.js        # Post subscription data
│   └── NotificationModel.js        # Notification data access
│
├── routes/                         # API endpoint definitions
│   ├── authRoutes.js               # /api/auth/* endpoints
│   ├── userRoutes.js               # /api/users/* endpoints
│   ├── postRoutes.js               # /api/posts/* endpoints
│   ├── commentRoutes.js            # /api/comments/* endpoints
│   ├── categoryRoutes.js           # /api/categories/* endpoints
│   └── notificationRoutes.js       # /api/notifications/* endpoints
│
├── controllers/                    # Request/response handlers
│   ├── AuthController.js           # Auth operations
│   ├── UserController.js           # User CRUD operations
│   ├── PostController.js           # Post CRUD + interactions
│   ├── CommentController.js        # Comment CRUD + likes
│   ├── CategoryController.js       # Category management
│   └── NotificationController.js   # Notification management
│
├── services/                       # Business logic layer
│   ├── AuthService.js              # Authentication logic, JWT generation
│   ├── UserService.js              # User business logic
│   ├── PostService.js              # Post business logic + subscriptions
│   ├── CommentService.js           # Comment business logic
│   ├── CategoryService.js          # Category business logic
│   └── NotificationService.js      # Notification creation logic
│
├── schemas/                        # Zod validation schemas
│   ├── authSchema.js               # Login, register, password reset
│   ├── userSchema.js               # User create, update
│   ├── postSchema.js               # Post create, update, filters
│   ├── commentSchema.js            # Comment create, update
│   └── categorySchema.js           # Category create, update
│
├── middlewares/                    # Express middlewares
│   ├── tokenMiddleware.js          # JWT validation (3 functions)
│   ├── baseMiddleware.js           # Zod schema validation wrapper
│   ├── requireRole.js              # Role-based access control
│   ├── avatarMiddleware.js         # Single file upload (avatars)
│   └── postImagesMiddleware.js     # Multiple file upload (post images)
│
├── public/                         # Static files served by Express
│   └── uploads/                    # User-uploaded files
│       ├── avatars/                # User avatars
│       │   └── {user_id}_avatar.ext
│       └── posts/                  # Post images
│           └── {post_id}/          # Images for specific post
│               ├── image1.jpg
│               └── image2.png
│
├── utils/                          # Helper functions
│   └── emailService.js             # Email sending utilities (Resend)
│
├── kottster-admin/                 # Admin panel (separate React app)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── docs/                           # Documentation
│   ├── DOCUMENTATION.md            # This file
│   └── db-diagram.png              # Database schema visualization
│
├── .env.example                    # Example environment variables
├── .env                            # Actual environment variables (gitignored)
├── .gitignore                      # Git ignore file
├── package.json                    # Dependencies and scripts
└── README.md                       # Main README
```

---

## Algorithm Overview

### 1. Application Initialization

**Startup Sequence:**
```
1. Load environment variables (.env)
   ↓
2. Import dependencies and modules
   ↓
3. Create Express app instance
   ↓
4. Configure middleware stack:
   - CORS (allow frontend origin)
   - JSON body parser
   - URL-encoded parser
   - Cookie parser
   - Static file serving (public/)
   ↓
5. Initialize database connection pool
   ↓
6. Register API routes:
   - /api/auth
   - /api/users
   - /api/posts
   - /api/comments
   - /api/categories
   - /api/notifications
   ↓
7. Start HTTP server on port 8080
   ↓
8. Log "Server running" message
```

**Key Code (app.js):**
```javascript
// Middleware setup
app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

// Route registration
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/notifications", notificationRoutes)
```

### 2. Request Handling Pipeline

**Middleware Chain:**
```
Client Request
  ↓
CORS Middleware (check origin)
  ↓
Body Parser (parse JSON/URL-encoded)
  ↓
Cookie Parser (extract cookies)
  ↓
Route Matcher (find matching route)
  ↓
Route-Specific Middlewares:
  ├── Zod Validation (baseMiddleware)
  ├── JWT Validation (tokenMiddleware)
  ├── Role Check (requireRole)
  └── File Upload (multer middlewares)
  ↓
Controller Function
  ↓
Service Layer (business logic)
  ↓
Model Layer (database query)
  ↓
Database Execution
  ↓
Response sent to client
```

**Example Flow for Creating a Post:**
```
POST /api/posts
  ↓
1. postImagesMiddleware.upload() - Handle multipart form data
  ↓
2. validator.validate(postSchema.create) - Validate title, content, categories
  ↓
3. validateAccess() - Check JWT token, set req.user
  ↓
4. PostController.createPost()
   - Extract data from req.body
   - Extract files from req.files
   - Call PostService.createPost()
  ↓
5. PostService.createPost()
   - Validate author exists
   - Create post in database
   - Create post-category associations
   - Save uploaded images
   - Generate image URLs
  ↓
6. PostModel.create() - Execute INSERT query
  ↓
7. Return post with images to client
```

### 3. Authentication & Authorization Algorithm

#### Registration Flow
```
POST /api/auth/register
  ↓
1. Validate input (email, login, password, full_name)
  ↓
2. Check if email/login already exists
  ↓
3. Hash password with bcrypt (10 rounds)
  ↓
4. Insert user into database (role: user, email_confirmed: false)
  ↓
5. Generate email confirmation token
  ↓
6. Store token in users.user_token field
  ↓
7. Send confirmation email via Resend API
  ↓
8. Return success message
```

#### Login Flow
```
POST /api/auth/login
  ↓
1. Validate input (email, password)
  ↓
2. Find user by email
  ↓
3. Check if user exists
  ↓
4. Check if email is confirmed
  ↓
5. Compare password hash with bcrypt.compare()
  ↓
6. If valid:
   a. Generate access token (JWT, expires in 15 minutes)
      - Payload: { userId, role }
      - Sign with JWT_SECRET
   b. Generate refresh token (JWT, expires in 7 days)
      - Payload: { userId }
      - Sign with JWT_REFRESH_SECRET
   c. Hash refresh token with SHA-256
   d. Store hash in refresh_tokens table
   e. Set refresh token as httpOnly cookie
   f. Return access token + user data in response
  ↓
7. Client stores access token in memory
  ↓
8. Client uses access token in Authorization header for subsequent requests
```

#### Token Refresh Flow
```
POST /api/auth/refresh
  ↓
1. Extract refresh token from httpOnly cookie
  ↓
2. Verify token signature with JWT_REFRESH_SECRET
  ↓
3. Hash token and check if hash exists in database
  ↓
4. If valid:
   a. Generate new access token (15 min expiry)
   b. Return new access token + user data
  ↓
5. Client updates access token in memory
```

#### Authorization Check
```
Protected Endpoint Request
  ↓
1. validateAccess() middleware runs
  ↓
2. Extract Authorization header
  ↓
3. Check format: "Bearer <token>"
  ↓
4. Verify token with JWT_SECRET
  ↓
5. If valid:
   - Set req.user = { userId, role }
   - Call next()
  ↓
6. If requireRole() middleware:
   - Check req.user.role === required role
   - If not, return 403 Forbidden
  ↓
7. Controller accesses req.user for user data
```

### 4. Post Management Algorithm

#### Create Post with Images
```
POST /api/posts (multipart/form-data)
  ↓
1. postImagesMiddleware processes files:
   - Accepts up to 10 images
   - Each image max 5MB
   - Allowed formats: jpg, jpeg, png, gif, bmp, webp
   - Stores temporarily in memory
  ↓
2. Validate post data (title, content, status, categories)
  ↓
3. Authenticate user (validateAccess)
  ↓
4. PostController.createPost():
   - Extract author_id from req.user
   - Call PostService.createPost()
  ↓
5. PostService.createPost():
   a. Start transaction (if needed)
   b. Insert post into posts table
   c. Get new post_id
   d. Create directory: public/uploads/posts/{post_id}/
   e. For each image:
      - Generate unique filename
      - Save to directory
      - Store path in database
   f. Insert post-category associations
   g. Commit transaction
  ↓
6. Return post object with image URLs
```

#### Get Posts with Pagination & Filters
```
GET /api/posts?page=1&limit=10&sort=rating&categories=1,2&status=active
  ↓
1. Extract query parameters
  ↓
2. Validate parameters with Zod
  ↓
3. Optional authentication (validateOptionalAccess)
  ↓
4. PostController.getAllPosts():
   - Build filters object
   - Call PostService.getAllPosts()
  ↓
5. PostService.getAllPosts():
   - Calculate offset: (page - 1) * limit
   - Build SQL query with:
     * JOINs (users, categories, likes, favorites)
     * WHERE clauses (status, categories)
     * GROUP BY (for aggregates)
     * ORDER BY (rating or date)
     * LIMIT and OFFSET (pagination)
   - Execute query
   - Count total matching posts
   - Calculate total pages
  ↓
6. Return {
     posts: [...],
     pagination: {
       currentPage,
       totalPages,
       totalPosts,
       limit
     }
   }
```

#### Like/Dislike Algorithm
```
POST /api/posts/:post_id/like
Body: { type: "like" | "dislike" }
  ↓
1. Authenticate user
  ↓
2. Validate post_id and type
  ↓
3. PostController.likePost():
   - Call PostService.likePost()
  ↓
4. PostService.likePost():
   a. Check if post exists
   b. Check if user already liked/disliked post
   c. If existing like:
      - Same type → Remove like (unlike)
      - Different type → Update type (change vote)
   d. If no existing like:
      - Insert new like
   e. Recalculate post rating:
      - rating = (likes count) - (dislikes count)
      - Update posts.rating field
  ↓
5. Return updated like status
```

### 5. Subscription & Notification Algorithm

#### Subscribe to Post
```
POST /api/posts/:post_id/subscribe
  ↓
1. Authenticate user
  ↓
2. Validate post exists
  ↓
3. PostController.subscribeToPost():
   - Call PostService.subscribeToPost()
  ↓
4. PostService.subscribeToPost():
   - Check if already subscribed
   - If not, insert into subscription table (user_id, post_id)
  ↓
5. Return success message
```

#### Post Update → Notification Creation
```
PATCH /api/posts/:post_id
  ↓
1. Authenticate user (must be author)
  ↓
2. Update post content
  ↓
3. PostService.updatePost():
   a. Update post in database
   b. Call NotificationService.createNotifications()
  ↓
4. NotificationService.createNotifications():
   a. Get all subscribers of the post
   b. Filter out post author (don't notify yourself)
   c. For each subscriber:
      - Insert into notification table (user_id, post_id)
      - If notification already exists, skip (unique constraint)
  ↓
5. Return updated post
```

#### Get Notifications
```
GET /api/notifications
  ↓
1. Authenticate user
  ↓
2. NotificationController.getNotifications():
   - Call NotificationService.getUserNotifications()
  ↓
3. NotificationService.getUserNotifications():
   - Query notifications table
   - JOIN with posts table to get post details
   - Filter by user_id
   - Order by most recent
  ↓
4. Return array of notifications:
   [
     {
       post_id,
       post_title,
       post_author,
       updated_at
     },
     ...
   ]
```

### 6. Comment System Algorithm

#### Create Comment
```
POST /api/posts/:post_id/comments
Body: { content, parent_id? }
  ↓
1. Authenticate user
  ↓
2. Validate post exists
  ↓
3. If parent_id provided:
   - Validate parent comment exists
   - Ensure parent belongs to same post
  ↓
4. CommentController.createComment():
   - Call CommentService.createComment()
  ↓
5. CommentService.createComment():
   - Insert comment into comments table
   - Set author_id, post_id, parent_id
  ↓
6. Return created comment
```

#### Get Comments (Nested Structure)
```
GET /api/posts/:post_id/comments
  ↓
1. Optional authentication
  ↓
2. CommentController.getPostComments():
   - Call CommentService.getPostComments()
  ↓
3. CommentService.getPostComments():
   a. Query all comments for post
   b. JOIN with users table (for author info)
   c. JOIN with likes table (for like counts)
   d. Order by create_at ASC
   e. Build tree structure:
      - Root comments (parent_id = NULL)
      - Child comments nested under parent
  ↓
4. Return hierarchical comment structure:
   [
     {
       id, author, content, created_at,
       likes, dislikes,
       replies: [
         { id, author, content, ... },
         ...
       ]
     },
     ...
   ]
```

### 7. Database Query Pattern

**BaseModel Factory Pattern:**
```javascript
export function createModel(tableName, schema) {
  return {
    create: async (data) => {
      const [result] = await pool.execute(
        `INSERT INTO ${tableName} SET ?`,
        [data]
      )
      return result.insertId
    },

    findById: async (id) => {
      const [rows] = await pool.execute(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id]
      )
      return rows[0]
    },

    update: async (id, data) => {
      await pool.execute(
        `UPDATE ${tableName} SET ? WHERE id = ?`,
        [data, id]
      )
    },

    delete: async (id) => {
      await pool.execute(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [id]
      )
    },

    findAll: async (filters = {}) => {
      const [rows] = await pool.execute(
        `SELECT * FROM ${tableName}`
      )
      return rows
    }
  }
}
```

**Usage in Models:**
```javascript
// UserModel.js
import { createModel } from './BaseModel.js'

const baseModel = createModel('users', userSchema)

export const UserModel = {
  ...baseModel, // Inherit generic methods

  // Custom method
  findByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }
}
```

### 8. Validation Pattern

**Zod Schema Definition:**
```javascript
// postSchema.js
import { z } from 'zod'

export const postSchema = {
  create: z.object({
    title: z.string()
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title too long"),
    content: z.string()
      .min(10, "Content must be at least 10 characters"),
    status: z.enum(['active', 'inactive']).optional(),
    categories: z.array(z.number().positive()).optional()
  }),

  update: z.object({
    title: z.string().min(3).max(255).optional(),
    content: z.string().min(10).optional(),
    status: z.enum(['active', 'inactive']).optional()
  })
}
```

**Validation Middleware:**
```javascript
// baseMiddleware.js
export const validator = {
  validate: (schema) => (req, res, next) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated // Replace with validated data
      next()
    } catch (err) {
      return res.status(400).json({
        status: 'Fail',
        type: 'Validation Error',
        message: err.errors
      })
    }
  }
}
```

**Usage in Routes:**
```javascript
router.post(
  '/',
  postImagesMiddleware.upload(),
  validator.validate(postSchema.create),
  validateAccess(),
  PostController.createPost
)
```

---

## Database Structure

The application uses a **MySQL relational database** with 10 interconnected tables.

### Database Diagram

![Database Diagram](./db-diagram.png)

### Table Descriptions

#### `users`
**Purpose**: Store user accounts and authentication data

| Field           | Type                 | Constraints           | Description                          |
|-----------------|----------------------|-----------------------|--------------------------------------|
| id              | INT                  | PK, AUTO_INCREMENT    | Unique user identifier               |
| login           | VARCHAR(50)          | UNIQUE, NOT NULL      | Username (unique)                     |
| password        | VARCHAR(255)         | NOT NULL              | Bcrypt hashed password                |
| full_name       | VARCHAR(255)         | NOT NULL              | User's full name                      |
| email           | VARCHAR(255)         | UNIQUE, NOT NULL      | User's email (unique)                 |
| avatar          | VARCHAR(255)         | DEFAULT 'def_avatar.png' | Profile avatar filename           |
| rating          | INT                  | DEFAULT 0             | Reputation / rating                   |
| role            | ENUM('admin','user') | DEFAULT 'user'        | User role for RBAC                    |
| user_token      | VARCHAR(255)         | NULL                  | Temporary token for reset/confirm     |
| email_confirmed | TINYINT(1)           | DEFAULT 0             | Email confirmation status             |

**Indexes**: `id` (PK), `login` (UNIQUE), `email` (UNIQUE)

---

#### `posts`
**Purpose**: Store user-created posts/questions

| Field        | Type                      | Constraints              | Description                     |
|--------------|---------------------------|--------------------------|---------------------------------|
| id           | INT                       | PK, AUTO_INCREMENT       | Unique post identifier          |
| author_id    | INT                       | FK → users.id, NOT NULL  | Post author                     |
| title        | VARCHAR(255)              | NOT NULL                 | Post title                      |
| publish_date | TIMESTAMP                 | DEFAULT CURRENT_TIMESTAMP| Creation date                   |
| status       | ENUM('active','inactive') | DEFAULT 'active'         | Post visibility status          |
| content      | TEXT                      | NOT NULL                 | Post body                       |
| rating       | INT                       | DEFAULT 0                | Post rating (likes - dislikes)  |
| ban_status   | TINYINT(1)                | DEFAULT 0                | Admin ban flag                  |

**Indexes**: `id` (PK), `author_id` (FK, INDEX)

**Constraints**:
- `FK_author`: `author_id` REFERENCES `users(id)` ON DELETE CASCADE

---

#### `categories`
**Purpose**: Organize posts by topic

| Field       | Type         | Constraints        | Description            |
|-------------|--------------|--------------------|------------------------|
| id          | INT          | PK, AUTO_INCREMENT | Unique category ID     |
| title       | VARCHAR(255) | NOT NULL           | Category title         |
| description | TEXT         | NULL               | Category description   |

**Indexes**: `id` (PK)

---

#### `post_categories`
**Purpose**: Many-to-many relationship between posts and categories

| Field       | Type | Constraints                     | Description                  |
|-------------|------|---------------------------------|------------------------------|
| post_id     | INT  | FK → posts.id, PK (composite)   | Post reference               |
| category_id | INT  | FK → categories.id, PK (composite) | Category reference       |

**Composite Primary Key**: (`post_id`, `category_id`)

**Constraints**:
- `FK_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE
- `FK_category`: `category_id` REFERENCES `categories(id)` ON DELETE CASCADE

---

#### `comments`
**Purpose**: User comments on posts (supports nesting)

| Field     | Type      | Constraints              | Description             |
|-----------|-----------|--------------------------|-------------------------|
| id        | INT       | PK, AUTO_INCREMENT       | Unique comment ID       |
| author_id | INT       | FK → users.id, NOT NULL  | Comment author          |
| post_id   | INT       | FK → posts.id, NOT NULL  | Parent post             |
| parent_id | INT       | FK → comments.id, NULL   | Parent comment (for nesting) |
| create_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP| Date of comment         |
| content   | TEXT      | NOT NULL                 | Comment text            |

**Indexes**: `id` (PK), `author_id` (FK, INDEX), `post_id` (FK, INDEX), `parent_id` (FK, INDEX)

**Constraints**:
- `FK_comment_author`: `author_id` REFERENCES `users(id)` ON DELETE CASCADE
- `FK_comment_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE
- `FK_parent_comment`: `parent_id` REFERENCES `comments(id)` ON DELETE CASCADE

---

#### `likes`
**Purpose**: Track like/dislike reactions on posts and comments

| Field      | Type                   | Constraints              | Description                                |
|------------|------------------------|--------------------------|--------------------------------------------|
| id         | INT                    | PK, AUTO_INCREMENT       | Unique like ID                             |
| author_id  | INT                    | FK → users.id, NOT NULL  | User who reacted                           |
| post_id    | INT                    | FK → posts.id, NULL      | Target post (if reaction on post)          |
| comment_id | INT                    | FK → comments.id, NULL   | Target comment (if reaction on comment)    |
| type       | ENUM('like','dislike') | NOT NULL                 | Reaction type                              |
| created_at | TIMESTAMP              | DEFAULT CURRENT_TIMESTAMP| Reaction timestamp                         |

**Indexes**:
- `id` (PK)
- `author_id` (FK, INDEX)
- `post_id` (FK, INDEX)
- `comment_id` (FK, INDEX)

**Unique Constraints**:
- `UNIQUE(author_id, post_id)` - One reaction per user per post
- `UNIQUE(author_id, comment_id)` - One reaction per user per comment

**Constraints**:
- Exactly one of `post_id` or `comment_id` must be non-NULL (CHECK constraint)
- `FK_like_author`: `author_id` REFERENCES `users(id)` ON DELETE CASCADE
- `FK_like_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE
- `FK_like_comment`: `comment_id` REFERENCES `comments(id)` ON DELETE CASCADE

---

#### `favorite`
**Purpose**: Track user's favorite posts

| Field   | Type | Constraints                            | Description               |
|---------|------|----------------------------------------|---------------------------|
| user_id | INT  | FK → users.id, PK (composite)          | User reference            |
| post_id | INT  | FK → posts.id, PK (composite)          | Post reference            |

**Composite Primary Key**: (`user_id`, `post_id`)

**Constraints**:
- `FK_favorite_user`: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- `FK_favorite_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE

---

#### `refresh_tokens`
**Purpose**: Store hashed refresh tokens for session management

| Field      | Type      | Constraints              | Description                      |
|------------|-----------|--------------------------|----------------------------------|
| id         | INT       | PK, AUTO_INCREMENT       | Unique token record ID           |
| user_id    | INT       | FK → users.id, NOT NULL  | Token owner                      |
| token_hash | CHAR(64)  | NOT NULL                 | SHA-256 hash of refresh token    |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP| When the token was created       |
| expires_at | TIMESTAMP | NOT NULL                 | When the token expires           |

**Indexes**: `id` (PK), `user_id` (FK, INDEX), `token_hash` (INDEX)

**Constraints**:
- `FK_token_user`: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

#### `subscription`
**Purpose**: Track post subscriptions for notifications

| Field   | Type | Constraints                            | Description               |
|---------|------|----------------------------------------|---------------------------|
| user_id | INT  | FK → users.id, PK (composite)          | Subscriber                |
| post_id | INT  | FK → posts.id, PK (composite)          | Subscribed post           |

**Composite Primary Key**: (`user_id`, `post_id`)

**Constraints**:
- `FK_subscription_user`: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- `FK_subscription_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE

---

#### `notification`
**Purpose**: Store user notifications for post updates

| Field   | Type | Constraints                            | Description               |
|---------|------|----------------------------------------|---------------------------|
| user_id | INT  | FK → users.id, PK (composite)          | Notification recipient    |
| post_id | INT  | FK → posts.id, PK (composite)          | Post that was updated     |

**Composite Primary Key**: (`user_id`, `post_id`)

**Constraints**:
- `FK_notification_user`: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- `FK_notification_post`: `post_id` REFERENCES `posts(id)` ON DELETE CASCADE

**Note**: Simple notification system - notifications are created when subscribed posts update and deleted when viewed. No read/unread states.

---

## API Endpoint Specifications

### Response Format

All API endpoints return JSON responses in the following format:

**Success Response:**
```json
{
  "status": "Success",
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "status": "Fail",
  "type": "Error type (e.g., Validation Error, Auth Error)",
  "message": "Error description or validation errors array"
}
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "login": "username",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "status": "Success",
  "message": "Registration successful. Please check your email to confirm."
}
```

---

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "status": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

**Sets Cookie:**
- `refreshToken`: httpOnly, secure, sameSite=None

---

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Requirements:**
- Valid refresh token in cookie

**Response (200):**
```json
{
  "status": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1
    }
  }
}
```

---

### Post Endpoints

#### GET /api/posts
Get paginated list of posts with filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sort` ("date" | "rating", default: "date")
- `status` ("active" | "inactive")
- `categories` (comma-separated IDs: "1,2,3")
- `favorites` ("true" - requires auth)

**Response (200):**
```json
{
  "status": "Success",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "How to use React hooks?",
        "content": "I'm struggling with...",
        "author": {
          "id": 2,
          "login": "johndoe",
          "avatar": "avatar_url"
        },
        "publish_date": "2025-01-15T10:30:00Z",
        "status": "active",
        "rating": 15,
        "likes": 18,
        "dislikes": 3,
        "images": ["image_url_1", "image_url_2"],
        "categories": ["React", "JavaScript"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 47,
      "limit": 10
    }
  }
}
```

---

#### POST /api/posts
Create a new post with optional images.

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `title` (string, required)
- `content` (string, required)
- `status` (enum: "active" | "inactive", optional)
- `categories` (array of IDs, optional)
- `images` (files, max 10, each max 5MB, optional)

**Response (201):**
```json
{
  "status": "Success",
  "data": {
    "post": {
      "id": 42,
      "title": "New post title",
      "content": "Post content...",
      "author_id": 1,
      "publish_date": "2025-01-15T12:00:00Z",
      "status": "active",
      "rating": 0,
      "images": ["http://localhost:8080/uploads/posts/42/image1.jpg"]
    }
  }
}
```

---

#### POST /api/posts/:post_id/like
Like or dislike a post.

**Authentication:** Required

**Request Body:**
```json
{
  "type": "like"
}
```
or
```json
{
  "type": "dislike"
}
```

**Response (200):**
```json
{
  "status": "Success",
  "data": {
    "like": {
      "id": 123,
      "type": "like",
      "author_id": 1,
      "post_id": 42
    },
    "post_rating": 16
  }
}
```

---

### Comment Endpoints

#### POST /api/posts/:post_id/comments
Add a comment to a post.

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Great question! Here's my answer...",
  "parent_id": null
}
```

**Response (201):**
```json
{
  "status": "Success",
  "data": {
    "comment": {
      "id": 89,
      "author_id": 1,
      "post_id": 42,
      "parent_id": null,
      "content": "Great question!...",
      "create_at": "2025-01-15T12:30:00Z"
    }
  }
}
```

---

## Implementation Patterns

### 1. Error Handling Pattern

**Centralized Error Response:**
```javascript
// In controllers
try {
  const result = await service.method()
  res.status(200).json({
    status: 'Success',
    data: result
  })
} catch (err) {
  console.error(err)
  res.status(err.statusCode || 500).json({
    status: 'Fail',
    type: err.type || 'Server Error',
    message: err.message || 'An unexpected error occurred'
  })
}
```

### 2. Transaction Pattern

**For operations requiring multiple queries:**
```javascript
const connection = await pool.getConnection()
await connection.beginTransaction()

try {
  // Multiple database operations
  await connection.execute('INSERT INTO ...')
  await connection.execute('UPDATE ...')

  await connection.commit()
} catch (err) {
  await connection.rollback()
  throw err
} finally {
  connection.release()
}
```

### 3. File Upload Pattern

**Multer Configuration:**
```javascript
// postImagesMiddleware.js
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

export const postImagesMiddleware = {
  upload: () => upload.array('images', 10)
}
```

### 4. Password Security

**Hashing:**
```javascript
import bcrypt from 'bcrypt'

// Hash password (registration)
const hashedPassword = await bcrypt.hash(password, 10)

// Verify password (login)
const isValid = await bcrypt.compare(password, hashedPassword)
```

### 5. JWT Token Generation

```javascript
import jwt from 'jsonwebtoken'

// Generate access token (15 min)
const accessToken = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
)

// Generate refresh token (7 days)
const refreshToken = jwt.sign(
  { userId },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
)

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

---

## Security Considerations

### 1. SQL Injection Prevention
- **Prepared statements**: All queries use parameterized queries via mysql2
- **Never concatenate SQL** with user input

### 2. Authentication Security
- **Password hashing**: Bcrypt with 10 rounds of salt
- **JWT secrets**: Strong random strings (32+ characters)
- **httpOnly cookies**: Refresh tokens not accessible to JavaScript
- **Token expiration**: Short-lived access tokens, long-lived refresh tokens
- **Token hashing**: Refresh tokens stored as SHA-256 hashes in database

### 3. Authorization
- **Role-based access control**: Admin and user roles
- **Ownership checks**: Users can only edit their own content (except admins)
- **Middleware chain**: validateAccess() → requireRole() → controller

### 4. File Upload Security
- **File type validation**: Only specific image formats allowed
- **File size limits**: 5MB per image, 10 images max
- **Filename sanitization**: Generate unique filenames
- **Storage isolation**: Files stored outside web root with static serving

### 5. CORS Configuration
- **Specific origin**: Only allow configured frontend URL
- **Credentials**: Enable cookie sending
- **No wildcard**: Never use `*` in production

### 6. Input Validation
- **Zod schemas**: Validate all request bodies
- **Type checking**: Ensure correct data types
- **Length limits**: Enforce min/max lengths
- **Enum validation**: Only allow specific values

---

## Performance Optimizations

### 1. Database Connection Pooling
- **mysql2 pool**: Reuse connections instead of creating new ones
- **Configuration**: Set appropriate pool size based on load

### 2. Indexing
- **Primary keys**: On all ID columns
- **Foreign keys**: Indexed for faster JOINs
- **Unique constraints**: On email, login for faster lookups

### 3. Query Optimization
- **SELECT specific columns**: Don't use `SELECT *` in production
- **JOINs**: Use appropriate JOIN types
- **LIMIT clauses**: Always paginate large result sets
- **Aggregate functions**: Use COUNT, SUM efficiently

### 4. File System Optimization
- **Directory structure**: Organize uploads by post ID
- **Static serving**: Use Express static middleware for direct serving
- **Cleanup**: Delete orphaned files when posts are deleted

---

## Testing Strategy

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Confirm email
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Refresh access token
- [ ] Logout

#### Posts
- [ ] Create post without images
- [ ] Create post with images
- [ ] Get all posts (paginated)
- [ ] Filter posts by status
- [ ] Filter posts by categories
- [ ] Sort posts by rating/date
- [ ] Update own post
- [ ] Delete own post
- [ ] Like/dislike post
- [ ] Favorite post

#### Comments
- [ ] Add root comment
- [ ] Add nested comment (reply)
- [ ] Get all post comments
- [ ] Update own comment
- [ ] Delete own comment
- [ ] Like/dislike comment

#### Admin
- [ ] Create category (admin)
- [ ] Ban post (admin)
- [ ] Delete user (admin)
- [ ] Manage categories (admin)

#### Subscriptions & Notifications
- [ ] Subscribe to post
- [ ] Update post (triggers notifications)
- [ ] Get notifications
- [ ] Delete notification
- [ ] Unsubscribe from post

---

## Author
- **Name:** Rostyslav Bryhynets
- **Project:** USOF Backend — Q&A Service API
- **GitHub:** [RofaBR](https://github.com/RofaBR)

## Related Documentation
- [Main README](../README.md)
- [Frontend Documentation](../../UsofF/docs/DOCUMENTATION.md)
- [Database Diagram](./db-diagram.png)
