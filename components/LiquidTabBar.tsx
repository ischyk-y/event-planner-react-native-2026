import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.9;
const TAB_BAR_HEIGHT = 70;
const INDICATOR_SIZE = 60;

const routeIcons: Record<string, string> = {
  index: 'house.fill',
  explore: 'paperplane.fill',
  default: 'house.fill',
};

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index]);

  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;

  const indicatorStyle = useAnimatedStyle(() => {
    const leftPosition = (activeIndex.value * TAB_WIDTH) + (TAB_WIDTH / 2) - (INDICATOR_SIZE / 2);
    return {
      transform: [{ translateX: leftPosition }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Glass Bar */}
      <View style={styles.blurContainerWrapper}>
        <BlurView intensity={90} tint="dark" style={styles.blurContainer} />
        {/* Subtle border to enhance glass effect */}
        <View style={styles.glassBorder} />
      </View>

      {/* Animated Liquid Bubble */}
      <Animated.View style={[styles.indicatorContainer, indicatorStyle]} pointerEvents="none">
        <View style={styles.indicatorBubble}>
           <View style={styles.indicatorGlow} />
        </View>
      </Animated.View>

      {/* Tab Items */}
      <View style={styles.tabsWrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconName = routeIcons[route.name] || routeIcons.default;

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              iconName={iconName as any}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({ isFocused, onPress, iconName }: any) {
  const iconY = useSharedValue(0);

  useEffect(() => {
    iconY.value = withSpring(isFocused ? -35 : 0, {
      damping: 12,
      stiffness: 150,
    });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: iconY.value }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <IconSymbol 
          size={24} 
          name={iconName} 
          color={isFocused ? '#ffffff' : 'rgba(255,255,255,0.5)'} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    width: TAB_BAR_WIDTH,
    height: 100, // Extra height for the bubble and icons to pop out
    justifyContent: 'flex-end',
  },
  blurContainerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Base color for dark mode fallback
  },
  blurContainer: {
    flex: 1,
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)', // Stronger top highlight
  },
  tabsWrapper: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'center',
    zIndex: 2,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0, // 30px above the bottom 70px bar
    left: 0,
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  indicatorBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorGlow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00f2fe',
    shadowColor: '#00f2fe',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
});
