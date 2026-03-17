import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { globalStyles } from './styles';

const financialTools = [
  { id: '1', name: 'Budget Tracker', description: 'Set and track your monthly budget' },
  { id: '2', name: 'Expense Analyzer', description: 'Categorize and analyze spending' },
  { id: '3', name: 'Tax Calculator', description: 'Estimate your provincial taxes' },
  { id: '4', name: 'Investment Tracker', description: 'Monitor your investments' },
  { id: '5', name: 'Loan Calculator', description: 'Calculate loan payments' },
  { id: '6', name: 'Savings Goal Planner', description: 'Set and track financial goals' },
  { id: '7', name: 'Peer-to-Peer Advice Market', description: 'Share and discover financial tips' },
  { id: '8', name: 'Financial Opportunities Board', description: 'Explore local financial opportunities' },
];

const financialTips = [
  'Create an emergency fund with 3-6 months of expenses.',
  'Diversify your investments to reduce risk.',
  'Automate savings to reach your goals faster.',
  'Review your budget weekly to stay on track.',
];

const communityListings = [
  { id: '1', title: 'Seeking Advice on RRSPs', user: 'User123', category: 'Peer-to-Peer Advice' },
  { id: '2', title: 'Local Investment Group', user: 'User456', category: 'Opportunities Board' },
];

export default function FinancesScreen() {
  const [budget, setBudget] = useState('$2000');
  const [expenses, setExpenses] = useState('$1350');

  const renderToolCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert(`Using ${item.name}`)}>
        <Text style={styles.buttonText}>Use Tool</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCommunityListing = ({ item }) => (
    <View style={styles.listingCard}>
      <Text style={styles.listingTitle}>{item.title}</Text>
      <Text style={styles.listingUser}>Posted by: {item.user}</Text>
      <Text style={styles.listingCategory}>Category: {item.category}</Text>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => alert(`Viewing ${item.title} by ${item.user}`)}>
        <Text style={styles.buttonText}>View Listing</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFinancialTip = ({ item }) => (
    <View style={styles.tipCard}>
      <Text style={styles.tipText}>💸 {item}</Text>
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* Agora Dashboard */}
      <View style={styles.overview}>
        <Text style={globalStyles.title}>SaskLife Financial Agora</Text>
        <Text style={styles.subtitle}>Your local hub for financial tools and community</Text>
        <View style={styles.summary}>
          <View style={styles.budgetInput}>
            <Text style={styles.summaryText}>Monthly Budget:</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.budgetInput}>
            <Text style={styles.summaryText}>Expenses:</Text>
            <TextInput
              style={styles.input}
              value={expenses}
              onChangeText={setExpenses}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.summaryText}>
            Remaining: ${(parseFloat(budget.replace('$', '')) - parseFloat(expenses.replace('$', ''))).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Financial Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Tools</Text>
        <FlatList
          data={financialTools}
          keyExtractor={(item) => item.id}
          renderItem={renderToolCard}
          scrollEnabled={false}
        />
      </View>

      {/* Community Marketplace */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Marketplace</Text>
        <FlatList
          data={communityListings}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunityListing}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Financial Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Tips</Text>
        <FlatList
          data={financialTips}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFinancialTip}
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
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  budgetInput: {
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
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  listingUser: {
    fontSize: 14,
    color: '#555',
  },
  listingCategory: {
    fontSize: 12,
    color: '#555',
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