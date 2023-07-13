

const create_access =
  "INSERT INTO `barge_diary`.`orginization_user_access` ( `user_id`, `orginization_id`, `table_id`, `access`) VALUES ( ?, ?, ?, ?)";
const get_user_access =
  "SELECT * FROM barge_diary.orginization_user_access where user_id = ? and orginization_id = ? ";

const create_multiple = (multipe: any) =>
  "INSERT INTO `barge_diary`.`orginization_user_access` ( `user_id`, `orginization_id`, `table_id`, `access`) VALUES " +
  multipe.map((data: any) => " (?,?,?,?) ").join(" , ");

export {
  create_access,
  get_user_access,
  create_multiple
}