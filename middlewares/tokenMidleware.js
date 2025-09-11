export default class TokenValidator {
    static validateAccess() {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers["authorization"];
                if (!authHeader) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Authorization header missing",
                        code: 401
                    });
                }

                const token = authHeader.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Access token missing",
                        code: 401
                    });
                }

                const userData = await TokenService.validateAccessToken(token);
                if (!userData) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Invalid or expired access token",
                        code: 401
                    });
                }
                req.user = userData;
                next();
            } catch (err) {
                return res.status(401).json({
                    status: "Fail",
                    type: "Auth error",
                    message: "Token validation failed",
                    code: 401
                });
            }
        };
    }

    static validateRefresh() {
        return async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Refresh token missing",
                        code: 401
                    });
                }

                const userData = await TokenService.validateRefreshToken(refreshToken);
                if (!userData) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Invalid or expired refresh token",
                        code: 401
                    });
                }

                const tokenInDb = await TokenService.findToken(refreshToken);
                if (!tokenInDb) {
                    return res.status(401).json({
                        status: "Fail",
                        type: "Auth error",
                        message: "Refresh token not found in database",
                        code: 401
                    });
                }

                req.user = userData;
                req.refreshToken = refreshToken;
                next();
            } catch (err) {
                return res.status(401).json({
                    status: "Fail",
                    type: "Auth error",
                    message: "Refresh token validation failed",
                    code: 401
                });
            }
        };
    }
}