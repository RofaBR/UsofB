export const LIKE_QUERIES = {
    DELETE_BY_POST: `DELETE FROM likes WHERE author_id = ? AND post_id = ?`,
    DELETE_BY_COMMENT: `DELETE FROM likes WHERE author_id = ? AND comment_id = ?`,
};