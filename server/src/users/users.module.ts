import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatusService } from './user-status.service';
import { WebsocketsModule } from '../websockets/websockets.module';

@Module({
  imports: [forwardRef(() => WebsocketsModule)],
  controllers: [UsersController],
  providers: [UsersService, UserStatusService, PrismaService],
  exports: [UsersService, UserStatusService],
})
export class UsersModule {}
