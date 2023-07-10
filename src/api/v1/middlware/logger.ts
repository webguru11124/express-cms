import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "backend" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
});
if (process.env.NODE_ENV !== "PRODUCTION") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
export { logger };
