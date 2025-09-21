export const LIKE_QUERIES = {
    DELETE: `DELETE FROM likes WHERE author_id = ? AND target_id = ? AND target_type = ?`,
};