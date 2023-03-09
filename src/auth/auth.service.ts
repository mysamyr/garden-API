import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { User, UserDocument } from "../models";
import {
  EMAIL_IN_USE,
  WRONG_CREDENTIALS,
} from "../common/constants/error-messages";
import { SignInTokenDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(user): Promise<any> {
    const isUserFound: UserDocument[] = await this.userModel.findOne({
      email: user.email,
    });

    if (isUserFound) {
      throw new BadRequestException(EMAIL_IN_USE);
    }

    const hash = await bcrypt.hash(user.password, +process.env.BCRYPT_SALT);
    await this.userModel.create({ ...user, password: hash });
  }

  async signIn({ email, password }): Promise<SignInTokenDto> {
    const user: UserDocument = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    const accessToken: string = this.jwtService.sign({ username: user.email });

    return { accessToken };
  }
}
