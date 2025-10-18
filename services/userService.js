import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

const UserService = {
    async getAllUsers() {
        const users = await UserModel.find();
        for (const user of users) {
            await this.calculateAndUpdateRating(user.id);
        }
        return await UserModel.find();
    },

    async getPaginatedUsers(page = 1, limit = 20, search = '') {
        return await UserModel.findPaginated({
            page,
            limit,
            orderBy: 'rating',
            orderDir: 'DESC',
            search,
            searchFields: ['full_name', 'login']
        });
    },

    async getUser(id) {
        await this.calculateAndUpdateRating(id);
        return await UserModel.findById(id);
    },

    async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userId = await UserModel.create({
            ...userData,
            password: hashedPassword,
            avatar: userData.avatar || '/uploads/avatars/def_avatar.png'
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
    },

    async calculateAndUpdateRating(userId) {
        const rating = await UserModel.calculateUserRating(userId);
        await UserModel.updateRating(userId, rating);
        return rating;
    }
}

export default UserService;