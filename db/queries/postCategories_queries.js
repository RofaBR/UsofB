export const POST_CATEGORIES_QUERIES = {
    CREATE: `
        INSERT INTO post_categories (post_id, category_id)
        VALUES (?, ?)
    `,
    FIND_BY_POST_ID: `SELECT * FROM post_categories WHERE post_id = ?`,
    FIND_BY_CATEGORY_ID: `SELECT * FROM post_categories WHERE category_id = ?`,
    DELETE_BY_POST_ID: `DELETE FROM post_categories WHERE post_id = ?`,
};