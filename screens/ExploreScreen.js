import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar, SectionHeader, RecipeCard } from '../components/ui';
import { colors, spacing, popularDishes } from '../constants/theme';
import { searchDishMenu, loadFullRecipe } from '../services/mealService';

export default function ExploreScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async (term = query) => {
    const q = term.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const found = await searchDishMenu(q);
      setResults(found);
    } catch (e) {
      Alert.alert('Error', 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const openRecipe = async (recipe) => {
    setOpening(true);
    try {
      const full = await loadFullRecipe(recipe);
      navigation.navigate('RecipeDetail', { recipe: full });
    } catch (e) {
      Alert.alert('Error', 'Could not load ingredients and steps.');
    } finally {
      setOpening(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explore</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search biryani, pasta, curry..."
          onFilterPress={() => runSearch()}
        />
        <TouchableOpacity style={styles.searchAction} onPress={() => runSearch()}>
          <Text style={styles.searchActionText}>Search</Text>
        </TouchableOpacity>

        <SectionHeader title="Popular Menus" />
        <View style={styles.grid}>
          {popularDishes.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              style={styles.tile}
              onPress={() => {
                setQuery(dish.label);
                runSearch(dish.query);
              }}
            >
              <Text style={styles.tileEmoji}>{dish.emoji}</Text>
              <Text style={styles.tileLabel}>{dish.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title={searched ? 'Results' : 'Find recipes'} />
        {(loading || opening) ? (
          <ActivityIndicator color={colors.green} style={{ marginVertical: 24 }} />
        ) : searched && results.length === 0 ? (
          <Text style={styles.empty}>No recipes found. Try Biryani or Pasta.</Text>
        ) : !searched ? (
          <Text style={styles.empty}>
            Tap Biryani, Pasta, and more — real recipes from TheMealDB with full ingredients & steps.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {results.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => openRecipe(recipe)}
              />
            ))}
          </ScrollView>
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchAction: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchActionText: { color: colors.white, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.md,
  },
  tile: {
    width: '22%',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileEmoji: { fontSize: 22, marginBottom: 6 },
  tileLabel: { fontWeight: '700', color: colors.text, fontSize: 11, textAlign: 'center' },
  empty: {
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
});
