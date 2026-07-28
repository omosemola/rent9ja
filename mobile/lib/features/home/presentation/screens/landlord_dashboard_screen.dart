// ============================================================================
// Landlord Dashboard Screen
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class LandlordDashboardScreen extends StatelessWidget {
  const LandlordDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 0,
            floating: true,
            pinned: true,
            backgroundColor: Theme.of(context).scaffoldBackgroundColor,
            title: Row(
              children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.dashboard_rounded, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 10),
                Text('Dashboard', style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                )),
              ],
            ),
            actions: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_outlined, size: 26)),
              const SizedBox(width: 8),
            ],
          ),

          // Welcome Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Good Morning,', style: TextStyle(color: Colors.white70, fontSize: 14)),
                            const SizedBox(height: 4),
                            const Text('Chief Adebayo 👋', style: TextStyle(
                              color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700,
                            )),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.star_rounded, size: 16, color: AppColors.accentLight),
                              const SizedBox(width: 4),
                              const Text('Premium', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        _DashStatMini(label: 'Views', value: '1,247', icon: Icons.visibility_rounded),
                        const SizedBox(width: 16),
                        _DashStatMini(label: 'Inquiries', value: '38', icon: Icons.chat_bubble_rounded),
                        const SizedBox(width: 16),
                        _DashStatMini(label: 'Conversion', value: '3.1%', icon: Icons.trending_up_rounded),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Stats Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(child: _DashCard(
                    icon: Icons.apartment_rounded, label: 'Active', value: '8',
                    color: AppColors.primary, bgColor: AppColors.primarySurface,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _DashCard(
                    icon: Icons.pending_outlined, label: 'Pending', value: '2',
                    color: AppColors.warning, bgColor: AppColors.warning.withOpacity(0.1),
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _DashCard(
                    icon: Icons.calendar_today_rounded, label: 'Appointments', value: '5',
                    color: AppColors.info, bgColor: AppColors.info.withOpacity(0.1),
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _DashCard(
                    icon: Icons.favorite_rounded, label: 'Saved', value: '42',
                    color: AppColors.error, bgColor: AppColors.error.withOpacity(0.1),
                  )),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 28)),

          // Quick Actions
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Quick Actions', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _ActionButton(
                        icon: Icons.add_home_rounded,
                        label: 'Add\nProperty',
                        color: AppColors.primary,
                        onTap: () {},
                      ),
                      const SizedBox(width: 12),
                      _ActionButton(
                        icon: Icons.calendar_month_rounded,
                        label: 'View\nSchedule',
                        color: AppColors.info,
                        onTap: () {},
                      ),
                      const SizedBox(width: 12),
                      _ActionButton(
                        icon: Icons.analytics_rounded,
                        label: 'Full\nAnalytics',
                        color: AppColors.accent,
                        onTap: () {},
                      ),
                      const SizedBox(width: 12),
                      _ActionButton(
                        icon: Icons.workspace_premium_rounded,
                        label: 'Upgrade\nPlan',
                        color: AppColors.accentDark,
                        onTap: () {},
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 28)),

          // Recent Activity
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Activity', style: Theme.of(context).textTheme.headlineSmall),
                  TextButton(onPressed: () {}, child: Text('View All', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600))),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _ActivityItem(index: index),
                childCount: 5,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 28)),

          // My Properties
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('My Properties', style: Theme.of(context).textTheme.headlineSmall),
                  TextButton(onPressed: () {}, child: Text('Manage All', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600))),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _LandlordPropertyCard(index: index),
                childCount: 4,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),

      // FAB for adding property
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('List Property', style: TextStyle(fontWeight: FontWeight.w600)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}

class _DashStatMini extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _DashStatMini({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: Colors.white70),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(color: Colors.white70, fontSize: 11)),
          ],
        ),
      ),
    );
  }
}

class _DashCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final Color bgColor;
  const _DashCard({required this.icon, required this.label, required this.value, required this.color, required this.bgColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: color)),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _ActionButton({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Theme.of(context).cardTheme.color,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border, width: 0.5),
          ),
          child: Column(
            children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(height: 10),
              Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, height: 1.2)),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final int index;
  const _ActivityItem({required this.index});

  @override
  Widget build(BuildContext context) {
    final activities = [
      {'icon': Icons.visibility_rounded, 'color': AppColors.info, 'text': 'Tunde Bakare viewed your property in Lekki Phase 1', 'time': '2 min ago'},
      {'icon': Icons.chat_bubble_rounded, 'color': AppColors.primary, 'text': 'New message from Ngozi Eze about Ajah Duplex', 'time': '15 min ago'},
      {'icon': Icons.calendar_today_rounded, 'color': AppColors.accent, 'text': 'Inspection booked for Saturday at 11:00 AM', 'time': '1 hour ago'},
      {'icon': Icons.favorite_rounded, 'color': AppColors.error, 'text': 'Your Victoria Island studio was saved 5 times today', 'time': '3 hours ago'},
      {'icon': Icons.star_rounded, 'color': AppColors.warning, 'text': 'New 5-star review from Bola Adeyemo', 'time': 'Yesterday'},
    ];

    final activity = activities[index % activities.length];

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.3),
      ),
      child: Row(
        children: [
          Container(
            width: 42, height: 42,
            decoration: BoxDecoration(
              color: (activity['color'] as Color).withOpacity(0.1),
              borderRadius: BorderRadius.circular(11),
            ),
            child: Icon(activity['icon'] as IconData, color: activity['color'] as Color, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(activity['text'] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w400, height: 1.3), maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(activity['time'] as String, style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LandlordPropertyCard extends StatelessWidget {
  final int index;
  const _LandlordPropertyCard({required this.index});

  @override
  Widget build(BuildContext context) {
    final titles = ['3-Bed Lekki Phase 1', '4-Bed Duplex Ajah', 'Studio VI', '5-Bed GRA PH'];
    final statuses = ['Active', 'Active', 'Pending Review', 'Active'];
    final statusColors = [AppColors.success, AppColors.success, AppColors.warning, AppColors.success];
    final views = ['342', '187', '—', '456'];
    final inquiries = ['12', '8', '—', '18'];

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 0.5),
      ),
      child: Row(
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(colors: [
                AppColors.primary.withOpacity(0.15 + (index * 0.1)),
                AppColors.primaryDark.withOpacity(0.35),
              ]),
            ),
            child: Center(child: Icon(Icons.home_rounded, size: 28, color: Colors.white.withOpacity(0.4))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(titles[index], style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: statusColors[index].withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(statuses[index], style: TextStyle(color: statusColors[index], fontSize: 11, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.visibility_outlined, size: 14, color: AppColors.textTertiary),
                    const SizedBox(width: 4),
                    Text(views[index], style: TextStyle(fontSize: 12, color: AppColors.textTertiary)),
                    const SizedBox(width: 16),
                    Icon(Icons.chat_bubble_outline, size: 14, color: AppColors.textTertiary),
                    const SizedBox(width: 4),
                    Text(inquiries[index], style: TextStyle(fontSize: 12, color: AppColors.textTertiary)),
                    const Spacer(),
                    Icon(Icons.more_horiz_rounded, size: 20, color: AppColors.textTertiary),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
