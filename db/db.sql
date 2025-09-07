CREATE DATABASE IF NOT EXISTS usof;
CREATE USER IF NOT EXISTS 'rbryhynets'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON usof.* TO 'rbryhynets'@'localhost';