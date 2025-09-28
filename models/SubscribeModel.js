import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import { SUBSCRIBE_QUERIES } from "../db/queries/subscribe_queries.js";
import subscribeSchema from "../schemas/SubscribeSchema.js"

const SubscribeModel = {
    ...createBaseModel("subscription", mysql_pool, subscribeSchema),

    async deleteSubscribe({ user_id, post_id }) {
        await mysql_pool.execute(SUBSCRIBE_QUERIES.DELETE_BY_USER_AND_POST, [user_id, post_id]);
    },

    async findByUserAndPost(user_id, post_id) {
        const [rows] = await mysql_pool.execute(SUBSCRIBE_QUERIES.FIND_BY_USER_AND_POST, [user_id, post_id]);
        return rows[0];
    }
}

export default SubscribeModel;