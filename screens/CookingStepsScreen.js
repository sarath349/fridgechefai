import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../constants/theme';

export default function CookingStepsScreen({ navigation, route }) {
  const { recipe = {}, steps = [] } = route.params || {};
  const [index, setIndex] = useState(0);
  const total = Math.max(steps.length, 1);
  const step = steps[index] || 'Enjoy your meal!';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>{index + 1}/{total}</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.recipeName}>{recipe.name}</Text>

      {(recipe.thumbnail || recipe.image) ? (
        <Image
          source={{ uri: recipe.thumbnail || recipe.image }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ fontSize: 48 }}>👨‍🍳</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.stepLabel}>Step {index + 1}</Text>
        <Text style={styles.stepText}>{step}</Text>
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnGhost, index === 0 && styles.disabled]}
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <Text style={styles.navGhostText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnSolid]}
          onPress={() => {
            if (index >= total - 1) {
              navigation.goBack();
            } else {
              setIndex((i) => i + 1);
            }
          }}
        >
          <Text style={styles.navSolidText}>
            {index >= total - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  back: { fontSize: 28, color: colors.green },
  progress: { fontWeight: '800', color: colors.text },
  done: { color: colors.green, fontWeight: '700' },
  recipeName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.greenSoft,
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 160,
  },
  stepLabel: {
    color: colors.orange,
    fontWeight: '800',
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  stepText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.text,
    fontWeight: '600',
  },
  nav: {
    marginTop: 'auto',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    gap: 12,
  },
  navBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnGhost: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnSolid: { backgroundColor: colors.green },
  navGhostText: { color: colors.text, fontWeight: '700' },
  navSolidText: { color: colors.white, fontWeight: '700' },
  disabled: { opacity: 0.4 },
});
