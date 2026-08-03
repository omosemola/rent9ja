// Basic Flutter widget test

import 'package:flutter_test/flutter_test.dart';
import 'package:rentnaija/app/app.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const RentNaijaApp());
  });
}
