// ============================================================================
// App Router - GoRouter Configuration
// ============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/register_screen.dart';
import '../features/auth/presentation/screens/onboarding_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/home/presentation/screens/app_shell.dart';
import '../features/search/presentation/screens/search_screen.dart';
import '../features/properties/presentation/screens/property_detail_screen.dart';
import '../features/chat/presentation/screens/conversations_screen.dart';
import '../features/profile/presentation/screens/profile_screen.dart';
import '../features/favorites/presentation/screens/favorites_screen.dart';
import '../features/profile/presentation/screens/edit_profile_screen.dart';
import '../features/notifications/presentation/screens/notifications_screen.dart';
import '../features/chat/presentation/screens/chat_detail_screen.dart';
import '../features/properties/presentation/screens/create_property_screen.dart';
import '../features/reviews/presentation/screens/reviews_screen.dart';
import '../features/subscriptions/presentation/screens/subscription_plans_screen.dart';
import '../features/appointments/presentation/screens/appointment_booking_screen.dart';
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/onboarding',
    routes: [
      // Onboarding
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // Auth
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegisterScreen(
          role: state.uri.queryParameters['role'] ?? 'HUNTER',
        ),
      ),

      // Main App Shell with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/search',
            builder: (context, state) => const SearchScreen(),
          ),
          GoRoute(
            path: '/favorites',
            builder: (context, state) => const FavoritesScreen(),
          ),
          GoRoute(
            path: '/chat',
            builder: (context, state) => const ConversationsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),

      // Property Detail
      GoRoute(
        path: '/property/:id',
        builder: (context, state) => PropertyDetailScreen(
          propertyId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: '/chat/:id',
        builder: (context, state) => ChatDetailScreen(
          recipientName: state.extra as String? ?? 'Landlord / Agent',
        ),
      ),
      GoRoute(
        path: '/create-property',
        builder: (context, state) => const CreatePropertyScreen(),
      ),
      GoRoute(
        path: '/reviews/:id',
        builder: (context, state) => const ReviewsScreen(),
      ),
      GoRoute(
        path: '/subscriptions',
        builder: (context, state) => const SubscriptionPlansScreen(),
      ),
      GoRoute(
        path: '/book-appointment/:id',
        builder: (context, state) => AppointmentBookingScreen(
          propertyId: state.pathParameters['id']!,
          propertyTitle: 'Property Inspection',
          landlordName: 'Landlord',
        ),
      ),
    ],
  );
}
