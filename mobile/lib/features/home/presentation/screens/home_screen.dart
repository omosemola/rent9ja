// ============================================================================
// Home Screen - Premium Property Discovery
// ============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Custom App Bar
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
                  child: const Icon(Icons.home_rounded, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 10),
                Text('RentNaija', style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                )),
              ],
            ),
            actions: [
              IconButton(
                onPressed: () {},
                icon: Stack(
                  children: [
                    const Icon(Icons.notifications_outlined, size: 26),
                    Positioned(
                      right: 0, top: 0,
                      child: Container(
                        width: 10, height: 10,
                        decoration: BoxDecoration(
                          color: AppColors.error,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 1.5),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
            ],
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
              child: GestureDetector(
                onTap: () => context.go('/search'),
                child: Container(
                  height: 54,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border, width: 0.5),
                  ),
                  child: Row(
                    children: [
                      const SizedBox(width: 16),
                      Icon(Icons.search_rounded, color: AppColors.textTertiary, size: 22),
                      const SizedBox(width: 12),
                      Text(
                        'Search for apartments, duplexes...',
                        style: TextStyle(color: AppColors.textTertiary, fontSize: 15),
                      ),
                      const Spacer(),
                      Container(
                        width: 40, height: 40,
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.tune_rounded, color: Colors.white, size: 20),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Quick Filters
          SliverToBoxAdapter(
            child: SizedBox(
              height: 42,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _QuickFilter(label: 'All', isActive: true),
                  _QuickFilter(label: 'Apartment'),
                  _QuickFilter(label: 'Duplex'),
                  _QuickFilter(label: 'Self-Contained'),
                  _QuickFilter(label: 'Studio'),
                  _QuickFilter(label: 'Shared'),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Featured Properties Section
          SliverToBoxAdapter(
            child: _SectionHeader(title: 'Featured Properties', onSeeAll: () {}),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 280,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: 5,
                itemBuilder: (context, index) => _FeaturedPropertyCard(index: index),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 28)),

          // Popular Cities
          SliverToBoxAdapter(
            child: _SectionHeader(title: 'Popular Cities', onSeeAll: () {}),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 110,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  _CityCard(name: 'Lagos', count: '2,450+', color: const Color(0xFF059669)),
                  _CityCard(name: 'Abuja', count: '1,830+', color: const Color(0xFF2563EB)),
                  _CityCard(name: 'Port Harcourt', count: '960+', color: const Color(0xFF7C3AED)),
                  _CityCard(name: 'Ibadan', count: '640+', color: const Color(0xFFDC2626)),
                  _CityCard(name: 'Enugu', count: '480+', color: const Color(0xFFD97706)),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 28)),

          // Newest Listings
          SliverToBoxAdapter(
            child: _SectionHeader(title: 'Newest Listings', onSeeAll: () {}),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _PropertyListCard(index: index),
                childCount: 5,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

// ── Supporting Widgets ─────────────────────────────────────────────────

class _QuickFilter extends StatelessWidget {
  final String label;
  final bool isActive;
  const _QuickFilter({required this.label, this.isActive = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      child: FilterChip(
        label: Text(label),
        selected: isActive,
        onSelected: (_) {},
        selectedColor: AppColors.primary,
        labelStyle: TextStyle(
          color: isActive ? Colors.white : AppColors.textSecondary,
          fontWeight: FontWeight.w500,
          fontSize: 13,
        ),
        checkmarkColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback onSeeAll;
  const _SectionHeader({required this.title, required this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          GestureDetector(
            onTap: onSeeAll,
            child: Text('See All', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 14)),
          ),
        ],
      ),
    );
  }
}

class _FeaturedPropertyCard extends StatelessWidget {
  final int index;
  const _FeaturedPropertyCard({required this.index});

  static const _titles = [
    'Luxury 3-Bed Apartment, Lekki',
    'Modern Duplex, Ajah',
    'Studio Apartment, VI',
    'Spacious Flat, Maitama',
    '5-Bed House, PH',
  ];
  static const _prices = ['₦3.5M/yr', '₦5M/yr', '₦2M/yr', '₦6M/yr', '₦8M/yr'];
  static const _locations = ['Lekki Phase 1, Lagos', 'Ajah, Lagos', 'Victoria Island, Lagos', 'Maitama, Abuja', 'GRA, Port Harcourt'];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Theme.of(context).cardTheme.color,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image placeholder with gradient overlay
          Stack(
            children: [
              Container(
                height: 160,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primary.withOpacity(0.3 + index * 0.1),
                      AppColors.primaryDark.withOpacity(0.5),
                    ],
                  ),
                ),
                child: Center(
                  child: Icon(Icons.apartment_rounded, size: 48, color: Colors.white.withOpacity(0.5)),
                ),
              ),
              // Featured badge
              Positioned(
                top: 12, left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    gradient: AppColors.goldGradient,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('Featured', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                ),
              ),
              // Favorite button
              Positioned(
                top: 12, right: 12,
                child: Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.favorite_border_rounded, size: 18, color: AppColors.textSecondary),
                ),
              ),
            ],
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _titles[index % _titles.length],
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                  maxLines: 1, overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.location_on_outlined, size: 14, color: AppColors.textTertiary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        _locations[index % _locations.length],
                        style: Theme.of(context).textTheme.bodySmall,
                        maxLines: 1, overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _prices[index % _prices.length],
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800, fontSize: 16),
                    ),
                    Row(
                      children: [
                        _MiniAmenity(icon: Icons.bed_outlined, label: '3'),
                        const SizedBox(width: 10),
                        _MiniAmenity(icon: Icons.bathtub_outlined, label: '2'),
                      ],
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

class _MiniAmenity extends StatelessWidget {
  final IconData icon;
  final String label;
  const _MiniAmenity({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textTertiary),
        const SizedBox(width: 3),
        Text(label, style: TextStyle(color: AppColors.textTertiary, fontSize: 12, fontWeight: FontWeight.w500)),
      ],
    );
  }
}

class _CityCard extends StatelessWidget {
  final String name;
  final String count;
  final Color color;
  const _CityCard({required this.name, required this.count, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 130,
      margin: const EdgeInsets.only(right: 14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color, color.withOpacity(0.7)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 4),
          Text('$count listings', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 12)),
        ],
      ),
    );
  }
}

class _PropertyListCard extends StatelessWidget {
  final int index;
  const _PropertyListCard({required this.index});

  static const _titles = [
    'Affordable 2-Bed in Yaba',
    'Mini Flat in Surulere',
    'Shared Apartment in Ikeja GRA',
    'Bungalow in Awka',
    'Modern Flat in Independence Layout',
  ];
  static const _prices = ['₦800K/yr', '₦450K/yr', '₦350K/yr', '₦500K/yr', '₦600K/yr'];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Row(
        children: [
          // Image
          Container(
            width: 110, height: 110,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                bottomLeft: Radius.circular(16),
              ),
              gradient: LinearGradient(
                colors: [
                  AppColors.primary.withOpacity(0.2 + (index * 0.08)),
                  AppColors.primaryDark.withOpacity(0.4),
                ],
              ),
            ),
            child: Center(child: Icon(Icons.home_rounded, size: 32, color: Colors.white.withOpacity(0.4))),
          ),
          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _titles[index % _titles.length],
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    maxLines: 1, overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.location_on_outlined, size: 13, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Text('Lagos, Nigeria', style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _prices[index % _prices.length],
                        style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800, fontSize: 15),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'New',
                          style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
