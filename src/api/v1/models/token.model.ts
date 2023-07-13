import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";
import { mysqlQuery, returnTypes } from "../config/queries";
import {
  tokecCreateQuery,
  getOneAdmin,
  tokenGetOne,
  updateTokenQuery,
} from "./queries/token.query";

const Token = {
  async create({ device_id, ip, user_id }: any): Promise<returnTypes> {
    const token = uuidv4();
    let country: string | undefined = "";
    try {
      country = geoip?.lookup(ip)?.country;
      country = country ? country : "0";
    } catch (e) {
      console.log(e);
    }
    const Values = [token, user_id, country, ip, device_id];
    const Result = await mysqlQuery.create(tokecCreateQuery, Values);
    return Result;
  },

  async get_one_admin(token: string) {
    const Values = [token];
    const Result = mysqlQuery.get_one(getOneAdmin, Values);
    return Result;
  },

  async get_one(token: string) {
    const Values = [token];
    const Result = mysqlQuery.get_one(tokenGetOne, Values);
    return Result;
  },
  async update({ token, userId }: any): Promise<returnTypes> {
    const Values = [token, userId];
    const result = mysqlQuery.update(updateTokenQuery, Values);
    return result;
  },

  async match_admin({ device_id, token, ip }: any): Promise<returnTypes> {
    const [Token, error] = await this.get_one_admin({ token } as any);
    if (error) {
      return [null, error];
    }
    let country: string | undefined = "";
    try {
      country = geoip?.lookup(ip)?.country;
      country = country ? country : "unknown";
    } catch (e) {
      console.log(e);
    }

    if (Token.deviceId === device_id || Token.ip === ip) {
      return [Token, null];
    }
    if (
      Token.deviceId !== device_id &&
      Token.ip !== ip &&
      Token.country === country
    ) {
      return [Token, null];
    }
    return [null, "Token not match"];
  },
  async match({ device_id, token, ip }: any): Promise<returnTypes> {
    const [Token, error] = await this.get_one(token);
    if (error) {
      return [null, error];
    }
    let country: string | undefined = "";
    try {
      country = geoip?.lookup(ip)?.country;
      country = country ? country : "unknown";
    } catch (e) {
      console.log(e);
    }

    if (Token.deviceId === device_id || Token.ip === ip) {
      return [Token, null];
    }
    if (
      Token.deviceId !== device_id &&
      Token.ip !== ip &&
      Token.country === country
    ) {
      return [Token, null];
    }
    return [null, "Token not match"];
  },
};

export { Token };
