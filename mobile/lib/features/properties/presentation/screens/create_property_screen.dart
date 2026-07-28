// ============================================================================
// Property Creation Wizard (Landlord)
// ============================================================================

import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class CreatePropertyScreen extends StatefulWidget {
  const CreatePropertyScreen({super.key});

  @override
  State<CreatePropertyScreen> createState() => _CreatePropertyScreenState();
}

class _CreatePropertyScreenState extends State<CreatePropertyScreen> {
  int _currentStep = 0;
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController();
  final _rentController = TextEditingController();
  final _serviceChargeController = TextEditingController();
  String _propertyType = 'APARTMENT';
  int _bedrooms = 2;
  int _bathrooms = 2;
  String _selectedState = 'Lagos';
  final Set<String> _selectedAmenities = {};

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    _rentController.dispose();
    _serviceChargeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('List Property'),
        actions: [
          TextButton(
            onPressed: () {},
            child: Text('Save Draft', style: TextStyle(color: AppColors.textTertiary)),
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              children: List.generate(4, (i) => Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: i < 3 ? 6 : 0),
                  decoration: BoxDecoration(
                    color: i <= _currentStep ? AppColors.primary : AppColors.surfaceVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              )),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(_stepTitles[_currentStep], style: Theme.of(context).textTheme.headlineSmall),
                Text('${_currentStep + 1}/4', style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Step content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: [_buildBasicInfo(), _buildLocation(), _buildPricing(), _buildPhotos()][_currentStep],
            ),
          ),

