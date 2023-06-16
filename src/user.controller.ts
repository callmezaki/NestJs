import { Body, Controller, Get, Post, UseGuards , Req , Query} from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';

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
  @Get("42")
  async Get_user() {
    const Token : string  = await this.userService.getAccessToken();
    return this.userService.get_intra_user(Token);
  }

  @Get("intra")
  Intra(@Query() queryParams: any){
    return queryParams;
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test() {
    return 'hey there';
  }
  
}
