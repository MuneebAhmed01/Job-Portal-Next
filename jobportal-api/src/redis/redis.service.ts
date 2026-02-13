import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Core Redis service — thin wrapper around ioredis.
 * Single Responsibility: manage the Redis connection and expose
 * generic get / set / del helpers.  Feature-specific logic lives
 * in dedicated services (SessionService, JobCacheService, etc.).
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: Number(process.env.REDIS_DB) || 0,
      retryStrategy: (times) => Math.min(times * 200, 5000),
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error', (err) => this.logger.error('Redis error', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  /* ------------------------------------------------------------------ */
  /*  Generic helpers                                                    */
  /* ------------------------------------------------------------------ */

  /** Store a value with an optional TTL (seconds). */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /** Retrieve a value (returns null when key is missing / expired). */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /** Delete one or more keys. */
  async del(...keys: string[]): Promise<number> {
    return this.client.del(...keys);
  }

  /** Check if a key exists. */
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  /** Set expiry on an existing key. */
  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  /** Return the underlying ioredis instance (escape hatch). */
  getClient(): Redis {
    return this.client;
  }
}
