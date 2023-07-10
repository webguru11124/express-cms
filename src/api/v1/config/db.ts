import mysql, { Pool } from "mysql2/promise";
let Con: Pool;
// eslint-disable-next-line no-useless-catch
try {
  Con = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  });
} catch (error) {
  throw error;
}
export default Con;
