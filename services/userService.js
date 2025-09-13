import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const UserService = {
    async getAllUsers() {
        return await UserModel.find();
    },

    async getUser(id) {
        return await UserModel.findById(id)
    },

    async createUser(data) {
        const { confirmPassword, ...userData } = data;
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userId = await UserModel.createUser({
            ...userData,
            password: hashedPassword,
            avatar: userData.avatar || 'def_avatar.png'
        });

        return userId;
    },

    async deleteUser(id) {
        return await UserModel.deleteById(id);
    },

    async updateUser(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return await UserModel.updateById(id, data);
    },

    async checkRole(id) {
        const user = await UserModel.findById(id);
        return user?.role || null;
    }
}

export default UserService;