import UserService from "../services/userService.js";

export function requireRole(role) {
    return async (req, res, next) => {
        try {
            const userRole = await UserService.checkRole(req.user.userId);
            if (userRole !== role) {
                return res.status(403).json({
                    status: "Fail",
                    type: "FORBIDDEN",
                    message: `Only ${role}s can perform this action.`,
                });
            }
            next();
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "ROLE_CHECK_ERROR",
                message: err.message,
            });
        }
    };
}