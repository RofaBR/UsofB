import TokenService from '../services/tokenService.js';

function authError(res, message) {
    return res.status(401).json({
        status: "Fail",
        type: "Midlleware error",
        message,
        code: 401
    });
}

export default class TokenValidator {
    static validateAccess() {
        return async (req, res, next) => {
            const authHeader = req.headers["authorization"];
            if (!authHeader) return authError(res, "Authorization header missing");

            const token = authHeader.split(" ")[1];
            if (!token) return authError(res, "Access token missing");

            try {
                const userData = await TokenService.validateAccessToken(token);
                if (!userData) return authError(res, "Invalid or expired access token");
                req.user = userData;
                next();
            } catch {
                return authError(res, "Token validation failed");
            }
        };
    }

    static validateRefresh() {
        return async (req, res, next) => {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return authError(res, "Refresh token missing");
            }

            try {
                const userData = await TokenService.validateRefreshToken(refreshToken);
                if (!userData) {
                    return authError(res, "Invalid or expired refresh token");
                }

                console.log("Refresh token decoded:", userData);

                const tokenInDb = await TokenService.findToken(userData.userId, refreshToken);
                if (!tokenInDb) {
                    return authError(res, "Refresh token not found in database");
                }
                req.user = { userId: userData.userId };
                req.refreshToken = refreshToken;
                req.token_hash = tokenInDb.token_hash;
                next();
            } catch (err) {
                console.error("Middleware refresh token error:", err.message);
                return authError(res, "Refresh token validation failed");
            }
        };
    }

    static validateOptionalAccess() {
        return async (req, res, next) => {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                req.user = null;
                return next();
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                req.user = null; 
                return next();
            }

            try {
                const userData = await TokenService.validateAccessToken(token);
                req.user = userData || null;
            } catch {
                req.user = null;
            }

            next();
        };
    }
}