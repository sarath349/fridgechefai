import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton } from '../components/ui';
import { colors, spacing, radius, popularIngredients } from '../constants/theme';
import {
  generateRecipeWithAI,
  recognizeIngredientsFromImage,
} from '../services/recipeGenerator';

export default function IngredientsScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [userPreferences, setUserPreferences] = useState({ servings: 2 });

  useEffect(() => {
    (async () => {
      try {
        const dietary = await AsyncStorage.getItem('dietaryPreferences');
        const prefs = await AsyncStorage.getItem('userPreferences');
        if (dietary) setDietaryPreferences(JSON.parse(dietary));
        if (prefs) setUserPreferences(JSON.parse(prefs));
      } catch (_) {}
    })();
  }, []);

  const toggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
    setSelected((prev) => [...new Set([...prev, ...parts])]);
    setCustom('');
  };

  const pickImage = () => {
    Alert.alert('Add ingredients from photo', 'Choose a source', [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Photo Library', onPress: pickFromLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickFromLibrary = async () => {
    setRecognizing(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open photo library');
    } finally {
      setRecognizing(false);
    }
  };

  const pickFromCamera = async () => {
    setRecognizing(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Camera permission is required.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        await processImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open camera');
    } finally {
      setRecognizing(false);
    }
  };

  const processImage = async (uri) => {
    setPreview(uri);
    try {
      const found = await recognizeIngredientsFromImage(uri);
      setSelected((prev) => [...new Set([...prev, ...found])]);
      Alert.alert('Ingredients found', found.join(', '));
    } catch (e) {
      Alert.alert('Photo saved', 'Add ingredients manually below.');
    }
  };

  const generate = async () => {
    if (selected.length === 0) {
      Alert.alert('No ingredients', 'Select or add at least one ingredient.');
      return;
    }
    setLoading(true);
    try {
      const recipe = await generateRecipeWithAI(
        selected.join(', '),
        dietaryPreferences,
        userPreferences
      );
      if (!recipe) {
        Alert.alert('No recipes', 'Try different ingredients.');
        return;
      }
      navigation.navigate('RecipeResults', {
        recipes: [recipe],
        ingredients: selected,
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Ingredients</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Add the ingredients you have</Text>

        <TouchableOpacity style={styles.photoBtn} onPress={pickImage} disabled={recognizing}>
          {recognizing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.photoBtnText}>📸 Scan ingredients from photo</Text>
          )}
        </TouchableOpacity>

        {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Type an ingredient..."
            placeholderTextColor={colors.textLight}
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addCustom}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {selected.length > 0 ? (
          <View style={styles.selectedWrap}>
            {selected.map((item) => (
              <TouchableOpacity key={item} style={styles.chip} onPress={() => toggle(item)}>
                <Text style={styles.chipText}>{item}</Text>
                <Text style={styles.chipX}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Popular picks</Text>
        <View style={styles.grid}>
          {popularIngredients.map((item) => {
            const active = selected.includes(item.name);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.ingredient, active && styles.ingredientActive]}
                onPress={() => toggle(item.name)}
              >
                <Text style={styles.ingredientEmoji}>{item.emoji}</Text>
                <Text style={[styles.ingredientName, active && styles.ingredientNameActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={loading ? 'Generating...' : 'Generate Recipes'}
          onPress={generate}
          disabled={loading || selected.length === 0}
        />
      </View>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Cooking up ideas...</Text>
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
  back: { fontSize: 28, color: colors.green, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  content: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  subtitle: { color: colors.textMuted, marginBottom: spacing.md, fontSize: 14 },
  photoBtn: {
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  photoBtnText: { color: colors.white, fontWeight: '700' },
  preview: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  addBtn: {
    backgroundColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addBtnText: { color: colors.white, fontWeight: '700' },
  selectedWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  chipText: { color: colors.green, fontWeight: '600' },
  chipX: { color: colors.green, fontSize: 16, fontWeight: '700' },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ingredient: {
    width: '22%',
    aspectRatio: 0.9,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
  },
  ingredientActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  ingredientEmoji: { fontSize: 24, marginBottom: 4 },
  ingredientName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  ingredientNameActive: { color: colors.white },
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247,244,238,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.green,
    fontWeight: '700',
  },
});
