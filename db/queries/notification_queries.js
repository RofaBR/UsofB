export const NOTIFICATION_QUERIES = {
    CREATE: `
        INSERT INTO notification (user_id, post_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `,
    FIND_BY_USER_ID: `
        SELECT
            n.user_id,
            n.post_id,
            n.updated_at,
            p.title as post_title,
            p.content as post_content,
            p.last_update,
            u.login as author_login,
            u.full_name as author_name
        FROM notification n
        JOIN posts p ON n.post_id = p.id
        JOIN users u ON p.author_id = u.id
        WHERE n.user_id = ?
        ORDER BY n.updated_at DESC
    `,
    FIND_BY_POST_ID: `SELECT * FROM notification WHERE post_id = ?`,
    FIND_BY_USER_AND_POST: `SELECT * FROM notification WHERE user_id = ? AND post_id = ?`,
    DELETE_BY_USER_ID: `DELETE FROM notification WHERE user_id = ?`,
    DELETE_BY_POST_ID: `DELETE FROM notification WHERE post_id = ?`,
    DELETE_BY_USER_AND_POST: `DELETE FROM notification WHERE user_id = ? AND post_id = ?`,
    GET_SUBSCRIBERS_FOR_POST: `
        SELECT DISTINCT s.user_id
        FROM subscription s
        WHERE s.post_id = ? AND s.user_id != ?
    `,
    CREATE_NOTIFICATIONS_FOR_SUBSCRIBERS: `
        INSERT INTO notification (user_id, post_id)
        SELECT s.user_id, s.post_id
        FROM subscription s
        WHERE s.post_id = ? AND s.user_id != ?
        ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `
};