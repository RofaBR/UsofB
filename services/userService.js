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
    },

    async getUserStatistics(userId) {
        return await UserModel.getUserStatistics(userId);
    },

    async deleteAvatar(userId) {
        const defaultAvatar = '/uploads/avatars/def_avatar.png';
        return await UserModel.updateById(userId, { avatar: defaultAvatar });
    },

    async setPendingEmail(userId, newEmail, token) {
        const existingUser = await UserModel.find({ email: newEmail });
        if (existingUser && existingUser.length > 0) {
            throw new Error("Email is already in use");
        }

        await UserModel.updateById(userId, {
            pending_email: newEmail,
            user_token: token
        });

        return true;
    },

    async confirmEmailChange(token) {
        if (!token || token.length !== 64 || !/^[a-f0-9]{64}$/i.test(token)) {
            throw new Error("Invalid token format");
        }

        const users = await UserModel.find({ user_token: token });
        if (!users || users.length === 0) {
            throw new Error("Invalid or expired token");
        }

        const user = users[0];
        if (!user.pending_email) {
            throw new Error("No pending email change");
        }

        await UserModel.updateById(user.id, {
            email: user.pending_email,
            pending_email: null,
            user_token: null
        });

        return user.pending_email;
    },

    async updatePassword(userId, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserModel.updateById(userId, { password: hashedPassword });
    },

    async updateProfile(userId, fullName) {
        return await UserModel.updateById(userId, { full_name: fullName });
    },

    async updateLogin(userId, newLogin, currentPassword) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        const existingUser = await UserModel.find({ login: newLogin });
        if (existingUser && existingUser.length > 0 && existingUser[0].id !== userId) {
            throw new Error("Login is already taken");
        }

        return await UserModel.updateById(userId, { login: newLogin });
    }
}

export default UserService;