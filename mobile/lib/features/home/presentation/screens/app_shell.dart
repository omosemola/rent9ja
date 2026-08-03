import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';

class AppShell extends StatelessWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context, bool isLandlord) {
    final location = GoRouterState.of(context).uri.toString();
    if (isLandlord) {
      if (location.startsWith('/home')) return 0;
      if (location.startsWith('/search')) return 1;
      if (location.startsWith('/create-property')) return 2;
      if (location.startsWith('/chat')) return 3;
      if (location.startsWith('/profile')) return 4;
      return 0;
    } else {
      if (location.startsWith('/home')) return 0;
      if (location.startsWith('/search')) return 1;
      if (location.startsWith('/favorites')) return 2;
      if (location.startsWith('/chat')) return 3;
      if (location.startsWith('/profile')) return 4;
      return 0;
    }
  }

  void _onItemTapped(int index, BuildContext context, bool isLandlord) {
    if (isLandlord) {
      switch (index) {
        case 0: context.go('/home'); break;
        case 1: context.go('/search'); break;
        case 2: context.push('/create-property'); break;
        case 3: context.go('/chat'); break;
        case 4: context.go('/profile'); break;
      }
    } else {
      switch (index) {
        case 0: context.go('/home'); break;
        case 1: context.go('/search'); break;
        case 2: context.go('/favorites'); break;
        case 3: context.go('/chat'); break;
        case 4: context.go('/profile'); break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, authState) {
        final role = authState is AuthAuthenticated ? authState.role : 'HUNTER';
        final isLandlord = role == 'LANDLORD' || role == 'ADMIN';

        return Scaffold(
          body: child,
          bottomNavigationBar: Container(
            decoration: BoxDecoration(
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: NavigationBar(
              selectedIndex: _calculateSelectedIndex(context, isLandlord),
              onDestinationSelected: (i) => _onItemTapped(i, context, isLandlord),
              height: 72,
              elevation: 0,
              indicatorColor: AppColors.primarySurface,
              destinations: isLandlord
                  ? const [
                      NavigationDestination(
                        icon: Icon(Icons.dashboard_outlined),
                        selectedIcon: Icon(Icons.dashboard_rounded),
                        label: 'Dashboard',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.search_outlined),
                        selectedIcon: Icon(Icons.search_rounded),
                        label: 'Listings',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.add_circle_outline_rounded),
                        selectedIcon: Icon(Icons.add_circle_rounded),
                        label: 'Add Property',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.chat_bubble_outline_rounded),
                        selectedIcon: Icon(Icons.chat_bubble_rounded),
                        label: 'Inquiries',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.person_outline_rounded),
                        selectedIcon: Icon(Icons.person_rounded),
                        label: 'Profile',
                      ),
                    ]
                  : const [
                      NavigationDestination(
                        icon: Icon(Icons.home_outlined),
                        selectedIcon: Icon(Icons.home_rounded),
                        label: 'Home',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.search_outlined),
                        selectedIcon: Icon(Icons.search_rounded),
                        label: 'Search',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.favorite_outline_rounded),
                        selectedIcon: Icon(Icons.favorite_rounded),
                        label: 'Saved',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.chat_bubble_outline_rounded),
                        selectedIcon: Icon(Icons.chat_bubble_rounded),
                        label: 'Chat',
                      ),
                      NavigationDestination(
                        icon: Icon(Icons.person_outline_rounded),
                        selectedIcon: Icon(Icons.person_rounded),
                        label: 'Profile',
                      ),
                    ],
            ),
          ),
        );
      },
    );
  }
}

