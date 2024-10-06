import { Logger, ILogObj } from "tslog";
import { createStream } from "rotating-file-stream";
import { config } from "dotenv";

config();

// Get log file path from environment variable
const logFileDir = process.env.LOG_FILE_PATH;

const stream = createStream(logFileDir ? `${logFileDir}/app.log` : "app.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
  });

const logger: Logger<ILogObj> = new Logger();
logger.attachTransport((logObj) => {
    stream.write(JSON.stringify(logObj) + "\n");
  });

export { logger };