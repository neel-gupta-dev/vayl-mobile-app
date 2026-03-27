import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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
};

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log(`Triggered ${action}`);
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['rgba(192, 193, 255, 0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol size={24} name="chevron.left" color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Resource Detail</Text>
        <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => {
                setIsFavorite(!isFavorite);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
        >
          <IconSymbol 
            size={24} 
            name={isFavorite ? "heart.fill" : "heart"} 
            color={isFavorite ? COLORS.error : COLORS.onSurfaceVariant} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Resource Preview Area */}
        <View style={styles.previewContainer}>
          <LinearGradient
            colors={[COLORS.surfaceContainerHighest, COLORS.surfaceContainer]}
            style={styles.previewCard}
          >
            <View style={styles.previewBadge}>
                <Text style={styles.badgeText}>PDF</Text>
            </View>
            <IconSymbol size={80} name="folder.fill" color={COLORS.primary} />
            <View style={styles.previewInfo}>
                <Text style={styles.previewTitle} numberOfLines={2}>{id}</Text>
                <Text style={styles.previewMeta}>Resource ID: #VY-{Math.floor(Math.random()*10000)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
            <TouchableOpacity style={styles.mainAction} onPress={() => handleAction('View')}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryContainer]}
                    style={styles.mainActionGradient}
                >
                    <IconSymbol size={20} name="eye.fill" color={COLORS.onPrimary} />
                    <Text style={styles.mainActionText}>Open Resource</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => handleAction('Download')}>
                    <IconSymbol size={20} name="arrow.down.to.line" color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => handleAction('Share')}>
                    <IconSymbol size={20} name="square.and.arrow.up" color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>CATEGORY</Text>
                <Text style={styles.infoValue}>Academic Notes</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>SIZE</Text>
                <Text style={styles.infoValue}>4.2 MB</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>UPLOADED</Text>
                <Text style={styles.infoValue}>Mar 24, 2026</Text>
            </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.descriptionText}>
                This resource provides a comprehensive overview of core principles within the {id} domain. 
                Designed for high-performance students, it includes key lecture summaries, high-yield diagrams, 
                and verified formula sheets for rapid exam preparation.
            </Text>
        </View>

        {/* Author Section */}
        <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
                <IconSymbol size={24} name="person.fill" color={COLORS.primary} />
            </View>
            <View style={styles.authorInfo}>
                <Text style={styles.authorName}>Vayl Academy</Text>
                <Text style={styles.authorCredential}>Verified Education Partner</Text>
            </View>
            <TouchableOpacity style={styles.authorButton}>
                <Text style={styles.authorButtonText}>Follow</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    maxWidth: width * 0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  previewContainer: {
    marginVertical: 20,
  },
  previewCard: {
    width: '100%',
    height: 380,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  previewBadge: {
      position: 'absolute',
      top: 24,
      right: 24,
      backgroundColor: COLORS.surfaceBright,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
  },
  badgeText: {
      color: COLORS.primary,
      fontSize: 10,
      fontWeight: '900',
  },
  previewInfo: {
      marginTop: 40,
      alignItems: 'center',
  },
  previewTitle: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'center',
      letterSpacing: -0.5,
  },
  previewMeta: {
      color: COLORS.onSurfaceVariant,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 8,
  },
  actionBar: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 32,
  },
  mainAction: {
      flex: 1,
      height: 60,
      borderRadius: 18,
      overflow: 'hidden',
  },
  mainActionGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
  },
  mainActionText: {
      color: COLORS.onPrimary,
      fontSize: 16,
      fontWeight: '800',
  },
  secondaryActions: {
      flexDirection: 'row',
      gap: 12,
  },
  secondaryAction: {
      width: 60,
      height: 60,
      borderRadius: 18,
      backgroundColor: COLORS.surfaceContainerHigh,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoGrid: {
      flexDirection: 'row',
      backgroundColor: COLORS.surfaceContainerLow,
      padding: 20,
      borderRadius: 24,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  infoSection: {
      flex: 1,
      alignItems: 'center',
  },
  infoLabel: {
      color: COLORS.onSurfaceVariant,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1.5,
      marginBottom: 6,
  },
  infoValue: {
      color: '#FFF',
      fontSize: 13,
      fontWeight: '700',
  },
  infoDivider: {
      width: 1,
      height: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignSelf: 'center',
  },
  descriptionSection: {
      marginBottom: 32,
  },
  sectionTitle: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 12,
  },
  descriptionText: {
      color: COLORS.onSurfaceVariant,
      fontSize: 15,
      lineHeight: 24,
      fontWeight: '500',
  },
  authorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surfaceContainer,
      padding: 16,
      borderRadius: 20,
      gap: 14,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  authorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.surfaceBright,
      alignItems: 'center',
      justifyContent: 'center',
  },
  authorInfo: {
      flex: 1,
  },
  authorName: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '800',
  },
  authorCredential: {
      color: COLORS.onSurfaceVariant,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2,
  },
  authorButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: COLORS.primary,
      borderRadius: 12,
  },
  authorButtonText: {
      color: COLORS.onPrimary,
      fontSize: 13,
      fontWeight: '800',
  }
});
