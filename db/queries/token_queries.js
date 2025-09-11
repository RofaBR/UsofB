export const TOKEN_QUERIES = {
    CREATE:`
        INSERT INTO refresh_tokens(user_id, token_hash, expires_at)
        VALUES (?, ?, ?)
    `,
    FIND_BY_HASH:`SELECT * FROM refresh_tokens WHERE token_hash = ?`,
    DELETE: `DELETE FROM refresh_tokens WHERE token_hash = ?`
};