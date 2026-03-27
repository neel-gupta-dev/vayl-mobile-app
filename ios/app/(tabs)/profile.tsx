import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const COLORS = {
  background: '#0b0e11',
  surface: '#0b0e11',
  surfaceContainer: '#141a20',
  surfaceContainerHigh: '#192027',
  primary: '#c0c1ff',
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
};

export default function ProfileScreen() {
  const menuItems = [
    { icon: 'person', label: 'Personal Information' },
    { icon: 'timer', label: 'Focus Statistics' },
    { icon: 'folder', label: 'My Vault' },
    { icon: 'square.grid.2x2', label: 'Appearance' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
             <IconSymbol size={40} name="person" color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>Julian</Text>
          <Text style={styles.userEmail}>julian@vayl.app</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <IconSymbol size={20} name={item.icon as any} color={COLORS.onSurfaceVariant} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <IconSymbol size={16} name="chevron.right" color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  userName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    marginTop: 4,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: 'bold',
  }
});
