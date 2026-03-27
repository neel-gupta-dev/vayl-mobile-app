import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  withSpring,
  useAnimatedStyle,
  interpolateColor
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CIRCLE_LENGTH = 1000; // Increased length for smoother look
const R = CIRCLE_LENGTH / (2 * Math.PI);

const COLORS = {
  background: '#0b0e11',
  surface: '#0b0e11',
  surfaceContainer: '#141a20',
  surfaceContainerHighest: '#1e272f',
  surfaceVariant: '#1e272f',
  primary: '#c0c1ff',
  primaryContainer: '#2f2ebe',
  onPrimary: '#2724b8',
  onSurface: '#dde6f2',
  onSurfaceVariant: '#a3acb7',
  outlineVariant: '#404952',
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FocusRoomScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25 * 60);
  
  const progress = useSharedValue(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    progress.value = withTiming(1 - timeLeft / duration, { duration: 1000 });
  }, [timeLeft, duration]);

  const toggleTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  }, [isActive]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
        <TouchableOpacity style={styles.iconButton}>
          <IconSymbol size={24} name="timer" color={COLORS.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.textCenter}>
          <Text style={styles.sessionLabel}>CURRENT SESSION</Text>
          <Text style={styles.sessionTitle}>Deep Work Phase</Text>
        </View>

        {/* Timer UI */}
        <View style={styles.timerContainer}>
          <Svg style={styles.svg}>
            <Circle
              cx={width / 2}
              cy={width / 2}
              r={R}
              stroke={COLORS.surfaceVariant}
              strokeWidth={2}
              fill="none"
            />
            <AnimatedCircle
              cx={width / 2}
              cy={width / 2}
              r={R}
              stroke={COLORS.primary}
              strokeWidth={6}
              strokeDasharray={CIRCLE_LENGTH}
              animatedProps={animatedProps}
              strokeLinecap="round"
              fill="none"
              opacity={0.6}
            />
          </Svg>

          <View style={styles.timeTextContainer}>
            <Text style={styles.timeDisplay}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timeLabel}>MINUTES LEFT</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={toggleTimer}
          >
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
            >
                <Text style={styles.mainButtonText}>
                    {isActive ? 'Pause Session' : 'Start Session'}
                </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryControls}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => {
                setIsActive(false);
                setTimeLeft(duration);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingsButton}>
              <IconSymbol size={24} name="timer" color={COLORS.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabelSmall}>COMPLETED</Text>
            <Text style={styles.statValue}>4 Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabelSmall}>TOTAL TIME</Text>
            <Text style={styles.statValue}>1h 40m</Text>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: 48,
  },
  sessionLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sessionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  timeTextContainer: {
    alignItems: 'center',
  },
  timeDisplay: {
    color: '#FFF',
    fontSize: 80,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 80,
  },
  timeLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 16,
  },
  controls: {
    width: '100%',
    gap: 16,
  },
  mainButton: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 64,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  statLabelSmall: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
