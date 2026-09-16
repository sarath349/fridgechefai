import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BrandTitle } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';

const DIETARY = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Keto', 'Paleo', 'Mediterranean',
];

export default function ProfileScreen() {
  const [savedCount, setSavedCount] = useState(0);
  const [dietary, setDietary] = useState([]);
  const [servings, setServings] = useState(2);

  const load = async () => {
    try {
      const fav = await AsyncStorage.getItem('favorites');
      setSavedCount(fav ? JSON.parse(fav).length : 0);
      const d = await AsyncStorage.getItem('dietaryPreferences');
      if (d) setDietary(JSON.parse(d));
      const p = await AsyncStorage.getItem('userPreferences');
      if (p) setServings(JSON.parse(p).servings || 2);
    } catch (_) {}
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const toggleDiet = async (item) => {
    const next = dietary.includes(item)
      ? dietary.filter((d) => d !== item)
      : [...dietary, item];
    setDietary(next);
    await AsyncStorage.setItem('dietaryPreferences', JSON.stringify(next));
  };

  const setDefaultServings = async (value) => {
    setServings(value);
    await AsyncStorage.setItem('userPreferences', JSON.stringify({ servings: value }));
  };

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    Alert.alert('Done', 'Restart the app to see the splash screen again.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RG</Text>
          </View>
          <BrandTitle size={28} />
          <Text style={styles.tag}>Good food • Anytime • With AI</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{dietary.length}</Text>
            <Text style={styles.statLabel}>Diet Goals</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{servings}</Text>
            <Text style={styles.statLabel}>Servings</Text>
          </View>
        </View>

        <View style={styles.proCard}>
          <Text style={styles.proTitle}>Upgrade to Pro</Text>
          <Text style={styles.proSub}>Unlimited AI recipes, shopping lists & nutrition.</Text>
        </View>

        <Text style={styles.section}>Dietary Goals</Text>
        <View style={styles.chips}>
          {DIETARY.map((item) => {
            const active = dietary.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleDiet(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.section}>Default Servings</Text>
        <View style={styles.chips}>
          {[1, 2, 4, 6, 8].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.chip, servings === n && styles.chipActive]}
              onPress={() => setDefaultServings(n)}
            >
              <Text style={[styles.chipText, servings === n && styles.chipTextActive]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.linkRow} onPress={resetOnboarding}>
          <Text style={styles.linkText}>Show splash again</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  hero: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 22 },
  tag: { marginTop: 6, color: colors.textMuted, fontSize: 12, letterSpacing: 0.4 },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginBottom: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.green },
  statLabel: { color: colors.textMuted, marginTop: 4, fontSize: 12 },
  proCard: {
    backgroundColor: colors.orangeSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  proTitle: { fontWeight: '800', color: colors.orange, fontSize: 16 },
  proSub: { marginTop: 4, color: colors.textMuted },
  section: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg },
  chip: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.textMuted, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  linkRow: { paddingVertical: 12 },
  linkText: { color: colors.greenMid, fontWeight: '700' },
});
