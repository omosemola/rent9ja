// ============================================================================
// Auth Repository - Connects to NestJS REST API
// ============================================================================

import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

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
      if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
    });

    final data = response.data as Map<String, dynamic>;
    if (data['accessToken'] != null) {
      await _storage.saveTokens(
        data['accessToken'] as String,
        data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>;
      await _storage.saveUserId(user['id'] as String);
      await _storage.saveUserRole(user['role'] as String);
    }

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

    final data = response.data as Map<String, dynamic>;
    if (data['accessToken'] != null) {
      await _storage.saveTokens(
        data['accessToken'] as String,
        data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>;
      await _storage.saveUserId(user['id'] as String);
      await _storage.saveUserRole(user['role'] as String);
    }

    return data;
  }

  Future<Map<String, dynamic>> loginWithGoogle() async {
    await GoogleSignIn.instance.initialize(
      // clientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual Client ID when available
    );

    GoogleSignInAccount account;
    try {
      account = await GoogleSignIn.instance.authenticate(
        scopeHint: ['email', 'profile'],
      );
    } catch (e) {
      throw Exception('Google Sign-In was cancelled or failed.');
    }

    final GoogleSignInAuthentication auth = account.authentication;
    final String? idToken = auth.idToken;

    if (idToken == null) {
      throw Exception('Failed to obtain ID token from Google.');
    }

    final response = await _api.post('/auth/google', data: {
      'idToken': idToken,
    });

    final data = response.data as Map<String, dynamic>;
    if (data['accessToken'] != null) {
      await _storage.saveTokens(
        data['accessToken'] as String,
        data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>;
      await _storage.saveUserId(user['id'] as String);
      await _storage.saveUserRole(user['role'] as String);
    }

    return data;
  }

  Future<Map<String, dynamic>> loginWithApple() async {
    final AuthorizationCredentialAppleID credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
    );

    final String? idToken = credential.identityToken;
    if (idToken == null) {
      throw Exception('Failed to obtain ID token from Apple.');
    }

    final response = await _api.post('/auth/apple', data: {
      'idToken': idToken,
      'firstName': credential.givenName,
      'lastName': credential.familyName,
    });

    final data = response.data as Map<String, dynamic>;
    if (data['accessToken'] != null) {
      await _storage.saveTokens(
        data['accessToken'] as String,
        data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>;
      await _storage.saveUserId(user['id'] as String);
      await _storage.saveUserRole(user['role'] as String);
    }

    return data;
  }

  Future<void> logout() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      await _api.post('/auth/logout', data: {'refreshToken': refreshToken});
    } catch (_) {
      // Clear local storage regardless of API server state
    } finally {
      await _storage.clearAll();
    }
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

  Future<Map<String, dynamic>?> getCurrentUser() async {
    try {
      final response = await _api.get('/users/me');
      return response.data as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }
}

