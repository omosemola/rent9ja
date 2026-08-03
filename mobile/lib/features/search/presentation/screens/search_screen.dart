// ============================================================================
// Search Screen with Advanced Filters (Connected to NestJS Backend API)
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../properties/presentation/bloc/properties_bloc.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  String _selectedState = 'All States';
  String _selectedType = 'All Types';

  @override
  void initState() {
    super.initState();
    _performSearch();
  }

  void _performSearch() {
    final query = _searchController.text.trim();
    context.read<PropertiesBloc>().add(SearchProperties(
          query: query.isNotEmpty ? query : null,
          state: _selectedState != 'All States' ? _selectedState : null,
          propertyType: _selectedType != 'All Types'
              ? _selectedType.toUpperCase().replaceAll('-', '_')
              : null,
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Properties'),
        actions: [
          IconButton(
            onPressed: _showFilterSheet,
            icon: const Badge(
              smallSize: 8,
              backgroundColor: AppColors.accent,
              child: Icon(Icons.tune_rounded),
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
                        onPressed: () {
                          _searchController.clear();
                          _performSearch();
                          setState(() {});
                        },
                        icon: const Icon(Icons.close_rounded),
                      )
                    : null,
              ),
              onSubmitted: (_) => _performSearch(),
              onChanged: (_) => setState(() {}),
            ),
          ),

          // State filter pills
          SizedBox(
            height: 38,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: [
                'All States',
                'Lagos',
                'Abuja',
                'Rivers',
                'Oyo',
                'Anambra',
                'Enugu'
              ].map((st) {
                final isSelected = _selectedState == st;
                return Container(
                  margin: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(st),
                    selected: isSelected,
                    onSelected: (_) {
                      setState(() => _selectedState = st);
                      _performSearch();
                    },
                    selectedColor: AppColors.primary,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : AppColors.textSecondary,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                    checkmarkColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10)),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 12),

          // Results list
          Expanded(
            child: BlocBuilder<PropertiesBloc, PropertiesState>(
              builder: (context, state) {
                if (state is PropertiesLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                List<dynamic> results = [];
                if (state is PropertiesSearchResult) {
                  results = state.properties;
                }

                if (results.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off_rounded,
                            size: 64, color: AppColors.textTertiary),
                        const SizedBox(height: 16),
                        Text('No properties found',
                            style: Theme.of(context).textTheme.titleLarge),
                        const SizedBox(height: 8),
                        Text('Try adjusting your search query or filters',
                            style: TextStyle(color: AppColors.textTertiary)),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  itemCount: results.length,
                  itemBuilder: (context, index) {
                    final prop = results[index] as Map<String, dynamic>;
                    final id = prop['id']?.toString() ?? '1';
                    final title = prop['title']?.toString() ?? 'Property Listing';
                    final priceNum = (prop['price'] as num?)?.toDouble() ?? 0.0;
                    final priceStr = priceNum >= 1000000
                        ? '₦${(priceNum / 1000000).toStringAsFixed(1)}M/yr'
                        : '₦${(priceNum / 1000).toStringAsFixed(0)}K/yr';
                    final address = prop['address']?.toString() ??
                        '${prop['city'] ?? ''}, ${prop['state'] ?? 'Nigeria'}';
                    final bedrooms = prop['bedrooms'] ?? 2;
                    final bathrooms = prop['bathrooms'] ?? 2;
                    final images = prop['images'] as List?;

                    return GestureDetector(
                      onTap: () => context.push('/property/$id'),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardTheme.color,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // Image
                            Container(
                              height: 180,
                              decoration: const BoxDecoration(
                                borderRadius: BorderRadius.vertical(
                                    top: Radius.circular(16)),
                                color: AppColors.primarySurface,
                              ),
                              child: images != null && images.isNotEmpty
                                  ? ClipRRect(
                                      borderRadius: const BorderRadius.vertical(
                                          top: Radius.circular(16)),
                                      child: Image.network(
                                        images[0].toString(),
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        errorBuilder: (_, __, ___) => Center(
                                          child: Icon(Icons.home_rounded,
                                              size: 48,
                                              color: Colors.white.withOpacity(0.4)),
                                        ),
                                      ),
                                    )
                                  : Center(
                                      child: Icon(Icons.home_rounded,
                                          size: 48,
                                          color: Colors.white.withOpacity(0.4)),
                                    ),
                            ),

                            // Details
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        priceStr,
                                        style: TextStyle(
                                          color: AppColors.primary,
                                          fontWeight: FontWeight.w800,
                                          fontSize: 18,
                                        ),
                                      ),
                                      Text(
                                        prop['propertyType']?.toString() ??
                                            'APARTMENT',
                                        style: const TextStyle(
                                          color: AppColors.textSecondary,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    title,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 16),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Icons.location_on_outlined,
                                          size: 14, color: AppColors.textTertiary),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          address,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                              color: AppColors.textTertiary,
                                              fontSize: 13),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Icon(Icons.bed_outlined,
                                          size: 16, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text('$bedrooms Beds',
                                          style: const TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textSecondary)),
                                      const SizedBox(width: 16),
                                      Icon(Icons.bathtub_outlined,
                                          size: 16, color: AppColors.textSecondary),
                                      const SizedBox(width: 4),
                                      Text('$bathrooms Baths',
                                          style: const TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textSecondary)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
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
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Filter Properties',
                style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 20),

            const Text('Property Type',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: [
                'All Types',
                'Apartment',
                'Duplex',
                'Self-Contain',
                'Studio'
              ].map((tp) {
                final isSelected = _selectedType == tp;
                return ChoiceChip(
                  label: Text(tp),
                  selected: isSelected,
                  onSelected: (_) {
                    setState(() => _selectedType = tp);
                    Navigator.pop(context);
                    _performSearch();
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
