import {
  getRecipeDetails,
  searchRecipesByName,
  searchRecipesByCategory,
  searchRecipesByArea,
} from './recipeAPI';

/** Map TheMealDB detail payload into RecipeGenie recipe shape */
export function mapMealDetailsToRecipe(details, source = 'TheMealDB') {
  const steps = (details.enhancedInstructions || [])
    .map((s) => (typeof s === 'string' ? s : s.instruction))
    .filter(Boolean);

  const instructions =
    steps.length > 0
      ? steps
      : (details.originalInstructions || '')
          .split(/\r?\n|\. (?=[A-Z])/)
          .map((s) => s.trim())
          .filter((s) => s.length > 8);

  return {
    id: details.id,
    name: details.name,
    cookTime: details.cookTime || estimateCookTime(instructions.length),
    difficulty: details.difficulty || estimateDifficulty(instructions.length),
    servings: 4,
    cuisine: details.area || 'International',
    thumbnail: details.thumbnail,
    youtube: details.youtube,
    ingredients: (details.ingredients || []).map((ing) =>
      ing.measure ? `${ing.measure} ${ing.ingredient}` : ing.ingredient
    ),
    instructions,
    enhancedInstructions: details.enhancedInstructions || [],
    nutrition: details.area ? `${details.area} cuisine` : undefined,
    source,
    category: details.category,
  };
}

function estimateCookTime(stepCount) {
  return `${Math.max(20, stepCount * 4)} mins`;
}

function estimateDifficulty(stepCount) {
  if (stepCount <= 4) return 'Easy';
  if (stepCount <= 8) return 'Medium';
  return 'Hard';
}

function withMeta(list) {
  return list.map((r) => ({
    ...r,
    cookTime: r.cookTime || '30 mins',
    difficulty: r.difficulty || 'Easy',
    source: 'TheMealDB',
  }));
}

/** Search dish menu (biryani, pasta, …) via TheMealDB */
export async function searchDishMenu(query) {
  const results = await searchRecipesByName(query);
  return withMeta(results);
}

/**
 * Browse a home category chip (Snacks, Breakfast, Indian, …)
 * Uses TheMealDB filter by category or area, then lookup for full details on tap.
 */
export async function browseCategory(category) {
  if (!category) return [];

  // Snacks: Starter + Side give better snack-style results
  if (category.id === 'snacks') {
    const [starters, sides] = await Promise.all([
      searchRecipesByCategory('Starter'),
      searchRecipesByCategory('Side'),
    ]);
    const merged = [...starters, ...sides];
    const unique = [];
    const seen = new Set();
    for (const item of merged) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return withMeta(unique.slice(0, 24));
  }

  if (category.id === 'healthy') {
    const [veg, vegan] = await Promise.all([
      searchRecipesByCategory('Vegetarian'),
      searchRecipesByCategory('Vegan'),
    ]);
    const merged = [...veg, ...vegan];
    const unique = [];
    const seen = new Set();
    for (const item of merged) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return withMeta(unique.slice(0, 24));
  }

  if (category.type === 'area') {
    return withMeta(await searchRecipesByArea(category.value));
  }

  if (category.type === 'category') {
    return withMeta(await searchRecipesByCategory(category.value));
  }

  // "All" / search fallback
  return withMeta(await searchRecipesByName(category.value || 'chicken'));
}

/** Open full recipe: ingredients + steps from TheMealDB lookup.php */
export async function loadFullRecipe(recipeOrId) {
  const id = typeof recipeOrId === 'object' ? recipeOrId.id : recipeOrId;
  if (!id) {
    if (typeof recipeOrId === 'object' && recipeOrId.ingredients) {
      return recipeOrId;
    }
    throw new Error('Missing recipe id');
  }
  const details = await getRecipeDetails(id);
  return mapMealDetailsToRecipe(details);
}
