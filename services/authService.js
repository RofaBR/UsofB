import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js"

const AuthService = { 
    async login(login, password) {
        const user = await UserModel.findbyLogin(login);
        if(!user) {
            //TODO ERR
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            //TODO ERR
        }
        return user;
    },

    async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userId = await UserModel.createUser({
            ...data,
            password: hashedPassword,
            role: "user"
        });

        return userId;
    }
};

export default AuthService;