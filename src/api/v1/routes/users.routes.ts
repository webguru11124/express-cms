import authController from "../controllers/auth.controller";
import AuthMiddleware from "../middleware/auth";
import users from "../controllers/users.controller";

import { Request, Response, Router, NextFunction } from "express";

const router_modules = Router();
router_modules.post("/login", users.signin, authController.CreateAuth);
router_modules.post("/", users.create, authController.CreateAuth);
router_modules.put("/", AuthMiddleware.VerifyMe, users.update);
router_modules.delete("/", AuthMiddleware.VerifyMe, users.update);

export default router_modules;
