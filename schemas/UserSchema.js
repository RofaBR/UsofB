import { z } from "zod";

export const UserSchema = z.object({
    id: z.number().optional(),
    login: z.string().min(3, "Login must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    avatarId: z.string().optional(),
    rating: z.number().optional(),
    role: z.enum(["user", "admin"]),
});

const UserLoginSchema = UserSchema.pick({ login: true, password: true });
const UserRegisterSchema = UserSchema.pick({
    login: true,
    password: true,
    fullName: true,
    email: true,
}).extend({
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default {
    login: (data) => UserLoginSchema.parse(data),
    register: (data) => UserRegisterSchema.parse(data),
};