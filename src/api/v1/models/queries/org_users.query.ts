const get_user_role_admin =
  "SELECT * FROM barge_diary.orginaztion_user where (role = 1 or role = 2) AND user_id ? AND orginaztion_id = ?";

export { get_user_role_admin };
