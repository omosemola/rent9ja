// ============================================================================
// Properties BLoC
// ============================================================================

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../data/properties_repository.dart';

// Events
abstract class PropertiesEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadFeaturedProperties extends PropertiesEvent {}
class LoadNewestProperties extends PropertiesEvent {}
class SearchProperties extends PropertiesEvent {
  final String? query;
  final String? state;
  final String? propertyType;
  final double? minPrice;
  final double? maxPrice;
  final int? bedrooms;
  final String? sortBy;
  final int page;

  SearchProperties({
    this.query, this.state, this.propertyType,
    this.minPrice, this.maxPrice, this.bedrooms,
    this.sortBy, this.page = 1,
  });

  @override
  List<Object?> get props => [query, state, propertyType, minPrice, maxPrice, bedrooms, sortBy, page];
}

class LoadPropertyDetail extends PropertiesEvent {
  final String propertyId;
  LoadPropertyDetail(this.propertyId);
  @override
  List<Object?> get props => [propertyId];
}

class ToggleFavorite extends PropertiesEvent {
  final String propertyId;
  ToggleFavorite(this.propertyId);
  @override
  List<Object?> get props => [propertyId];
}

// States
abstract class PropertiesState extends Equatable {
  @override
  List<Object?> get props => [];
}

class PropertiesInitial extends PropertiesState {}
class PropertiesLoading extends PropertiesState {}
class PropertiesLoaded extends PropertiesState {
  final List<dynamic> featured;
  final List<dynamic> newest;
  PropertiesLoaded({this.featured = const [], this.newest = const []});
  @override
  List<Object?> get props => [featured, newest];
}
class PropertiesSearchResult extends PropertiesState {
  final List<dynamic> properties;
  final Map<String, dynamic> pagination;
  PropertiesSearchResult({required this.properties, required this.pagination});
  @override
  List<Object?> get props => [properties, pagination];
}
class PropertyDetailLoaded extends PropertiesState {
  final Map<String, dynamic> property;
  PropertyDetailLoaded(this.property);
  @override
  List<Object?> get props => [property];
}
class PropertiesError extends PropertiesState {
  final String message;
  PropertiesError(this.message);
  @override
  List<Object?> get props => [message];
}

// BLoC
class PropertiesBloc extends Bloc<PropertiesEvent, PropertiesState> {
  final PropertiesRepository _repository;

  PropertiesBloc(this._repository) : super(PropertiesInitial()) {
    on<LoadFeaturedProperties>(_onLoadFeatured);
    on<LoadNewestProperties>(_onLoadNewest);
    on<SearchProperties>(_onSearch);
    on<LoadPropertyDetail>(_onLoadDetail);
    on<ToggleFavorite>(_onToggleFavorite);
  }

  List<dynamic> _featured = [];
  List<dynamic> _newest = [];

  Future<void> _onLoadFeatured(LoadFeaturedProperties event, Emitter<PropertiesState> emit) async {
    try {
      _featured = await _repository.getFeatured();
      emit(PropertiesLoaded(featured: _featured, newest: _newest));
    } catch (e) {
      emit(PropertiesError(e.toString()));
    }
  }

  Future<void> _onLoadNewest(LoadNewestProperties event, Emitter<PropertiesState> emit) async {
    try {
      _newest = await _repository.getNewest();
      emit(PropertiesLoaded(featured: _featured, newest: _newest));
    } catch (e) {
      emit(PropertiesError(e.toString()));
    }
  }

  Future<void> _onSearch(SearchProperties event, Emitter<PropertiesState> emit) async {
    emit(PropertiesLoading());
    try {
      final result = await _repository.search(
        query: event.query, state: event.state,
        propertyType: event.propertyType,
        minPrice: event.minPrice, maxPrice: event.maxPrice,
        bedrooms: event.bedrooms, sortBy: event.sortBy, page: event.page,
      );
      emit(PropertiesSearchResult(
        properties: result['data'],
        pagination: result['pagination'],
      ));
    } catch (e) {
      emit(PropertiesError(e.toString()));
    }
  }

  Future<void> _onLoadDetail(LoadPropertyDetail event, Emitter<PropertiesState> emit) async {
    emit(PropertiesLoading());
    try {
      final property = await _repository.getById(event.propertyId);
      emit(PropertyDetailLoaded(property));
    } catch (e) {
      emit(PropertiesError(e.toString()));
    }
  }

  Future<void> _onToggleFavorite(ToggleFavorite event, Emitter<PropertiesState> emit) async {
    try {
      await _repository.toggleFavorite(event.propertyId);
    } catch (_) {}
  }
}
