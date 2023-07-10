import { NextFunction, Response, Request } from "express";

import RedisClient from "../config/redis";
import { Token } from "../models/token.model";
import { userOrgAccess } from "../models/user_org_access.model";

function extractToken(req: Request): string | null {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token as string;
  }
  return null;
}
const AuthMiddleware = {
  async VerifyMe(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
    const device_id = (req.headers?.deviceId as string) ?? "";

    if (token === null || token === undefined) {
      next(new Error("Auth not found"));
      return;
    }
    const [RedistResult, errorRedis] = await RedisClient.Get(token as string);
    if (errorRedis) {
      next(new Error("error check memory"));
      return;
    }

    if (
      RedistResult &&
      ((RedistResult && RedistResult.ip === res.locals.ip) ||
        RedistResult.device_id === device_id)
    ) {
      res.locals.user_id = RedistResult.user_id;
      next();
      return;
    }

    const [result, error] = await Token.match({
      device_id,
      token: token as string,
      ip: res.locals.ip,
    });
    if (error) {
      next(new Error("Err auth user"));
      return;
    }

    res.locals.user_id = result.user_id;

    await RedisClient.Set(
      result.token,
      JSON.stringify({ user_id: result.user_id, ip: res.locals.ip, device_id })
    );

    next();
    return;
  },
  async VerifyHasAccess(req: Request, res: Response, next: NextFunction) {
    const [RedistResult, errorRedis] = await RedisClient.getkeyInHash(
      "access",
      res.locals.id
    );
    if (errorRedis) {
      next(new Error("error check memory"));
      return;
    }

    const orginaztion_id =
      (req.headers?.orginaztion_id as string) ?? req.body?.orginaztion_id;
    if (!orginaztion_id) {
      next(new Error("missing headers"));
      return;
    }

    if (RedistResult && Object.keys(RedistResult).length > 0) {
      if (RedistResult[orginaztion_id] === null) {
        next(new Error("You dont have access"));
        return;
      }
      if (RedistResult[orginaztion_id]) {
        const isWrite = req.method === "POST";
        const table = RedistResult[orginaztion_id].find(
          (data: any) => data.table === res.locals.which_table
        );
        const isAdmin = RedistResult[orginaztion_id].find(
          (data: any) => data.admin === 1
        );
        if (isAdmin) {
          next();
          return;
        }
        if (table) {
          if (isWrite && table.write) {
            next();
            return;
          }
          if (!isWrite && table.read) {
            next();
            return;
          }
        }
      }
    }
    const [resAccess, erAccess] = await userOrgAccess.get_user_access({
      user_id: res.locals.id,
      orginization_id: orginaztion_id,
    });
    if (erAccess) {
      if (erAccess === "no access") {
        try {
          await RedisClient.SetKeyInHash("access", res.locals.id, {
            [orginaztion_id]: null,
          });
        } catch (e) {
          console.log(e);
        }
      }
      next(new Error("err Checking  access"));
      return;
    }
    if (resAccess) {
      const isWrite = req.method === "POST";
      const table = resAccess[orginaztion_id].find(
        (data: any) => data.table && data.table === res.locals.which_table
      );

      const isAdmin = resAccess[orginaztion_id].find(
        (data: any) => data.admin && data.admin === 1
      );
      if (isAdmin) {
        next();
        return;
      }
      if (table) {
        if (isWrite && table.write) {
          next();
          return;
        }
        if (!isWrite && table.read) {
          next();
          return;
        }
      }
    }

    next(new Error("You dont have access"));
    return;
  },
  async addUserAccess(req: Request, res: Response, next: NextFunction) {
    //here should go the user
  },
  async VerifyToken(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
    const device_id = (req.headers?.deviceId as string) ?? "";
    if (token === null || token === undefined) {
      next(new Error("Auth not found"));
      return;
    }
    const [RedistResult, errorRedis] = await RedisClient.Get(token as string);

    if (errorRedis) {
      next(new Error("error check memory"));
      return;
    }

    if (
      RedistResult &&
      ((RedistResult && RedistResult.ip === res.locals.ip) ||
        RedistResult.device_id === device_id)
    ) {
      res.locals.user_id = RedistResult.user_id;
      res.locals.created_by = RedistResult.user_id;
      next();
      return;
    }

    const [result, error] = await Token.match({
      device_id,
      token: token as string,
      ip: res.locals.ip,
    });
    if (error) {
      next(new Error("Err auth user"));
      return;
    }

    res.locals.user_id = result.user_id;

    await RedisClient.Set(
      result.token,
      JSON.stringify({ user_id: result.user_id, ip: res.locals.ip, device_id })
    );

    next();
    return;
  },
  async SetAuth({
    device_id,
    user_id,
    ip,
  }: {
    device_id: string;
    user_id: string;
    ip: string;
  }): Promise<
    [
      {
        token: string;
        user_id: string;
      } | null,
      {
        error: string;
      } | null
    ]
  > {
    const [TokenResult, Tokenerror] = await Token.create({
      device_id,
      ip,
      user_id,
    });
    if (Tokenerror) {
      return [null, { error: Tokenerror }];
    }
    const token = TokenResult[0];
    return [{ token, user_id }, null];
  },
};
export default AuthMiddleware;
/*

auth user_id  {[org_id]:[
    {
        table:vender,
        read:1,
        write:1,
    }
]
] }

*/
