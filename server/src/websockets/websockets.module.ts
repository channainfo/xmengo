import { Module, forwardRef } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { WebsocketClientService } from './websocket-client.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
  ],
  providers: [WebsocketsGateway, WebsocketClientService],
  exports: [WebsocketsGateway, WebsocketClientService],
})
export class WebsocketsModule {}
