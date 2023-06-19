import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Patch,
  Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserData } from "./dtos/user.dto";
import { AuthGuard } from "@nestjs/passport";
import { chPass } from "./dtos/pass.dto";

@Controller("user")
export class userController {
  constructor(private userService: UserService) {}

  @Get("all")
  getUsers() {
    return this.userService.getUsers();
  }
  @Post("signup")
  signup(@Body() userData: UserData) {
    if (userData.email && userData.password)
      return this.userService.addUser(userData);
    else {
      return "invalid input";
    }
  }

  @Post("login")
  signin(@Body() userData: UserData) {
    if ((userData.username || userData.email) && userData.password)
      return this.userService.login(userData);
    else {
      return "invalid input";
    }
  }

  @Patch("pass")
  @UseGuards(AuthGuard("jwt"))
  changePass(@Req() req){
    const chPass : chPass = req.body;
    if (chPass.newPassword && chPass.password) {
      return this.userService.changePass(chPass ,req.user.id);
    }
    else
      return "Invalid input" 
  }

  @Get("intra")
  @UseGuards(AuthGuard("42"))
  Callback(@Req() req) {
    return this.userService.intraJWT(req.user.email);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  profile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }


  @Get("profile/:id")
  @UseGuards(AuthGuard("jwt"))
  pubProfile(@Param() params: any) {
    // if (typeof id == '"Nan"')
    //   return "zbi";
    return this.userService.getProfile(params.id);
  }

  @Get("42")
  @UseGuards(AuthGuard("42"))
  async fortyTwoCallback(@Req() req: Request): Promise<void> {
    const user = req.body;
    console.log("here");
  }
}
