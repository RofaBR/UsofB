import CommentsService from "../services/commentService.js"
import LikesService from "../services/likesService.js";
const comments_controller = {
    get_comment: async (req, res) => {
        try {
            const comment = await CommentsService.getComment(req.params.comment_id)
            return res.status(200).json({
                status: "Success",
                comment
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_like: async(req, res) => {
        try {
            const likes = await LikesService.getAllLikes({ comment_id: req.params.comment_id });
            return res.status(200).json({
                status: "Success",
                likes
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_LIKES_FETCH_ERROR",
                message: err.message
            }); 
        }
    },

    post_like: async(req, res) => {
        try {
            const likeData = {
                ...req.validated,
                author_id: req.user.userId,
                post_id: null,
                comment_id: Number(req.params.comment_id)
            };
            await LikesService.postLike(likeData);
            res.status(201).json({status: "Success"});
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_LIKE_ERROR",
                message: err.message
            });
        }
    },

    patch_comment: async(req, res) => {
        try {
            await CommentsService.updateComment(req.user.userId, req.params.comment_id, req.validated)
            return res.status(200).json({
                status: "Success",
                message: "Comment updated successfully"
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_UPDATE_ERROR",
                message: err.message
            });
        }
    },

    delete_comment : async(req, res) => {
        try {
            await CommentsService.deleteComment(req.user.userId, req.params.comment_id);
            return res.status(204).send();
        }catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_DELETE_ERROR",
                message: err.message
            }); 
        }
    },
    
    delete_like: async (req, res) => {
        try {
            await LikesService.deleteLike({
                author_id: req.user.userId,
                post_id: null,
                comment_id: Number(req.params.comment_id)
            });
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_LIKE_DELETE_ERROR",
                message: err.message
            }); 
        }
    },
}

export default comments_controller;