export const SUBSCRIBE_QUERIES = {
    CREATE: `
        INSERT INTO subscription (user_id, post_id)
        VALUES (?, ?)
    `,
    FIND_BY_POST_ID: `SELECT * FROM subscription WHERE post_id = ?`,
    FIND_BY_USER_AND_POST: `SELECT * FROM subscription WHERE user_id = ? AND post_id = ?`,
    DELETE_BY_POST_ID: `DELETE FROM subscription WHERE post_id = ?`,
    DELETE_BY_USER_AND_POST: `DELETE FROM subscription WHERE user_id = ? AND post_id = ?`,
};