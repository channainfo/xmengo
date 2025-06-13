import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-telegram-official';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      botToken: configService.get('TELEGRAM_BOT_TOKEN'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, data: any, done: Function): Promise<any> {
    const user = {
      id: data.id.toString(),
      name: `${data.first_name} ${data.last_name || ''}`.trim(),
      username: data.username,
      photo_url: data.photo_url,
      accessToken: null,
      refreshToken: null,
    };

    const result = await this.authService.validateOAuthLogin(user, 'telegram');
    done(null, result);
  }
}
