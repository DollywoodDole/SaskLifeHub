import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from './styles';

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

const featuredListings = [
  { id: '1', title: 'Handmade Pottery', price: '$25', category: 'Local Goods' },
  { id: '2', title: 'John Deere Tractor', price: '$5000', category: 'Agricultural Equipment' },
  { id: '3', title: 'Contractor for Hire', price: '$50/hr', category: 'Construction Services' },
  { id: '4', title: 'Homemade Perogies', price: '$10/dozen', category: 'Homemade Food' },
  { id: '5', title: 'Used Dining Table', price: '$200', category: 'Second-Hand Goods' },
  { id: '6', title: 'Lawn Mowing Service', price: '$30', category: 'Local Services' },
  { id: '7', title: 'Electric Motor', price: '$800', category: 'Manufacturing Machinery' },
  { id: '8', title: 'Community Workshop', price: '$15', category: 'Event Planning' },
];

const localEvents = [
  'SaskLife Community Market - May 3, 2025',
  'SaskLife Trade Fair for Farmers - May 10, 2025',
];

export default function MarketplaceScreen() {
  const renderCategoryCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Browsing ${item.name}`)}>
          <Text style={styles.buttonText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => alert(`Listing in ${item.name}`)}>
          <Text style={styles.buttonText}>List Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeaturedListing = ({ item }) => (
    <View style={styles.listingCard}>
      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingPrice}>{item.price}</Text>
      <Text style={styles.listingCategory}>Category: {item.category}</Text>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => alert(`Viewing ${item.title}`)}>
        <Text style={styles.buttonText}>View Item</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocalEvent = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventText}>📅 {item}</Text>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* Agora Dashboard */}
      <View style={styles.overview}>
        <Text style={globalStyles.title}>SaskLife Marketplace Agora</Text>
        <Text style={styles.subtitle}>Your local hub for buying, selling, and trading</Text>
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

      {/* Featured Listings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Listings</Text>
        <FlatList
          data={featuredListings}
          keyExtractor={(item) => item.id}
          renderItem={renderFeaturedListing}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Local Events */}
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
});