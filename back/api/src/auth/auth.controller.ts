import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { username, id } = await this.authService.addUser(dto.username);
    req.session.user = { username, id };
    return res.send(HttpStatus.OK);
  }

  @Get('status')
  getStatus(@Req() req: Request) {
    return req.session.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      return res.sendStatus(200);
    });
  }
}
