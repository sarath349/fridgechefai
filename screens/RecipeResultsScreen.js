import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../constants/theme';
import { loadFullRecipe } from '../services/mealService';

const FILTERS = ['All', 'Quick & Easy', 'Healthy', 'Indian'];

export default function RecipeResultsScreen({ navigation, route }) {
  const { recipes = [], ingredients = [] } = route.params || {};
  const [filter, setFilter] = useState('All');
  const [opening, setOpening] = useState(false);

  const saveFavorite = async (recipe) => {
    try {
      const existing = await AsyncStorage.getItem('favorites');
      const favorites = existing ? JSON.parse(existing) : [];
      if (favorites.some((f) => f.name === recipe.name)) {
        Alert.alert('Already saved', 'This recipe is already in your saved list.');
        return;
      }
      favorites.push({
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients
          : ingredients.join(', '),
        savedAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      Alert.alert('Saved', 'Recipe added to Saved.');
    } catch (e) {
      Alert.alert('Error', 'Could not save recipe');
    }
  };

  const openRecipe = async (item) => {
    const hasDetails =
      Array.isArray(item.instructions) &&
      item.instructions.length > 0 &&
      Array.isArray(item.ingredients) &&
      item.ingredients.length > 0;

    if (hasDetails) {
      navigation.navigate('RecipeDetail', { recipe: item });
      return;
    }

    setOpening(true);
    try {
      const full = await loadFullRecipe(item);
      navigation.navigate('RecipeDetail', { recipe: full });
    } catch (e) {
      Alert.alert('Error', 'Could not load ingredients and steps.');
    } finally {
      setOpening(false);
    }
  };

  const filtered = recipes.filter((r) => {
    if (filter === 'All') return true;
    if (filter === 'Quick & Easy') return (r.difficulty || '').toLowerCase() === 'easy';
    if (filter === 'Healthy') return r.vegetarian || r.vegan || (r.diets || []).length > 0;
    if (filter === 'Indian') {
      return (r.cuisine || r.area || '').toLowerCase().includes('indian');
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recipes</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.subtitle}>
        Based on: {ingredients.slice(0, 4).join(', ')}
        {ingredients.length > 4 ? '...' : ''}
      </Text>

      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
            onPress={() => setFilter(item)}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No recipes match this filter.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openRecipe(item)}
            activeOpacity={0.9}
          >
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]}>
                <Text style={{ fontSize: 28 }}>🍽️</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.meta}>
                ⏱ {item.cookTime || '30 mins'}  •  {item.difficulty || 'Easy'}
              </Text>
              <Text style={styles.source} numberOfLines={1}>
                {item.source || 'TheMealDB'}
              </Text>
            </View>
            <TouchableOpacity style={styles.heart} onPress={() => saveFavorite(item)}>
              <Text style={styles.heartText}>♡</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {opening ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  back: { fontSize: 28, color: colors.green },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  subtitle: {
    paddingHorizontal: spacing.md,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 8,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  filterText: { color: colors.textMuted, fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumb: { width: 92, height: 92 },
  thumbPlaceholder: {
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { marginTop: 6, color: colors.textMuted, fontSize: 12 },
  source: { marginTop: 4, color: colors.greenMid, fontSize: 11, fontWeight: '600' },
  heart: { padding: 12, justifyContent: 'center' },
  heartText: { fontSize: 22, color: colors.orange },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247,244,238,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