          // Navigation buttons
          Container(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, -2))],
            ),
            child: Row(
              children: [
                if (_currentStep > 0)
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => setState(() => _currentStep--),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Previous'),
                    ),
                  ),
                if (_currentStep > 0) const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      if (_currentStep < 3) {
                        setState(() => _currentStep++);
                      } else {
                        // Submit
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text('Property listed successfully! 🎉'),
                            backgroundColor: AppColors.success,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        );
                        Navigator.pop(context);
                      }
                    },
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                    child: Text(_currentStep < 3 ? 'Next' : 'Publish Listing'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static const _stepTitles = ['Basic Information', 'Location', 'Pricing', 'Photos'];

  Widget _buildBasicInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: _titleController,
          decoration: const InputDecoration(labelText: 'Property Title', hintText: 'e.g. Modern 3-Bedroom Apartment in Lekki'),
        ),
        const SizedBox(height: 16),

        Text('Property Type', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8, runSpacing: 8,
          children: {'APARTMENT': 'Apartment', 'DUPLEX': 'Duplex', 'SELF_CONTAINED': 'Self-Contained',
            'MINI_FLAT': 'Mini Flat', 'BUNGALOW': 'Bungalow', 'STUDIO': 'Studio', 'SHARED_APARTMENT': 'Shared'
          }.entries.map((e) => ChoiceChip(
            label: Text(e.value),
            selected: _propertyType == e.key,
            onSelected: (_) => setState(() => _propertyType = e.key),
          )).toList(),
        ),
        const SizedBox(height: 20),

        Row(
          children: [
            Expanded(child: _CounterField(label: 'Bedrooms', value: _bedrooms, onChanged: (v) => setState(() => _bedrooms = v))),
            const SizedBox(width: 16),
            Expanded(child: _CounterField(label: 'Bathrooms', value: _bathrooms, onChanged: (v) => setState(() => _bathrooms = v))),
          ],
        ),
        const SizedBox(height: 20),

        TextFormField(
          controller: _descriptionController,
          maxLines: 4,
          decoration: const InputDecoration(
            labelText: 'Description', alignLabelWithHint: true,
            hintText: 'Describe the property in detail...',
          ),
        ),
        const SizedBox(height: 20),

        Text('Amenities', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8, runSpacing: 8,
          children: ['Parking', 'Security', 'Generator', 'Borehole', 'Internet', 'AC',
            'Pool', 'Gym', 'Furnished', 'CCTV', 'Water Heater', 'Balcony', 'POP Ceiling',
          ].map((a) => FilterChip(
            label: Text(a),
            selected: _selectedAmenities.contains(a),
            onSelected: (s) => setState(() => s ? _selectedAmenities.add(a) : _selectedAmenities.remove(a)),
          )).toList(),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildLocation() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        DropdownButtonFormField<String>(
          value: _selectedState,
          decoration: const InputDecoration(labelText: 'State'),
          items: ['Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu', 'Anambra', 'Delta', 'Edo', 'Kaduna', 'Kano']
              .map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
          onChanged: (v) => setState(() => _selectedState = v!),
        ),
        const SizedBox(height: 16),

        TextFormField(decoration: const InputDecoration(labelText: 'City / LGA', hintText: 'e.g. Lekki Phase 1')),
        const SizedBox(height: 16),

        TextFormField(
          controller: _addressController,
          decoration: const InputDecoration(labelText: 'Full Address', hintText: 'Street address', prefixIcon: Icon(Icons.location_on_outlined)),
        ),
        const SizedBox(height: 16),

        TextFormField(decoration: const InputDecoration(labelText: 'Nearby Landmarks', hintText: 'e.g. Shoprite, Toll Gate')),
        const SizedBox(height: 20),

        // Map placeholder
        Container(
          height: 200,
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.map_outlined, size: 40, color: AppColors.textTertiary),
                const SizedBox(height: 8),
                Text('Tap to pin location on map', style: TextStyle(color: AppColors.textTertiary)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildPricing() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextFormField(
          controller: _rentController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Annual Rent (₦)', prefixText: '₦ ', hintText: 'e.g. 3,500,000'),
        ),
        const SizedBox(height: 16),

        TextFormField(
          controller: _serviceChargeController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Service Charge (₦)', prefixText: '₦ ', hintText: 'e.g. 1,000,000'),
        ),
        const SizedBox(height: 16),

        TextFormField(
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Agency Fee (₦)', prefixText: '₦ '),
        ),
        const SizedBox(height: 16),

        TextFormField(
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Legal Fee (₦)', prefixText: '₦ '),
        ),
        const SizedBox(height: 16),

        TextFormField(
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Caution Fee (₦)', prefixText: '₦ '),
        ),
        const SizedBox(height: 16),

        TextFormField(
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Agreement Fee (₦)', prefixText: '₦ '),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildPhotos() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Upload property photos (min. 3, max. 20)',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
        const SizedBox(height: 16),

        // Upload area
        GestureDetector(
          onTap: () {
            // TODO: Open image picker
          },
          child: Container(
            height: 180,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.primary, width: 1, style: BorderStyle.solid),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 60, height: 60,
                  decoration: BoxDecoration(
                    color: AppColors.primarySurface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.add_photo_alternate_outlined, size: 32, color: AppColors.primary),
                ),
                const SizedBox(height: 12),
                Text('Tap to upload photos', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text('JPEG, PNG up to 10MB each', style: TextStyle(color: AppColors.textTertiary, fontSize: 12)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Photo grid placeholder
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemCount: 3,
          itemBuilder: (context, index) => Container(
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1 + (index * 0.1)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Stack(
              children: [
                Center(child: Icon(Icons.image_rounded, color: AppColors.primary.withOpacity(0.3), size: 32)),
                Positioned(
                  top: 6, right: 6,
                  child: Container(
                    width: 24, height: 24,
                    decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                    child: const Icon(Icons.close_rounded, size: 16, color: Colors.white),
                  ),
                ),
                if (index == 0)
                  Positioned(
                    bottom: 6, left: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(4)),
                      child: const Text('Cover', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w600)),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),

        // Tip
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.info.withOpacity(0.08),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              Icon(Icons.lightbulb_outline_rounded, color: AppColors.info, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Properties with 5+ quality photos get 3x more inquiries!',
                  style: TextStyle(color: AppColors.info, fontSize: 13, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}

class _CounterField extends StatelessWidget {
  final String label;
  final int value;
  final ValueChanged<int> onChanged;

  const _CounterField({required this.label, required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: value > 0 ? () => onChanged(value - 1) : null,
                icon: const Icon(Icons.remove_rounded),
                iconSize: 20,
              ),
              Text('$value', style: Theme.of(context).textTheme.headlineSmall),
              IconButton(
                onPressed: () => onChanged(value + 1),
                icon: const Icon(Icons.add_rounded),
                iconSize: 20,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
