import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrandTitle, PrimaryButton } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';

export default function SplashScreen({ navigation }) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setChecking(false);
    }, 800);

    (async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (cancelled) return;
        if (seen === 'true') {
          navigation.replace('Main');
          return;
        }
      } catch (_) {
        // show splash
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigation]);

  const start = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    } catch (_) {}
    navigation.replace('Main');
  };

  if (checking) {
    return <View style={[styles.container, { justifyContent: 'center' }]} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.script}>Good Food! Happier You</Text>

      <View style={styles.heroWrap}>
        <View style={styles.glow} />
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <BrandTitle size={40} style={styles.brand} />
      <Text style={styles.tagline}>AI RECIPES FOR A HAPPIER YOU</Text>

      <View style={styles.features}>
        {[
          { emoji: '🌿', label: 'Use\nIngredients' },
          { emoji: '👨‍🍳', label: 'Get AI\nRecipes' },
          { emoji: '💚', label: 'Cook &\nEnjoy' },
        ].map((item) => (
          <View key={item.label} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.featureLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton title="Get Started" onPress={start} style={styles.cta} />

      <TouchableOpacity onPress={start}>
        <Text style={styles.signin}>
          Already have an account? <Text style={styles.signinLink}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  script: {
    alignSelf: 'flex-end',
    marginTop: spacing.md,
    color: colors.greenMid,
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 14,
  },
  heroWrap: {
    marginTop: spacing.lg,
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.yellow,
    opacity: 0.7,
  },
  logo: {
    width: 240,
    height: 240,
  },
  brand: {
    marginTop: spacing.sm,
  },
  tagline: {
    marginTop: 8,
    letterSpacing: 1.5,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  featureItem: {
    alignItems: 'center',
    width: '30%',
  },
  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureLabel: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  cta: {
    width: '100%',
    marginTop: spacing.xl,
  },
  signin: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 14,
  },
  signinLink: {
    color: colors.green,
    fontWeight: '700',
  },
});
