import { Test, TestingModule } from '@nestjs/testing';
import { JobCacheService } from './job-cache.service';
import { RedisService } from './redis.service';

describe('JobCacheService', () => {
  let cache: JobCacheService;
  let redis: RedisService;

  const sampleJobs = [
    { id: 'j1', title: 'Backend Developer', company: 'Acme' },
    { id: 'j2', title: 'Frontend Developer', company: 'Globex' },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, JobCacheService],
    }).compile();

    redis = module.get<RedisService>(RedisService);
    redis.onModuleInit();
    cache = module.get<JobCacheService>(JobCacheService);
  });

  afterAll(async () => {
    await redis.del('jobs:all', 'jobs:detail:j1');
    await redis.onModuleDestroy();
  });

  it('should return null on cache miss (all jobs)', async () => {
    await redis.del('jobs:all');
    expect(await cache.getAllJobs()).toBeNull();
  });

  it('should cache and retrieve all jobs', async () => {
    await cache.cacheAllJobs(sampleJobs);
    const cached = await cache.getAllJobs();
    expect(cached).toEqual(sampleJobs);
  });

  it('should cache and retrieve a single job', async () => {
    await cache.cacheJob('j1', sampleJobs[0]);
    const cached = await cache.getJob('j1');
    expect(cached).toEqual(sampleJobs[0]);
  });

  it('should return null for uncached job', async () => {
    expect(await cache.getJob('unknown')).toBeNull();
  });

  it('should invalidate a specific job + listing', async () => {
    await cache.cacheAllJobs(sampleJobs);
    await cache.cacheJob('j1', sampleJobs[0]);

    await cache.invalidateJob('j1');

    expect(await cache.getAllJobs()).toBeNull();
    expect(await cache.getJob('j1')).toBeNull();
  });
});
