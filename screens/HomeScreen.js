import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SearchBar, SectionHeader, RecipeCard } from '../components/ui';
import { colors, spacing, radius, categories, popularDishes } from '../constants/theme';
import { searchDishMenu, browseCategory, loadFullRecipe } from '../services/mealService';

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeDish, setActiveDish] = useState(null);
  const [menuRecipes, setMenuRecipes] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [opening, setOpening] = useState(false);
  const [saved, setSaved] = useState([]);
  const [searching, setSearching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const stored = await AsyncStorage.getItem('favorites');
          setSaved(stored ? JSON.parse(stored) : []);
        } catch (_) {
          setSaved([]);
        }
      })();
    }, [])
  );

  const loadMenu = useCallback(async () => {
    setLoadingMenu(true);
    try {
      let results = [];
      if (activeDish) {
        results = await searchDishMenu(activeDish.query);
      } else {
        results = await browseCategory(activeCategory);
      }
      setMenuRecipes(results);
    } catch (e) {
      setMenuRecipes([]);
      Alert.alert('Error', 'Could not load recipes.');
    } finally {
      setLoadingMenu(false);
    }
  }, [activeCategory, activeDish]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const openFullRecipe = async (recipe) => {
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

  const runSearch = async () => {
    const q = query.trim();
    if (!q) {
      navigation.navigate('Ingredients');
      return;
    }
    setSearching(true);
    try {
      const results = await searchDishMenu(q);
      if (!results.length) {
        Alert.alert('No recipes', 'Try Snacks, Biryani, or Pasta.');
        return;
      }
      navigation.navigate('RecipeResults', {
        recipes: results,
        ingredients: [q],
      });
    } catch (e) {
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const sectionTitle = activeDish
    ? `${activeDish.label} Recipes`
    : `${activeCategory.label} Recipes`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hi Chef 👋</Text>
            <Text style={styles.subGreeting}>What would you like to cook today?</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.avatarText}>RG</Text>
          </TouchableOpacity>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search biryani, pasta, snacks..."
          onFilterPress={runSearch}
        />
        {(searching || opening) ? (
          <ActivityIndicator color={colors.green} style={{ marginTop: 12 }} />
        ) : null}

        <View style={styles.banner}>
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>Turn Ingredients into Amazing Recipes</Text>
            <Text style={styles.bannerSub}>Use AI to create recipes with what you have.</Text>
            <TouchableOpacity
              style={styles.bannerCta}
              onPress={() => navigation.navigate('Ingredients')}
            >
              <Text style={styles.bannerCtaText}>Try with Ingredients →</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('../assets/logo.png')} style={styles.bannerLogo} />
        </View>

        <SectionHeader title="Categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => {
            const active = !activeDish && activeCategory.id === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.category, active && styles.categoryActive]}
                onPress={() => {
                  setActiveDish(null);
                  setActiveCategory(cat);
                }}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionHeader title="Popular Menus" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {popularDishes.map((dish) => {
            const active = activeDish?.id === dish.id;
            return (
              <TouchableOpacity
                key={dish.id}
                style={[styles.category, active && styles.categoryActive]}
                onPress={() => setActiveDish(dish)}
              >
                <Text style={styles.categoryEmoji}>{dish.emoji}</Text>
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {dish.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionHeader
          title={sectionTitle}
          onSeeAll={() =>
            navigation.navigate('RecipeResults', {
              recipes: menuRecipes,
              ingredients: [activeDish?.query || activeCategory.label],
            })
          }
        />

        {loadingMenu ? (
          <ActivityIndicator color={colors.green} style={{ marginVertical: 20 }} />
        ) : menuRecipes.length === 0 ? (
          <Text style={styles.emptySub}>No recipes found for {sectionTitle}.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menuRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => openFullRecipe(recipe)}
              />
            ))}
          </ScrollView>
        )}

        {saved.length > 0 ? (
          <>
            <SectionHeader
              title="Your Saved Recipes"
              onSeeAll={() => navigation.navigate('Saved')}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {saved.map((recipe, index) => (
                <RecipeCard
                  key={`${recipe.name}-${index}`}
                  recipe={recipe}
                  onPress={() => openFullRecipe(recipe)}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
  },
  categoriesContent: {
    gap: 10,
    paddingRight: 8,
    marginBottom: spacing.sm,
  },
  category: {
    width: 78,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  categoryLabelActive: {
    color: colors.white,
  },
  banner: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.greenSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.green,
    lineHeight: 24,
  },
  bannerSub: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  bannerCta: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bannerCtaText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerLogo: {
    width: 108,
    height: 108,
  },
  emptySub: {
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});
