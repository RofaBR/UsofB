import AuthService from "../services/authService.js"
import TokenService from '../services/tokenService.js';
import SenderService from "../services/SenderService.js";

const auth_controller = {
    post_login: async (req, res) => {
        try {
            const user = await AuthService.login(req.validated.login, req.validated.password);

            const tokens = TokenService.generateTokens({ userId: user.id });
            await TokenService.saveRefreshToken(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const {password, ...safeUser} = user
            return res.status(200).json({
                status: "Success",
                user: safeUser,
                accessToken: tokens.accessToken
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "LOGIN_ERROR",
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
                html: `<p>Click to confirm: <a href="${process.env.FRONTEND_URL}/auth/confirm-email/${token}">Confirm mail</a></p>`,
            })

            return res.status(201).json({
                status: "Success",
                userId,
                message: "User registered. Please confirm your email."
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "REGISTER_ERROR",
                message: err.message,
            });
        }
    },

    post_logout : async (req, res) => {
        try {
            await TokenService.removeToken(req.token_hash)
            res.clearCookie('refreshToken');
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                stastus: "Fail",
                type: "LOGOUT_ERROR",
                message: err.message
            })
        }
    },

    post_passwordReset: async (req, res) => {
        try {
            const token =  TokenService.generateConfToken();
            const is_user = await AuthService.createUserToken(req.validated.email, token);
            if (!is_user) {
                return res.status(404).json({
                    status: "Fail",
                    type: "USER_NOT_FOUND",
                    message: "User not found"
                });
            }

            await SenderService.sendEmail({
                to: req.body.email,
                subject: "Password Reset",
                html: `<p>Click to reset: <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}">Reset Password</a></p>`,
            });

            return res.status(200).json({
                status: "Success",
                message: "Password reset link sent"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "PASSWORD_RESET_ERROR",
                message: err.message
            });
        }
    },

    post_confirmReset: async (req, res) => {
        try {
            await AuthService.resetPassword(req.params.confirm_token, req.validated.password);
            return res.status(200).json({
                status: "Success",
                message: "Password has been reset successfully"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "CONFIRM_PASSWORD_RESET_ERROR",
                message: err.message
            });
        }
    },

    post_confirmEmail : async (req, res) => {
        try {
            await AuthService.confirmEmail(req.params.confirm_token);
            return res.status(200).json({
                status: "Success",
                message: "Email has been verified successfully"
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CONFIRM_EMAIL_ERROR",
                message: err.message
            });
        }
    },

    post_refreshToken : async (req, res) => {
        try {
            const userId = req.user.userId;
            const accessToken = TokenService.generateAccessToken({ userId });
            return res.status(200).json({
                status: "Success",
                accessToken,
                user: { id: userId }
            });
        } catch(err) {
            return res.status(401).json({
                status: "Fail",
                type: "REFRESH_TOKEN_ERROR",
                message: err.message
            });
        }
    }
};

export default auth_controller;