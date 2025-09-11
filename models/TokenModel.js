import { TOKEN_QUERIES } from "../db/queries/token_queries.js";
import mysql_pool from "../db/mysql_pool.js"

const TokenModel = {
    async save(userId, tokenHash, expireAt) {
        const [ result ] = await mysql_pool.execute(TOKEN_QUERIES.CREATE, [
            userId,
            tokenHash,
            expireAt
        ]);
        return result.insertId;
    },

    async findByUserID(user_id) {
        return await mysql_pool.execute(TOKEN_QUERIES.FIND_USER_ID, [user_id]);
    },

    async remove(token_hash) {
        await mysql_pool.execute(TOKEN_QUERIES.DELETE, [token_hash]);
    }
};

export default TokenModel;