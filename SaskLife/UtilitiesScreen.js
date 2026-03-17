import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from './styles';

const utilitiesData = [
  { id: '1', name: 'SaskPower', type: 'Electricity', amount: '$150', dueDate: '2025-05-01', status: 'Due' },
  { id: '2', name: 'SaskEnergy', type: 'Natural Gas', amount: '$200', dueDate: '2025-05-15', status: 'Due' },
  { id: '3', name: 'SaskTel', type: 'Internet & Phone', amount: '$80', dueDate: '2025-05-10', status: 'Paid' },
  { id: '4', name: 'Regina Water', type: 'Water', amount: '$45', dueDate: '2025-05-05', status: 'Due' },
  { id: '5', name: 'Saskatoon Water', type: 'Water', amount: '$50', dueDate: '2025-05-07', status: 'Due' },
  { id: '6', name: 'TransGas', type: 'Gas Transmission', amount: '$120', dueDate: '2025-05-12', status: 'Due' },
  { id: '7', name: 'Access Communications', type: 'Internet & TV', amount: '$90', dueDate: '2025-05-08', status: 'Paid' },
  { id: '8', name: 'Saskatoon Light & Power', type: 'Electricity', amount: '$130', dueDate: '2025-05-03', status: 'Due' },
];

const conservationTips = [
  'Turn off lights when not in use to save electricity.',
  'Use a programmable thermostat to reduce gas usage.',
  'Fix leaks promptly to conserve water.',
  'Switch to energy-efficient appliances for long-term savings.',
];

export default function UtilitiesScreen() {
const renderUtilityCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.amount}>Bill: {item.amount}</Text>
        <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
        <Text style={[styles.status, item.status === 'Paid' ? styles.statusPaid : styles.statusDue]}>
          Status: {item.status}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.button} onPress={() => alert(`Pay bill for ${item.name}`)}>
          <Text style={styles.buttonText}>Pay Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => alert(`Report issue with ${item.name}`)}>
          <Text style={styles.buttonText}>Report Issue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConservationTip = ({ item }) => (
    <View style={styles.tipCard}>
      <Text style={styles.tipText}>💡 {item}</Text>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* Dashboard Overview */}
      <View style={styles.overview}>
        <Text style={globalStyles.title}>Utilities Hub</Text>
        <Text style={styles.subtitle}>All your essential services in one place</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Due: $685</Text>
          <Text style={styles.summaryText}>Next Due Date: 2025-05-03</Text>
        </View>
      </View>

      {/* Utility Cards */}
      <FlatList
        data={utilitiesData}
        keyExtractor={(item) => item.id}
        renderItem={renderUtilityCard}
        scrollEnabled={false}
      />

      {/* Conservation Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Conservation Tips</Text>
        <FlatList
          data={conservationTips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderConservationTip}
          horizontal
          showsHorizontalScrollIndicator={false}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  type: {
    fontSize: 14,
    color: '#555',
  },
  cardBody: {
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    color: '#2196F3',
  },
  dueDate: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusPaid: {
    color: '#2E7D32',
  },
  statusDue: {
    color: '#D32F2F',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tipsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  tipCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 200,
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
  },
});