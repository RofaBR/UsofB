import mysql from "mysql2/promise"
import config from "./config.json"

const mysql_pool = mysql.createPool(config);

export default mysql_pool;