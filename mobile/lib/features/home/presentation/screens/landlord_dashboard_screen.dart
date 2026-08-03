// ============================================================================
// Landlord Dashboard Screen
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';

class LandlordDashboardScreen extends StatelessWidget {
  const LandlordDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    void showComingSoon(String feature) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('$feature coming soon!', style: const TextStyle(fontWeight: FontWeight.w600)),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: AppColors.primary,
      ));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Very light cool grey background
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 0,
            floating: true,
            pinned: true,
            elevation: 0,
            backgroundColor: const Color(0xFFF8FAFC),
            title: Row(
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF042F2E), Color(0xFF064E3B)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4)),
                    ],
                  ),
                  child: const Icon(Icons.dashboard_rounded, color: Colors.white, size: 22),
                ),
                const SizedBox(width: 12),
                Text('Dashboard', style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF0F172A),
                  letterSpacing: -0.5,
                )),
              ],
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: IconButton(
                  onPressed: () => context.push('/notifications'),
                  icon: const Icon(Icons.notifications_outlined, size: 24, color: Color(0xFF475569)),
                ),
              ),
            ],
          ),

          // Welcome Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
              child: BlocBuilder<AuthBloc, AuthState>(
                builder: (context, authState) {
                  final user = authState is AuthAuthenticated ? authState.user : <String, dynamic>{};
                  final fullName = user['fullName']?.toString() ?? 'Landlord';

                  return Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF022C22), Color(0xFF064E3B)], // Deep premium green
                        begin: Alignment.bottomLeft,
                        end: Alignment.topRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF064E3B).withOpacity(0.4),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Welcome Back,', style: TextStyle(color: Color(0xFFA7F3D0), fontSize: 15, fontWeight: FontWeight.w500)),
                                const SizedBox(height: 6),
                                Text('$fullName', style: const TextStyle(
                                  color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.5
                                )),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: Colors.white.withOpacity(0.2)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.verified_rounded, size: 16, color: Color(0xFFFBBF24)),
                                  const SizedBox(width: 6),
                                  const Text('Verified', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 30),
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _DashStatMini(label: 'Total Views', value: '1,247', trend: '+12%', icon: Icons.visibility_rounded),
                              Container(width: 1, height: 40, color: Colors.white.withOpacity(0.2)),
                              _DashStatMini(label: 'Inquiries', value: '38', trend: '+5%', icon: Icons.chat_bubble_rounded),
                              Container(width: 1, height: 40, color: Colors.white.withOpacity(0.2)),
                              _DashStatMini(label: 'Conversion', value: '3.1%', trend: '+0.2%', icon: Icons.trending_up_rounded),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),

          // Stats Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Overview', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _DashCard(
                        icon: Icons.apartment_rounded, label: 'Active Listings', value: '8',
                        color: const Color(0xFF3B82F6), bgColor: Colors.white,
                      )),
                      const SizedBox(width: 16),
                      Expanded(child: _DashCard(
                        icon: Icons.pending_actions_rounded, label: 'Pending', value: '2',
                        color: const Color(0xFFF59E0B), bgColor: Colors.white,
                      )),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _DashCard(
                        icon: Icons.calendar_month_rounded, label: 'Appointments', value: '5',
                        color: const Color(0xFF8B5CF6), bgColor: Colors.white,
                      )),
                      const SizedBox(width: 16),
                      Expanded(child: _DashCard(
                        icon: Icons.favorite_rounded, label: 'Saved', value: '42',
                        color: const Color(0xFFEF4444), bgColor: Colors.white,
                      )),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 32)),

          // Quick Actions
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      _ActionButton(
                        icon: Icons.add_home_rounded,
                        label: 'Add Property',
                        color: const Color(0xFF10B981),
                        onTap: () => context.push('/create-property'),
                      ),
                      const SizedBox(width: 16),
                      _ActionButton(
                        icon: Icons.bar_chart_rounded,
                        label: 'Analytics',
                        color: const Color(0xFF3B82F6),
                        onTap: () => showComingSoon('Analytics'),
                      ),
                      const SizedBox(width: 16),
                      _ActionButton(
                        icon: Icons.workspace_premium_rounded,
                        label: 'Upgrade',
                        color: const Color(0xFFF59E0B),
                        onTap: () => context.push('/subscriptions'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 32)),

          // Recent Activity
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Recent Activity', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  TextButton(
                    onPressed: () => showComingSoon('Activity History'), 
                    style: TextButton.styleFrom(foregroundColor: AppColors.primary),
                    child: const Text('View All', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _ActivityItem(index: index),
                childCount: 4,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 32)),

          // My Properties
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Top Performing', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  TextButton(
                    onPressed: () => showComingSoon('Property Management'), 
                    style: TextButton.styleFrom(foregroundColor: AppColors.primary),
                    child: const Text('Manage', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _LandlordPropertyCard(index: index),
                childCount: 3,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),

      // FAB for adding property
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/create-property'),
        backgroundColor: const Color(0xFF064E3B), // Deep Green
        foregroundColor: Colors.white,
        elevation: 4,
        icon: const Icon(Icons.add_rounded),
        label: const Text('List Property', style: TextStyle(fontWeight: FontWeight.w700, letterSpacing: 0.5)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}

