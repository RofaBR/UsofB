import PostService from "../services/postService.js"
import CommentService from "../services/commentService.js"
import LikesService from "../services/likesService.js";
import CategoriesService from "../services/categoriesService.js";
import FavoriteService from "../services/favoriteService.js"
import UserService from "../services/userService.js";
import SubscribeService from "../services/subscribeService.js";
import PostImageService from "../services/postImageService.js";

const post_controller = {
    get_posts: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const orderBy = req.query.orderBy || "publish_date";
            const orderDir = (req.query.direction || "DESC").toUpperCase();
            const favoriteOnly = req.query.favorite === "true";
            const search = req.query.search || '';

            let status;
            if (req.query.status === 'all') {
                status = null;
            } else if (favoriteOnly) {
                status = req.query.status || null;
            } else {
                status = req.query.status || "active";
            }

            let categories = [];
            if (req.query.categories) {
                categories = Array.isArray(req.query.categories)
                    ? req.query.categories.map(Number)
                    : req.query.categories.split(",").map(Number);
            }

            let role = "guest";
            let userId = null;

            if (req.user) {
                role = await UserService.checkRole(req.user.userId) || "user";
                userId = req.user.userId;
            }

            const result = await PostService.getPosts({
                page,
                limit,
                orderBy,
                orderDir,
                categories,
                favoriteOnly,
                userId,
                status,
                role,
                search,
            });

            return res.status(200).json({
                status: "Success",
                result,
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
            const post = await PostService.getPost(req.params.post_id);
            const response = {
                status: "Success",
                post
            };

            if (req.user) {
                const userId = req.user.userId;
                const postId = Number(req.params.post_id);

                const [isSubscribed, isFavorite] = await Promise.all([
                    SubscribeService.getSubscriptionStatus(userId, postId),
                    FavoriteService.isFavorite(userId, postId)
                ]);

                response.isSubscribed = isSubscribed;
                response.isFavorite = isFavorite;
            }

            return res.status(200).json(response);
        } catch(err) {
            console.error('Error in get_post:', err);
            return res.status(400).json({
                status: "Fail",
                type: "POST_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_myposts: async (req, res) => {
        try {
            const userIdFromUrl = req.params.user_id;

            if (!userIdFromUrl || isNaN(parseInt(userIdFromUrl, 10))) {
                return res.status(400).json({
                    status: "Fail",
                    type: "INVALID_REQUEST",
                    message: "Valid user ID is required in the URL.",
                });
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const orderBy = req.query.orderBy || "publish_date";
            const orderDir = (req.query.direction || "DESC").toUpperCase();

            const result = await PostService.getMyPosts({
                page,
                limit,
                orderBy,
                orderDir,
                userId: userIdFromUrl,
            });

            return res.status(200).json({
                status: "Success",
                result,
            });
        } catch (err) {
            return res.status(500).json({
                status: "Fail",
                type: "POST_FETCH_ERROR",
                message: err.message,
            });
        }
    },

    get_comments: async(req, res) =>{
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const userId = req.user?.userId || null;

            const result = await CommentService.getPaginatedComments(req.params.post_id, page, limit, userId);

            return res.status(200).json({
                status: "Success",
                data: result.data,
                pagination: result.pagination
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

    get_likes: async (req, res) => {
        try {
            const likes = await LikesService.getAllLikes({ post_id: req.params.post_id });
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

    get_post_images: async (req, res) => {
        try {
            const images = await PostService.getPostImages(req.params.post_id);
            return res.status(200).json({
                status: "Success",
                images
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_IMAGES_FETCH_ERROR",
                message: err.message
            });
        }
    },

    post_comment: async (req, res) => {
        try {
            const commentData = {
                ...req.validated,
                author_id: req.user.userId,
                post_id: req.params.post_id
            };

            const post = await PostService.getPost(commentData.post_id);

            if (!post) {
                return res.status(404).json({
                    status: "Fail",
                    type: "POST_NOT_FOUND",
                    message: "Post not found"
                });
            }

            if (post.status !== "active" || post.ban_status === 1) {
                return res.status(403).json({
                    status: "Fail",
                    type: "COMMENT_BLOCKED",
                    message: "Comments are not allowed under inactive or banned posts"
                });
            }

            const comment = await CommentService.create(commentData);

            return res.status(201).json({
                status: "Success",
                commentId: comment.id
            });

        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "COMMENT_CREATE_ERROR",
                message: err.message
            });
        }
    },

    post_createPost : async (req, res) => {
        const uploadedImages = req.uploadedImages || [];
        try {
            const postData = {
                ...req.validated,
                author_id: req.user.userId
            };
            const post = await PostService.createPost(postData, uploadedImages);
            res.status(201).json({
                status: "Success",
                post: post
            });
        } catch(err) {
            PostImageService.cleanupTempFiles(uploadedImages);
            return res.status(400).json({
                status: "Fail",
                type: "POST_CREATE_ERROR",
                message: err.message
            });
        }
    },

    post_like: async (req, res) => {
        try {
            const likeData = {
                ...req.validated,
                author_id: req.user.userId,
                post_id: Number(req.params.post_id),
                comment_id: null
            };
            await LikesService.postLike(likeData);
            return res.status(201).json({ status: "Success" });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_LIKE_ERROR",
                message: err.message
            });
        }
    },

    post_ban : async (req ,res) => {
        try {
            const data = {
                post_id: req.params.post_id,
                ban_status: req.body.ban_status
            }
            await PostService.postBan(data);
            return res.status(201).json({
                status: "Success",
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_CHANGE_BAN_STATUS_ERROR",
                message: err.message
            });  
        }
    },

    post_favorite : async (req, res) => {
        try {
            const favoriteData = {
                user_id: req.user.userId,
                post_id: Number(req.params.post_id) 
            }
            await FavoriteService.postFavorite(favoriteData);
            return res.status(201).json({
                status: "Success"
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_FAVORITE_ERROR",
                message: err.message
            })
        }
    },

    post_subscribe : async (req, res) => {
        try {
            const subscribeData = {
                user_id: req.user.userId,
                post_id: Number(req.params.post_id)
            }
            await SubscribeService.postSubscribe(subscribeData);
            return res.status(201).json({
                status: "Success"
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_SUBSCRIBE_ERROR",
                message: err.message
            })
        }
    },

    get_subscribe_status: async (req, res) => {
        try {
            const user_id = req.user.userId;
            const post_id = Number(req.params.post_id);
            const subscribed = await SubscribeService.getSubscriptionStatus(user_id, post_id);
            return res.status(200).json({
                status: "Success",
                subscribed
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "GET_SUBSCRIBE_STATUS_ERROR",
                message: err.message
            });
        }
    },

    delete_favorite : async (req, res) => {
        try {
            const favoriteData = {
                user_id: req.user.userId,
                post_id: Number(req.params.post_id) 
            }
            await FavoriteService.deleteFavorite(favoriteData);
            return res.status(201).json({
                status: "Success"
            })
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "DELETE_FAVORITE_ERROR",
                message: err.message
            })
        }
    },

    delete_like: async (req, res) => {
        try {
            await LikesService.deleteLike({
                author_id: req.user.userId,
                post_id: Number(req.params.post_id),
                comment_id: null
            });
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_LIKE_DELETE_ERROR",
                message: err.message
            });
        }
    },

    delete_subscribe: async (req, res) => {
        try {
            await SubscribeService.deleteSubscribe({
                user_id:  req.user.userId,
                post_id: req.params.post_id
            })
            return res.status(204).send();
        } catch (err) {
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
            const uploadedImages = req.uploadedImages || [];
            const keepImages = req.body.keepImages ? JSON.parse(req.body.keepImages) : [];

            const result = await PostService.updatePost(postData, uploadedImages, keepImages);
            return res.status(200).json({
                status: "success",
                post: result,
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_UPDATE_ERROR",
                message: err.message
            });
        }
    },

    post_increment_views: async (req, res) => {
        try {
            const post_id = req.params.post_id;
            await PostService.incrementViews(post_id);
            return res.status(200).json({
                status: "Success",
                message: "View count incremented"
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "POST_INCREMENT_VIEWS_ERROR",
                message: err.message
            });
        }
    }

}

export default post_controller