import express from "express"
import { createServer } from "http"

import auth_router from "./routes/auth.js";

const port = 8080;
const app = express();
const http_server = createServer(app)

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use(auth_router);
app.use()

http_server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})