const create_user =
  "INSERT INTO `barge_diary`.`users` (`f_name`, `l_name`, `email`, `password`) VALUES ( ?, ?, ?, ?);";
const sigin_user =
  "SELECT * FROM barge_diary.users WHERE email = ? AND password = ? AND status = 1;";

const update_user = (values: any) => {
  return (
    "UPDATE users SET " +
    values
      .filter((data: any) =>
        ["f_name", "l_name", "password", "number"].includes(data)
      )
      .map((data: any) => data + " = ?")
      .join(",") +
    " WHERE  id  = ?  "
  );
};

const delete_user = "DELETE FROM barge_diary.users where id = ?";

export { create_user, delete_user, update_user, sigin_user };
