import AuthService from "../services/authService.js"
import TokenService from '../services/tokenService.js';
const auth_controller = {
    post_login: async (req, res) => {
        try {
            const user = await AuthService.login(req.validated.login, req.validated.password);

            const tokens = TokenService.generateTokens({ userId: user.id });
            await TokenService.saveRefreshToken(user.id, tokens.refreshToken);
            
            const {password, ...safeUser} = user
            return res.json({
                status: "Success",
                user: safeUser,
                tokens
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "Auth error",
                message: err.message,
            });
        }
    },

    post_register: async (req, res, next) => {
        try {
            const userId = await AuthService.register(req.validated);
            return res.json({
                status: "Success",
                userId,
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "Auth error",
                message: err.message,
            });
        }
    },

    post_logout : async (req, res) => {
        try {
            await TokenService.removeToken(req.token_hash)
            return res.json({
                status: "Success",
                message: "Logged out successfully"
            });
        } catch(err) {
            return res.status(400).json({
                stastus: "Fail",
                type: "Auth error",
                message: err.message
            })
        }
    }
};

export default auth_controller;