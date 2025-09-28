export const FAVORITE_QUERIES = {
    CREATE: `
        INSERT INTO favorite (user_id, post_id)
        VALUES (?, ?)
    `,
    FIND_BY_POST_ID: `SELECT * FROM favorite WHERE post_id = ?`,
    FIND_BY_USER_AND_POST: `SELECT * FROM favorite WHERE user_id = ? AND post_id = ?`,
    DELETE_BY_POST_ID: `DELETE FROM favorite WHERE post_id = ?`,
    DELETE_BY_USER_AND_POST: `DELETE FROM favorite WHERE user_id = ? AND post_id = ?`,
};