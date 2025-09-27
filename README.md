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
- **Kottster** (admin panel UI for backend management)

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
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
    - Make sure your `.env` file contains the correct database credentials (host, user, password).
    - Run the following command to create all tables and relations:
    ```bash
    npm run db:init
    ```
    - This will execute all SQL files in `/db/sql/` and initialize your database schema.
    If you want to drop and recreate all tables (for example, during development or testing), you can use the reset command:
    ```bash
    npm run db:reset
    ```

    This will remove all existing tables and data, then re-run all SQL migrations to set up a fresh database schema.  
    **Warning:** This will erase all data in your database!

5. **Start the server:**
    ```bash
    npm start
    ```
    The server will run on [http://localhost:8080](http://localhost:8080).

---

## API EndpointsЦ

### Auth
- `POST /api/auth/register` — Register a new user  
- `POST /api/auth/login` — Login and receive tokens  
- `POST /api/auth/logout` — Logout and invalidate refresh token (**authenticated**)  
- `POST /api/auth/password-reset` — Request password reset  
- `POST /api/auth/password-reset/:confirm_token` — Confirm password reset  
- `POST /api/auth/email-confirm/:confirm_token` — Confirm email  
- `POST /api/auth/refresh` — Refresh access token (**authenticated**)  

---

### Users
- `GET /api/users` — List users (**authenticated**)  
- `GET /api/users/:user_id` — Get user by ID (**authenticated**)  
- `POST /api/users` — Create user (**admin only**)  
- `PATCH /api/users/avatar` — Upload/update user avatar (**authenticated**)  
- `PATCH /api/users/:user_id` — Update user (**authenticated, self only**)  
- `PATCH /api/admin/users/:user_id` — Update user (**admin only**)  
- `DELETE /api/admin/users/:user_id` — Delete user (**admin only**)  

---

### Posts
- `GET /api/posts` — List posts (with filters, pagination, sorting, favorites)  
- `GET /api/posts/:post_id` — Get post by ID  
- `GET /api/posts/myposts/:user_id` — Get all posts of a specific user (**authenticated**)  
- `GET /api/posts/:post_id/comments` — Get comments for a post  
- `GET /api/posts/:post_id/categories` — Get categories for a post  
- `GET /api/posts/:post_id/like` — Get like/dislike stats for a post  
- `POST /api/posts` — Create post (**authenticated**)  
- `POST /api/posts/:post_id/comments` — Add comment to a post (**authenticated**)  
- `POST /api/posts/:post_id/like` — Like/dislike a post (**authenticated**)  
- `POST /api/posts/:post_id/favorite` — Favorite a post (**authenticated**)  
- `POST /api/admin/posts/:post_id/ban` — Ban/unban a post (**admin only**)  
- `PATCH /api/posts/:post_id` — Update post (**authenticated, only author**)  
- `DELETE /api/posts/:post_id` — Delete post (**authenticated, only author or admin**)  
- `DELETE /api/posts/:post_id/like` — Remove like/dislike from a post (**authenticated**)  
- `DELETE /api/posts/:post_id/favorite` — Remove favorite from a post (**authenticated**)  

---

### Comments
- `GET /api/comments/:comment_id` — Get comment by ID (**authenticated**)  
- `GET /api/comments/:comment_id/like` — Get like/dislike stats for a comment  
- `POST /api/comments/:comment_id/like` — Like/dislike a comment (**authenticated**)  
- `PATCH /api/comments/:comment_id` — Update comment (**authenticated, only author**)  
- `DELETE /api/comments/:comment_id` — Delete comment (**authenticated, only author or admin**)  
- `DELETE /api/comments/:comment_id/like` — Remove like/dislike from a comment (**authenticated**)  

---

### Categories
- `GET /api/categories` — List categories (**authenticated**)  
- `GET /api/admin/categories/:category_id` — Get category by ID (**admin only**)  
- `GET /api/admin/categories/:category_id/posts` — List posts in a category (**admin only**)  
- `POST /api/admin/categories` — Create category (**admin only**)  
- `PATCH /api/admin/categories/:category_id` — Update category (**admin only**)  
- `DELETE /api/admin/categories/:category_id` — Delete category (**admin only**)  

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
[📄 **Full Documentation**](./docs/DOCUMENTATION.md)

```