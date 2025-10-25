import { requireRole } from "../middlewares/requireRole.js";
import UserService from "../services/userService.js";
import FavoriteService from "../services/favoriteService.js";
import CommentService from "../services/commentService.js";
import TokenService from "../services/tokenService.js";
import SenderService from "../services/SenderService.js";
import path from "path";

const users_controller = {
    get_Users: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const search = req.query.search || '';

            const result = await UserService.getPaginatedUsers(page, limit, search);
            let users = result.data;

            if (!req.user || (req.user && await UserService.checkRole(req.user.userId) === "user")) {
                users = users.map(u => ({
                    id: u.id,
                    full_name: u.full_name,
                    avatar: u.avatar,
                    rating: u.rating,
                }));
            }

            return res.status(200).json({
                status: "Success",
                data: users,
                pagination: result.pagination
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "USERS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_User: async (req, res) => {
        try {
            const user = await UserService.getUser(req.params.user_id);

            const isOwnProfile = req.user && req.user.userId == req.params.user_id;

            const responseData = {
                id: user.id,
                full_name: user.full_name,
                avatar: user.avatar,
                rating: user.rating
            };

            if (isOwnProfile) {
                responseData.role = user.role;
                responseData.login = user.login;
                responseData.email = user.email;
                responseData.pending_email = user.pending_email;
            }

            return res.status(200).json({
                status: "Success",
                user: responseData
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "USER_FETCH_ERROR",
                message: err.message
            });
        }
    },

    post_create: async(req, res) => {
        try {
            const user = await UserService.createUser(req.validated)
            res.status(201).json({
                status: "Succses",
                user: user,
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "USER_CREATE_ERROR",
                message: err.message
            });
        }
    },

    delete_User: async(req, res) => {
        try {
            await UserService.deleteUser(req.params.user_id)
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "USER_DELETE_ERROR",
                message: err.message
            });
        }
    },
    
    patch_updateUser: async (req, res) => {
        try {
            if (req.user.userId != req.params.user_id && req.user.role !== "admin") {
            return res.status(403).json({
                status: "Fail",
                type: "UNAUTHORIZED_ACTION",
                message: "You cannot update another user's profile"
            });
            }

            const updatedUser = await UserService.updateUser(req.params.user_id, req.validated);
            return res.status(200).json({
                status: "Success",
                user: updatedUser
            });
        } catch (err) {
            return res.status(400).json({
            status: "Fail",
            type: "USER_UPDATE_ERROR",
            message: err.message
            }); 
        }
    },

    patch_uploadAvatar: async(req, res) => {
        try {
            if (!req.file) {
                throw new Error("No file uploaded");
            }
            const filename = `${req.user.userId}${path.extname(req.file.originalname)}`;
            const avatarPath = `/uploads/avatars/${filename}`;
            const updatedUser = await UserService.updateUser(req.user.userId, { avatar: avatarPath });

            return res.status(200).json({
                status: "success",
                message: "Avatar uploaded successfully",
                user: updatedUser
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "AVATAR_UPLOAD_ERROR",
                message: err.message
            });
        }
    },

    delete_avatar: async(req, res) => {
        try {
            await UserService.deleteAvatar(req.user.userId);
            return res.status(200).json({
                status: "success",
                message: "Avatar removed successfully"
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "AVATAR_DELETE_ERROR",
                message: err.message
            });
        }
    },

    get_favorites: async (req, res) => {
        try {
            const userIdFromToken = req.user.userId;
            const userIdFromParams = parseInt(req.params.user_id, 10);

            if (userIdFromParams !== userIdFromToken) {
                return res.status(403).json({
                    status: "Fail",
                    type: "FORBIDDEN",
                    message: "You are not allowed to view favorites of another user"
                });
            }

            const favorites = await FavoriteService.getUserFavorites(userIdFromParams);
            return res.status(200).json({
                status: "Success",
                favorites
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "FAVORITES_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_user_stats: async (req, res) => {
        try {
            const stats = await UserService.getUserStatistics(req.params.user_id);
            return res.status(200).json({
                status: "Success",
                stats
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "USER_STATS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_user_comments: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await CommentService.getUserComments(req.params.user_id, page, limit);
            return res.status(200).json({
                status: "Success",
                data: result.data,
                pagination: result.pagination
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "USER_COMMENTS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    post_requestEmailChange: async (req, res) => {
        try {
            const token = TokenService.generateConfToken();
            await UserService.setPendingEmail(req.user.userId, req.validated.email, token);

            await SenderService.sendEmail({
                to: req.validated.email,
                subject: "Email Change Confirmation",
                html: `<p>Click to confirm your new email: <a href="${process.env.FRONTEND_URL}/auth/confirm-email-change/${token}">Confirm Email Change</a></p>`
            });

            return res.status(200).json({
                status: "Success",
                message: "Confirmation email sent to new address"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "EMAIL_CHANGE_REQUEST_ERROR",
                message: err.message
            });
        }
    },

    post_confirmEmailChange: async (req, res) => {
        try {
            await UserService.confirmEmailChange(req.params.token);
            return res.status(200).json({
                status: "Success",
                message: "Email changed successfully"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "EMAIL_CHANGE_CONFIRM_ERROR",
                message: err.message
            });
        }
    },

    patch_updatePassword: async (req, res) => {
        try {
            await UserService.updatePassword(req.user.userId, req.validated.password);
            return res.status(200).json({
                status: "Success",
                message: "Password updated successfully"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "PASSWORD_UPDATE_ERROR",
                message: err.message
            });
        }
    },

    patch_updateProfile: async (req, res) => {
        try {
            await UserService.updateProfile(req.user.userId, req.validated.full_name);
            return res.status(200).json({
                status: "Success",
                message: "Profile updated successfully"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "PROFILE_UPDATE_ERROR",
                message: err.message
            });
        }
    },

    patch_updateLogin: async (req, res) => {
        try {
            await UserService.updateLogin(
                req.user.userId,
                req.validated.newLogin,
                req.validated.currentPassword
            );
            return res.status(200).json({
                status: "Success",
                message: "Login updated successfully"
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "LOGIN_UPDATE_ERROR",
                message: err.message
            });
        }
    }
};

export default users_controller;