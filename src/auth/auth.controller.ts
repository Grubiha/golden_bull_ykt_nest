import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth,dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const userData = await this.authService.login(dto);
    await this.setRefreshTokenToCookie(userData.refreshToken, res);
    return userData;
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    await this.setRefreshTokenToCookie(userData.refreshToken, res);
    return userData;
  }

  private async setRefreshTokenToCookie(refreshToken: string, res: Response) {
    const now = new Date().getTime();
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(
        now + Number(process.env.JWT_REFRESH_EXPIRE) * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }
}
