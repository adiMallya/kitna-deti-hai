import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

// To add currUser prop to default Request interface of express library
declare global{
  namespace Express{
    interface Request{
      currUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session ?? {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currUser = user;
      next();
    }
  }
}
