import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Manages user session tokens in Redis.
 *
 * Key pattern:  session:<userId>
 * Value:        JWT token string
 * TTL:          24 hours (matches JWT expiry in AuthModule)
 *
 * Benefits over stateless-only JWT:
 *  - Immediate token revocation on logout / password change
 *  - Visibility into active sessions
 */
@Injectable()
export class SessionService {
  private readonly PREFIX = 'session';
  private readonly TTL = 60 * 60 * 24; // 24 hours
  private readonly logger = new Logger(SessionService.name);

  constructor(private readonly redis: RedisService) {}

  /** Store a session token for a user. */
  async store(userId: string, token: string): Promise<void> {
    const key = `${this.PREFIX}:${userId}`;
    await this.redis.set(key, token, this.TTL);
    this.logger.debug(`Session stored for user ${userId}`);
  }

  /** Retrieve the active session token for a user (null = no session). */
  async get(userId: string): Promise<string | null> {
    return this.redis.get(`${this.PREFIX}:${userId}`);
  }

  /** Validate that the provided token matches the one stored in Redis. */
  async validate(userId: string, token: string): Promise<boolean> {
    const stored = await this.get(userId);
    return stored === token;
  }

  /** Invalidate / revoke a user session (logout). */
  async revoke(userId: string): Promise<void> {
    await this.redis.del(`${this.PREFIX}:${userId}`);
    this.logger.debug(`Session revoked for user ${userId}`);
  }
}
