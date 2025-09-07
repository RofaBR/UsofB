import mysql_pool from '../db/mysql_pool.js';

const auth_controller = {
    //get_login
    post_login: async (req, res) => {
        let connection = await mysql_pool.getConnection();
    }
    try 
}