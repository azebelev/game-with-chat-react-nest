import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ValidateUserDetails } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findUser(
      { email: userDetails.username },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await bcrypt.compare(
      userDetails.password,
      user.password,
    );
    console.log(isPasswordValid);
    return isPasswordValid ? user : null;
  }
}
