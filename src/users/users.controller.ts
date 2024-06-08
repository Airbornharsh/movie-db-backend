import { Controller, Post, Body } from '@nestjs/common';
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
}
