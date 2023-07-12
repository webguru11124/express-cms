import { NextFunction, Response, Request } from "express";
import { usersModel } from "../models/users.models";
import { HandleError } from "../utils/HandleError";

class adminController {

    //state 0 activate user

    public async stateZero(req: Request, res: Response, next: NextFunction) {

      const [data, err] = await usersModel.update_user({
        ...req.body,
        state: 0
      });
      if (err) {
        next((HandleError(err, "user"), 500, err));
        return;
      }
      res.status(200).json(data);

    }

    //state 1 activate user

    public async stateOne(req: Request, res: Response, next: NextFunction) {

        const [data, err] = await usersModel.update_user({
          ...req.body,
          state: 1
        });
        if (err) {
          next((HandleError(err, "user"), 500, err));
          return;
        }
        res.status(200).json(data);
    }

    //state 2 activate user
    public async stateTwo(req: Request, res: Response, next: NextFunction) {

        const [data, err] = await usersModel.update_user({
          ...req.body,
          state: 1
        });
        if (err) {
          next((HandleError(err, "user"), 500, err));
          return;
        }
        res.status(200).json(data);
    }

  }
  export default new adminController();
  