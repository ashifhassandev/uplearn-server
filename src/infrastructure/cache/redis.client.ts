import Redis from "ioredis";

import { WinstonLogger } from "@/infrastructure/logger/winston.logger";
import { redisConfig } from "@/shared/config/redis.config";

// Use WinstonLogger directly — Redis client is infrastructure,
// instantiated before the DI container is fully built
const logger = new WinstonLogger();

let client: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (client) return client;

  client = new Redis(redisConfig);

  client.on("connect", () => logger.info("[Redis] Connecting..."));
  client.on("ready", () => logger.info("[Redis] Connected and ready"));
  client.on("close", () => logger.warn("[Redis] Connection closed"));
  client.on("reconnecting", () => logger.info("[Redis] Reconnecting..."));
  client.on("error", (err: Error) =>
    logger.error("[Redis] Error", { message: err.message }),
  );

  return client;
};

export const connectRedis = async (): Promise<void> => {
  const redis = getRedisClient();
  await redis.connect();
  logger.info("[Redis] Connection established");
};

export const disconnectRedis = async (): Promise<void> => {
  if (client) {
    await client.quit();
    client = null;
    logger.info("[Redis] Disconnected gracefully");
  }
};