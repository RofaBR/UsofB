import FavoriteModel from "../models/FavoriteModel.js"

const FavoriteService = {
    async postFavorite(data) {
        return await FavoriteModel.create(data);
    },

    async deleteFavorite({ user_id, post_id }) {
        const posts = await FavoriteModel.find({ user_id, post_id});
        if (!posts.length) {
            throw new Error("Favorite post not found for this user.");
        }

        await FavoriteModel.deleteFavorite(post_id);
    }
};

export default FavoriteService;