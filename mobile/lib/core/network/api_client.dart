// ============================================================================
// API Client - Dio HTTP Configuration
// ============================================================================

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  late final Dio dio;
  final SecureStorageService _storage;

  // Change this to your backend URL
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:3001/api/v1';
    return 'http://10.0.2.2:3001/api/v1'; // Android emulator
  }


  ApiClient(this._storage) {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Request interceptor - add auth token
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Try to refresh token
          final refreshToken = await _storage.getRefreshToken();
          if (refreshToken != null) {
            try {
              final response = await Dio().post(
                '$baseUrl/auth/refresh',
                data: {'refreshToken': refreshToken},
              );

              final newToken = response.data['accessToken'];
              final newRefresh = response.data['refreshToken'];
              await _storage.saveTokens(newToken, newRefresh);

              // Retry the original request
              error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
              final retryResponse = await dio.fetch(error.requestOptions);
              return handler.resolve(retryResponse);
            } catch (_) {
              await _storage.clearAll();
              // Navigate to login - handled by auth bloc
            }
          }
        }
        return handler.next(error);
      },
    ));

    // Logging interceptor (dev only)
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
  }

  // HTTP Methods
  Future<Response> get(String path, {Map<String, dynamic>? queryParams}) =>
      dio.get(path, queryParameters: queryParams);

  Future<Response> post(String path, {dynamic data}) =>
      dio.post(path, data: data);

  Future<Response> put(String path, {dynamic data}) =>
      dio.put(path, data: data);

  Future<Response> patch(String path, {dynamic data}) =>
      dio.patch(path, data: data);

  Future<Response> delete(String path) =>
      dio.delete(path);
}
