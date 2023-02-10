import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../users/user.service";
import { GetUserDto } from "../users/dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    const { username } = payload;
    const user = await this.userService.find(username);

    if (!user) {
      return new UnauthorizedException();
    }

    return new GetUserDto(user);
  }
}
