import express from "express"
import { createServer } from "http"
import dotenv from "dotenv";


import auth_router from "./routes/auth.js";
import categories_router from "./routes/categories.js";
import user_router from "./routes/users.js";
import post_router from "./routes/posts.js";
import comments_router from "./routes/comments.js";

const port = 8080;
const app = express();
const http_server = createServer(app)

dotenv.config();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use(auth_router);
app.use(categories_router);
app.use(user_router);
app.use(post_router);
app.use(comments_router);

http_server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})