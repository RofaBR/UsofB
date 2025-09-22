import { requireRole } from "../middlewares/requireRole.js";
import UserService from "../services/userService.js";
import path from "path";

const users_controller = {
    get_Users: async (req, res) => {
        try {
            const role = await UserService.checkRole(req.user.userId);
            const users = await UserService.getAllUsers();
            if (role === "user") {
                users = users.map(u => ({
                    full_name: u.full_name,
                    avatar: u.avatar,
                    rating: u.rating,
                }));
            }
            return res.status(200).json({
                status: "Success",
                users
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
            const role = await UserService.checkRole(req.user.userId);
            const user = await UserService.getUser(req.params.user_id)
            if (role === "user") {
                user = {
                    full_name: user.full_name,
                    avatar: user.avatar,
                    rating: user.rating
                }
            }
            return res.status(200).json({
                status: "Success",
                user
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
    
    patch_updateUser: async(req, res) => {
        try {
            if (req.user.userId != req.params.user_id) {
                const role = await UserService.checkRole(req.user.userId);
                if (role === "user") {
                    return res.status(403).json({
                        status: "Fail",
                        type: "UNAUTHORIZED_ACTION",
                        message: "You cannot update another user's profile"
                    });
                }
            }
            const updatedUser = await UserService.updateUser(req.params.user_id, req.validated)
            return res.status(200).json({
                status: "Success",
                user: updatedUser
            });
        } catch(err) {
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
            const updatedUser = await UserService.updateUser(req.user.userId, { avatar: filename });
            
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
    }
};

export default users_controller;