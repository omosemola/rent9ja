// ============================================================================
// Properties Repository
// ============================================================================

import '../../../core/network/api_client.dart';

class PropertiesRepository {
  final ApiClient _api;

  PropertiesRepository(this._api);

  Future<Map<String, dynamic>> search({
    String? query, String? state, String? city, String? propertyType,
    double? minPrice, double? maxPrice, int? bedrooms,
    String? sortBy, int page = 1, int limit = 20,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
      if (query != null) 'query': query,
      if (state != null) 'state': state,
      if (city != null) 'city': city,
      if (propertyType != null) 'propertyType': propertyType,
      if (minPrice != null) 'minPrice': minPrice,
      if (maxPrice != null) 'maxPrice': maxPrice,
      if (bedrooms != null) 'bedrooms': bedrooms,
      if (sortBy != null) 'sortBy': sortBy,
    };
    final response = await _api.get('/properties/search', queryParams: params);
    return response.data;
  }

  Future<List<dynamic>> getFeatured() async {
    final response = await _api.get('/properties/featured');
    return response.data;
  }

  Future<List<dynamic>> getNewest() async {
    final response = await _api.get('/properties/newest');
    return response.data;
  }

  Future<Map<String, dynamic>> getById(String id) async {
    final response = await _api.get('/properties/$id');
    return response.data;
  }

  Future<void> toggleFavorite(String propertyId) async {
    await _api.post('/favorites/$propertyId');
  }

  Future<List<dynamic>> getFavorites() async {
    final response = await _api.get('/favorites');
    return response.data;
  }
}
