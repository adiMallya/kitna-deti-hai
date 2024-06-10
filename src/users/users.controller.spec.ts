import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'xyz@test.com',
          password: 'asasf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asasf' } as User]);
      },
    };

    mockAuthService = {
      // signup: (email: string, password: string) => {},
      login: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Login', () => {
    it('should update session and return user', async () => {
      let session = { userId: -1 };
      const user = await controller.loginUser(
        { email: 'xyz@test.com', password: 'asasf' },
        session,
      );

      expect(session.userId).toBe(1);
      expect(user.id).toBe(1);
    });
  });
});
