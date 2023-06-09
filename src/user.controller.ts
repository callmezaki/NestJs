import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  @Get('all')
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('signup')
  signup(@Body() userData: UserData) {
    if (userData.email && userData.password)
      return this.userService.addUser(userData);
    else {
      return 'invalid input';
    }
  }
  @Post('login')
  signin(@Body() userData: UserData) {
    if (userData.email && userData.password)
      return this.userService.login(userData);
    else {
      return 'invalid input';
    }
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test() {
    return 'hey there';
  }
}
