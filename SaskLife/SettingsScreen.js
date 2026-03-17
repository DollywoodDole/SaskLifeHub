import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { globalStyles } from './styles';
import {
  login,
  signup,
  logout,
  getMe,
  getStoredUser,
  getAccessToken,
  clearAuth,
} from './lib/apiClient';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // On mount: check if a token is already stored
  const loadStoredUser = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        const stored = await getStoredUser();
        if (stored) {
          setUser(stored);
        } else {
          // token exists but no cached user — fetch from server
          const freshUser = await getMe();
          setUser(freshUser);
        }
      }
    } catch {
      // Token invalid / expired; credentials were already cleared by apiClient
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredUser();
  }, [loadStoredUser]);

  const handleLogin = async () => {
    setFormError('');
    if (!email.trim() || !password) {
      setFormError('Email and password are required.');
      return;
    }
    setFormLoading(true);
    try {
      const data = await login(email.trim().toLowerCase(), password);
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (err) {
      setFormError(err.message || 'Login failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignup = async () => {
    setFormError('');
    if (!name.trim() || !email.trim() || !password) {
      setFormError('Name, email, and password are required.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    setFormLoading(true);
    try {
      const data = await signup(name.trim(), email.trim().toLowerCase(), password);
      setUser(data.user);
      setName('');
      setEmail('');
      setPassword('');
      if (data.message) {
        Alert.alert('Account Created', data.message);
      }
    } catch (err) {
      setFormError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // logout() already clears local storage even on network errors
    }
    setUser(null);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <View style={[globalStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // ── Logged-in view ────────────────────────────────────────────────────────
  if (user) {
    return (
      <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Settings</Text>

        {/* Dark Mode toggle */}
        <View style={styles.setting}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Account info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.infoText}>Name: {user.name}</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
          {user.is_verified ? (
            <Text style={styles.verifiedBadge}>Email verified</Text>
          ) : (
            <Text style={styles.unverifiedBadge}>Email not verified</Text>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Auth form (not logged in) ─────────────────────────────────────────────
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Settings</Text>

      {/* Dark Mode toggle always visible */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <View style={styles.card}>
        {/* Mode toggle */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
            onPress={() => { setMode('login'); setFormError(''); }}
          >
            <Text style={[styles.modeTabText, mode === 'login' && styles.modeTabTextActive]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
            onPress={() => { setMode('signup'); setFormError(''); }}
          >
            <Text style={[styles.modeTabText, mode === 'signup' && styles.modeTabTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, formLoading && styles.submitButtonDisabled]}
          onPress={mode === 'login' ? handleLogin : handleSignup}
          disabled={formLoading}
        >
          {formLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
  },
  settingText: {
    fontSize: 18,
    color: '#2E7D32',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  verifiedBadge: {
    marginTop: 6,
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  unverifiedBadge: {
    marginTop: 6,
    fontSize: 13,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  modeRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modeTabActive: {
    backgroundColor: '#2196F3',
  },
  modeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  modeTabTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
