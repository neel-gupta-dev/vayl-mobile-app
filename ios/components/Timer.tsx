import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Modal, 
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolateColor,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const TIMER_SIZE = width * 0.7;

const COLORS = {
  background: '#000000',
  primary: '#FF007F', // Neon Pink
  secondary: '#00F3FF', // Cyan
  accent: '#39FF14', // Lime Green
  text: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.1)',
  modalBg: 'rgba(0, 0, 0, 0.9)',
};

export const Timer = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputMins, setInputMins] = useState('1');
  const [inputSecs, setInputSecs] = useState('00');

  const progress = useSharedValue(1);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
        progress.value = withTiming((seconds - 1) / initialSeconds, { duration: 1000 });
      }, 1000);
    } else if (isActive && seconds === 0) {
      setIsActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, initialSeconds]);

  useEffect(() => {
    if (isActive) {
      glowOpacity.value = withRepeat(withTiming(0.8, { duration: 1000 }), -1, true);
    } else {
      glowOpacity.value = withTiming(0.3);
    }
  }, [isActive]);

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
    scale.value = withSequence(withSpring(1.1), withSpring(1));
  };

  const resetTimer = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsActive(false);
    setSeconds(initialSeconds);
    progress.value = withTiming(1);
  };

  const applyCustomTime = (mins: number, secs: number) => {
    const total = mins * 60 + secs;
    if (total > 0) {
      setInitialSeconds(total);
      setSeconds(total);
      setIsActive(false);
      progress.value = 1;
      setIsModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.primary, COLORS.secondary]
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.primary, COLORS.secondary]
    ),
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => {
            Haptics.selectionAsync();
            setIsModalVisible(true);
        }}
        style={styles.timerWrapper}
      >
        <Animated.View style={[styles.outerCircle, animatedCircleStyle]} />
        <View style={styles.innerCircle}>
          <Animated.Text style={[styles.timerText, animatedTextStyle]}>
            {formatTime(seconds)}
          </Animated.Text>
          <Text style={styles.tapToEdit}>TAP TO EDIT</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Ionicons name="refresh" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: isActive ? COLORS.primary : COLORS.secondary }]} 
          onPress={toggleTimer}
        >
          <Ionicons name={isActive ? "pause" : "play"} size={32} color={COLORS.background} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {
            Haptics.selectionAsync();
            setInitialSeconds(prev => prev + 60);
            setSeconds(prev => prev + 60);
            progress.value = 1;
        }}>
          <Ionicons name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>SET TIME</Text>
              
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={inputMins}
                    onChangeText={setInputMins}
                    keyboardType="numeric"
                    placeholder="00"
                    placeholderTextColor="#444"
                    maxLength={2}
                  />
                  <Text style={styles.inputLabel}>MINS</Text>
                </View>
                <Text style={styles.colon}>:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={inputSecs}
                    onChangeText={setInputSecs}
                    keyboardType="numeric"
                    placeholder="00"
                    placeholderTextColor="#444"
                    maxLength={2}
                  />
                  <Text style={styles.inputLabel}>SECS</Text>
                </View>
              </View>

              <View style={styles.presets}>
                {[5, 10, 25].map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={styles.presetButton}
                    onPress={() => applyCustomTime(p, 0)}
                  >
                    <Text style={styles.presetText}>{p}m</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={() => applyCustomTime(parseInt(inputMins || '0'), parseInt(inputSecs || '0'))}
                >
                  <Text style={styles.applyText}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWrapper: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    borderWidth: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  innerCircle: {
    width: TIMER_SIZE - 20,
    height: TIMER_SIZE - 20,
    borderRadius: (TIMER_SIZE - 20) / 2,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  tapToEdit: {
    color: '#444',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    gap: 30,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.secondary,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 30,
    letterSpacing: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  textInput: {
    color: COLORS.secondary,
    fontSize: 48,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: COLORS.glass,
    paddingBottom: 5,
  },
  inputLabel: {
    color: '#666',
    fontSize: 10,
    marginTop: 8,
    fontWeight: 'bold',
  },
  colon: {
    color: COLORS.text,
    fontSize: 32,
    marginHorizontal: 15,
    marginTop: -20,
  },
  presets: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: COLORS.glass,
  },
  cancelText: {
    color: '#999',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  applyButton: {
    flex: 2,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  applyText: {
    color: COLORS.background,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
