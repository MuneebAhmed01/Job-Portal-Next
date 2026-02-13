import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Caches frequently accessed job data in Redis.
 *
 * Key patterns:
 *   jobs:all          – full public job listing
 *   jobs:detail:<id>  – single job detail
 *
 * TTL:  5 minutes (keeps data fresh while reducing DB load)
 *
 * The service is transparent: callers get data back in the same
 * shape whether it was cached or freshly fetched.
 */
@Injectable()
export class JobCacheService {
  private readonly PREFIX = 'jobs';
  private readonly TTL = 60 * 5; // 5 minutes
  private readonly logger = new Logger(JobCacheService.name);

  constructor(private readonly redis: RedisService) {}

  /* ------------------------------------------------------------------ */
  /*  All public jobs                                                    */
  /* ------------------------------------------------------------------ */

  /** Cache the full public job listing. */
  async cacheAllJobs(jobs: any[]): Promise<void> {
    const key = `${this.PREFIX}:all`;
    await this.redis.set(key, JSON.stringify(jobs), this.TTL);
    this.logger.debug('Public job listing cached');
  }

  /** Return cached public jobs or null if cache miss. */
  async getAllJobs(): Promise<any[] | null> {
    const data = await this.redis.get(`${this.PREFIX}:all`);
    if (!data) return null;
    return JSON.parse(data);
  }

  /* ------------------------------------------------------------------ */
  /*  Single job detail                                                  */
  /* ------------------------------------------------------------------ */

  /** Cache a single job detail. */
  async cacheJob(jobId: string, job: any): Promise<void> {
    const key = `${this.PREFIX}:detail:${jobId}`;
    await this.redis.set(key, JSON.stringify(job), this.TTL);
    this.logger.debug(`Job ${jobId} cached`);
  }

  /** Return a cached job detail or null. */
  async getJob(jobId: string): Promise<any | null> {
    const data = await this.redis.get(`${this.PREFIX}:detail:${jobId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  /* ------------------------------------------------------------------ */
  /*  Invalidation                                                       */
  /* ------------------------------------------------------------------ */

  /** Bust the cache when a job is created, updated or closed. */
  async invalidateJob(jobId: string): Promise<void> {
    await this.redis.del(
      `${this.PREFIX}:all`,
      `${this.PREFIX}:detail:${jobId}`,
    );
    this.logger.debug(`Cache invalidated for job ${jobId}`);
  }

  /** Bust the entire jobs cache. */
  async invalidateAll(): Promise<void> {
    // Only delete the "all" key; detail keys expire on their own
    await this.redis.del(`${this.PREFIX}:all`);
    this.logger.debug('Full jobs cache invalidated');
  }
}
