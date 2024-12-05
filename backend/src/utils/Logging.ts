
const { Logger } = require("tslog");
const rfs = require("rotating-file-stream");
import { config } from "dotenv";

config();

// Get log file path from environment variable
const logFileDir = process.env.LOG_FILE_PATH;

const stream = rfs.createStream(logFileDir ? `${logFileDir}/app.log` : "app.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
  });

const logger: InstanceType<typeof Logger> = new Logger();
interface LogObject {
  [key: string]: any;
}

interface TransportFunction {
  (logObj: LogObject): void;
}

const attachTransport: TransportFunction = (logObj) => {
  stream.write(JSON.stringify(logObj) + "\n");
};

logger.attachTransport(attachTransport);

export { logger };