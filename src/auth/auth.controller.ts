import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInUserDto } from "../users/dto/user-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.signUp(createUserDto);
  }

  @Post("/signin")
  signIn(
    @Body() singInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(singInUserDto);
  }

  @Get("/secured")
  @UseGuards(AuthGuard("jwt"))
  test(): string {
    return "Try to rich me";
  }
}
