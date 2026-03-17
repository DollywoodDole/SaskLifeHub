import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { globalStyles } from './styles';
import { getListings } from './lib/apiClient';

// Static category definitions (UI only — category values must match
// the LISTING_CATEGORIES enum defined in the backend's models/listing.py)
const marketplaceCategories = [
  { id: '1', name: 'Local Goods', description: 'Handmade crafts, farm produce, and more' },
  { id: '2', name: 'Agricultural Equipment', description: 'Tractors, grain bins, and farming tools' },
  { id: '3', name: 'Construction Services', description: 'Contractors, equipment rental, and tools' },
  { id: '4', name: 'Homemade Food', description: 'Fresh meals and baked goods from local cooks' },
  { id: '5', name: 'Second-Hand Goods', description: 'Used furniture, vehicles, and more' },
  { id: '6', name: 'Local Services', description: 'Repairs, landscaping, tutoring, and more' },
  { id: '7', name: 'Manufacturing Machinery', description: 'Industrial equipment for small businesses' },
  { id: '8', name: 'Event Planning', description: 'Plan and book local activities and events' },
];

// Static local events (no backend endpoint exists for these yet)
// TODO: wire to a backend /events endpoint when it is available
const localEvents = [
  'SaskLife Community Market - May 3, 2025',
  'SaskLife Trade Fair for Farmers - May 10, 2025',
];

export default function MarketplaceScreen() {
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch featured listings (first page, no filters by default)
  const fetchListings = useCallback(async (searchTerm = '') => {
    setLoadingListings(true);
    setListingsError('');
    try {
      const params = { page: 1, per_page: 10 };
      if (searchTerm) params.search = searchTerm;
      const data = await getListings(params);
      setListings(data.listings || []);
    } catch (err) {
      setListingsError(err.message || 'Failed to load listings.');
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = () => {
    const term = searchInput.trim();
    setSearch(term);
    fetchListings(term);
  };

  // ── Renderers ──────────────────────────────────────────────────────────────

  const renderCategoryCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => fetchListings(item.name)}
        >
          <Text style={styles.buttonText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => alert(`Listing in ${item.name}`)}
        >
          <Text style={styles.buttonText}>List Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListing = ({ item }) => (
    <View style={styles.listingCard}>
      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingPrice}>
        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
        {item.price_unit ? ` / ${item.price_unit}` : ''}
      </Text>
      <Text style={styles.listingCategory}>Category: {item.category}</Text>
      {item.location ? (
        <Text style={styles.listingLocation}>{item.location}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => alert(`Viewing: ${item.title}`)}
      >
        <Text style={styles.buttonText}>View Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocalEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventText}>📅 {item}</Text>
    </View>
  );

  // ── Featured listings section content ─────────────────────────────────────
  let featuredContent;
  if (loadingListings) {
    featuredContent = (
      <View style={styles.centeredRow}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.loadingText}>Loading listings…</Text>
      </View>
    );
  } else if (listingsError) {
    featuredContent = (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>{listingsError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchListings(search)}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (listings.length === 0) {
    featuredContent = (
      <Text style={styles.emptyText}>
        {search ? `No listings found for "${search}".` : 'No active listings yet.'}
      </Text>
    );
  } else {
    featuredContent = (
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={renderListing}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      {/* Agora Dashboard */}
      <View style={styles.overview}>
        <Text style={globalStyles.title}>SaskLife Marketplace Agora</Text>
        <Text style={styles.subtitle}>Your local hub for buying, selling, and trading</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings…"
          placeholderTextColor="#aaa"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Marketplace Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Marketplace Categories</Text>
        <FlatList
          data={marketplaceCategories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryCard}
          scrollEnabled={false}
        />
      </View>

      {/* Featured Listings (from API) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {search ? `Results for "${search}"` : 'Featured Listings'}
        </Text>
        {featuredContent}
      </View>

      {/* Local Events */}
      {/* TODO: wire to a backend /events endpoint when available */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SaskLife Events</Text>
        <FlatList
          data={localEvents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLocalEvent}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overview: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonSecondary: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listingCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  listingPrice: {
    fontSize: 14,
    color: '#2196F3',
  },
  listingCategory: {
    fontSize: 12,
    color: '#555',
  },
  listingLocation: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  eventCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  eventText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 14,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
