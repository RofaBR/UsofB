import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import TokenModel from "../models/TokenModel.js";

const TokenService = {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d"});
        return { accessToken, refreshToken };
    },

    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
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
        } catch(err) {
            return null;
        }
    },

    async findToken(user_id, token) {
        const rows = await TokenModel.findByUserID(user_id);
        const tokenData = rows[0];
        for (const row of tokenData) {
            if (await bcrypt.compare(token, row.token_hash)) {
                return row;
            }
        }
        return null;
    },

    async removeToken(token) {
        await TokenModel.remove(token);
    },

    generateConfToken() {
        return crypto.randomBytes(32).toString("hex");
    },
};

export default TokenService;