import { Test, TestingModule } from '@nestjs/testing';
import { DraftStorageService } from './draft-storage.service';
import { RedisService } from './redis.service';

describe('DraftStorageService', () => {
  let drafts: DraftStorageService;
  let redis: RedisService;

  const employeeId = 'emp-1';
  const jobId = 'job-1';
  const payload = { coverLetter: 'I am very interested…', experience: '3 years' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, DraftStorageService],
    }).compile();

    redis = module.get<RedisService>(RedisService);
    redis.onModuleInit();
    drafts = module.get<DraftStorageService>(DraftStorageService);
  });

  afterAll(async () => {
    await redis.del(`draft:application:${employeeId}:${jobId}`);
    await redis.onModuleDestroy();
  });

  it('should save and retrieve a draft', async () => {
    await drafts.saveDraft(employeeId, jobId, payload);
    const stored = await drafts.getDraft(employeeId, jobId);
    expect(stored).toEqual(payload);
  });

  it('should return null when no draft exists', async () => {
    expect(await drafts.getDraft('no-one', 'no-job')).toBeNull();
  });

  it('should delete a draft', async () => {
    await drafts.saveDraft(employeeId, jobId, payload);
    await drafts.deleteDraft(employeeId, jobId);
    expect(await drafts.getDraft(employeeId, jobId)).toBeNull();
  });

  it('should overwrite an existing draft', async () => {
    await drafts.saveDraft(employeeId, jobId, { note: 'v1' });
    await drafts.saveDraft(employeeId, jobId, { note: 'v2' });
    const stored = await drafts.getDraft(employeeId, jobId);
    expect(stored).toEqual({ note: 'v2' });
  });
});
