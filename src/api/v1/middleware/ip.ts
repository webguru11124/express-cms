import requestIp from "request-ip";

export const ipMiddleware = (req: any, res: any, next: any) => {
  res.locals.ip = requestIp.getClientIp(req);
  next();
};
