// ============================================================================
// Dependency Injection Setup
// ============================================================================

import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/network/api_client.dart';
import '../core/storage/secure_storage.dart';
import '../features/auth/data/auth_repository.dart';
import '../features/auth/presentation/bloc/auth_bloc.dart';
import '../features/properties/data/properties_repository.dart';
import '../features/properties/presentation/bloc/properties_bloc.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies() async {
  // External
  final prefs = await SharedPreferences.getInstance();
  getIt.registerSingleton<SharedPreferences>(prefs);
  getIt.registerSingleton<FlutterSecureStorage>(const FlutterSecureStorage());

  // Core
  getIt.registerSingleton<SecureStorageService>(
    SecureStorageService(getIt<FlutterSecureStorage>()),
  );
  getIt.registerSingleton<ApiClient>(
    ApiClient(getIt<SecureStorageService>()),
  );

  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepository(getIt<ApiClient>(), getIt<SecureStorageService>()),
  );
  getIt.registerLazySingleton<PropertiesRepository>(
    () => PropertiesRepository(getIt<ApiClient>()),
  );

  // Blocs
  getIt.registerFactory<AuthBloc>(
    () => AuthBloc(getIt<AuthRepository>()),
  );
  getIt.registerFactory<PropertiesBloc>(
    () => PropertiesBloc(getIt<PropertiesRepository>()),
  );
}
