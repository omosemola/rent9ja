// ============================================================================
// RentNaija - Root App Widget
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/theme/app_theme.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/properties/presentation/bloc/properties_bloc.dart';
import 'router.dart';
import 'di.dart';

class RentNaijaApp extends StatelessWidget {
  const RentNaijaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<AuthBloc>()..add(AuthCheckStatus())),
        BlocProvider(
          create: (_) => getIt<PropertiesBloc>()
            ..add(LoadFeaturedProperties())
            ..add(LoadNewestProperties()),
        ),
      ],
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          return MaterialApp.router(
            title: 'RentNaija',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.system,
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
