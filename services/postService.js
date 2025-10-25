import PostModel from "../models/PostModel.js"
import PostCategoriesModel from "../models/PostCategoriesModel.js"
import NotificationService from "./NotificationService.js"
import PostImageService from "./postImageService.js"
import CategoriesService from "./categoriesService.js"
import UserModel from "../models/UserModel.js"
import CommentModel from "../models/CommentModel.js"

const PostService = {
    async getPosts(params) {
        const result = await PostModel.findWithFilters(params);

        const postIds = result.data.map(post => post.id);
        const ratingsMap = await PostModel.calculateRatingsForPosts(postIds);

        const enrichedPosts = await Promise.all(
            result.data.map(async (post) => {
                const categoryIds = await CategoriesService.getCategories(post.id);
                const categories = await CategoriesService.findAllWithIds(categoryIds);

                const author = await UserModel.findById(post.author_id);
                const comments = await CommentModel.find({ post_id: post.id });

                return {
                    ...post,
                    categories,
                    author_name: author?.full_name || 'Unknown',
                    author_login: author?.login || 'unknown',
                    author_avatar: author?.avatar || null,
                    comments_count: comments.length,
                    views: post.views || 0,
                    ban_status: post.ban_status || false,
                    rating: ratingsMap[post.id] || 0
                };
            })
        );

        return {
            ...result,
            data: enrichedPosts
        };
    },

    async getPost(post_id) {
        const post = await PostModel.findById(post_id);
        if (!post) return null;

        const author = await UserModel.findById(post.author_id);

        post.images = PostImageService.getPostImages(post_id);
        post.rating = await PostModel.calculateRating(post_id);
        post.author_name = author?.full_name || 'Unknown';
        post.author_login = author?.login || 'unknown';
        post.author_avatar = author?.avatar || null;

        return post;
    },

    async getFavorite(user_id) {
        return await PostModel.findFavoritesByUser(user_id)
    },

    async getMyPosts(params) {
        return await PostModel.getMyPosts(params);
    },

    async findAllWithIds(ids) {
        const posts =  await PostModel.findAllWithIds(ids);
        return posts
    },

    async createPost(data, uploadedImages = []) {
        const post = await PostModel.create({
        author_id: data.author_id,
        title: data.title,
        content: data.content,
        status: data.status || "active"
        });

        if (data.categories && data.categories.length > 0) {
            for (const categoryId of data.categories) {
                await PostCategoriesModel.create(post.id, categoryId);
            }
        }

        let savedImages = [];
        if (uploadedImages && uploadedImages.length > 0) {
            savedImages = PostImageService.moveUploadedImages(post.id, uploadedImages);
        }

        return {
            id: post.id,
            images: savedImages
        };
    },

    async getPostImages(postId) {
        return PostImageService.getPostImages(postId);
    },

    async clearPostImages(postId, userId) {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== userId) {
            throw new Error("You are not allowed to manage images for this post");
        }
        return PostImageService.clearPostImages(postId);
    },
    
    async updatePost(data, uploadedImages = [], keepImages = []) {
        const post = await PostModel.findById(data.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== data.author_id) {
            throw new Error("You are not allowed to update this post");
        }

        if (data.categories !== undefined) {
            await PostCategoriesModel.deleteByPostId(data.post_id);
            if (data.categories.length > 0) {
                for (const categoryId of data.categories) {
                    await PostCategoriesModel.create(data.post_id, categoryId);
                }
            }
        }

        const { post_id, author_id, categories, ...updateData } = data;
        const newPostData = await PostModel.updateById(post_id, updateData);

        const updatedImages = PostImageService.replacePostImages(data.post_id, uploadedImages, keepImages);

        try {
            await NotificationService.notifySubscribersOfPostUpdate(data.post_id, data.author_id);
        } catch (error) {
            console.error("Failed to create notifications for post update:", error.message);
        }

        return {
            newPostData,
            images: updatedImages
        };
    },

    async deletePost(data) {
        const post = await PostModel.findById(data.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== data.author_id) {
            throw new Error("You are not allowed to delete this post");
        }

        try {
            PostImageService.deletePostImageDirectory(data.post_id);
        } catch (error) {
            console.error(`Failed to delete images for post ${data.post_id}:`, error.message);
        }

        return await PostModel.deleteById(data.post_id);
    },

    async postBan({post_id, ban_status }) {
        return await PostModel.updateById(post_id, { ban_status });
    },

    async incrementViews(post_id) {
        const post = await PostModel.findById(post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        const currentViews = post.views || 0;
        return await PostModel.updateById(post_id, { views: currentViews + 1 });
    },

    async addPostImages(postId, userId, uploadedImages) {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== userId) {
            throw new Error("You are not allowed to add images to this post");
        }

        return PostImageService.appendUploadedImages(postId, uploadedImages);
    },

    async deletePostImage(postId, userId, imageId) {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== userId) {
            throw new Error("You are not allowed to delete images from this post");
        }

        return PostImageService.deleteImageById(postId, imageId);
    }

}

export default PostService