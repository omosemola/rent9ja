// ============================================================================
// Reviews Screen - Landlord Reviews
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class ReviewsScreen extends StatelessWidget {
  final String landlordName;
  final double averageRating;
  final int totalReviews;

  const ReviewsScreen({
    super.key,
    this.landlordName = 'Chief Adebayo Ogundimu',
    this.averageRating = 4.8,
    this.totalReviews = 124,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reviews')),
      body: CustomScrollView(
        slivers: [
          // Rating summary
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardTheme.color,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.border, width: 0.5),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Column(
                          children: [
                            Text(averageRating.toString(),
                              style: TextStyle(fontSize: 48, fontWeight: FontWeight.w800, color: AppColors.primary)),
                            Row(
                              children: List.generate(5, (i) => Icon(
                                i < averageRating.round() ? Icons.star_rounded : Icons.star_border_rounded,
                                size: 20, color: AppColors.accent,
                              )),
                            ),
                            const SizedBox(height: 4),
                            Text('$totalReviews reviews', style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                        const SizedBox(width: 30),
                        Expanded(
                          child: Column(
                            children: [
                              _RatingBar(label: '5', percent: 0.72),
                              _RatingBar(label: '4', percent: 0.18),
                              _RatingBar(label: '3', percent: 0.06),
                              _RatingBar(label: '2', percent: 0.03),
                              _RatingBar(label: '1', percent: 0.01),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    const Divider(),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _SubRating(label: 'Communication', value: 4.9),
                        _SubRating(label: 'Professionalism', value: 4.7),
                        _SubRating(label: 'Accuracy', value: 4.8),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Review list
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _ReviewCard(index: index),
                childCount: 6,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

class _RatingBar extends StatelessWidget {
  final String label;
  final double percent;
  const _RatingBar({required this.label, required this.percent});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: AppColors.textTertiary, fontWeight: FontWeight.w500)),
          const SizedBox(width: 8),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: percent,
                minHeight: 6,
                backgroundColor: AppColors.surfaceVariant,
                valueColor: AlwaysStoppedAnimation(AppColors.accent),
              ),
            ),
          ),
          const SizedBox(width: 8),
          SizedBox(
            width: 32,
            child: Text('${(percent * 100).toInt()}%', style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
          ),
        ],
      ),
    );
  }
}

class _SubRating extends StatelessWidget {
  final String label;
  final double value;
  const _SubRating({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value.toString(), style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18, color: AppColors.primary)),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 12, color: AppColors.textTertiary)),
      ],
    );
  }
}

class _ReviewCard extends StatelessWidget {
  final int index;
  const _ReviewCard({required this.index});

  @override
  Widget build(BuildContext context) {
    final names = ['Tunde Bakare', 'Ngozi Eze', 'Bola Adeyemo', 'Fatima Bello', 'Emeka Obi', 'Adaeze Nnadi'];
    final ratings = [5.0, 5.0, 4.0, 5.0, 4.0, 5.0];
    final comments = [
      'Excellent landlord! Very professional and responsive. The apartment was exactly as described. Would highly recommend.',
      'Chief Adebayo was very transparent about all costs. No hidden fees. The property was well-maintained and clean upon move-in.',
      'Good experience overall. The property needed minor repairs which were promptly handled after moving in.',
      'Best landlord I\'ve dealt with in Lagos. Quick responses, honest descriptions, and fair pricing.',
      'The service charge breakdown was clear from the start. Property is in a great location with good security.',
      'Moved in seamlessly. All documentation was handled professionally. The estate management is also responsive.',
    ];
    final dates = ['2 weeks ago', '1 month ago', '2 months ago', '3 months ago', '4 months ago', '5 months ago'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 0.3),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppColors.primarySurface,
                child: Text(
                  names[index].split(' ').map((n) => n[0]).join().toUpperCase(),
                  style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 13),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(names[index], style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        ...List.generate(5, (i) => Icon(
                          i < ratings[index].round() ? Icons.star_rounded : Icons.star_border_rounded,
                          size: 16, color: AppColors.accent,
                        )),
                        const SizedBox(width: 8),
                        Text(dates[index], style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            comments[index],
            style: TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.5),
          ),
        ],
      ),
    );
  }
}
