import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import UtilitiesScreen from './UtilitiesScreen';
import FinancesScreen from './FinancesScreen';
import MarketplaceScreen from './MarketplaceScreen';
import HealthMedicalScreen from './HealthMedicalScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#FFC107', paddingBottom: 5, height: 60 },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#2E7D32',
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Utilities') iconName = 'flash';
            else if (route.name === 'Finances') iconName = 'wallet';
            else if (route.name === 'Marketplace') iconName = 'cart';
            else if (route.name === 'Health') iconName = 'medkit';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Utilities" component={UtilitiesScreen} />
        <Tab.Screen name="Finances" component={FinancesScreen} />
        <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
        <Tab.Screen name="Health" component={HealthMedicalScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}