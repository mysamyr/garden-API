import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CreateUserDto, GetUserDto, SignInUserDto } from "../users/dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() createUserDto: CreateUserDto): Promise<GetUserDto> {
    return this.authService.signUp(createUserDto);
  }

  @Post("/signin")
  signIn(
    @Body() singInUserDto: SignInUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(singInUserDto);
  }
}
