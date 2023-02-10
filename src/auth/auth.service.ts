import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { UserService } from "../users/user.service";
import { User, UserDocument } from "../models";
import {
  EMAIL_IN_USE,
  WRONG_CREDENTIALS,
} from "../common/constants/error-messages";
import { GetUserDto } from "../users/dto";

@Injectable()
export class AuthService {
  @Inject(UserService)
  private readonly userService: UserService;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(user): Promise<GetUserDto> {
    const users = await this.userService.find(user.email);

    if (users) {
      throw new BadRequestException(EMAIL_IN_USE);
    }

    const saltOfRounds = 10;
    const hash = await bcrypt.hash(user.password, saltOfRounds);
    const newUser = await (
      await this.userModel.create({ ...user, password: hash })
    ).toObject();

    return new GetUserDto(newUser);
  }

  async signIn({ email, password }): Promise<{ accessToken: string }> {
    const user = await this.userService.find(email);
    if (!user) {
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    const accessToken = this.jwtService.sign(
      { username: user.email },
      { secret: process.env.SECRET, expiresIn: "1h" },
    );

    return { accessToken };
  }
}
