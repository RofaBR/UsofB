export const USER_QUERIES = {
    CREATE: `
        INSERT INTO users (login, password, full_name, email, avatar, role, user_token)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    UPDATE: `
        UPDATE users
        SET login = ?, password = ?, full_name = ?, email = ?, avatar = ?, role = ?
        WHERE id = ?
    `,
    UPDATE_RATING: `
        UPDATE users
        SET rating = ?
        WHERE id = ?
    `,
    CALCULATE_USER_RATING: `
        SELECT
            COALESCE(
                (SELECT SUM(CASE WHEN l.type = 'like' THEN 1 ELSE -1 END)
                 FROM likes l
                 INNER JOIN posts p ON l.post_id = p.id
                 WHERE p.author_id = ?), 0) +
            COALESCE(
                (SELECT SUM(CASE WHEN l.type = 'like' THEN 1 ELSE -1 END)
                 FROM likes l
                 INNER JOIN comments c ON l.comment_id = c.id
                 WHERE c.author_id = ?), 0) as total_rating
    `,
    FIND_BY_ID: `SELECT * FROM users WHERE id = ?`,
    FIND_BY_LOGIN: `SELECT * FROM users WHERE login = ?`,
    FIND_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,
    DELETE: `DELETE FROM users WHERE id = ?`,
    GET_USER_STATISTICS: `
        SELECT
            (SELECT COUNT(*) FROM posts WHERE author_id = ?) as posts_count,
            (SELECT COUNT(*) FROM comments WHERE author_id = ?) as comments_count,
            (SELECT rating FROM users WHERE id = ?) as rating
    `,
};