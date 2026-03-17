// TODO: wire to backend API when /health or /appointments endpoints are added.
// Currently uses static placeholder data and local state for wellness tracking.
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { globalStyles } from './styles';

const healthCategories = [
  { id: '1', name: 'Doctor Appointments', description: 'Book appointments with local doctors' },
  { id: '2', name: 'Health Record Tracker', description: 'Access and manage your health records' },
  { id: '3', name: 'Wellness Tracker', description: 'Track steps, water intake, and sleep' },
  { id: '4', name: 'Mental Health Support', description: 'Resources and virtual counseling' },
  { id: '5', name: 'Prescription Manager', description: 'Track and refill prescriptions' },
  { id: '6', name: 'Emergency Services', description: 'Quick access to emergency contacts' },
  { id: '7', name: 'Community Wellness Market', description: 'Share and discover health tips' },
  { id: '8', name: 'Health Events Board', description: 'Explore local health events' },
];

const featuredResources = [
  { id: '1', title: 'Vaccination Reminder', description: 'Get your flu shot this month!', category: 'Health Events Board' },
  { id: '2', title: 'Mental Health Tip', description: 'Practice mindfulness daily', category: 'Mental Health Support' },
  { id: '3', title: 'Hydration Goal', description: 'Drink 8 glasses of water today', category: 'Wellness Tracker' },
  { id: '4', title: 'Emergency Contact', description: 'Saskatoon City Hospital', category: 'Emergency Services' },
];

const localEvents = [
  'SaskLife Vaccination Clinic - May 5, 2025',
  'SaskLife Wellness Workshop - May 12, 2025',
];

export default function HealthMedicalScreen() {
  const [steps, setSteps] = useState('5000');
  const [waterIntake, setWaterIntake] = useState('6');

  const renderCategoryCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Accessing ${item.name}`)}>
          <Text style={styles.buttonText}>Use Service</Text>
        </TouchableOpacity>
        {item.name === 'Community Wellness Market' || item.name === 'Health Events Board' ? (
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => alert(`Posting to ${item.name}`)}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  const renderFeaturedResource = ({ item }) => (
    <View style={styles.resourceCard}>
      <Text style={styles.resourceTitle}>{item.title}</Text>
      <Text style={styles.resourceDescription}>{item.description}</Text>
      <Text style={styles.resourceCategory}>Category: {item.category}</Text>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => alert(`Viewing ${item.title}`)}>
        <Text style={styles.buttonText}>Learn More</Text>
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
        <Text style={globalStyles.title}>SaskLife Health Agora</Text>
        <Text style={styles.subtitle}>Your local hub for health and medical services</Text>
        <View style={styles.summary}>
          <View style={styles.healthInput}>
            <Text style={styles.summaryText}>Daily Steps:</Text>
            <TextInput
              style={styles.input}
              value={steps}
              onChangeText={setSteps}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.healthInput}>
            <Text style={styles.summaryText}>Water Intake (glasses):</Text>
            <TextInput
              style={styles.input}
              value={waterIntake}
              onChangeText={setWaterIntake}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.summaryText}>Next Appointment: May 3, 2025</Text>
        </View>
      </View>

      {/* Health Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Services</Text>
        <FlatList
          data={healthCategories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryCard}
          scrollEnabled={false}
        />
      </View>

      {/* Featured Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Resources</Text>
        <FlatList
          data={featuredResources}
          keyExtractor={(item) => item.id}
          renderItem={renderFeaturedResource}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Local Health Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SaskLife Health Events</Text>
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
  summary: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  healthInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 5,
    padding: 5,
    width: 100,
    textAlign: 'center',
    color: '#2E7D32',
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
  resourceCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#555',
  },
  resourceCategory: {
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
