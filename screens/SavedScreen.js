import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../constants/theme';

export default function SavedScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState('Recipes');

  const load = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (_) {
      setFavorites([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const remove = async (name) => {
    const updated = favorites.filter((f) => f.name !== name);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Saved</Text>

      <View style={styles.tabs}>
        {['Recipes', 'Collections'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, tab === item && styles.tabActive]}
            onPress={() => setTab(item)}
          >
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'Collections' ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>No collections yet</Text>
          <Text style={styles.emptySub}>Save recipes to start building collections.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>♡</Text>
              <Text style={styles.emptyTitle}>No saved recipes</Text>
              <Text style={styles.emptySub}>Heart a recipe to keep it here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text>🍽️</Text>
                </View>
              )}
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.cookTime || '30 mins'} • {item.difficulty || 'Easy'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Remove?', 'Delete this saved recipe?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => remove(item.name) },
                  ])
                }
              >
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.green },
  tabText: { fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.md, paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: 12,
    padding: 10,
    gap: 12,
  },
  thumb: { width: 64, height: 64, borderRadius: 14 },
  thumbPlaceholder: {
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  name: { fontWeight: '700', color: colors.text, fontSize: 15 },
  meta: { marginTop: 4, color: colors.textMuted, fontSize: 12 },
  delete: { fontSize: 18, padding: 8 },
  emptyWrap: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 40, color: colors.orange, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  emptySub: { marginTop: 6, color: colors.textMuted, textAlign: 'center' },
});
