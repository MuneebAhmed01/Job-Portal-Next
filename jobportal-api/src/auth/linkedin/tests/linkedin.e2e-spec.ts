import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { LinkedInModule } from '../linkedin.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../lib/prisma/prisma.service';

describe('LinkedIn Authentication (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LinkedInModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          const config = {
            LINKEDIN_CLIENT_ID: 'test-client-id',
            LINKEDIN_CLIENT_SECRET: 'test-client-secret',
            LINKEDIN_REDIRECT_URI:
              'http://localhost:3001/auth/linkedin/callback',
            FRONTEND_URL: 'http://localhost:3000',
            JWT_SECRET: 'test-jwt-secret',
          };
          return config[key];
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up test data
    await prismaService.employee.deleteMany({
      where: { provider: 'LINKEDIN' },
    });
  });

  describe('/auth/linkedin (GET)', () => {
    it('should redirect to LinkedIn OAuth URL', () => {
      return supertest(app.getHttpServer())
        .get('/auth/linkedin')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).toContain(
            'https://www.linkedin.com/oauth/v2/authorization',
          );
          expect(res.headers.location).toContain('client_id=test-client-id');
          expect(res.headers.location).toContain(
            'scope=r_emailaddress%20r_liteprofile',
          );
          expect(res.headers.location).toContain('state=');
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain(
            'linkedin_oauth_state',
          );
        });
    });

    it('should handle missing configuration', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

      return supertest(app.getHttpServer()).get('/auth/linkedin').expect(400);
    });
  });

  describe('/auth/linkedin/callback (GET)', () => {
    it('should handle OAuth errors', () => {
      return supertest(app.getHttpServer())
        .get('/auth/linkedin/callback')
        .query({
          error: 'access_denied',
          error_description: 'User denied access',
        })
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).toContain(
            'http://localhost:3000/auth/error',
          );
          expect(res.headers.location).toContain('error=access_denied');
        });
    });

    it('should reject requests without state parameter', () => {
      return supertest(app.getHttpServer())
        .get('/auth/linkedin/callback')
        .query({
          code: 'test-code',
        })
        .expect(401);
    });

    it('should reject requests with invalid state', () => {
      return supertest(app.getHttpServer())
        .get('/auth/linkedin/callback')
        .query({
          code: 'test-code',
          state: 'invalid-state',
        })
        .expect(401);
    });
  });

  describe('/auth/linkedin/employer (GET)', () => {
    it('should redirect to LinkedIn OAuth URL for employer', () => {
      return supertest(app.getHttpServer())
        .get('/auth/linkedin/employer')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).toContain(
            'https://www.linkedin.com/oauth/v2/authorization',
          );
          expect(res.headers.location).toContain('client_id=test-client-id');
          expect(res.headers.location).toContain(
            'redirect_uri=' +
              encodeURIComponent(
                'http://localhost:3001/auth/linkedin/callback/employer',
              ),
          );
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie'][0]).toContain(
            'linkedin_employer_oauth_state',
          );
        });
    });
  });

  describe('LinkedInService', () => {
    let service: any;

    beforeEach(async () => {
      service = app.get('LinkedInService');
    });

    describe('generateState', () => {
      it('should generate a random state string', () => {
        const state1 = service.generateState();
        const state2 = service.generateState();

        expect(state1).toBeDefined();
        expect(state2).toBeDefined();
        expect(state1).not.toBe(state2);
        expect(state1.length).toBeGreaterThan(10);
      });
    });

    describe('validateState', () => {
      it('should validate matching states', () => {
        const state = 'test-state';
        expect(() => service.validateState(state, state)).not.toThrow();
      });

      it('should reject mismatched states', () => {
        expect(() => service.validateState('state1', 'state2')).toThrow(
          'Invalid state parameter',
        );
      });

      it('should reject empty states', () => {
        expect(() => service.validateState('', 'state')).toThrow(
          'Invalid state parameter',
        );
        expect(() => service.validateState('state', '')).toThrow(
          'Invalid state parameter',
        );
      });
    });

    describe('getRedirectUri', () => {
      it('should return configured redirect URI', () => {
        const redirectUri = service.getRedirectUri();
        expect(redirectUri).toBe(
          'http://localhost:3001/auth/linkedin/callback',
        );
      });

      it('should throw error when redirect URI not configured', () => {
        jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);
        expect(() => service.getRedirectUri()).toThrow(
          'LinkedIn redirect URI not configured',
        );
      });
    });

    describe('validateLinkedInUser', () => {
      const mockProfile = {
        id: 'linkedin-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePicture: 'https://example.com/photo.jpg',
        headline: 'Software Engineer',
        summary: 'Experienced developer',
      };

      it('should create new LinkedIn user', async () => {
        const result = await service.validateLinkedInUser(mockProfile);

        expect(result).toBeDefined();
        expect(result.user).toBeDefined();
        expect(result.user.email).toBe(mockProfile.email);
        expect(result.user.name).toBe('John Doe');
        expect(result.user.provider).toBe('LINKEDIN');
        expect(result.user.linkedinId).toBe(mockProfile.id);
        expect(result.accessToken).toBeDefined();
      });

      it('should link LinkedIn to existing user', async () => {
        // Create existing user first
        await prismaService.employee.create({
          data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            provider: 'LOCAL',
          },
        });

        const result = await service.validateLinkedInUser(mockProfile);

        expect(result.user.provider).toBe('LINKEDIN');
        expect(result.user.linkedinId).toBe(mockProfile.id);
      });

      it('should update existing LinkedIn user', async () => {
        // Create LinkedIn user first
        await prismaService.employee.create({
          data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            provider: 'LINKEDIN',
            linkedinId: mockProfile.id,
          },
        });

        const updatedProfile = {
          ...mockProfile,
          headline: 'Senior Software Engineer',
        };

        const result = await service.validateLinkedInUser(updatedProfile);

        expect(result.user.name).toBe('John Doe');
        expect(result.accessToken).toBeDefined();
      });

      it('should throw error for missing LinkedIn ID', async () => {
        const invalidProfile = { ...mockProfile, id: '' };
        await expect(
          service.validateLinkedInUser(invalidProfile),
        ).rejects.toThrow('LinkedIn ID is required');
      });

      it('should throw error for missing email', async () => {
        const invalidProfile = { ...mockProfile, email: undefined };
        await expect(
          service.validateLinkedInUser(invalidProfile),
        ).rejects.toThrow('Email is required from LinkedIn profile');
      });
    });
  });
});
