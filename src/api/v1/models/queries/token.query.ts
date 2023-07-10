const tokecCreateQuery = `INSERT INTO token ( token,user_id,country,ip,device_id) VALUES (?, ?, ?, ?, ?)`;
const tokenGetOne = "SELECT token.* FROM token  WHERE token = ? AND status = 1";
const getOneAdmin =
  "SELECT token.* FROM token INNER JOIN users on token.user_id = users.id AND users.type = 1  WHERE token = ? AND token.status = 1 ";
const updateTokenQuery = "UPDATE token SET  status = 0  WHERE token = ?";

export { tokecCreateQuery, getOneAdmin, tokenGetOne, updateTokenQuery };
