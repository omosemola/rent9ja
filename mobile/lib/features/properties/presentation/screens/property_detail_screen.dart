// ============================================================================
// Property Detail Screen - Connected to NestJS Backend API
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../bloc/properties_bloc.dart';

class PropertyDetailScreen extends StatefulWidget {
  final String propertyId;
  const PropertyDetailScreen({super.key, required this.propertyId});

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PropertiesBloc>().add(LoadPropertyDetail(widget.propertyId));
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$feature coming soon!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<PropertiesBloc, PropertiesState>(
        builder: (context, state) {
          if (state is PropertiesLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          Map<String, dynamic> property = {};
          if (state is PropertyDetailLoaded) {
            property = state.property;
          }

          final title = property['title']?.toString() ?? '3-Bedroom Luxury Duplex';
          final priceNum = (property['price'] as num?)?.toDouble() ?? 3500000;
          final priceStr = priceNum >= 1000000
              ? '₦${(priceNum / 1000000).toStringAsFixed(1)}M'
              : '₦${(priceNum / 1000).toStringAsFixed(0)}K';
          final address = property['address']?.toString() ??
              '${property['city'] ?? 'Lekki Phase 1'}, ${property['state'] ?? 'Lagos State'}';
          final description = property['description']?.toString() ??
              'Spacious, modern property located in a highly serene and secure environment with 24/7 security, constant power supply, and clean water.';
          final bedrooms = property['bedrooms'] ?? 3;
          final bathrooms = property['bathrooms'] ?? 3;
          final toilets = property['toilets'] ?? 4;
          final images = property['images'] as List?;
          final landlordUser = property['landlordProfile']?['user'] as Map<String, dynamic>?;
          final landlordName = landlordUser?['fullName']?.toString() ?? 'Chief Adebayo Ogundimu';

          return CustomScrollView(
            slivers: [
              // Image Gallery App Bar
              SliverAppBar(
                expandedHeight: 300,
                pinned: true,
                leading: Padding(
                  padding: const EdgeInsets.all(8),
                  child: CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.9),
                    child: IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
                    ),
                  ),
                ),
                actions: [
                  CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.9),
                    child: IconButton(
                      onPressed: () => _showComingSoon('Share'),
                      icon: const Icon(Icons.share_outlined, size: 20),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.9),
                    child: IconButton(
                      onPressed: () {
                        context.read<PropertiesBloc>().add(ToggleFavorite(widget.propertyId));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Favorite updated!')),
                        );
                      },
                      icon: const Icon(Icons.favorite_border_rounded, size: 20, color: AppColors.error),
                    ),
                  ),
                  const SizedBox(width: 16),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    decoration: const BoxDecoration(
                      color: AppColors.primaryDark,
                    ),
                    child: images != null && images.isNotEmpty
                        ? Image.network(
                            images[0].toString(),
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Center(
                              child: Icon(Icons.apartment_rounded,
                                  size: 80, color: Colors.white.withOpacity(0.3)),
                            ),
                          )
                        : Stack(
                            fit: StackFit.expand,
                            children: [
                              Center(
                                child: Icon(Icons.apartment_rounded,
                                    size: 80, color: Colors.white.withOpacity(0.3)),
                              ),
                              Positioned(
                                bottom: 16,
                                right: 16,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.6),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Row(
                                    children: [
                                      Icon(Icons.photo_library_outlined,
                                          size: 16, color: Colors.white),
                                      SizedBox(width: 6),
                                      Text('1/8',
                                          style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
              ),

              // Property Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Price & Verification Badge
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: [
                              Text(
                                priceStr,
                                style: Theme.of(context)
                                    .textTheme
                                    .displaySmall
                                    ?.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w800,
                                    ),
                              ),
                              const Text(' / year',
                                  style: TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 14)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppColors.success.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.verified_rounded,
                                    size: 16, color: AppColors.success),
                                SizedBox(width: 4),
                                Text('Verified',
                                    style: TextStyle(
                                        color: AppColors.success,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      // Title
                      Text(title, style: Theme.of(context).textTheme.headlineMedium),

                      const SizedBox(height: 8),

                      // Address
                      Row(
                        children: [
                          Icon(Icons.location_on_outlined,
                              size: 18, color: AppColors.textTertiary),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(address,
                                style: TextStyle(
                                    color: AppColors.textSecondary, fontSize: 14)),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 20),

                      // Key Features Grid
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _FeatureTile(
                              icon: Icons.king_bed_outlined,
                              value: '$bedrooms',
                              label: 'Bedrooms'),
                          _FeatureTile(
                              icon: Icons.bathtub_outlined,
                              value: '$bathrooms',
                              label: 'Bathrooms'),
                          _FeatureTile(
                              icon: Icons.wc_outlined,
                              value: '$toilets',
                              label: 'Toilets'),
                          const _FeatureTile(
                              icon: Icons.square_foot_outlined,
                              value: '350',
                              label: 'sqm'),
                        ],
                      ),

                      const SizedBox(height: 20),
                      const Divider(),
                      const SizedBox(height: 20),

                      // Landlord Card
                      Text('Property Manager',
                          style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceVariant,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border, width: 0.5),
                        ),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 26,
                              backgroundColor: AppColors.primary,
                              child: Text(
                                landlordName.isNotEmpty ? landlordName[0] : 'L',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 20),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(landlordName,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.w700, fontSize: 15)),
                                  const SizedBox(height: 2),
                                  const Text('Verified Landlord • 12 Active Listings',
                                      style: TextStyle(
                                          color: AppColors.textSecondary, fontSize: 12)),
                                ],
                              ),
                            ),
                            IconButton(
                              onPressed: () => context.push('/chat/1', extra: landlordName),
                              icon: const Icon(Icons.chat_bubble_outline_rounded,
                                  color: AppColors.primary),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Description
                      Text('Description', style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 8),
                      Text(
                        description,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: AppColors.textSecondary,
                              height: 1.6,
                            ),
                      ),

                      const SizedBox(height: 24),

                      // Amenities
                      Text('Amenities & Facilities',
                          style: Theme.of(context).textTheme.headlineSmall),
                      const SizedBox(height: 12),
                      const Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _AmenityChip(icon: Icons.flash_on_rounded, label: '24/7 Electricity'),
                          _AmenityChip(icon: Icons.security_rounded, label: 'Gated Security'),
                          _AmenityChip(icon: Icons.water_drop_rounded, label: 'Treated Water'),
                          _AmenityChip(icon: Icons.directions_car_rounded, label: 'Parking Space'),
                          _AmenityChip(icon: Icons.ac_unit_rounded, label: 'Air Conditioning'),
                          _AmenityChip(icon: Icons.pool_rounded, label: 'Swimming Pool'),
                        ],
                      ),

                      const SizedBox(height: 120),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),

      // Bottom Booking bar
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardTheme.color,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 54,
                child: OutlinedButton.icon(
                  onPressed: () => context.push('/chat/1'),
                  icon: const Icon(Icons.chat_bubble_outline_rounded),
                  label: const Text('Contact'),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              flex: 2,
              child: SizedBox(
                height: 54,
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/book-appointment/${widget.propertyId}'),
                  icon: const Icon(Icons.calendar_month_rounded),
                  label: const Text('Book Inspection'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeatureTile extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _FeatureTile({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.primarySurface,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(icon, color: AppColors.primary, size: 22),
        ),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
        Text(label, style: const TextStyle(color: AppColors.textTertiary, fontSize: 12)),
      ],
    );
  }
}

class _AmenityChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _AmenityChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border, width: 0.5),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: AppColors.primary),
          const SizedBox(width: 8),
          Text(label,
              style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 13,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
