USE usof;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS delete_expired_tokens
ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM refresh_tokens WHERE expires_at < NOW();