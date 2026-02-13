import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Temporary draft storage for job applications.
 *
 * Key pattern:  draft:application:<employeeId>:<jobId>
 * Value:        JSON string of the draft payload
 * TTL:          7 days — drafts auto-expire if never submitted
 *
 * Use case: an applicant starts filling out an application, navigates
 * away, and comes back later to finish it.
 */
@Injectable()
export class DraftStorageService {
  private readonly PREFIX = 'draft:application';
  private readonly TTL = 60 * 60 * 24 * 7; // 7 days
  private readonly logger = new Logger(DraftStorageService.name);

  constructor(private readonly redis: RedisService) {}

  /** Save (or update) a draft application. */
  async saveDraft(employeeId: string, jobId: string, payload: Record<string, any>): Promise<void> {
    const key = `${this.PREFIX}:${employeeId}:${jobId}`;
    await this.redis.set(key, JSON.stringify(payload), this.TTL);
    this.logger.debug(`Draft saved for employee ${employeeId}, job ${jobId}`);
  }

  /** Retrieve a draft application (null = no draft). */
  async getDraft(employeeId: string, jobId: string): Promise<Record<string, any> | null> {
    const data = await this.redis.get(`${this.PREFIX}:${employeeId}:${jobId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  /** Delete a draft (e.g. after successful submission). */
  async deleteDraft(employeeId: string, jobId: string): Promise<void> {
    await this.redis.del(`${this.PREFIX}:${employeeId}:${jobId}`);
    this.logger.debug(`Draft deleted for employee ${employeeId}, job ${jobId}`);
  }
}
