import { z } from "zod";

export const FavoriteSchema = z.object({
    user_id: z.number().min(1, "User ID is required"),
    post_id: z.number().min(1, "Post ID is required"),
});

const FavoriteSchemaCreateSchema = FavoriteSchema;

export default {
    create: (data) => FavoriteSchemaCreateSchema.parse(data),
    read: (data) => FavoriteSchema.parse(data),
};
