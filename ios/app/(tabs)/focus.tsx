import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, StatusBar, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.75;
const STROKE_WIDTH = 12;
const R = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCLE_LENGTH = 2 * Math.PI * R;

const MINUTES = Array.from({ length: 120 }, (_, i) => i + 1);

const COLORS = {
  background: '#0b0e11',
  surface: '#141a20',
  surfaceVariant: '#1e272f',
  primary: '#c0c1ff',
  primaryContainer: '#2f2ebe',
  onPrimary: '#2724b8',
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
  accent: '#ec7c8a',
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function FocusRoomScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  const [showPicker, setShowPicker] = useState(false);
  
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    StatusBar.setHidden(isActive, 'fade');
    
    if (isActive && scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
    }
    
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: {
          display: isActive ? 'none' : 'flex',
          backgroundColor: '#0b0e11',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        }
      });
    }

    if (isActive) {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );
    } else {
        pulse.value = withTiming(1);
    }

    return () => {
        StatusBar.setHidden(false);
        if (parent) {
            parent.setOptions({ tabBarStyle: undefined });
        }
    };
  }, [isActive, navigation]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerEnd = async () => {
    setIsActive(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Session Complete! 🎯",
        body: "Well done! You've finished your focus session. Time for a well-deserved break.",
        sound: true,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    progress.value = withTiming(1 - timeLeft / duration, { duration: 1000 });
  }, [timeLeft, duration]);

  const toggleTimer = useCallback(() => {
    if (showPicker) setShowPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
    scale.value = withTiming(isActive ? 1 : 1.05, { duration: 300 });
  }, [isActive, showPicker]);

  const handlePickerChange = (itemValue: number) => {
    const seconds = itemValue * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulse.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[isActive ? 'rgba(192, 193, 255, 0.1)' : 'rgba(192, 193, 255, 0.05)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      
      {!isActive && (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                <IconSymbol size={24} name="chevron.left" color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Focus Session</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
                <IconSymbol size={24} name="ellipsis" color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
        </View>
      )}

      {isActive && (
          <View style={styles.focusBadgeContainer}>
              <View style={styles.focusBadge}>
                  <View style={styles.dot} />
                  <Text style={styles.focusBadgeText}>FOCUS MODE ACTIVE</Text>
              </View>
          </View>
      )}

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, isActive && styles.fullScreenContent]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isActive}
      >
        <Animated.View style={[styles.timerWrapper, timerAnimatedStyle, isActive && styles.activeTimerWrapper]}>
          <View style={styles.timerContainer}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={R}
                stroke={COLORS.surfaceVariant}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <AnimatedCircle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={R}
                stroke={COLORS.primary}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCLE_LENGTH}
                animatedProps={animatedProps}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>

            <View style={styles.timeTextContainer}>
              <Text style={styles.timeDisplay}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timeLabel}>{Math.floor(duration/60)} minute session</Text>
            </View>
          </View>
        </Animated.View>

        {!isActive && showPicker && (
            <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>SELECT DURATION</Text>
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                        <Text style={styles.closeText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                <Picker
                    selectedValue={Math.floor(duration / 60)}
                    onValueChange={(itemValue) => handlePickerChange(itemValue as number)}
                    style={styles.nativePicker}
                    itemStyle={styles.pickerItem}
                >
                    {MINUTES.map((min) => (
                        <Picker.Item key={min} label={`${min} minutes`} value={min} color="#FFF" />
                    ))}
                </Picker>
            </View>
        )}

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <IconSymbol 
                size={28} 
                name={isActive ? "pause.fill" : "play.fill"} 
                color={COLORS.onPrimary} 
              />
              <Text style={styles.mainButtonText}>
                {isActive ? 'Pause Session' : 'Start Session'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {!isActive && (
            <View style={styles.secondaryActions}>
                <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => {
                    setIsActive(false);
                    setTimeLeft(duration);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                >
                <IconSymbol size={20} name="arrow.counterclockwise" color={COLORS.onSurface} />
                <Text style={styles.actionButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, showPicker && { borderColor: COLORS.primary }]}
                  onPress={() => setShowPicker(!showPicker)}
                >
                <IconSymbol size={20} name="timer" color={showPicker ? COLORS.primary : COLORS.onSurface} />
                <Text style={[styles.actionButtonText, showPicker && { color: COLORS.primary }]}>Adjust</Text>
                </TouchableOpacity>
            </View>
          )}
        </View>

        {!isActive && !showPicker && (
            <View style={styles.statsGrid}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>04</Text>
                <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>1h 40m</Text>
                <Text style={styles.statLabel}>Focused</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Goal</Text>
            </View>
            </View>
        )}
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  timerWrapper: {
    marginVertical: 40,
  },
  activeTimerWrapper: {
    marginVertical: 0,
    marginBottom: height * 0.1,
  },
  timerContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  timeTextContainer: {
    alignItems: 'center',
  },
  timeDisplay: {
    color: '#FFF',
    fontSize: 84,
    fontWeight: '900',
    letterSpacing: -4,
  },
  timeLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: '600',
    marginTop: -4,
  },
  pickerContainer: {
    width: width - 48,
    backgroundColor: COLORS.surface,
    marginBottom: 40,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  pickerTitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  closeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  nativePicker: {
    width: '100%',
    height: 200,
  },
  pickerItem: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  controlsContainer: {
    width: width - 48,
    gap: 20,
  },
  mainButton: {
    width: '100%',
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  mainButtonText: {
    color: COLORS.onPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 60,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonText: {
    color: COLORS.onSurface,
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    width: width - 48,
    backgroundColor: COLORS.surface,
    marginTop: 40,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  focusBadgeContainer: {
      position: 'absolute',
      top: 60,
      width: '100%',
      alignItems: 'center',
      zIndex: 10,
  },
  focusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(192, 193, 255, 0.1)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: 'rgba(192, 193, 255, 0.2)',
      gap: 8,
  },
  dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.primary,
  },
  focusBadgeText: {
      color: COLORS.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.5,
  }
});
