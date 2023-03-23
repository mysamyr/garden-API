import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import {
  CreateUserDto,
  SignInUserDto,
  SignInTokenDto,
  GetUserDto,
  ChangePasswordDto,
  ChangePhoneDto,
} from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.signUp(createUserDto);
  }

  @Post("/signin")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() singInUserDto: SignInUserDto): Promise<SignInTokenDto> {
    return this.authService.signIn(singInUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/email")
  @HttpCode(HttpStatus.OK)
  changeEmail(
    @Body() changeEmailDto: SignInUserDto,
    @Req() req,
  ): Promise<SignInTokenDto> {
    const user: GetUserDto = req.user;
    return this.authService.changeEmail(changeEmailDto, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/password")
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<any> {
    const user: GetUserDto = req.user;
    return this.authService.changePassword(changePasswordDto, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/phone")
  @HttpCode(HttpStatus.OK)
  changePhone(
    @Body() changePhoneDto: ChangePhoneDto,
    @Req() req,
  ): Promise<any> {
    const user: GetUserDto = req.user;
    return this.authService.changePhone(changePhoneDto, user);
  }
}
