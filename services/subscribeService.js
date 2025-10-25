import SubscribeModel from "../models/SubscribeModel.js";

const SubscribeService = {
    async postSubscribe(data) {
        return await SubscribeModel.create(data);
    },

    async deleteSubscribe({user_id, post_id}) {
        const subscription = await SubscribeModel.findByUserAndPost(user_id, post_id);
        if (!subscription) {
            throw new Error("Subscription not found for this user.");
        }
        await SubscribeModel.deleteSubscribe({user_id, post_id});
    },

    async getSubscriptionStatus(user_id, post_id) {
        const subscription = await SubscribeModel.findByUserAndPost(user_id, post_id);
        return !!subscription;
    }
}

export default SubscribeService;