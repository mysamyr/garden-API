import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CreateUserDto, SignInUserDto, SignInTokenDto } from "./dto";

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
}
