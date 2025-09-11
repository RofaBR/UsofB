import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import TokenModel from "../models/TokenModel.js";

const TokenService = {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15"});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d"});
        return { accessToken, refreshToken };
    },

    async saveRefreshToken(userId, refreshToken) {
        const tokenHash = await bcrypt.hash(refreshToken, 2);
        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await TokenModel.save(userId, tokenHash, expireAt)
    },

    async validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return null;
        }
    },

    async validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch {
            return null;
        }
    },

    async findToken(token) {
        const tokens = await TokenModel.findAll();
        for (const t of tokens) {
            if (await bcrypt.compare(token, t.token_hash)) {
                return t;
            }
        }
        return null;
    },

    async removeToken(token) {
        await TokenModel.delete(token);
    }
};

export default TokenService;