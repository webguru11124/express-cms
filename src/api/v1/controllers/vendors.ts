//this just an exampple of how the middleware should check

import { NextFunction, Request, Response } from "express";

class Vendor {
  public async create(req: Request, res: Response, next: NextFunction) {
    //go to models here similar to users
    res.status(200).json("data");
  }
}

export default new Vendor();
