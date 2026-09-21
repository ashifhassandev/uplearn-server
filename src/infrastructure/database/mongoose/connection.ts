import mongoose from "mongoose";

import { WinstonLogger } from "../../logger/winston.logger";

const logger = new WinstonLogger();

export const connectMongoDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", { error: String(error) });
    throw error;
  }
};