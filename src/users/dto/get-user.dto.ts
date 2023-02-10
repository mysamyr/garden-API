export class GetUserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;

  constructor(user) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
  }
}
