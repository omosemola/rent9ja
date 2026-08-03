// ============================================================================
// Home Screen - Ultra-Premium Solid UI Experience
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../properties/presentation/bloc/properties_bloc.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import 'landlord_dashboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = 'All Homes';

  final List<String> _categories = [
    'All Homes',
    'Apartments',
    'Duplexes',
    'Self-Contain',
    'Studios',
    'Shortlets',
  ];

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, authState) {
        if (authState is AuthAuthenticated &&
            (authState.role == 'LANDLORD' || authState.role == 'ADMIN')) {
          return const LandlordDashboardScreen();
        }

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: RefreshIndicator(
            color: AppColors.primary,
            onRefresh: () async {
              context.read<PropertiesBloc>().add(LoadFeaturedProperties());
              context.read<PropertiesBloc>().add(LoadNewestProperties());
            },
            child: CustomScrollView(

          physics: const BouncingScrollPhysics(),
          slivers: [
            // ── Top Header Section (Solid Deep Emerald) ───────────────────
            SliverToBoxAdapter(
              child: Container(
                color: const Color(0xFF064E3B),
                padding: const EdgeInsets.fromLTRB(24, 60, 24, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Bar: Location & Notifications
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(
                                  Icons.location_on_rounded,
                                  color: Color(0xFF10B981),
                                  size: 18,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Lagos, Nigeria',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.9),
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  color: Colors.white,
                                  size: 18,
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Find Your Dream Home',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.5,
                              ),
                            ),
                          ],
                        ),
                        // Notification Badge Icon
                        GestureDetector(
                          onTap: () => context.push('/notifications'),
                          child: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.2),
                                width: 1,
                              ),
                            ),
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                const Icon(
                                  Icons.notifications_none_rounded,
                                  color: Colors.white,
                                  size: 24,
                                ),
                                Positioned(
                                  right: 12,
                                  top: 12,
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFEF4444),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Search Input Bar
                    GestureDetector(
                      onTap: () => context.go('/search'),
                      child: Container(
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 15,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.search_rounded,
                              color: Color(0xFF064E3B),
                              size: 24,
                            ),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Text(
                                'Search area, state, or property type...',
                                style: TextStyle(
                                  color: Color(0xFF94A3B8),
                                  fontSize: 15,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF064E3B),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(
                                Icons.tune_rounded,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Hero Featured House Card Banner ───────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
                child: Container(
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    color: const Color(0xFF0F172A),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset(
                          'assets/images/onboarding_house.jpg',
                          fit: BoxFit.cover,
                        ),
                        Container(
                          color: Colors.black.withOpacity(0.35),
                        ),
                        Positioned(
                          left: 20,
                          bottom: 20,
                          right: 20,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFD4A017),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'PREMIUM PICK OF THE DAY',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Luxury 4-Bed Fully Serviced Villa',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    '₦7,500,000 / year • Victoria Island',
                                    style: TextStyle(
                                      color: Color(0xFFE2E8F0),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () => context.push('/property/1'),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 14,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: const Text(
                                        'View',
                                        style: TextStyle(
                                          color: Color(0xFF064E3B),
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // ── Category Filter Pills ─────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.only(top: 24, bottom: 8),
                child: SizedBox(
                  height: 44,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = _selectedCategory == category;
                      return Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedCategory = category),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? const Color(0xFF064E3B)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isSelected
                                    ? const Color(0xFF064E3B)
                                    : const Color(0xFFE2E8F0),
                                width: 1,
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: const Color(0xFF064E3B)
                                            .withOpacity(0.2),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      )
                                    ]
                                  : [],
                            ),
                            child: Text(
                              category,
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.white
                                    : const Color(0xFF475569),
                                fontSize: 13,
                                fontWeight: isSelected
                                    ? FontWeight.w700
                                    : FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),

            // ── Featured Properties Section Header ────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Featured Properties',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.4,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/search'),
                      child: const Text(
                        'See All',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF064E3B),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Featured Properties Horizontal Carousel ───────────────────
            SliverToBoxAdapter(
              child: SizedBox(
                height: 310,
                child: BlocBuilder<PropertiesBloc, PropertiesState>(
                  builder: (context, state) {
                    List<dynamic> featured = [];
                    if (state is PropertiesLoaded) {
                      featured = state.featured;
                    }

                    if (featured.isEmpty) {
                      return ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        itemCount: 3,
                        itemBuilder: (context, index) => _FeaturedCard(
                          property: _getFallbackFeatured(index),
                        ),
                      );
                    }

                    return ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      itemCount: featured.length,
                      itemBuilder: (context, index) => _FeaturedCard(
                        property: featured[index] as Map<String, dynamic>,
                      ),
                    );
                  },
                ),
              ),
            ),

            // ── Popular Cities Section ────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 28, 24, 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Explore Locations',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.4,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/search'),
                      child: const Text(
                        'View Map',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF064E3B),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            SliverToBoxAdapter(
              child: SizedBox(
                height: 100,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  children: const [
                    _CityPill(name: 'Lagos', count: '2,450+ Homes', color: Color(0xFF064E3B)),
                    _CityPill(name: 'Abuja', count: '1,830+ Homes', color: Color(0xFF1E3A8A)),
                    _CityPill(name: 'Port Harcourt', count: '960+ Homes', color: Color(0xFF581C87)),
                    _CityPill(name: 'Ibadan', count: '640+ Homes', color: Color(0xFF991B1B)),
                    _CityPill(name: 'Enugu', count: '480+ Homes', color: Color(0xFF92400E)),
                  ],
                ),
              ),
            ),

            // ── Newest Listings Section Header ────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 28, 24, 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Newest Verified Listings',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.4,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => context.go('/search'),
                      child: const Text(
                        'Browse All',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF064E3B),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Newest Listings Vertical List ──────────────────────────────
            BlocBuilder<PropertiesBloc, PropertiesState>(
              builder: (context, state) {
                List<dynamic> newest = [];
                if (state is PropertiesLoaded) {
                  newest = state.newest;
                }

                if (newest.isEmpty) {
                  return SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) => _ListingCard(
                          property: _getFallbackNewest(index),
                        ),
                        childCount: 3,
                      ),
                    ),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _ListingCard(
                        property: newest[index] as Map<String, dynamic>,
                      ),
                      childCount: newest.length,
                    ),
                  ),
                );
              },
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  },
);
  }


  static Map<String, dynamic> _getFallbackFeatured(int index) {
    final titles = [
      'Luxury 3-Bed Apartment, Lekki Phase 1',
      'Modern Executive Duplex, Ajah',
      'Studio Penthouse, Victoria Island',
    ];
    final prices = [3500000, 5500000, 2200000];
    final locations = ['Lekki Phase 1, Lagos', 'Ajah, Lagos', 'VI, Lagos'];
    return {
      'id': 'prop_$index',
      'title': titles[index % titles.length],
      'price': prices[index % prices.length],
      'address': locations[index % locations.length],
      'bedrooms': 3,
      'bathrooms': 3,
      'images': <String>[],
    };
  }

  static Map<String, dynamic> _getFallbackNewest(int index) {
    final titles = [
      'Affordable 2-Bed Flat, Yaba',
      'Mini Flat Apartment, Surulere',
      'Shared Luxury Apartment, Ikeja GRA',
    ];
    final prices = [850000, 450000, 350000];
    final locations = ['Yaba, Lagos', 'Surulere, Lagos', 'Ikeja, Lagos'];
    return {
      'id': 'new_$index',
      'title': titles[index % titles.length],
      'price': prices[index % prices.length],
      'address': locations[index % locations.length],
      'bedrooms': 2,
      'bathrooms': 2,
      'images': <String>[],
    };
  }
}

