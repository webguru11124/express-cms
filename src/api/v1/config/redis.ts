import { createClient } from "redis";
import { logger } from "../middleware/logger";
import { returnTypes } from "./queries";

let client: any = null;
type avatarIds = string;
class RedisClient {
  async getkeyInHash(key: string, user_id: string): Promise<returnTypes> {
    try {
      const result = await client.hGet(key, user_id);

      if (result === null) return [null, null];
      try {
        return [JSON.parse(result), null];
      } catch (err) {
        return [null, err];
      }
    } catch (err) {
      return [null, err];
    }
  }
  async SetKeyInHash(
    key: string,
    user_id: string,
    access: any
  ): Promise<returnTypes> {
    // eslint-disable-next-line prefer-const

    let StringValue: string;
    try {
      StringValue = JSON.stringify(access);
    } catch (err) {
      return [null, err];
    }
    try {
      await client.hSet(key, user_id, access);
      return [true, null];
    } catch (err) {
      return [null, err];
    }
  }
  async Set(token: string, string: string): Promise<returnTypes> {
    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
    const [_, error]: any = await this.Get(token);
    if (error) {
      return [null, error];
    }

    try {
      await client.set(token, string);
      return [true, null];
    } catch (err) {
      return [null, err];
    }
  }
  async Get(token: string): Promise<returnTypes> {
    try {
      const result = await client.get(token);

      if (result === null) return [null, null];
      try {
        return [JSON.parse(result), null];
      } catch (err) {
        return [null, err];
      }
    } catch (err) {
      return [null, err];
    }
  }

  async GetClient() {
    if (client === null) throw new Error("Redis client is not initialized");
    return client;
  }
  async initliaze() {
    try {
      client = createClient();
      await client.connect();
    } catch (error) {
      client = null;
      logger.log({ level: "error", message: JSON.stringify(error) });
    }
    if (client) {
      client.on("error", (err: any) => {
        client = null;
        logger.log({ level: "error", message: JSON.stringify(err) });
      });
    }
  }
}
export default new RedisClient();
