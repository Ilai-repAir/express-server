import mysql, { Pool } from "mysql2";
const con_port = process.env.PORT || "0";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dotenv.config();

//Connection and distinct between dev-production environment should be handled differently.

const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

// export const pool = mysql.createPool({
//   connectionLimit: 500,
//   host: process.env.HOST,
//   port: Number(con_port),
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: "trials",
// });

export const createPool = (
  userName: string,
  password: string,
  db: string
): Pool =>
  mysql.createPool({
    connectionLimit: 500,
    host: isDev ? process.env.HOST_DEV : process.env.HOST_PROD,
    port: Number(con_port),
    user: userName,
    password: password,
    database: db,
    multipleStatements: true,
  });

// pool.getConnection = util.promisify(pool.getConnection);

// module.exports = pool;
