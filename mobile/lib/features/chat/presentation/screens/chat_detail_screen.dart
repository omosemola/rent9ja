// ============================================================================
// Chat Detail Screen - Real-time Messaging UI
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class ChatDetailScreen extends StatefulWidget {
  final String recipientName;
  final String propertyTitle;

  const ChatDetailScreen({
    super.key,
    required this.recipientName,
    this.propertyTitle = '',
  });

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();

  // Demo messages
  final List<Map<String, dynamic>> _messages = [
    {'text': 'Hello! I\'m interested in the property at Lekki Phase 1.', 'isMe': true, 'time': '10:30 AM'},
    {'text': 'Good morning! Yes, the property is still available. Would you like to schedule an inspection?', 'isMe': false, 'time': '10:32 AM'},
    {'text': 'That would be great. Is this weekend available?', 'isMe': true, 'time': '10:33 AM'},
    {'text': 'Yes, Saturday works. How about 11am? I\'ll meet you at the estate gate.', 'isMe': false, 'time': '10:35 AM'},
    {'text': 'The estate is well-maintained with 24/7 security and you\'ll love the swimming pool area 🏊‍♂️', 'isMe': false, 'time': '10:35 AM'},
    {'text': 'Perfect! Saturday at 11am it is. Can you share the exact address?', 'isMe': true, 'time': '10:38 AM'},
    {'text': '12 Admiralty Way, Lekki Phase 1, Lagos. There\'s a big blue gate - you can\'t miss it. Ask for Chief Adebayo at the security post.', 'isMe': false, 'time': '10:40 AM'},
    {'text': 'Thank you! One more question - does the rent include service charge?', 'isMe': true, 'time': '10:42 AM'},
    {'text': 'The annual rent is ₦3.5M and service charge is separate at ₦1M per year. I can break down all the move-in costs when we meet.', 'isMe': false, 'time': '10:45 AM'},
  ];

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$feature coming soon!')));
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;
    setState(() {
      _messages.add({
        'text': _messageController.text.trim(),
        'isMe': true,
        'time': 'Just now',
      });
      _messageController.clear();
    });
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            Stack(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: AppColors.primarySurface,
                  child: Text(
                    widget.recipientName.substring(0, 2).toUpperCase(),
                    style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 14),
                  ),
                ),
                Positioned(
                  right: 0, bottom: 0,
                  child: Container(
                    width: 12, height: 12,
                    decoration: BoxDecoration(
                      color: AppColors.success,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.recipientName,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                  Text('Online', style: TextStyle(color: AppColors.success, fontSize: 12, fontWeight: FontWeight.w500)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(onPressed: () => _showComingSoon('Call'), icon: const Icon(Icons.phone_outlined)),
          IconButton(onPressed: () => _showComingSoon('More Options'), icon: const Icon(Icons.more_vert_rounded)),
        ],
      ),

      body: Column(
        children: [
          // Property context bar
          if (widget.propertyTitle.isNotEmpty)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              color: AppColors.primarySurface,
              child: Row(
                children: [
                  Icon(Icons.home_outlined, size: 18, color: AppColors.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      widget.propertyTitle,
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w500, fontSize: 13),
                      maxLines: 1, overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Icon(Icons.chevron_right_rounded, size: 18, color: AppColors.primary),
                ],
              ),
            ),

          // Messages list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isMe = msg['isMe'] as bool;
                final showAvatar = !isMe && (index == 0 || _messages[index - 1]['isMe']);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (!isMe && showAvatar)
                        Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: CircleAvatar(
                            radius: 14,
                            backgroundColor: AppColors.primarySurface,
                            child: Text(
                              widget.recipientName.substring(0, 1),
                              style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w700),
                            ),
                          ),
                        )
                      else if (!isMe)
                        const SizedBox(width: 36),

                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: isMe ? AppColors.primary : AppColors.surfaceVariant,
                            borderRadius: BorderRadius.only(
                              topLeft: const Radius.circular(18),
                              topRight: const Radius.circular(18),
                              bottomLeft: Radius.circular(isMe ? 18 : 4),
                              bottomRight: Radius.circular(isMe ? 4 : 18),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                msg['text'] as String,
                                style: TextStyle(
                                  color: isMe ? Colors.white : AppColors.textPrimary,
                                  fontSize: 14.5,
                                  height: 1.4,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    msg['time'] as String,
                                    style: TextStyle(
                                      color: isMe ? Colors.white70 : AppColors.textTertiary,
                                      fontSize: 11,
                                    ),
                                  ),
                                  if (isMe) ...[
                                    const SizedBox(width: 4),
                                    Icon(Icons.done_all_rounded, size: 14, color: Colors.white70),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Message input
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 32),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, -2))],
            ),
            child: Row(
              children: [
                // Attachment
                Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: IconButton(
                    onPressed: () => _showComingSoon('Attachments'),
                    icon: Icon(Icons.add_rounded, color: AppColors.textSecondary, size: 22),
                  ),
                ),
                const SizedBox(width: 10),

                // Text field
                Expanded(
                  child: Container(
                    constraints: const BoxConstraints(maxHeight: 120),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: TextField(
                      controller: _messageController,
                      maxLines: null,
                      textCapitalization: TextCapitalization.sentences,
                      decoration: InputDecoration(
                        hintText: 'Type a message...',
                        hintStyle: TextStyle(color: AppColors.textTertiary, fontSize: 15),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),

                // Send button
                Container(
                  width: 46, height: 46,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: IconButton(
                    onPressed: _sendMessage,
                    icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
