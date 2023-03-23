import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { User, UserDocument } from "../models";
import {
  EMAIL_IN_USE,
  EMAILS_MATCH,
  PASSWORDS_MATCH,
  PHONE_NUMBER_IN_USE,
  PHONE_NUMBERS_MATCH,
  WRONG_CREDENTIALS,
} from "../common/constants/error-messages";
import {
  CreateUserDto,
  GetUserDto,
  SignInTokenDto,
  SignInUserDto,
  ChangePasswordDto,
  ChangePhoneDto,
} from "./dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto): Promise<any> {
    const isUserFound: UserDocument[] = await this.userModel.findOne({
      email: user.email,
    });

    if (isUserFound) {
      throw new BadRequestException(EMAIL_IN_USE);
    }

    const hash = await bcrypt.hash(user.password, +process.env.BCRYPT_SALT);
    await this.userModel.create({ ...user, password: hash });
  }

  async signIn(credentials: SignInUserDto): Promise<SignInTokenDto> {
    const user: UserDocument = await this.checkUserData(credentials);

    const accessToken: string = this.jwtService.sign({ username: user.email });

    return { accessToken };
  }

  async changeEmail(
    credentials: SignInUserDto,
    user: GetUserDto,
  ): Promise<SignInTokenDto> {
    if (user.email === credentials.email) {
      throw new BadRequestException(EMAILS_MATCH);
    }
    const isEmailInUse = await this.userModel.findOne({
      email: credentials.email,
    });
    if (isEmailInUse) {
      throw new BadRequestException(EMAIL_IN_USE);
    }
    const dbUser: UserDocument = await this.checkUserData(credentials);
    dbUser.email = credentials.email;
    await dbUser.save();

    const accessToken: string = this.jwtService.sign({ username: user.email });

    return { accessToken };
  }

  async changePassword(
    { password, newPassword }: ChangePasswordDto,
    user: GetUserDto,
  ): Promise<any> {
    if (password === newPassword) {
      throw new BadRequestException(PASSWORDS_MATCH);
    }

    const dbUser: UserDocument = await this.userModel.findById(user.id);
    await this.verifyPassword(dbUser.password, password);

    dbUser.password = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT);
    await dbUser.save();
  }

  async changePhone(
    { phone, password }: ChangePhoneDto,
    user: GetUserDto,
  ): Promise<any> {
    if (user.phone === phone) {
      throw new BadRequestException(PHONE_NUMBERS_MATCH);
    }
    const isPhoneInUse = await this.userModel.findOne({ phone });
    if (isPhoneInUse) {
      throw new BadRequestException(PHONE_NUMBER_IN_USE);
    }
    const dbUser: UserDocument = await this.userModel.findById(user.id);
    await this.verifyPassword(dbUser.password, password);

    dbUser.phone = phone;
    await dbUser.save();
  }

  private async checkUserData({
    email,
    password,
  }: SignInUserDto): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    await this.verifyPassword(user.password, password);

    return user;
  }
  private async verifyPassword(oldPass, newPass): Promise<void> {
    const isMatch: boolean = await bcrypt.compare(oldPass, newPass);

    if (!isMatch) {
      throw new BadRequestException(WRONG_CREDENTIALS);
    }
  }
}
