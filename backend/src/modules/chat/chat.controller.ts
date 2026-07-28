import { Controller, Get, Post, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  async getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start or get a conversation with another user' })
  async startConversation(
    @Req() req: any,
    @Body() body: { recipientId: string; propertyId?: string },
  ) {
    return this.chatService.getOrCreateConversation(req.user.id, body.recipientId, body.propertyId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  async getMessages(
    @Param('id') id: string,
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(id, req.user.id, page, limit);
  }

  @Post('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all messages as read' })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.chatService.markAsRead(id, req.user.id);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(@Param('id') id: string, @Req() req: any) {
    return this.chatService.deleteConversation(id, req.user.id);
  }

  @Post('conversations/:id/block')
  @ApiOperation({ summary: 'Block/unblock user in conversation' })
  async toggleBlock(@Param('id') id: string, @Req() req: any) {
    return this.chatService.toggleBlock(id, req.user.id);
  }
}
