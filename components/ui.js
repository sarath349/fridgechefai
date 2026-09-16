import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export function BrandTitle({ size = 36, style }) {
  return (
    <Text style={[styles.brand, { fontSize: size }, style]}>
      <Text style={styles.brandGreen}>Recipe</Text>
      <Text style={styles.brandOrange}>Genie</Text>
    </Text>
  );
}

export function PrimaryButton({ title, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.primaryBtnText}>{title}</Text>
      <Text style={styles.primaryBtnArrow}>→</Text>
    </TouchableOpacity>
  );
}

export function SectionHeader({ title, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function RecipeCard({ recipe, onPress, onFavorite, favorited }) {
  const image = recipe.thumbnail || recipe.image;
  return (
    <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.recipeImageWrap}>
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, styles.recipeImagePlaceholder]}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
          </View>
        )}
        {onFavorite ? (
          <TouchableOpacity style={styles.heartBtn} onPress={onFavorite}>
            <Text style={styles.heartIcon}>{favorited ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.recipeName} numberOfLines={2}>{recipe.name}</Text>
      <View style={styles.recipeMeta}>
        <Text style={styles.metaText}>⏱ {recipe.cookTime || '30 mins'}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>{recipe.difficulty || 'Easy'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function SearchBar({ value, onChangeText, placeholder, onFilterPress }) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Search recipes, ingredients...'}
          placeholderTextColor={colors.textLight}
        />
      </View>
      {onFilterPress ? (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandGreen: {
    color: colors.green,
  },
  brandOrange: {
    color: colors.orange,
  },
  primaryBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.lg,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.55,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  primaryBtnArrow: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  seeAll: {
    color: colors.greenMid,
    fontWeight: '700',
    fontSize: 14,
  },
  recipeCard: {
    width: 168,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: colors.green,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  recipeImageWrap: {
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 130,
    backgroundColor: colors.greenSoft,
  },
  recipeImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    color: colors.orange,
    fontSize: 16,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 12,
    paddingTop: 10,
    minHeight: 44,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  metaDot: {
    color: colors.textLight,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
    color: colors.textMuted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
    color: colors.green,
  },
});
