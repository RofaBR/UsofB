import { z } from "zod";

export const SubscribeSchema = z.object({
    user_id: z.number().min(1, "User ID is required"),
    post_id: z.number().min(1, "Post ID is required"),
});

export default {
    create: (data) => SubscribeSchema.parse(data),
    read: (data) => SubscribeSchema.parse(data),
}