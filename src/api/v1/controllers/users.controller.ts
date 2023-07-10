import { NextFunction, Response, Request } from "express";
import { usersModel } from "../models/users.models";
import { HandleError } from "../utils/HandleError";

class userController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const [data, err] = await usersModel.create_user({
      email,
      password,
    });
    if (err) {
      next((HandleError(err, "user"), 500, err));
      return;
    }
    res.status(200).json(data);
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const [data, err] = await usersModel.update_user({
      ...req.body,
      id: res.locals.id,
    });
    if (err) {
      next((HandleError(err, "user"), 500, err));
      return;
    }
    res.status(200).json(data);
  }

  public async signin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const [data, err] = await usersModel.sigin_user({
      email,
      password,
    });
    if (err) {
      next((HandleError(err, "user"), 500, err));
      return;
    }
    res.status(200).json(data);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const [data, err] = await usersModel.delete_user({
      ...req.body,
      id: res.locals.id,
    });
    if (err) {
      next((HandleError(err, "user"), 500, err));
      return;
    }
    res.status(200).json(data);
  }
}
export default new userController();
