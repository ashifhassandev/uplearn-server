import "dotenv/config";
import "reflect-metadata";
import "./infrastructure/config/container";

import {
  connectRedis,
  disconnectRedis,
} from "./infrastructure/cache/redis.client";
import { connectMongoDB } from "./infrastructure/database/mongoose/connection";
import { WinstonLogger } from "./infrastructure/logger/winston.logger";
import { createExpressApp } from "./presentation/web/express-app";

const logger = new WinstonLogger();

const bootstrap = async (): Promise<void> => {
  await connectMongoDB();
  await connectRedis();

  const app = createExpressApp();
  const BASE_URL = process.env.BASE_URL;
  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, (): void => {
    logger.info(`Server running on ${BASE_URL}:${PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectRedis();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

bootstrap().catch((err: unknown) => {
  logger.error("Failed to start server", { error: String(err) });
  process.exit(1);
});