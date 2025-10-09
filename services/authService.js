import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js"

const AuthService = { 
    async login(login, password) {
        const user = await UserModel.findbyLogin(login);
        if(!user) {
            throw new Error("User not found");
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            throw new Error("Invalid password");
        }
        if (!user.email_confirmed) {
            throw new Error("Email not confirmed");
        }
        return user;
    },

    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userId = await UserModel.create({
            ...data,
            password: hashedPassword,
            role: "user"
        });

        return userId;
    },

    async createUserToken(email, token) {
        const users = await UserModel.find({ email });
        if (!users.length) return null;
        const user = users[0];

        await UserModel.updateById(user.id, {
            user_token: token,
        });

        return true;
    },

    async resetPassword(token, newPassword) {
        if (!token || token.length !== 64 || !/^[a-f0-9]{64}$/i.test(token)) {
            throw new Error("Invalid token format");
        }

        const users = await UserModel.find({ user_token: token });
        if (!users.length) throw new Error("Invalid or expired token");
        const user = users[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await UserModel.updateById(user.id, {
            password: hashedPassword,
            user_token: null,
        });

        return true;
    },

    async confirmEmail(token) {
        if (!token || token.length !== 64 || !/^[a-f0-9]{64}$/i.test(token)) {
            throw new Error("Invalid token format");
        }

        const users = await UserModel.find({ user_token: token });
        if (!users.length) throw new Error("Invalid or expired token");

        const user = users[0];
        await UserModel.updateById(user.id, {
            email_confirmed: 1,
            user_token: null
        })
        return true;
    }
};

export default AuthService;