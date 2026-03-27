import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
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
  onPrimaryContainer: '#ccccff',
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
  error: '#ec7c8a',
  errorContainer: '#7f2737',
};

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <IconSymbol size={24} name="square.grid.2x2" color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Knowledge Vault</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/focus')}>
          <IconSymbol size={24} name="timer" color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.dateLabel}>Monday, Oct 24</Text>
          <Text style={styles.greetingText}>Hello, Julian</Text>
        </View>

        {/* Progress and Streak Bento Row */}
        <View style={styles.bentoContainer}>
          {/* Daily Focus Card */}
          <View style={styles.focusCard}>
            <View style={styles.focusCardLeft}>
              <Text style={styles.cardTitle}>Daily Focus</Text>
              <Text style={styles.cardSubtitle}>You've completed 75% of your target goals.</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>45 / 60 min</Text>
              </View>
            </View>
            <View style={styles.progressRingContainer}>
              {/* Simplified Circular Progress for now */}
              <View style={styles.progressRingOuter}>
                <Text style={styles.progressPercentage}>75%</Text>
              </View>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.streakCard}>
            <View style={styles.streakIconContainer}>
              <IconSymbol size={24} name="timer" color={COLORS.error} />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakTitle}>12 Day Streak</Text>
              <Text style={styles.streakSubtitle}>Keep it up! 3 days until milestone.</Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color={COLORS.onSurfaceVariant} />
          </View>
        </View>

        {/* Recent Resources */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Resources</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalContent}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.resourceCard}>
              <View style={styles.resourceImageContainer}>
                <View style={styles.resourcePlaceholder} />
                <View style={styles.resourceIconTag}>
                  <IconSymbol size={14} name="folder" color={COLORS.onSurface} />
                </View>
              </View>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle} numberOfLines={1}>
                  {item === 1 ? 'Advanced Neural Networks' : item === 2 ? 'Macroeconomic Principles' : 'Organic Chemistry Basics'}
                </Text>
                <Text style={styles.resourceSubtitle}>Updated 2h ago</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Up Next Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Up Next</Text>
        </View>

        <View style={styles.upNextCard}>
          <View style={styles.timeCluster}>
            <Text style={styles.timeText}>14:00</Text>
            <View style={styles.timeConnector} />
            <Text style={styles.timeSubtext}>15:30</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Deep Focus: Cognitive Psychology</Text>
            <Text style={styles.eventSubtitle}>Library Room 402</Text>
          </View>
          <TouchableOpacity style={styles.eventButton}>
            <IconSymbol size={20} name="timer" color={COLORS.primary} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FAB */}
      {/* <TouchableOpacity style={styles.fab}>
        <IconSymbol size={32} name="timer" color={COLORS.background} />
      </TouchableOpacity> */}
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
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120,
  },
  welcomeSection: {
    marginVertical: 16,
  },
  dateLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '500',
  },
  greetingText: {
    color: COLORS.onSurface,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 4,
  },
  bentoContainer: {
    gap: 16,
    marginVertical: 16,
  },
  focusCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  focusCardLeft: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 160,
  },
  progressBadge: {
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  progressBadgeText: {
    color: COLORS.onPrimaryContainer,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressRingContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakCard: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(236, 124, 138, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  streakSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -24,
  },
  horizontalContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  resourceCard: {
    width: 240,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    overflow: 'hidden',
  },
  resourceImageContainer: {
    height: 120,
    backgroundColor: COLORS.surfaceBright,
    position: 'relative',
  },
  resourcePlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  resourceIconTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(11, 14, 17, 0.8)',
    padding: 6,
    borderRadius: 8,
  },
  resourceInfo: {
    padding: 16,
    gap: 4,
  },
  resourceTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resourceSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
  upNextCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeCluster: {
    alignItems: 'center',
    width: 40,
  },
  timeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeConnector: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.surfaceContainerHighest,
    marginVertical: 4,
  },
  timeSubtext: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  eventSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
  eventButton: {
    backgroundColor: COLORS.surfaceBright,
    padding: 8,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});
