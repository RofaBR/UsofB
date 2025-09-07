USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR() NOT NULL UNIQUE,
    password VARCHAR() NOT NULL,
    full_name VARCHAR() NOT NULL,
    avatar VARCHAR(255) NOT NULL, DEFAULT 'Def_avatar.png',
    rating INT, DEFAULT 0
    role ENUM('admin', 'user') DEFAULT 'user'
)