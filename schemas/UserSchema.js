import { z } from "zod";

export const UserSchema = z.object({
    id: z.number().optional(),
    login: z.string().min(3, "Login must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    avatarId: z.string().optional(),
    rating: z.number().optional(),
    role: z.enum(["user", "admin"]),
    user_token: z.string().nullable().optional(),
    email_confirmed: z.number().optional(),
});

const UserLoginSchema = UserSchema.pick({ login: true, password: true });
const UserRegisterSchema = UserSchema.pick({
    login: true,
    password: true,
    full_name: true,
    email: true,
}).extend({
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const AdminCreateUserSchema = UserSchema.pick({
    login: true,
    password: true,
    full_name: true,
    email: true,
    role: true,
}).extend({
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const UserUpdateSchema = UserSchema.partial();
const ReadUserSchena = UserSchema;
const EmailSchema = z.object({
    email: UserSchema.shape.email,
});

const PasswordResetSchema = z.object({
    password: UserSchema.shape.password,
    confirmPassword: z.string().min(6, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default {
    login: (data) => UserLoginSchema.parse(data),
    register: (data) => UserRegisterSchema.parse(data),
    update: (data) => UserUpdateSchema.parse(data),
    adminCreate: (data) => AdminCreateUserSchema.parse(data),
    read: (data) =>  ReadUserSchena.parse(data),
    email: (data) => EmailSchema.parse(data),
    passwordReset: (data) => PasswordResetSchema.parse(data),
};