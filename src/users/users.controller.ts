import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsersByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
