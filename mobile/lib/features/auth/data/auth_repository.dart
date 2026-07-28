// ============================================================================
// Auth Repository
// ============================================================================

import '../../../core/network/api_client.dart';
import '../../../core/storage/secure_storage.dart';

class AuthRepository {
  final ApiClient _api;
  final SecureStorageService _storage;

  AuthRepository(this._api, this._storage);

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    String? phone,
  }) async {
    final response = await _api.post('/auth/register', data: {
      'email': email,
      'password': password,
      'fullName': fullName,
      'role': role,
      if (phone != null) 'phone': phone,
    });

    final data = response.data;
    await _storage.saveTokens(data['accessToken'], data['refreshToken']);
    await _storage.saveUserId(data['user']['id']);
    await _storage.saveUserRole(data['user']['role']);

    return data;
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _api.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    final data = response.data;
    await _storage.saveTokens(data['accessToken'], data['refreshToken']);
    await _storage.saveUserId(data['user']['id']);
    await _storage.saveUserRole(data['user']['role']);

    return data;
  }

  Future<void> logout() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      await _api.post('/auth/logout', data: {'refreshToken': refreshToken});
    } catch (_) {}
    await _storage.clearAll();
  }

  Future<void> forgotPassword(String email) async {
    await _api.post('/auth/forgot-password', data: {'email': email});
  }

  Future<void> resetPassword(String email, String code, String newPassword) async {
    await _api.post('/auth/reset-password', data: {
      'email': email,
      'code': code,
      'newPassword': newPassword,
    });
  }

  Future<void> verifyEmail(String code) async {
    await _api.post('/auth/verify-email', data: {'code': code});
  }

  Future<bool> isLoggedIn() => _storage.isLoggedIn();
  Future<String?> getUserRole() => _storage.getUserRole();
}
