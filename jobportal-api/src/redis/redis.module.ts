import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { SessionService } from './session.service';
import { JobCacheService } from './job-cache.service';
import { DraftStorageService } from './draft-storage.service';

/**
 * @Global() makes RedisService (and the feature services) available
 * everywhere without manually importing RedisModule in each feature module.
 */
@Global()
@Module({
  providers: [RedisService, SessionService, JobCacheService, DraftStorageService],
  exports: [RedisService, SessionService, JobCacheService, DraftStorageService],
})
export class RedisModule {}
