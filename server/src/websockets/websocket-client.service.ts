import { Injectable, Logger } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';

/**
 * Service for frontend clients to interact with the WebSocket gateway
 * This service provides methods for sending real-time updates to connected clients
 */
@Injectable()
export class WebsocketClientService {
  private readonly logger = new Logger(WebsocketClientService.name);

  constructor(private websocketsGateway: WebsocketsGateway) {}

  /**
   * Send a notification to a specific user
   */
  sendNotificationToUser(userId: string, notification: any): void {
    this.websocketsGateway.sendNotificationToUser(userId, notification);
    this.logger.debug(`Notification sent to user ${userId}`);
  }

  /**
   * Send a message to a match room
   */
  sendMessageToMatch(matchId: string, message: any): void {
    this.websocketsGateway.sendMessageToMatch(matchId, message);
    this.logger.debug(`Message sent to match ${matchId}`);
  }

  /**
   * Broadcast user online status
   */
  broadcastUserStatus(userId: string, isOnline: boolean): void {
    this.websocketsGateway.broadcastUserStatus(userId, isOnline);
    this.logger.debug(`User ${userId} status broadcasted: ${isOnline ? 'online' : 'offline'}`);
  }

  /**
   * Send a system notification to all connected users
   */
  broadcastSystemNotification(title: string, message: string): void {
    this.websocketsGateway.server.emit('systemNotification', {
      title,
      message,
      timestamp: new Date(),
    });
    this.logger.debug(`System notification broadcasted: ${title}`);
  }

  /**
   * Send a targeted promotion to specific users
   */
  sendTargetedPromotion(userIds: string[], promotionData: any): void {
    for (const userId of userIds) {
      this.websocketsGateway.sendNotificationToUser(userId, {
        type: 'promotion',
        ...promotionData,
        timestamp: new Date(),
      });
    }
    this.logger.debug(`Promotion sent to ${userIds.length} users`);
  }

  /**
   * Notify users about new matches in their area
   */
  notifyAboutNewMatches(userId: string, matchCount: number): void {
    this.websocketsGateway.sendNotificationToUser(userId, {
      type: 'newMatches',
      message: `${matchCount} new potential matches in your area!`,
      timestamp: new Date(),
    });
    this.logger.debug(`New matches notification sent to user ${userId}`);
  }
}
