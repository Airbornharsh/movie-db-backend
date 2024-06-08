import { Controller, Post, Body, Get, Response } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.createUser(body.email, body.password);
    return user;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.usersService.validateUser(
      body.email,
      body.password,
    );
    if (user) {
      return this.usersService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @Get('admin')
  async getAdmin(@Response() res) {
    const user = await this.usersService.makeAdmin(res.locals.user.sub);
    return res.status(200).json({
      message: 'You are now an admin',
      user: {
        id: user.id,
        email: user.email,
        admin: user.admin,
      },
    });
  }
}
