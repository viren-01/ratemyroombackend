import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getallusers')
  async getAllUsers() {
      const resp = await this.userService.getAllUsers();
      return resp;
  }
}
 