// ============================================================================
// Currency & Utility Helpers
// ============================================================================

import 'package:intl/intl.dart';

class CurrencyHelper {
  static final _nairaFormat = NumberFormat.currency(
    locale: 'en_NG',
    symbol: '₦',
    decimalDigits: 0,
  );

  static final _nairaCompact = NumberFormat.compactCurrency(
    locale: 'en_NG',
    symbol: '₦',
    decimalDigits: 1,
  );

  /// Format amount as ₦1,500,000
  static String format(double amount) => _nairaFormat.format(amount);

  /// Format amount as ₦1.5M
  static String compact(double amount) => _nairaCompact.format(amount);

  /// Format amount with period label: ₦1.5M/yr
  static String withPeriod(double amount, {String period = 'yr'}) =>
      '${compact(amount)}/$period';

  /// Format move-in cost breakdown
  static String formatMoveIn(Map<String, double> costs) {
    final total = costs.values.fold(0.0, (a, b) => a + b);
    return format(total);
  }
}

class DateHelper {
  static String timeAgo(DateTime dateTime) {
    final diff = DateTime.now().difference(dateTime);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    if (diff.inDays < 30) return '${(diff.inDays / 7).floor()}w ago';
    return DateFormat('MMM d, y').format(dateTime);
  }

  static String formatDate(DateTime date) =>
      DateFormat('MMM d, yyyy').format(date);

  static String formatTime(DateTime time) =>
      DateFormat('h:mm a').format(time);
}

class StringHelper {
  /// Get initials from full name: "Tunde Bakare" → "TB"
  static String initials(String fullName) {
    final parts = fullName.trim().split(' ');
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    if (parts.isNotEmpty) return parts[0][0].toUpperCase();
    return '?';
  }

  /// Truncate text: "Very long text..." → "Very long tex..."
  static String truncate(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }

  /// Format Nigerian phone number
  static String formatPhone(String phone) {
    phone = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    if (phone.startsWith('0')) phone = '+234${phone.substring(1)}';
    if (phone.startsWith('234')) phone = '+$phone';
    return phone;
  }
}

class NigerianStates {
  static const List<String> all = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
    'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
    'Zamfara', 'Abuja FCT',
  ];

  static const List<String> popular = [
    'Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu', 'Anambra',
    'Delta', 'Edo', 'Kaduna', 'Kano',
  ];
}

class PropertyTypes {
  static const Map<String, String> labels = {
    'APARTMENT': 'Apartment',
    'DUPLEX': 'Duplex',
    'SELF_CONTAINED': 'Self-Contained',
    'MINI_FLAT': 'Mini Flat',
    'BUNGALOW': 'Bungalow',
    'STUDIO': 'Studio',
    'SHARED_APARTMENT': 'Shared Apartment',
    'OFFICE_SPACE': 'Office Space',
    'SHOP': 'Shop',
  };
}
