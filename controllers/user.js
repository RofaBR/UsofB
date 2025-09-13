import UserService from "../services/userService.js";

const users_controller = {
    get_getAllUsers: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            });
        }
    },

    get_getUser: async (req, res) => {
        try {
            const user = await UserService.getUser(req.params.user_id)
            res.json(user);
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            });
        }
    },

    post_create: async(req, res) => {
        try {
            const user_role = await UserService.checkRole(req.user.userId);
            if (user_role !== "admin") {
                return res.status(403).json({
                    status: "Fail",
                    type: "Permission error",
                    message: "Only admins can create new users"
                });
            }

            const user = await UserService.createUser(req.validated)
            res.status(201).json({
                user: user,
                status: "Succses"
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            });
        }
    },

    delete_deleteUser: async(req, res) => {
        try {
            await UserService.deleteUser(req.params.user_id)
            return res.json({
                status: "Succses"
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            });
        }
    },
    
    patch_uploadAvatar: async(req, res) => {
        try {
            
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            });
        }
    },

    patch_updateUser: async(req, res) => {
        try {
            const updatedUser = await UserService.updateUser(req.params.user_id, req.validated)
            res.json(updatedUser)
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly",
                message: err.message
            }); 
        }
    }
};

export default users_controller;