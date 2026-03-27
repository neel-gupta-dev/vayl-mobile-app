import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#0b0e11',
  surface: '#0b0e11',
  surfaceContainerLow: '#0f1418',
  surfaceContainer: '#141a20',
  surfaceContainerHigh: '#192027',
  surfaceContainerHighest: '#1e272f',
  surfaceBright: '#222d37',
  primary: '#c0c1ff',
  primaryContainer: '#2f2ebe',
  onPrimary: '#2724b8',
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
  error: '#ec7c8a',
  tertiary: '#dee5ff',
};

const CATEGORIES = ['All', 'Notes', 'MCQ', 'Video', 'Audio'];

const MOCK_RESOURCES = [
  { id: '1', title: 'Fundamentals of Mechanics', type: 'Notes', size: '2.4 MB', time: '2 days ago', icon: 'description' },
  { id: '2', title: 'Quantum Mechanics Explained', type: 'Video', size: '15:20', time: '1 week ago', icon: 'play_circle' },
  { id: '3', title: 'Electrostatics Practice Set', type: 'MCQ', size: '15 Ques', time: '3 days ago', icon: 'quiz' },
  { id: '4', title: 'Optics Cheat Sheet', type: 'Notes', size: '850 KB', time: 'Just now', icon: 'description' },
  { id: '5', title: 'Thermodynamics Lecture', type: 'Audio', size: '45:10', time: 'Yesterday', icon: 'mic' },
  { id: '6', title: 'Wave Particle Duality', type: 'Video', size: '22:15', time: '2 weeks ago', icon: 'play_circle' },
];

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = MOCK_RESOURCES.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.type === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['rgba(192, 193, 255, 0.05)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol size={24} name="chevron.left" color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{id}</Text>
          <Text style={styles.headerSubtitle}>{MOCK_RESOURCES.length} Resources</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <IconSymbol size={24} name="ellipsis" color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color={COLORS.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search in ${id}...`}
            placeholderTextColor="rgba(163, 172, 183, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.filterChip, selectedCategory === cat && styles.activeFilterChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterText, selectedCategory === cat && styles.activeFilterText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resourceList}>
          {filteredResources.map((item) => (
            <TouchableOpacity 
                key={item.id} 
                style={styles.resourceCard}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                        pathname: '/resource/[id]',
                        params: { id: item.title }
                    });
                }}
            >
              <View style={styles.resourceIconContainer}>
                <LinearGradient
                  colors={[COLORS.surfaceContainerHighest, COLORS.surfaceContainerHigh]}
                  style={styles.resourceIconBg}
                >
                  <IconSymbol size={22} name="folder" color={COLORS.primary} />
                </LinearGradient>
              </View>
              
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.resourceMeta}>
                  <Text style={styles.metaText}>{item.type} • {item.size}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.moreButton}>
                <IconSymbol size={20} name="chevron.right" color={COLORS.surfaceBright} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {filteredResources.length === 0 && (
              <View style={styles.emptyContainer}>
                  <IconSymbol size={48} name="folder.fill" color={COLORS.surfaceContainerHigh} />
                  <Text style={styles.emptyText}>No items found</Text>
              </View>
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 60,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  searchInput: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: 15,
    fontWeight: '500',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '700',
  },
  activeFilterText: {
    color: COLORS.onPrimary,
  },
  resourceList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 14,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  resourceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  resourceIconBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(163, 172, 183, 0.3)',
  },
  moreButton: {
    padding: 4,
  },
  emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      opacity: 0.5,
  },
  emptyText: {
      color: COLORS.onSurfaceVariant,
      fontSize: 14,
      fontWeight: '600',
      marginTop: 12,
  }
});
