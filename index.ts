import dotenv from "dotenv";
import express, { Request } from "express";
dotenv.config();
import rateLimit from "express-rate-limit";
import http from "http";
import { ErrorHandler } from "./src/api/v1/middleware/errorHandler";
import { ipMiddleware } from "./src/api/v1/middleware/ip";
import RedisClient from "./src/api/v1/config/redis";
import path from "path";
import bodyParser from "body-parser";
import { logger } from "./src/api/v1/middleware/logger";
import cors from "cors";
import UserRoutes from "./src/api/v1/routes/users.routes";
import VendorRoutes from "./src/api/v1/routes/Vendors";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
RedisClient.initliaze();
app.use(limiter);
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/", ipMiddleware);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/vendors", VendorRoutes);


app.use("/api/v1/test", (req: Request, res) => res.send({ success: true }));
app.use((req, res, next) => {
  if (!req.route) return next(new Error("404 not found"));
  next();
});
app.use(ErrorHandler);

server.listen(port, () => {
  logger.log({ level: "info", message: `Server is running on port ${port}` });
});
