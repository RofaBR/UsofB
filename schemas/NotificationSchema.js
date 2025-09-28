import { z } from "zod";

export const NotificationSchema = z.object({
    user_id: z.number().min(1, "User ID is required"),
    post_id: z.number().min(1, "Post ID is required"),
});

export default {
    create: (data) => NotificationSchema.parse(data),
    read: (data) => NotificationSchema.parse(data),
    update: (data) => NotificationSchema.partial().parse(data),
};