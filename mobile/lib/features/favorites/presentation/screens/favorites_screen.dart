// ============================================================================
// Favorites Screen
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Properties'),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.folder_outlined)),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: 4,
        itemBuilder: (context, index) {
          final titles = ['Luxury 3-Bed Apartment', 'Modern Duplex, Ajah', 'Studio VI', 'Flat in Maitama'];
          final prices = ['₦3.5M/yr', '₦5M/yr', '₦2M/yr', '₦6M/yr'];
          return Dismissible(
            key: ValueKey(index),
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              decoration: BoxDecoration(color: AppColors.error.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
              child: const Icon(Icons.delete_outline_rounded, color: AppColors.error, size: 28),
            ),
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Theme.of(context).cardTheme.color,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10)],
              ),
              child: Row(
                children: [
                  Container(
                    width: 100, height: 100,
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
                      gradient: LinearGradient(colors: [
                        AppColors.primary.withOpacity(0.2 + (index * 0.1)),
                        AppColors.primaryDark.withOpacity(0.4),
                      ]),
                    ),
                    child: Center(child: Icon(Icons.home_rounded, size: 32, color: Colors.white.withOpacity(0.4))),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(titles[index], style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Text('Lagos, Nigeria', style: Theme.of(context).textTheme.bodySmall),
                          const SizedBox(height: 8),
                          Text(prices[index], style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800)),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 14),
                    child: Icon(Icons.favorite_rounded, color: AppColors.error, size: 22),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