class _DashStatMini extends StatelessWidget {
  final String label;
  final String value;
  final String trend;
  final IconData icon;
  const _DashStatMini({required this.label, required this.value, required this.trend, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 24, color: const Color(0xFFA7F3D0)), // Light mint green
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 20)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Color(0xFFD1FAE5), fontSize: 12, fontWeight: FontWeight.w500)),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: const Color(0xFF34D399).withOpacity(0.2),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(trend, style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.bold)),
        ),
      ],
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
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: const Color(0xFF94A3B8).withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 28, color: Color(0xFF0F172A), letterSpacing: -0.5)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
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
          padding: const EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(color: const Color(0xFF94A3B8).withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
            ],
            border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 12),
              Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
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
      {'icon': Icons.visibility_rounded, 'color': const Color(0xFF3B82F6), 'title': 'New View', 'text': 'Tunde Bakare viewed your property in Lekki Phase 1', 'time': '2 min ago'},
      {'icon': Icons.chat_bubble_rounded, 'color': const Color(0xFF10B981), 'title': 'New Message', 'text': 'Ngozi Eze sent a message about Ajah Duplex', 'time': '15 min ago'},
      {'icon': Icons.calendar_today_rounded, 'color': const Color(0xFF8B5CF6), 'title': 'Inspection Booked', 'text': 'Inspection booked for Saturday at 11:00 AM', 'time': '1 hour ago'},
      {'icon': Icons.star_rounded, 'color': const Color(0xFFF59E0B), 'title': 'New Review', 'text': '5-star review from Bola Adeyemo', 'time': 'Yesterday'},
    ];

    final activity = activities[index % activities.length];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: const Color(0xFF94A3B8).withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
        ],
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: (activity['color'] as Color).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(activity['icon'] as IconData, color: activity['color'] as Color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
               crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(activity['title'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                    Text(activity['time'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(activity['text'] as String, style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.4)),
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
    final titles = ['Luxury 3-Bed Lekki Phase 1', 'Spacious 4-Bed Duplex Ajah', 'Modern Studio VI'];
    final prices = ['₦4,500,000/yr', '₦6,000,000/yr', '₦2,500,000/yr'];
    final statuses = ['Active', 'Active', 'Pending Review'];
    final statusColors = [const Color(0xFF10B981), const Color(0xFF10B981), const Color(0xFFF59E0B)];
    final views = ['342', '187', '—'];
    final inquiries = ['12', '8', '—'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: const Color(0xFF94A3B8).withOpacity(0.08), blurRadius: 12, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1),
      ),
      child: Column(
        children: [
          // Image / Header area
          Container(
            height: 120,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20)),
              gradient: LinearGradient(
                colors: [const Color(0xFFCBD5E1), const Color(0xFF94A3B8)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Stack(
              children: [
                Center(child: Icon(Icons.home_work_rounded, size: 48, color: Colors.white.withOpacity(0.5))),
                Positioned(
                  top: 12, right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4)],
                    ),
                    child: Text(statuses[index], style: TextStyle(color: statusColors[index], fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          
          // Content Area
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(child: Text(titles[index], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)))),
                    Text(prices[index], style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF064E3B))),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _StatBadge(icon: Icons.visibility_rounded, value: views[index], label: 'Views'),
                    const SizedBox(width: 16),
                    _StatBadge(icon: Icons.chat_bubble_rounded, value: inquiries[index], label: 'Inquiries'),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(10)),
                      child: const Icon(Icons.edit_rounded, size: 16, color: Color(0xFF64748B)),
                    ),
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

class _StatBadge extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  const _StatBadge({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF64748B)),
        const SizedBox(width: 6),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF334155))),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
      ],
    );
  }
}
