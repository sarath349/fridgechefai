import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius } from '../constants/theme';

const TABS = ['Ingredients', 'Steps', 'Nutrition'];

export default function RecipeDetailScreen({ navigation, route }) {
  const recipe = route.params?.recipe || {};
  const [tab, setTab] = useState('Ingredients');
  const [checked, setChecked] = useState({});

  const ingredients = useMemo(() => {
    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.map((ing) =>
        typeof ing === 'string' ? ing : `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ing.ingredient || ''}`.trim()
      );
    }
    if (typeof recipe.ingredients === 'string') {
      return recipe.ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [recipe]);

  const steps = useMemo(() => {
    if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
      return recipe.instructions;
    }
    if (Array.isArray(recipe.enhancedInstructions)) {
      return recipe.enhancedInstructions.map((s) => s.instruction || s);
    }
    return ['Follow the recipe steps and enjoy!'];
  }, [recipe]);

  const toggleCheck = (index) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const save = async () => {
    try {
      const existing = await AsyncStorage.getItem('favorites');
      const favorites = existing ? JSON.parse(existing) : [];
      if (!favorites.some((f) => f.name === recipe.name)) {
        favorites.push({ ...recipe, savedAt: new Date().toISOString() });
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      }
      Alert.alert('Saved', 'Added to your saved recipes.');
    } catch (e) {
      Alert.alert('Error', 'Could not save recipe');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          {recipe.thumbnail || recipe.image ? (
            <Image
              source={{ uri: recipe.thumbnail || recipe.image }}
              style={styles.hero}
            />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}>
              <Text style={{ fontSize: 64 }}>🍽️</Text>
            </View>
          )}
          <TouchableOpacity style={styles.backFab} onPress={() => navigation.goBack()}>
            <Text style={styles.backFabText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartFab} onPress={save}>
            <Text style={styles.heartFabText}>♡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{recipe.name || 'Recipe'}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>⏱ {recipe.cookTime || '30 mins'}</Text>
            <Text style={styles.meta}>•</Text>
            <Text style={styles.meta}>{recipe.difficulty || 'Easy'}</Text>
            <Text style={styles.meta}>•</Text>
            <Text style={styles.meta}>{recipe.servings || 2} servings</Text>
          </View>

          <View style={styles.tabs}>
            {TABS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.tab, tab === item && styles.tabActive]}
                onPress={() => setTab(item)}
              >
                <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'Ingredients' && (
            <View style={styles.block}>
              {ingredients.map((ing, index) => (
                <TouchableOpacity
                  key={`${ing}-${index}`}
                  style={styles.checkRow}
                  onPress={() => toggleCheck(index)}
                >
                  <View style={[styles.checkbox, checked[index] && styles.checkboxOn]}>
                    {checked[index] ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>
                  <Text style={[styles.checkText, checked[index] && styles.checkTextDone]}>
                    {ing}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {tab === 'Steps' && (
            <View style={styles.block}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {tab === 'Nutrition' && (
            <View style={styles.block}>
              <Text style={styles.nutrition}>
                {recipe.nutrition || 'Nutrition details unavailable for this recipe.'}
              </Text>
              {recipe.cuisine ? (
                <Text style={styles.cuisine}>Cuisine: {recipe.cuisine}</Text>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Start Cooking"
          onPress={() => navigation.navigate('CookingSteps', { recipe, steps })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  heroWrap: { position: 'relative' },
  hero: { width: '100%', height: 260, backgroundColor: colors.greenSoft },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  backFab: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backFabText: { fontSize: 22, color: colors.green },
  heartFab: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartFabText: { fontSize: 20, color: colors.orange },
  body: { padding: spacing.md, paddingBottom: 120 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  meta: { color: colors.textMuted, fontSize: 13 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.green },
  tabText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: colors.white },
  block: { marginTop: spacing.md },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.green },
  checkMark: { color: colors.white, fontWeight: '800' },
  checkText: { flex: 1, color: colors.text, fontSize: 15 },
  checkTextDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: colors.green, fontWeight: '800' },
  stepText: { flex: 1, color: colors.text, lineHeight: 22 },
  nutrition: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 16,
    color: colors.text,
    lineHeight: 22,
  },
  cuisine: { marginTop: 12, color: colors.textMuted },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
