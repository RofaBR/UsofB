import PostService from "../services/postService.js"
import CommentService from "../services/commentService.js"
import LikesService from "../services/likesService.js";
import CategoriesService from "../services/categoriesService.js";

const post_controller = {
    get_posts: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const orderBy = req.query.orderBy || "publish_date";
            const orderDir = (req.query.direction || "DESC").toUpperCase();
            let categories = [];
            if (req.query.categories) {
                if (Array.isArray(req.query.categories)) {
                    categories = req.query.categories.map(Number);
                } else {
                    categories = req.query.categories.split(",").map(Number);
                }
            }

            const result = await PostService.getPosts({
                page,
                limit,
                orderBy,
                orderDir,
                categories,
            });

            return res.status(200).json({
                status: "Success",
                result
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "POSTS_FETCH_ERROR",
                message: err.message,
            });
        }
    },

    get_post: async (req, res) => {
        try {
            const post = await PostService.getPost(req.params.post_id)
            return res.status(200).json({
                status: "Success",
                post
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_FETCH_ERROR",
                message: err.message
            });
        }
    },
    
    get_comments: async(req, res) =>{
        try {
            const comments = await CommentService.findAllCommentsToPost(req.params.post_id);
            return res.status(200).json({
                status: "Success",
                comments
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENTS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_categories: async(req, res) => {
        try {
            const category_ids = await CategoriesService.getCategories(req.params.post_id);
            const categories = await CategoriesService.findAllWithIds(category_ids)
            return res.status(200).json({
                status: "Success",
                categories
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_CATEGORIES_FETCH_ERROR",
                message: err.message
            });  
        } 
    },

    get_likes : async(req, res) => {
        try {
            const likeData = {
                target_id: req.params.post_id,
                target_type: "post"
            }
            const likes = await LikesService.getAllLikes(likeData);
            return res.status(200).json({
                status: "Success",
                likes
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_LIKES_FETCH_ERROR",
                message: err.message
            }); 
        }
    },

    post_comment : async(req, res) => {
        try {
            const commentData = {
                ...req.validated,
                author_id: req.user.userId,
                post_id: req.params.post_id
            }
            const comment = await CommentService.create(commentData);
            return res.status(201).json({
                status: "Success",
                commentId: comment.id
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_CREATE_ERROR",
                message: err.message
            });
        }
    },

    post_createPost : async (req, res) => {
        try {
            const postData = {
                ...req.validated,
                author_id: req.user.userId
            };
            const post = await PostService.createPost(postData);
            res.status(201).json({
                status: "Success",
                post: post.id
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly Post",
                message: err.message
            });
        }
    },

    post_like : async (req, res) => {
        try {
            const likeData = {
                ...req.validated,
                author_id: req.user.userId,
                target_type: "post",
                target_id: req.params.post_id
            };
            await LikesService.postLike(likeData)
            return res.status(201).json({
                status: "Success",
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_LIKE_ERROR",
                message: err.message
            });
        }
    },

    delete_like : async (req, res) => {
        try {
            const likeData = {
                author_id: req.user.userId,
                target_type: "post",
                target_id: req.params.post_id
            }
            await LikesService.deleteLike(likeData);
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_LIKE_DELETE_ERROR",
                message: err.message
            });
        }
    },

    delete_post : async (req, res) => {
        try {
            const postData = {
                author_id: req.user.userId,
                post_id: req.params.post_id
            }
            await PostService.deletePost(postData);
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_DELETE_ERROR",
                message: err.message
            }); 
        }
    },

    patch_post : async (req, res) => {
        try {
            const postData = {
                post_id: req.params.post_id,
                author_id: req.user.userId,
                ...req.validated,
            }
            const result = await PostService.updatePost(postData);

            return res.status(200).json({
                status: "success",
                post: result,
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EPOST_UPDATE_ERROR",
                message: err.message
            });
        }
    }

}

export default post_controller