// ── Featured Property Card Component ──────────────────────────────────────

class _FeaturedCard extends StatelessWidget {
  final Map<String, dynamic> property;
  const _FeaturedCard({required this.property});

  @override
  Widget build(BuildContext context) {
    final id = property['id']?.toString() ?? '1';
    final title = property['title']?.toString() ?? 'Property Listing';
    final priceNum = (property['price'] as num?)?.toDouble() ?? 0.0;
    final priceStr = priceNum >= 1000000
        ? '₦${(priceNum / 1000000).toStringAsFixed(1)}M/yr'
        : '₦${(priceNum / 1000).toStringAsFixed(0)}K/yr';
    final address = property['address']?.toString() ??
        '${property['city'] ?? ''}, ${property['state'] ?? 'Nigeria'}';
    final bedrooms = property['bedrooms'] ?? 3;
    final bathrooms = property['bathrooms'] ?? 3;
    final images = property['images'] as List?;

    return GestureDetector(
      onTap: () => context.push('/property/$id'),
      child: Container(
        width: 260,
        margin: const EdgeInsets.only(right: 18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 20,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Section
            Stack(
              children: [
                Container(
                  height: 170,
                  color: const Color(0xFF064E3B),
                  child: images != null && images.isNotEmpty
                      ? Image.network(
                          images[0].toString(),
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (_, __, ___) => Image.asset(
                            'assets/images/onboarding_house.jpg',
                            fit: BoxFit.cover,
                            width: double.infinity,
                          ),
                        )
                      : Image.asset(
                          'assets/images/onboarding_house.jpg',
                          fit: BoxFit.cover,
                          width: double.infinity,
                        ),
                ),
                Positioned(
                  top: 14,
                  left: 14,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD4A017),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'FEATURED',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Text Info Section
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    priceStr,
                    style: const TextStyle(
                      color: Color(0xFF064E3B),
                      fontWeight: FontWeight.w900,
                      fontSize: 19,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF0F172A),
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 14,
                        color: Color(0xFF94A3B8),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          address,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Color(0xFF64748B),
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      _SpecPill(icon: Icons.bed_outlined, text: '$bedrooms Beds'),
                      const SizedBox(width: 12),
                      _SpecPill(icon: Icons.bathtub_outlined, text: '$bathrooms Baths'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── City Pill Component ───────────────────────────────────────────────────

class _CityPill extends StatelessWidget {
  final String name;
  final String count;
  final Color color;

  const _CityPill({
    required this.name,
    required this.count,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(right: 14),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(
            name,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            count,
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Vertical Listing Card Component ───────────────────────────────────────

class _ListingCard extends StatelessWidget {
  final Map<String, dynamic> property;
  const _ListingCard({required this.property});

  @override
  Widget build(BuildContext context) {
    final id = property['id']?.toString() ?? '1';
    final title = property['title']?.toString() ?? 'Property Listing';
    final priceNum = (property['price'] as num?)?.toDouble() ?? 0.0;
    final priceStr = priceNum >= 1000000
        ? '₦${(priceNum / 1000000).toStringAsFixed(1)}M/yr'
        : '₦${(priceNum / 1000).toStringAsFixed(0)}K/yr';
    final address = property['address']?.toString() ??
        '${property['city'] ?? ''}, ${property['state'] ?? 'Nigeria'}';
    final bedrooms = property['bedrooms'] ?? 2;
    final bathrooms = property['bathrooms'] ?? 2;
    final images = property['images'] as List?;

    return GestureDetector(
      onTap: () => context.push('/property/$id'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Image Thumbnail
            Container(
              width: 120,
              height: 120,
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                ),
                color: Color(0xFF064E3B),
              ),
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                ),
                child: images != null && images.isNotEmpty
                    ? Image.network(
                        images[0].toString(),
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Image.asset(
                          'assets/images/onboarding_house.jpg',
                          fit: BoxFit.cover,
                        ),
                      )
                    : Image.asset(
                        'assets/images/onboarding_house.jpg',
                        fit: BoxFit.cover,
                      ),
              ),
            ),

            // Content Body
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Color(0xFF0F172A),
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      address,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Color(0xFF64748B),
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          priceStr,
                          style: const TextStyle(
                            color: Color(0xFF064E3B),
                            fontWeight: FontWeight.w900,
                            fontSize: 16,
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.bed_outlined,
                                size: 14, color: Color(0xFF64748B)),
                            const SizedBox(width: 4),
                            Text('$bedrooms',
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF64748B))),
                            const SizedBox(width: 10),
                            const Icon(Icons.bathtub_outlined,
                                size: 14, color: Color(0xFF64748B)),
                            const SizedBox(width: 4),
                            Text('$bathrooms',
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF64748B))),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SpecPill extends StatelessWidget {
  final IconData icon;
  final String text;

  const _SpecPill({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF64748B)),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Color(0xFF64748B),
          ),
        ),
      ],
    );
  }
}
