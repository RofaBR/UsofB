import AuthService from "../services/authService.js"
const auth_controller = {
    post_login: async (req, res) => {
        try {
            const user = await AuthService.login(req.validated.login, req.validated.password);
            const {password, ...safeUser} = user
            return res.json({
                status: "Success",
                user: safeUser
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
};

export default auth_controller;