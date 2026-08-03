// ============================================================================
// Profile Screen
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    void showComingSoon(String feature) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$feature coming soon!')));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            onPressed: () => showComingSoon('Settings'),
            icon: const Icon(Icons.settings_outlined),
          ),
        ],
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          final user = authState is AuthAuthenticated ? authState.user : <String, dynamic>{};
          final role = authState is AuthAuthenticated ? authState.role : 'HUNTER';
          final fullName = user['fullName']?.toString() ?? (role == 'LANDLORD' ? 'Chief Adebayo Ogundimu' : 'Tunde Bakare');
          final roleLabel = role == 'LANDLORD'
              ? 'Landlord / Property Agent'
              : role == 'ADMIN'
                  ? 'Administrator'
                  : 'House Hunter';
          
          final initials = fullName
              .trim()
              .split(RegExp(r'\s+'))
              .where((s) => s.isNotEmpty)
              .map((s) => s[0])
              .take(2)
              .join('')
              .toUpperCase();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Profile card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 34,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        child: Text(
                          initials.isEmpty ? 'U' : initials,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 20),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              fullName,
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              roleLabel,
                              style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.verified, size: 14, color: Colors.white.withOpacity(0.9)),
                                  const SizedBox(width: 4),
                                  Text('Verified', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12, fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => context.push('/edit-profile'),
                        icon: const Icon(Icons.edit_outlined, color: Colors.white),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Stats
                Row(
                  children: [
                    _StatCard(
                      label: role == 'LANDLORD' ? 'Listings' : 'Saved',
                      value: role == 'LANDLORD' ? '8' : '12',
                      icon: role == 'LANDLORD' ? Icons.home_work_rounded : Icons.favorite_rounded,
                      color: role == 'LANDLORD' ? AppColors.primary : AppColors.error,
                    ),
                    const SizedBox(width: 12),
                    _StatCard(label: 'Viewed', value: '48', icon: Icons.visibility_rounded, color: AppColors.info),
                    const SizedBox(width: 12),
                    _StatCard(label: 'Chats', value: '6', icon: Icons.chat_bubble_rounded, color: AppColors.primary),
                  ],
                ),
                const SizedBox(height: 24),

                // Landlord Tools Section if Landlord
                if (role == 'LANDLORD' || role == 'ADMIN') ...[
                  _MenuSection(
                    title: 'Landlord & Agent Tools',
                    items: [
                      _MenuItem(
                        icon: Icons.add_business_outlined,
                        label: 'Post New Property',
                        onTap: () => context.push('/create-property'),
                      ),
                      _MenuItem(
                        icon: Icons.star_outline_rounded,
                        label: 'Subscription Plans',
                        onTap: () => context.push('/subscriptions'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],

                // Menu items
                _MenuSection(
                  title: 'Account',
                  items: [
                    _MenuItem(icon: Icons.person_outline, label: 'Edit Profile', onTap: () => context.push('/edit-profile')),
                    _MenuItem(icon: Icons.lock_outline, label: 'Change Password', onTap: () => showComingSoon('Change Password')),
                    _MenuItem(icon: Icons.notifications_outlined, label: 'Notifications', onTap: () => context.push('/notifications')),
                    _MenuItem(icon: Icons.shield_outlined, label: 'Verification', onTap: () => showComingSoon('Verification')),
                  ],
                ),
                const SizedBox(height: 16),

                _MenuSection(
                  title: 'Preferences',
                  items: [
                    _MenuItem(icon: Icons.dark_mode_outlined, label: 'Dark Mode', trailing: Switch(value: false, onChanged: (_) => showComingSoon('Dark Mode')), onTap: () => showComingSoon('Dark Mode')),
                    _MenuItem(icon: Icons.language_outlined, label: 'Language', trailing: Text('English', style: TextStyle(color: AppColors.textTertiary)), onTap: () => showComingSoon('Language')),
                    _MenuItem(icon: Icons.location_on_outlined, label: 'Preferred Locations', onTap: () => showComingSoon('Preferred Locations')),
                  ],
                ),
                const SizedBox(height: 16),

                _MenuSection(
                  title: 'Support',
                  items: [
                    _MenuItem(icon: Icons.help_outline, label: 'Help Center', onTap: () => showComingSoon('Help Center')),
                    _MenuItem(icon: Icons.privacy_tip_outlined, label: 'Privacy Policy', onTap: () => showComingSoon('Privacy Policy')),
                    _MenuItem(icon: Icons.description_outlined, label: 'Terms of Service', onTap: () => showComingSoon('Terms of Service')),
                    _MenuItem(icon: Icons.info_outline, label: 'About RentNaija', onTap: () => showComingSoon('About RentNaija')),
                  ],
                ),
                const SizedBox(height: 24),

                // Logout
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      context.read<AuthBloc>().add(AuthLogoutRequested());
                      context.go('/onboarding');
                    },
                    icon: const Icon(Icons.logout_rounded, color: AppColors.error),
                    label: const Text('Sign Out', style: TextStyle(color: AppColors.error)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.error),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text('Version 1.0.0', style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),

    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: color)),
            Text(label, style: TextStyle(fontSize: 12, color: AppColors.textTertiary)),
          ],
        ),
      ),
    );
  }
}

class _MenuSection extends StatelessWidget {
  final String title;
  final List<_MenuItem> items;
  const _MenuSection({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.labelMedium?.copyWith(fontSize: 13)),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: Theme.of(context).cardTheme.color,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border, width: 0.5),
          ),
          child: Column(children: items),
        ),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Widget? trailing;
  final VoidCallback onTap;
  const _MenuItem({required this.icon, required this.label, this.trailing, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon, size: 22, color: AppColors.textSecondary),
      title: Text(label, style: const TextStyle(fontSize: 15)),
      trailing: trailing ?? const Icon(Icons.chevron_right_rounded, color: AppColors.textTertiary),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}
