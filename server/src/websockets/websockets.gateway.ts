import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatusService } from '../users/user-status.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketsGateway.name);
  private userSocketMap: Map<string, string> = new Map(); // userId -> socketId
  private socketUserMap: Map<string, string> = new Map(); // socketId -> userId

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserStatusService))
    private userStatusService: UserStatusService,
  ) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Get userId from socketId
    const userId = this.socketUserMap.get(client.id);
    
    if (userId) {
      // Update user status to offline
      this.userStatusService.userDisconnected(userId);
      
      // Clean up maps
      this.userSocketMap.delete(userId);
      this.socketUserMap.delete(client.id);
      
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuthentication(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { token: string },
  ) {
    try {
      const decodedToken = this.jwtService.verify(payload.token);
      const userId = decodedToken.sub;
      
      // Store the user's socket connection in both maps
      this.userSocketMap.set(userId, client.id);
      this.socketUserMap.set(client.id, userId);
      
      // Mark user as online
      await this.userStatusService.userConnected(userId);
      
      this.logger.log(`User ${userId} authenticated and marked online`);
      
      // Join user to their private room
      client.join(`user-${userId}`);
      
      return { status: 'authenticated', userId };
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      return { status: 'error', message: 'Authentication failed' };
    }
  }

  @SubscribeMessage('joinMatch')
  handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { matchId: string },
  ) {
    // Update user activity
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      this.userStatusService.updateUserActivity(userId);
    }
    
    client.join(`match-${payload.matchId}`);
    this.logger.log(`Client ${client.id} joined match room: ${payload.matchId}`);
    return { status: 'joined', matchId: payload.matchId };
  }

  @SubscribeMessage('leaveMatch')
  handleLeaveMatch(client: Socket, payload: { matchId: string }) {
    client.leave(`match-${payload.matchId}`);
    this.logger.log(`Client ${client.id} left match room: ${payload.matchId}`);
    return { status: 'left', matchId: payload.matchId };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { matchId: string, isTyping: boolean },
  ) {
    // Update user activity
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      this.userStatusService.updateUserActivity(userId);
    }
    
    // Broadcast to everyone in the match room except the sender
    client.to(`match-${payload.matchId}`).emit('userTyping', {
      userId: userId,
      matchId: payload.matchId,
      isTyping: payload.isTyping,
    });
    return { status: 'ok' };
  }

  // Method to send notification to a specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
    this.logger.log(`Notification sent to user ${userId}`);
  }

  // Method to send message to a match room
  sendMessageToMatch(matchId: string, message: any) {
    this.server.to(`match-${matchId}`).emit('newMessage', message);
    this.logger.log(`Message sent to match ${matchId}`);
  }

  // Method to broadcast online status of a user
  broadcastUserStatus(userId: string, isOnline: boolean) {
    this.server.emit('userStatus', { userId, isOnline, timestamp: new Date() });
    this.logger.log(`User ${userId} status broadcasted: ${isOnline ? 'online' : 'offline'}`);
  }
  
  // Method to get online status of users
  @SubscribeMessage('getOnlineStatus')
  handleGetOnlineStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userIds: string[] },
  ) {
    // Update user activity
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      this.userStatusService.updateUserActivity(userId);
    }
    
    const onlineStatus = this.userStatusService.getOnlineStatus(payload.userIds);
    return { status: 'ok', onlineStatus };
  }
}
