import FavoriteModel from "../models/FavoriteModel.js"

const FavoriteService = {
    async postFavorite(data) {
        return await FavoriteModel.create(data);
    },

    async deleteFavorite({ user_id, post_id }) {
        const favorite = await FavoriteModel.findByUserAndPost(user_id, post_id);
        if (!favorite) {
            throw new Error("Favorite post not found for this user.");
        }

        await FavoriteModel.deleteFavorite({ user_id, post_id });
    },

    async getUserFavorites(user_id) {
        return await FavoriteModel.findByUserWithPosts(user_id);
    },

    async isFavorite(user_id, post_id) {
        const favorite = await FavoriteModel.findByUserAndPost(user_id, post_id);
        return !!favorite;
    }
};

export default FavoriteService;