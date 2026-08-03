// ============================================================================
// Conversations Screen - Chat List
// ============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class ConversationsScreen extends StatelessWidget {
  const ConversationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    void showComingSoon(String feature) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$feature coming soon!')));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [
          IconButton(onPressed: () => showComingSoon('Search Conversations'), icon: const Icon(Icons.search_rounded)),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: 6,
        itemBuilder: (context, index) {
          final names = ['Chief Adebayo', 'Amaka C.', 'Ibrahim M.', 'Chidinma O.', 'Emeka N.', 'Admin Support'];
          final messages = [
            'Yes, the apartment is still available for viewing...',
            'I can schedule an inspection for next week.',
            'The rent includes service charge for this year.',
            'Let me send you the floor plan.',
            'Thanks for your interest! When would you like to visit?',
            'Your account has been verified successfully.',
          ];
          final times = ['2m ago', '15m ago', '1h ago', '3h ago', 'Yesterday', '2 days ago'];
          final unread = [2, 0, 1, 0, 3, 0];
          final isOnline = [true, false, true, false, true, false];

          return Container(
            margin: const EdgeInsets.only(bottom: 4),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(vertical: 8),
              leading: Stack(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: AppColors.primarySurface,
                    child: Text(
                      names[index].substring(0, 2).toUpperCase(),
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 15),
                    ),
                  ),
                  if (isOnline[index])
                    Positioned(
                      right: 0, bottom: 2,
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
              title: Row(
                children: [
                  Expanded(
                    child: Text(names[index], style: TextStyle(
                      fontWeight: unread[index] > 0 ? FontWeight.w700 : FontWeight.w500,
                      fontSize: 15,
                    )),
                  ),
                  Text(times[index], style: TextStyle(
                    fontSize: 12,
                    color: unread[index] > 0 ? AppColors.primary : AppColors.textTertiary,
                    fontWeight: unread[index] > 0 ? FontWeight.w600 : FontWeight.w400,
                  )),
                ],
              ),
              subtitle: Row(
                children: [
                  Expanded(
                    child: Text(
                      messages[index],
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        color: unread[index] > 0 ? AppColors.textPrimary : AppColors.textTertiary,
                        fontWeight: unread[index] > 0 ? FontWeight.w500 : FontWeight.w400,
                      ),
                    ),
                  ),
                  if (unread[index] > 0)
                    Container(
                      width: 22, height: 22,
                      margin: const EdgeInsets.only(left: 8),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text('${unread[index]}', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                      ),
                    ),
                ],
              ),
              onTap: () => context.push('/chat/1'),
            ),
          );
        },
      ),
    );
  }
}
