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

    async findByHash(token_hash) {
        const [ rows ] = await mysql_pool.execute(TOKEN_QUERIES.FIND_BY_HASH, [token_hash]);
        return rows[0];
    },

    async remove(token_hash) {
        await mysql_pool.execute(TOKEN_QUERIES.DELETE, [token_hash]);
    }
};

export default TokenModel;