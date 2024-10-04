import { Logger, ILogObj } from "tslog";
import { createStream } from "rotating-file-stream";

const stream = createStream("tslog.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
  });

const logger: Logger<ILogObj> = new Logger();
logger.attachTransport((logObj) => {
    stream.write(JSON.stringify(logObj) + "\n");
  });

export { logger };