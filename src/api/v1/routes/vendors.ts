import authController from "../controllers/auth.controller";
import AuthMiddleware from "../middleware/auth";
import Vendors from "../controllers/vendors";

import { Request, Response, Router, NextFunction } from "express";
//all here are examples on how they should know they have access
const Vendors_modules = Router();
Vendors_modules.post(
  "/",
  AuthMiddleware.VerifyToken,
  AuthMiddleware.VerifyHasAccess,
  Vendors.create
);

Vendors_modules.get(
  "/",
  AuthMiddleware.VerifyToken,
  AuthMiddleware.VerifyHasAccess,
  Vendors.create
);

export default Vendors_modules;
