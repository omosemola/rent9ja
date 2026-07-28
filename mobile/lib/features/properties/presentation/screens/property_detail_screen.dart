// ============================================================================
// Property Detail Screen
// ============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';

class PropertyDetailScreen extends StatelessWidget {
  final String propertyId;
  const PropertyDetailScreen({super.key, required this.propertyId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Image Gallery
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
                  onPressed: () {},
                  icon: const Icon(Icons.share_outlined, size: 20),
                ),
              ),
              const SizedBox(width: 8),
              CircleAvatar(
                backgroundColor: Colors.white.withOpacity(0.9),
                child: IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.favorite_border_rounded, size: 20, color: AppColors.error),
                ),
              ),
              const SizedBox(width: 16),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [AppColors.primary.withOpacity(0.3), AppColors.primaryDark.withOpacity(0.6)],
                  ),
                ),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Center(child: Icon(Icons.apartment_rounded, size: 80, color: Colors.white.withOpacity(0.3))),
                    // Image counter
                    Positioned(
                      bottom: 16, right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.photo_library_outlined, size: 16, color: Colors.white),
                            const SizedBox(width: 6),
                            const Text('1/8', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title & Price
                  Text('Luxury 3-Bedroom Apartment in Lekki Phase 1',
                    style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.location_on, size: 16, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Expanded(child: Text('12 Admiralty Way, Lekki Phase 1, Lagos',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          const Text('Rent', style: TextStyle(color: Colors.white70, fontSize: 13)),
                          const Text('₦3,500,000/yr', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
                        ]),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                          child: const Text('Available', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Quick specs
                  Row(
                    children: [
                      _SpecItem(icon: Icons.bed_outlined, label: '3 Beds'),
                      _SpecItem(icon: Icons.bathtub_outlined, label: '3 Baths'),
                      _SpecItem(icon: Icons.square_foot_rounded, label: '150 m²'),
                      _SpecItem(icon: Icons.garage_outlined, label: 'Parking'),
                    ],
                  ),

                  const SizedBox(height: 28),
                  const Divider(),
                  const SizedBox(height: 20),

                  // Description
                  Text('Description', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 12),
                  Text(
                    'A stunning, fully furnished 3-bedroom apartment located in the heart of Lekki Phase 1. This premium unit features modern finishes, spacious rooms with en-suite bathrooms, a fully equipped kitchen with granite countertops, and a large living area with floor-to-ceiling windows.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary, height: 1.6),
                  ),

                  const SizedBox(height: 28),

                  // Cost Breakdown
                  Text('Move-in Cost Breakdown', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  _CostRow(label: 'Annual Rent', amount: '₦3,500,000'),
                  _CostRow(label: 'Service Charge', amount: '₦1,000,000'),
                  _CostRow(label: 'Agency Fee', amount: '₦350,000'),
                  _CostRow(label: 'Legal Fee', amount: '₦150,000'),
                  _CostRow(label: 'Caution Fee', amount: '₦500,000'),
                  _CostRow(label: 'Agreement Fee', amount: '₦100,000'),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Total Move-in Cost', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
                      Text('₦5,600,000', style: TextStyle(color: AppColors.primary, fontSize: 18, fontWeight: FontWeight.w800)),
                    ],
                  ),

                  const SizedBox(height: 28),

                  // Amenities
                  Text('Amenities', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 10, runSpacing: 10,
                    children: [
                      _AmenityChip(icon: Icons.local_parking, label: 'Parking'),
                      _AmenityChip(icon: Icons.security, label: 'Security'),
                      _AmenityChip(icon: Icons.wifi, label: 'Internet'),
                      _AmenityChip(icon: Icons.pool, label: 'Pool'),
                      _AmenityChip(icon: Icons.fitness_center, label: 'Gym'),
                      _AmenityChip(icon: Icons.ac_unit, label: 'AC'),
                      _AmenityChip(icon: Icons.hot_tub, label: 'Water Heater'),
                      _AmenityChip(icon: Icons.videocam, label: 'CCTV'),
                      _AmenityChip(icon: Icons.bolt, label: 'Generator'),
                      _AmenityChip(icon: Icons.water_drop, label: 'Borehole'),
                    ],
                  ),

                  const SizedBox(height: 28),

                  // Landlord
                  Text('Listed by', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardTheme.color,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border, width: 0.5),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: AppColors.primarySurface,
                          child: Text('CA', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 18)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(children: [
                                Text('Chief Adebayo Ogundimu', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                                const SizedBox(width: 6),
                                Icon(Icons.verified, size: 18, color: AppColors.primary),
                              ]),
                              const SizedBox(height: 4),
                              Text('Adebayo Properties & Estates', style: Theme.of(context).textTheme.bodySmall),
                              const SizedBox(height: 4),
                              Row(children: [
                                Icon(Icons.star_rounded, size: 16, color: AppColors.accent),
                                const SizedBox(width: 4),
                                Text('4.8', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                Text(' (124 reviews)', style: Theme.of(context).textTheme.bodySmall),
                              ]),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 120),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom action bar
      bottomSheet: Container(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5))],
        ),
        child: Row(
          children: [
            // Chat button
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.primary),
                borderRadius: BorderRadius.circular(14),
              ),
              child: IconButton(
                onPressed: () {},
                icon: Icon(Icons.chat_bubble_outline_rounded, color: AppColors.primary),
              ),
            ),
            const SizedBox(width: 12),
            // Call button
            Container(
              width: 56, height: 56,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.primary),
                borderRadius: BorderRadius.circular(14),
              ),
              child: IconButton(
                onPressed: () {},
                icon: Icon(Icons.phone_outlined, color: AppColors.primary),
              ),
            ),
            const SizedBox(width: 12),
            // Book inspection
            Expanded(
              child: SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: () {},
                  child: const Text('Book Inspection'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SpecItem extends StatelessWidget {
  final IconData icon;
  final String label;
  const _SpecItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 22),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

class _CostRow extends StatelessWidget {
  final String label;
  final String amount;
  const _CostRow({required this.label, required this.amount});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
          Text(amount, style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
        ],
      ),
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
        color: AppColors.primarySurface,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 8),
          Text(label, style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w500, fontSize: 13)),
        ],
      ),
    );
  }
}
