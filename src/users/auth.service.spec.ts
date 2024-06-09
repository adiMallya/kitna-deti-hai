import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    mockUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SignUp', () => {
    it('should create salt, hash and save hashed password', async () => {
      const user = await service.signup('xyz@test.com', 'asfafs');

      const [hash, salt] = user.password.split('.');
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();

      expect(user.password).not.toEqual('asfafs');
    });

    it('should throw BadRequestException for email already in use', async () => {
      await service.signup('xyz@test.com', 'asfafs');

      await expect(service.signup('xyz@test.com', 'asfafs')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Login', () => {
    it('should throw NotFoundException for wrong email', async () => {
      await expect(service.login('abc@test.com', 'asfafs')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user if password is correct', async () => {
      await service.signup('xyz@test.com', 'asfafs');

      const user = await service.login('xyz@test.com', 'asfafs');
      expect(user).toBeDefined();
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      await service.signup('xyz@test.com', 'asfafs');

      await expect(service.login('xyz@test.com', 'badmas')).rejects.toThrow(BadRequestException);
    });
  });
});
