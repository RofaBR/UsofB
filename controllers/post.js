import PostService from "../services/postService"

const post_controller = {
    get_posts: async (req, res) => {
        try {
            const posts = await PostService.getPosts();
            return res.json(posts)
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "EEh vpadly Post",
                message: err.message
            });
        }
    },
}

export default post_controller