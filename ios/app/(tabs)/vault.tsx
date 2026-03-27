import React from 'react';
import { Linking, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';

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
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
  error: '#ec7c8a',
  tertiary: '#dee5ff',
};

const SUBJECTS = [
  { name: 'Physics', count: 42, icon: 'architecture', color: COLORS.primary, bg: COLORS.primaryContainer },
  { name: 'Maths', count: 128, icon: 'functions', color: COLORS.tertiary, bg: COLORS.surfaceBright },
  { name: 'Chemistry', count: 24, icon: 'science', color: COLORS.error, bg: COLORS.surfaceBright },
  { name: 'Biology', count: 56, icon: 'biotech', color: '#4b546d', bg: COLORS.surfaceBright },
];

const RECENT_ITEMS = [
  { title: 'Quantum Mechanics Intro', type: 'PDF', size: '4.2 MB', time: '2h ago', icon: 'picture_as_pdf' },
  { title: 'Organic Chemistry Review', type: 'Video', size: '12:40', time: 'Yesterday', icon: 'play_circle' },
  { title: 'Calculus III: Summary', type: 'Notes', size: '12 pages', time: '3 days ago', icon: 'description' },
];

export default function VaultScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol size={24} name="square.grid.2x2" color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Knowledge Vault</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/focus')}>
            <IconSymbol size={24} name="timer" color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Area */}
        <View style={styles.searchContainer}>
          {/* <IconSymbol size={20} name="timer" color={COLORS.onSurfaceVariant} /> */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor="rgba(163, 172, 183, 0.5)"
          />
          <View style={styles.commandBadge}>
            {/* <IconSymbol size={12} name="timer" color={COLORS.onSurfaceVariant} />
            <Text style={styles.commandText}>K</Text> */}
          </View>
        </View>

        {/* Subject Folders */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Subject Folders</Text>
            <Text style={styles.sectionSubtitle}>12 active domains</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <IconSymbol size={14} name="chevron.right" color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {SUBJECTS.map((subject, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <View style={[styles.subjectIconContainer, { backgroundColor: subject.bg }]}>
                <IconSymbol size={24} name="folder" color={subject.color} />
              </View>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectCount}>{subject.count} Resources</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recently Added */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
        </View>

        <View style={styles.recentList}>
          {RECENT_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.recentCard}>
              <View style={styles.recentThumbnail}>
                <View style={styles.thumbnailPlaceholder} />
                <IconSymbol size={20} name="folder" color="#FFF" style={styles.thumbnailIcon} />
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.recentMeta}>
                  <Text style={styles.metaText}>{item.type} • {item.size}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  searchContainer: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: 14,
  },
  commandBadge: {
    backgroundColor: COLORS.surfaceBright,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  commandText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: (width - 48 - 16) / 2,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 20,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  subjectName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subjectCount: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recentList: {
    gap: 12,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  recentThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  thumbnailIcon: {
    position: 'absolute',
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  metaText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
  },
  metaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.outlineVariant,
  },
  downloadButton: {
    padding: 8,
  }
});
