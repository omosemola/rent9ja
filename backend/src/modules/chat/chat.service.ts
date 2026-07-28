// ============================================================================
// Chat Service - Messaging Business Logic
// ============================================================================

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(userId1: string, userId2: string, propertyId?: string) {
    // Check for existing conversation
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
        ...(propertyId && { propertyId }),
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, fullName: true, profilePicture: true, role: true },
            },
          },
        },
      },
    });

    if (existing) return existing;

    // Create new conversation
    return this.prisma.conversation.create({
      data: {
        propertyId,
        participants: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, fullName: true, profilePicture: true, role: true },
            },
          },
        },
      },
    });
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
    mediaUrl?: string,
  ) {
    // Verify sender is a participant
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: senderId },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        type,
        mediaUrl,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePicture: true },
        },
      },
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50) {
    // Verify user is a participant
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('Not a participant');
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId, isDeleted: false },
        include: {
          sender: {
            select: { id: true, fullName: true, profilePicture: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({
        where: { conversationId, isDeleted: false },
      }),
    ]);

    return {
      data: messages.reverse(),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get user's conversations list
   */
  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId, isDeleted: false },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, fullName: true, profilePicture: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true, content: true, type: true, senderId: true,
            isRead: true, createdAt: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Count unread messages per conversation
    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });
        return { ...conv, unreadCount };
      }),
    );

    return withUnread;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true, readAt: new Date() },
    });

    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    });

    return { message: 'Messages marked as read' };
  }

  /**
   * Delete a conversation (soft delete)
   */
  async deleteConversation(conversationId: string, userId: string) {
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId },
      data: { isDeleted: true },
    });
    return { message: 'Conversation deleted' };
  }

  /**
   * Block/unblock a user in conversation
   */
  async toggleBlock(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });

    if (!participant) throw new NotFoundException('Conversation not found');

    await this.prisma.conversationParticipant.update({
      where: { id: participant.id },
      data: { hasBlocked: !participant.hasBlocked },
    });

    return { blocked: !participant.hasBlocked };
  }
}
