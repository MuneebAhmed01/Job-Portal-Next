import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { RedisService } from './redis.service';

describe('SessionService', () => {
  let session: SessionService;
  let redis: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, SessionService],
    }).compile();

    redis = module.get<RedisService>(RedisService);
    redis.onModuleInit();
    session = module.get<SessionService>(SessionService);
  });

  afterAll(async () => {
    await redis.del('session:test-user-1');
    await redis.onModuleDestroy();
  });

  it('should store and retrieve a session token', async () => {
    await session.store('test-user-1', 'jwt-token-abc');
    const token = await session.get('test-user-1');
    expect(token).toBe('jwt-token-abc');
  });

  it('should validate a correct token', async () => {
    await session.store('test-user-1', 'jwt-token-abc');
    expect(await session.validate('test-user-1', 'jwt-token-abc')).toBe(true);
  });

  it('should reject an incorrect token', async () => {
    await session.store('test-user-1', 'jwt-token-abc');
    expect(await session.validate('test-user-1', 'wrong-token')).toBe(false);
  });

  it('should revoke a session', async () => {
    await session.store('test-user-1', 'jwt-token-abc');
    await session.revoke('test-user-1');
    const token = await session.get('test-user-1');
    expect(token).toBeNull();
  });
});
