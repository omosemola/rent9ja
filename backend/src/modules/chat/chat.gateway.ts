// ============================================================================
// Chat Gateway - Socket.IO Real-time Communication
// ============================================================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { RedisService } from '../../common/redis/redis.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;
      client.data.userId = userId;

      // Track socket
      const existing = this.userSockets.get(userId) || [];
      existing.push(client.id);
      this.userSockets.set(userId, existing);

      // Join user's personal room
      client.join(`user:${userId}`);

      // Set online status
      await this.redisService.setUserOnline(userId);

      // Notify contacts that user is online
      this.server.emit('user:online', { userId });

      this.logger.log(`User ${userId} connected (socket: ${client.id})`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    // Remove socket from tracking
    const sockets = this.userSockets.get(userId) || [];
    const remaining = sockets.filter((id) => id !== client.id);

    if (remaining.length === 0) {
      this.userSockets.delete(userId);
      this.server.emit('user:offline', { userId });
    } else {
      this.userSockets.set(userId, remaining);
    }

    this.logger.log(`User ${userId} disconnected`);
  }

  @SubscribeMessage('join:conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    this.logger.log(`User ${client.data.userId} joined conversation ${data.conversationId}`);
  }

  @SubscribeMessage('leave:conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      conversationId: string;
      content: string;
      type?: string;
      mediaUrl?: string;
    },
  ) {
    const userId = client.data.userId;
    const message = await this.chatService.sendMessage(
      data.conversationId,
      userId,
      data.content,
      (data.type as any) || 'TEXT',
      data.mediaUrl,
    );

    // Broadcast to all participants in the conversation room
    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('message:received', message);

    // Send push notification to offline users (via user rooms)
    // The notification module would handle this
    return message;
  }

  @SubscribeMessage('message:read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    await this.chatService.markAsRead(data.conversationId, userId);

    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('message:read', { conversationId: data.conversationId, userId });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client
      .to(`conversation:${data.conversationId}`)
      .emit('typing:start', { userId: client.data.userId });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client
      .to(`conversation:${data.conversationId}`)
      .emit('typing:stop', { userId: client.data.userId });
  }
}
