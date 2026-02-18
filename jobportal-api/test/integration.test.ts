import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LinkedInModule } from '../src/auth/linkedin/linkedin.module';
import { LinkedInService } from '../src/auth/linkedin/linkedin.service';

describe('LinkedIn Integration Tests', () => {
  let linkedInService: LinkedInService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              LINKEDIN_CLIENT_ID: 'test-client-id',
              LINKEDIN_CLIENT_SECRET: 'test-client-secret',
              LINKEDIN_REDIRECT_URI:
                'http://localhost:3001/auth/linkedin/callback',
              FRONTEND_URL: 'http://localhost:3000',
              JWT_SECRET: 'test-jwt-secret',
            }),
          ],
        }),
        LinkedInModule,
      ],
    }).compile();

    linkedInService = module.get<LinkedInService>(LinkedInService);
  });

  describe('LinkedInService', () => {
    it('should be defined', () => {
      expect(linkedInService).toBeDefined();
    });

    it('should generate state', () => {
      const state = linkedInService.generateState();
      expect(state).toBeDefined();
      expect(typeof state).toBe('string');
      expect(state.length).toBeGreaterThan(10);
    });

    it('should validate matching states', () => {
      const state = 'test-state-123';
      expect(() => linkedInService.validateState(state, state)).not.toThrow();
    });

    it('should reject mismatched states', () => {
      expect(() => linkedInService.validateState('state1', 'state2')).toThrow(
        'Invalid state parameter',
      );
    });

    it('should return redirect URI', () => {
      const redirectUri = linkedInService.getRedirectUri();
      expect(redirectUri).toBe('http://localhost:3001/auth/linkedin/callback');
    });
  });
});
