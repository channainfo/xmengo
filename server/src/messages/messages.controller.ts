import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('messages')
@Controller('messages')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('match/:matchId')
  @ApiOperation({ summary: 'Send a message in a match' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of this match' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  sendMessage(
    @Req() req,
    @Param('matchId') matchId: string,
    @Body() messageData: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(req.user.id, matchId, messageData.content);
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: 'Get messages for a match' })
  @ApiResponse({ status: 200, description: 'Return messages' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of this match' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  getMessages(@Req() req, @Param('matchId') matchId: string) {
    return this.messagesService.getMessages(req.user.id, matchId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread message count' })
  @ApiResponse({ status: 200, description: 'Return unread count' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUnreadCount(@Req() req) {
    return this.messagesService.getUnreadMessagesCount(req.user.id).then(count => ({ unreadCount: count }));
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the sender of this message' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  deleteMessage(@Req() req, @Param('messageId') messageId: string) {
    return this.messagesService.deleteMessage(req.user.id, messageId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  @ApiResponse({ status: 200, description: 'Return conversations' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getConversations(@Req() req) {
    return this.messagesService.getConversations(req.user.id);
  }
}
