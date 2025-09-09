USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT 'def_avatar.png',
    rating INT NOT NULL DEFAULT 0,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);