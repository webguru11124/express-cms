import { v4 as uuidv4 } from "uuid";
import { mysqlQuery } from "../config/queries";
import {
  create_user,
  delete_user,
  update_user,
  sigin_user,
} from "./queries/users.query";
export const usersModel: any = {
  create: async ({ f_name, l_name, email, password }: any) => {
    const Values: Array<any> = [f_name, l_name, email, password];
    const Result = await mysqlQuery.get(sigin_user, Values);
    return Result;
  },
  sign: async ({ email, password }: any) => {
    const Values: Array<any> = [email, password];
    const Result = await mysqlQuery.get(sigin_user, Values);
    return Result;
  },
  update: async ({ id, body }: any) => {
    const options = Object.keys(body);
    const filtered = options.filter((data: any) =>
      ["f_name", "l_name", "password", "number"].includes(data)
    );
    if (filtered.length < 1) {
      return [null, "missing fields "];
    }
    const Values: Array<any> = [
      ...filtered.map((key: any) => body[key]),
      ...[id],
    ];
    const Result = await mysqlQuery.get(update_user(filtered), Values);
    return Result;
  },
  delete: async ({ id }: any) => {
    const Values: Array<any> = [id];
    const Result = await mysqlQuery.get(delete_user, Values);
    return Result;
  },
};
