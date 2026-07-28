// ============================================================================
// Notifications Screen
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () {},
            child: Text('Mark all read', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        itemCount: 8,
        itemBuilder: (context, index) {
          final items = [
            {'icon': Icons.home_rounded, 'color': AppColors.primary, 'title': 'New listing in your area', 'body': 'A new 3-bedroom apartment was listed in Lekki Phase 1 matching your preferences.', 'time': '5 min ago', 'read': false},
            {'icon': Icons.chat_bubble_rounded, 'color': AppColors.info, 'title': 'New message', 'body': 'Chief Adebayo sent you a message about the Lekki apartment.', 'time': '15 min ago', 'read': false},
            {'icon': Icons.calendar_today_rounded, 'color': AppColors.accent, 'title': 'Inspection reminder', 'body': 'You have an inspection scheduled for tomorrow at 11:00 AM at Lekki Phase 1.', 'time': '1 hour ago', 'read': false},
            {'icon': Icons.verified_rounded, 'color': AppColors.success, 'title': 'Property verified', 'body': 'The property at Admiralty Way has been verified by our team.', 'time': '2 hours ago', 'read': true},
            {'icon': Icons.favorite_rounded, 'color': AppColors.error, 'title': 'Price drop alert', 'body': 'A property you saved in Victoria Island dropped in price by ₦200,000.', 'time': '5 hours ago', 'read': true},
            {'icon': Icons.star_rounded, 'color': AppColors.warning, 'title': 'New review', 'body': 'You received a 5-star review from Ngozi Eze.', 'time': 'Yesterday', 'read': true},
            {'icon': Icons.payment_rounded, 'color': AppColors.success, 'title': 'Payment successful', 'body': 'Your premium subscription payment of ₦15,000 was successful.', 'time': '2 days ago', 'read': true},
            {'icon': Icons.campaign_rounded, 'color': AppColors.primary, 'title': 'Special offer', 'body': 'Upgrade to Premium and get 30% off your first month! Limited time offer.', 'time': '3 days ago', 'read': true},
          ];

          final item = items[index % items.length];
          final isRead = item['read'] as bool;

          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isRead
                  ? Theme.of(context).cardTheme.color
                  : AppColors.primarySurface.withOpacity(0.5),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isRead ? AppColors.border.withOpacity(0.3) : AppColors.primary.withOpacity(0.15),
                width: 0.5,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 42, height: 42,
                  decoration: BoxDecoration(
                    color: (item['color'] as Color).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(11),
                  ),
                  child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 20),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              item['title'] as String,
                              style: TextStyle(
                                fontWeight: isRead ? FontWeight.w500 : FontWeight.w700,
                                fontSize: 14,
                              ),
                            ),
                          ),
                          if (!isRead)
                            Container(
                              width: 8, height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item['body'] as String,
                        style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.3),
                        maxLines: 2, overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Text(item['time'] as String, style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
