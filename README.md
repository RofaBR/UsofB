# USOF Backend

A backend API for a question-and-answer service inspired by StackOverflow.  
This project allows users to register, log in, create posts, comment, like, and interact with content.  
Admins can manage users, posts, categories, and comments via admin-only endpoints.

---

## Features

- **User Authentication:** Register, login, JWT-based authentication, password reset, email confirmation.
- **User Roles:** Regular users and admins with role-based access control.
- **Posts:** Create, read, update, delete, like/dislike, favorite, and ban posts.
- **Comments:** Add, edit, delete, and like/dislike comments.
- **Categories:** Organize posts by categories.
- **Likes & Favorites:** Like/dislike posts and comments, favorite posts.
- **Admin Panel:** Admin endpoints for managing users, posts, and categories.
- **Validation:** Request validation using Zod schemas.
- **Pagination & Filtering:** Paginated endpoints for posts with filtering and sorting.

---

## Tech Stack

- **Node.js** (Express)
- **MySQL** (with `mysql2` driver)
- **Zod** (validation)
- **JWT** (authentication)
- **dotenv** (environment variables)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL server

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/RofaBR/UsofB.git
    cd usof-backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and fill in your database and JWT secrets.

> **Important:**  
> Before running the project, make sure to carefully read the `.env.example` file.  
> Copy it to `.env` and fill in all required environment variables (such as database credentials, JWT secrets, etc.) for the application to work correctly.

4. **Set up the database:**
    - Import the SQL files in `/db/sql/` into your MySQL database:
      ```bash
      mysql -u youruser -p < db/sql/users.sql
      mysql -u youruser -p < db/sql/post.sql
      mysql -u youruser -p < db/sql/categories.sql
      mysql -u youruser -p < db/sql/like.sql
      # ...and any others
      ```

5. **Start the server:**
    ```bash
    npm start
    ```
    The server will run on [http://localhost:8080](http://localhost:8080).

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive tokens
- `POST /api/auth/logout` — Logout and invalidate refresh token
- `POST /api/auth/password-reset` — Request password reset
- `POST /api/auth/password-reset/:confirm_token` — Confirm password reset
- `POST /api/auth/email-confirm/:confirm_token` — Confirm email
- `POST /api/auth/refresh` — Refresh access token

### Users

- `GET /api/users` — List users (admin only)
- `GET /api/users/:user_id` — Get user by ID
- `POST /api/users` — Create user (admin only)
- `PATCH /api/users/:user_id` — Update user
- `DELETE /api/admin/users/:user_id` — Delete user (admin only)

### Posts

- `GET /api/posts` — List posts (with filters, pagination)
- `GET /api/posts/:post_id` — Get post by ID
- `POST /api/posts` — Create post
- `PATCH /api/posts/:post_id` — Update post
- `DELETE /api/posts/:post_id` — Delete post
- `POST /api/posts/:post_id/like` — Like/dislike post
- `POST /api/posts/:post_id/favorite` — Favorite post

### Comments

- `GET /api/posts/:post_id/comments` — List comments for a post
- `POST /api/posts/:post_id/comments` — Add comment to a post
- `PATCH /api/comments/:comment_id` — Edit comment
- `DELETE /api/comments/:comment_id` — Delete comment
- `POST /api/comments/:comment_id/like` — Like/dislike comment

### Categories

- `GET /api/categories` — List categories
- `POST /api/categories` — Create category (admin only)

---

## Project Structure

```
/db/sql/           # SQL schema files
/models/           # Database models
/routes/           # Express route definitions
/controllers/      # Request handlers
/services/         # Business logic
/schemas/          # Zod validation schemas
/middlewares/      # Express middlewares
```