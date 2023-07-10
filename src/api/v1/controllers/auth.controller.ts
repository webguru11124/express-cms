import { Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middleware/auth";
class authController {
  public async CreateAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // eslint-disable-next-line prefer-const
    let { user_id, device_id, ip } = res.locals;
    if (!device_id) {
      device_id = req.headers.deviceId ?? "";
    }
    const [Value, error] = await AuthMiddleware.SetAuth({
      user_id,
      device_id,
      ip,
    });
    if (error) {
      next(new Error("error auth"));
      return;
    }

    if (Value && Value.token) {
      res.status(200).json({
        success: true,
        message: "User signed in successfully",
        result: Value,
      });
      return;
    }
    next(new Error("error auth"));
    return;
  }
}
export default new authController();
