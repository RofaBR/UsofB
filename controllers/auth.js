import AuthService from "../services/authService.js"
import TokenService from '../services/tokenService.js';
import SenderService from "../services/SenderService.js";

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

    post_register: async (req, res) => {
        try {
            const token = TokenService.generateConfToken();
            const userId = await AuthService.register({
                ...req.validated,
                user_token: token,
            });
            
            await SenderService.sendEmail({
                to: req.validated.email,
                subject: "Mail confirmation",
                html: `<p>Click to confirm: <a href="http://localhost:8080/api/auth/email-confirm/${token}">Confirm mail</a></p>`,
            })

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
    },

    post_passwordReset: async (req, res) => {
        try {
            const token =  TokenService.generateConfToken();
            const is_user = await AuthService.createUserToken(req.validated.email, token);
            if (!is_user) {
                return res.status(404).json({ status: "Fail", message: "User not found" });
            }

            await SenderService.sendEmail({
                to: req.body.email,
                subject: "Password Reset",
                html: `<p>Click to reset: <a href="http://localhost:8080/api/auth/password-reset/${token}">Reset Password</a></p>`,
            });

            res.json({ status: "ok", message: "Reset link sent" });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "reset error",
                message: err.message
            });
        }
    },

    post_confirmReset: async (req, res) => {
        try {
            await AuthService.resetPassword(req.params.confirm_token, req.validated.password);
            res.json({ status: "ok", message: "Password has been reset successfully" });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "reset error",
                message: err.message
            });
        }
    },

    post_confirmEmail : async (req, res) => {
        try {
            await AuthService.confirmEmail(req.params.confirm_token);
            res.json({ status: "ok", message: "Mail has been verified successfully" });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "confirm error",
                message: err.message
            });
        }
    },
};

export default auth_controller;