import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import auth_router from "./routes/auth.js";
import categories_router from "./routes/categories.js";
import user_router from "./routes/users.js";
import post_router from "./routes/posts.js";
import comments_router from "./routes/comments.js";
import notification_router from "./routes/notifications.js";
import statistics_router from "./routes/statistics.js";

const port = 8080;
const app = express();
const http_server = createServer(app)

//middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use(auth_router);
app.use(categories_router);
app.use(user_router);
app.use(post_router);
app.use(comments_router);
app.use(notification_router);
app.use(statistics_router);

http_server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})