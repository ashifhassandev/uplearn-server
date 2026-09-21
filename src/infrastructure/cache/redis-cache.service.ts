import type Redis from "ioredis";
import { injectable } from "tsyringe";

import type { ICacheService } from "@/application/ports/services/cache.service.interface";

import { getRedisClient } from "./redis.client";

@injectable()
export class RedisCacheService implements ICacheService {
  private get client(): Redis {
    return getRedisClient();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttlSeconds) {
      await this.client.set(key, serialized, "EX", ttlSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  // Safe pattern delete using SCAN — never use KEYS in production
  async deleteByPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({ match: pattern, count: 100 });

    stream.on("data", async (keys: string[]) => {
      if (keys.length) {
        await this.client.del(...keys);
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });
  }
}