import mysql_pool from "../db/mysql_pool.js";

const PostImagesModel = {
    async create(postId, filePath) {
      const sql = "INSERT INTO post_images (post_id, file_path) VALUES (?, ?)";
      const [result] = await mysql_pool.execute(sql, [postId, filePath]);
      return { id: result.insertId, post_id: postId, file_path: filePath };
    },

    async findByPostId(postId) {
      const sql = "SELECT * FROM post_images WHERE post_id = ?";
      const [rows] = await mysql_pool.execute(sql, [postId]);
      return rows;
    },

    async deleteByPostId(postId) {
      const sql = "DELETE FROM post_images WHERE post_id = ?";
      await mysql_pool.execute(sql, [postId]);
    },

    async deleteById(imageId) {
      const sql = "DELETE FROM post_images WHERE id = ?";
      await mysql_pool.execute(sql, [imageId]);
    },

    async findById(imageId) {
      const sql = "SELECT * FROM post_images WHERE id = ?";
      const [rows] = await mysql_pool.execute(sql, [imageId]);
      return rows[0];
    }
};

export default PostImagesModel;
