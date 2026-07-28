// ============================================================================
// Subscription Plans Screen
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class SubscriptionPlansScreen extends StatelessWidget {
  const SubscriptionPlansScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Subscription Plans')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Header
            Text('Choose Your Plan', style: Theme.of(context).textTheme.displaySmall),
            const SizedBox(height: 8),
            Text('Unlock premium features for your listings',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
            const SizedBox(height: 32),

            // Free Plan
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Basic', style: Theme.of(context).textTheme.headlineSmall),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text('Current', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Free', style: TextStyle(color: AppColors.primary, fontSize: 28, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 20),
                  ...[
                    'Up to 3 property listings',
                    'Basic analytics',
                    'Standard support',
                    'Limited chat messages',
                  ].map((f) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(children: [
                      Icon(Icons.check_circle_rounded, size: 20, color: AppColors.success),
                      const SizedBox(width: 10),
                      Text(f, style: const TextStyle(fontSize: 14)),
                    ]),
                  )),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Premium Plan
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text('Premium', style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white)),
                          const SizedBox(width: 8),
                          Icon(Icons.workspace_premium_rounded, color: AppColors.accentLight, size: 24),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: AppColors.goldGradient,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text('Recommended', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text('₦15,000', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                      Text('/month', style: TextStyle(color: Colors.white70, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...[
                    'Unlimited property listings',
                    'Featured listings badge',
                    'Priority in search results',
                    'Verified landlord badge',
                    'Advanced analytics dashboard',
                    'Higher visibility in searches',
                    'Unlimited chat messages',
                    'Premium support (24/7)',
                  ].map((f) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(children: [
                      Icon(Icons.check_circle_rounded, size: 20, color: AppColors.accentLight),
                      const SizedBox(width: 10),
                      Text(f, style: const TextStyle(fontSize: 14, color: Colors.white)),
                    ]),
                  )),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.primaryDark,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Upgrade to Premium', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text('Cancel anytime. No hidden fees.',
              style: TextStyle(color: AppColors.textTertiary, fontSize: 13)),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
