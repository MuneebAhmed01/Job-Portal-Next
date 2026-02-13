import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

/**
 * Unit tests for the core RedisService.
 *
 * These tests use a real Redis connection (localhost:6379).
 * Make sure Redis is running before executing:
 *   npx jest src/redis/redis.service.spec.ts
 */
describe('RedisService', () => {
  let service: RedisService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    service.onModuleInit(); // manually trigger connection
  });

  afterAll(async () => {
    // Clean up test keys
    await service.del('test:key', 'test:ttl');
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set and get a value', async () => {
    await service.set('test:key', 'hello');
    const value = await service.get('test:key');
    expect(value).toBe('hello');
  });

  it('should return null for a missing key', async () => {
    const value = await service.get('test:nonexistent');
    expect(value).toBeNull();
  });

  it('should delete a key', async () => {
    await service.set('test:key', 'to-delete');
    await service.del('test:key');
    const value = await service.get('test:key');
    expect(value).toBeNull();
  });

  it('should report key existence', async () => {
    await service.set('test:key', 'exists');
    expect(await service.exists('test:key')).toBe(true);
    expect(await service.exists('test:nope')).toBe(false);
    await service.del('test:key');
  });

  it('should respect TTL (short-lived key)', async () => {
    await service.set('test:ttl', 'expires-soon', 1); // 1 second
    const before = await service.get('test:ttl');
    expect(before).toBe('expires-soon');

    // Wait 1.5 seconds for the key to expire
    await new Promise((r) => setTimeout(r, 1500));
    const after = await service.get('test:ttl');
    expect(after).toBeNull();
  }, 10000);
});
