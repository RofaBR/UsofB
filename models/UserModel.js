import { USER_QUERIES } from "../db/queries/user_queries.js";
import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import UserSchema from "../schemas/UserSchema.js";

const UserModel = {
    ...createBaseModel("users", mysql_pool, UserSchema),

    async findbyLogin(login) {
        const [rows] = await mysql_pool.execute(USER_QUERIES.FIND_BY_LOGIN, [login]);
        return rows[0] || null;
    },

    async createUser(user) {
        const [ result ] = await mysql_pool.execute(USER_QUERIES.CREATE, [
            user.login,
            user.password,
            user.full_name,
            user.email,
            user.avatar || 'def_avatar.png',
            user.role,
            user.user_token
        ]);
        return result.insertId
    }
};

export default UserModel;
