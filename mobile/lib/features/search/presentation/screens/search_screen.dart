// ============================================================================
// Search Screen with Advanced Filters
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  String _selectedState = 'All States';
  String _selectedType = 'All Types';
  RangeValues _priceRange = const RangeValues(100000, 10000000);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Properties'),
        actions: [
          IconButton(
            onPressed: _showFilterSheet,
            icon: Badge(
              smallSize: 8,
              backgroundColor: AppColors.accent,
              child: const Icon(Icons.tune_rounded),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by location, property type...',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        onPressed: () => setState(() => _searchController.clear()),
                        icon: const Icon(Icons.close_rounded),
                      )
                    : null,
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),

          // Filter chips
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                _FilterChip(label: _selectedState, onTap: () {}),
                _FilterChip(label: _selectedType, onTap: () {}),
                _FilterChip(
                  label: '₦${(_priceRange.start / 1000000).toStringAsFixed(1)}M - ₦${(_priceRange.end / 1000000).toStringAsFixed(1)}M',
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Results header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('234 properties found', style: Theme.of(context).textTheme.bodySmall),
                DropdownButton<String>(
                  value: 'Newest',
                  items: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular']
                      .map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 13))))
                      .toList(),
                  onChanged: (_) {},
                  underline: const SizedBox(),
                  style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600, fontSize: 13),
                  icon: Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.primary, size: 20),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Results list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: 10,
              itemBuilder: (context, index) => _SearchResultCard(index: index),
            ),
          ),
        ],
      ),
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        expand: false,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Filters', style: Theme.of(context).textTheme.headlineMedium),
                  TextButton(onPressed: () {}, child: const Text('Reset All')),
                ],
              ),
              const SizedBox(height: 24),

              Text('Property Type', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10, runSpacing: 10,
                children: ['Apartment', 'Duplex', 'Self-Contained', 'Mini Flat', 'Bungalow', 'Studio', 'Shared', 'Office']
                    .map((type) => ChoiceChip(label: Text(type), selected: type == 'Apartment', onSelected: (_) {}))
                    .toList(),
              ),
              const SizedBox(height: 24),

              Text('Price Range', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              RangeSlider(
                values: _priceRange,
                min: 0,
                max: 20000000,
                divisions: 40,
                labels: RangeLabels(
                  '₦${(_priceRange.start / 1000000).toStringAsFixed(1)}M',
                  '₦${(_priceRange.end / 1000000).toStringAsFixed(1)}M',
                ),
                onChanged: (v) => setState(() => _priceRange = v),
              ),
              const SizedBox(height: 24),

              Text('Bedrooms', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Row(
                children: [1, 2, 3, 4, 5].map((n) => Padding(
                  padding: const EdgeInsets.only(right: 10),
                  child: ChoiceChip(label: Text('$n+'), selected: n == 2, onSelected: (_) {}),
                )).toList(),
              ),
              const SizedBox(height: 24),

              Text('Amenities', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Wrap(
                spacing: 10, runSpacing: 10,
                children: ['Parking', 'Security', 'Furnished', 'Generator', 'Internet', 'AC', 'Pool', 'Gym']
                    .map((a) => FilterChip(label: Text(a), selected: false, onSelected: (_) {}))
                    .toList(),
              ),
              const SizedBox(height: 32),

              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Apply Filters'),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _FilterChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.surfaceVariant,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border, width: 0.5),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label, style: TextStyle(fontSize: 13, color: AppColors.textSecondary, fontWeight: FontWeight.w500)),
            const SizedBox(width: 4),
            Icon(Icons.keyboard_arrow_down_rounded, size: 18, color: AppColors.textTertiary),
          ],
        ),
      ),
    );
  }
}

class _SearchResultCard extends StatelessWidget {
  final int index;
  const _SearchResultCard({required this.index});

  @override
  Widget build(BuildContext context) {
    final titles = [
      'Modern 3-Bedroom Apartment', 'Spacious Duplex with Pool',
      'Cozy Studio in Victoria Island', 'Self-Contained Flat in Surulere',
      'Luxury Penthouse in Ikoyi', 'Mini Flat near UNILAG',
      'Furnished Apartment Ikeja', 'New Build Bungalow Awka',
      '2-Bed Flat GRA Enugu', 'Shared Space Lekki',
    ];
    final prices = ['₦2.5M/yr', '₦5M/yr', '₦1.8M/yr', '₦500K/yr', '₦12M/yr',
                     '₦450K/yr', '₦1.2M/yr', '₦600K/yr', '₦700K/yr', '₦350K/yr'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Column(
        children: [
          // Image
          Container(
            height: 180,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              gradient: LinearGradient(colors: [
                AppColors.primary.withOpacity(0.15 + (index * 0.05) % 0.5),
                AppColors.primaryDark.withOpacity(0.4),
              ]),
            ),
            child: Stack(
              children: [
                Center(child: Icon(Icons.apartment_rounded, size: 56, color: Colors.white.withOpacity(0.3))),
                Positioned(
                  top: 12, right: 12,
                  child: Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.9), shape: BoxShape.circle),
                    child: Icon(Icons.favorite_border_rounded, size: 18, color: AppColors.textSecondary),
                  ),
                ),
                if (index < 3)
                  Positioned(
                    top: 12, left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(8)),
                      child: const Text('Verified', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600)),
                    ),
                  ),
              ],
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(titles[index % titles.length],
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.location_on_outlined, size: 14, color: AppColors.textTertiary),
                    const SizedBox(width: 4),
                    Text('Lagos, Nigeria', style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(prices[index % prices.length],
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800, fontSize: 17)),
                    const Spacer(),
                    Row(children: [
                      Icon(Icons.bed_outlined, size: 16, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Text('${(index % 4) + 1}', style: TextStyle(color: AppColors.textTertiary, fontSize: 13)),
                      const SizedBox(width: 12),
                      Icon(Icons.bathtub_outlined, size: 16, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Text('${(index % 3) + 1}', style: TextStyle(color: AppColors.textTertiary, fontSize: 13)),
                      const SizedBox(width: 12),
                      Icon(Icons.square_foot_rounded, size: 16, color: AppColors.textTertiary),
                      const SizedBox(width: 4),
                      Text('${80 + (index * 20)}m²', style: TextStyle(color: AppColors.textTertiary, fontSize: 13)),
                    ]),
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
