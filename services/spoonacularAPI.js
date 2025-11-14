// Spoonacular Premium API Integration for High-Accuracy Recipe Search
import { API_CONFIG } from '../config';

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = API_CONFIG.SPOONACULAR_API_KEY;

// Enhanced recipe search using Spoonacular Premium API
export const searchRecipesWithSpoonacular = async (query, options = {}) => {
  try {
    console.log(`🔍 Spoonacular Premium search for: "${query}"`);
    
    const {
      cuisine = '',
      diet = '',
      intolerances = '',
      includeIngredients = '',
      excludeIngredients = '',
      maxReadyTime = 60,
      minServings = 1,
      maxServings = 8,
      sort = 'relevance',
      number = 5,
      addRecipeInformation = true,
      addRecipeInstructions = true,
      addRecipeNutrition = true
    } = options;

    const params = new URLSearchParams({
      query: query,
      apiKey: API_KEY,
      number: number.toString(),
      addRecipeInformation: addRecipeInformation.toString(),
      addRecipeInstructions: addRecipeInstructions.toString(),
      addRecipeNutrition: addRecipeNutrition.toString(),
      sort: sort,
      maxReadyTime: maxReadyTime.toString(),
      minServings: minServings.toString(),
      maxServings: maxServings.toString()
    });

    // Add optional parameters if provided
    if (cuisine) params.append('cuisine', cuisine);
    if (diet) params.append('diet', diet);
    if (intolerances) params.append('intolerances', intolerances);
    if (includeIngredients) params.append('includeIngredients', includeIngredients);
    if (excludeIngredients) params.append('excludeIngredients', excludeIngredients);

    const url = `${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`;
    console.log(`Making request to: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Spoonacular found ${data.totalResults} total results, returning ${data.results.length}`);

    return data.results.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      thumbnail: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      source: 'Spoonacular Premium',
      relevanceScore: 100, // Spoonacular results are highly relevant
      summary: recipe.summary,
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      nutrition: recipe.nutrition,
      analyzedInstructions: recipe.analyzedInstructions || []
    }));

  } catch (error) {
    console.error('Spoonacular search error:', error);
    throw new Error(`Spoonacular search failed: ${error.message}`);
  }
};

// Search recipes by ingredients using Spoonacular
export const searchRecipesByIngredientsSpoonacular = async (ingredients, options = {}) => {
  try {
    console.log(`🥘 Spoonacular ingredient search for: ${ingredients.join(', ')}`);
    
    const {
      number = 5,
      ranking = 2, // Maximize used ingredients
      ignorePantry = true
    } = options;

    const params = new URLSearchParams({
      ingredients: ingredients.join(','),
      number: number.toString(),
      ranking: ranking.toString(),
      ignorePantry: ignorePantry.toString(),
      apiKey: API_KEY
    });

    const url = `${SPOONACULAR_BASE_URL}/findByIngredients?${params.toString()}`;
    console.log(`Making ingredient search request to: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular ingredient search error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Spoonacular found ${data.length} recipes with your ingredients`);

    return data.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      thumbnail: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      usedIngredients: recipe.usedIngredients || [],
      missedIngredients: recipe.missedIngredients || [],
      unusedIngredients: recipe.unusedIngredients || [],
      source: 'Spoonacular Premium',
      relevanceScore: calculateIngredientRelevanceScore(recipe, ingredients)
    }));

  } catch (error) {
    console.error('Spoonacular ingredient search error:', error);
    throw new Error(`Spoonacular ingredient search failed: ${error.message}`);
  }
};

// Get detailed recipe information with full instructions
export const getRecipeDetailsSpoonacular = async (recipeId) => {
  try {
    console.log(`📋 Getting detailed recipe info for ID: ${recipeId}`);
    
    const params = new URLSearchParams({
      apiKey: API_KEY,
      includeNutrition: 'true'
    });

    const url = `${SPOONACULAR_BASE_URL}/${recipeId}/information?${params.toString()}`;
    console.log(`Making details request to: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular recipe details error: ${response.status} ${response.statusText}`);
    }

    const recipe = await response.json();
    console.log(`✅ Got detailed info for: ${recipe.title}`);

    // Get analyzed instructions
    const instructions = await getAnalyzedInstructions(recipeId);
    
    return {
      id: recipe.id,
      name: recipe.title,
      summary: recipe.summary,
      thumbnail: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      source: recipe.sourceUrl,
      sourceName: recipe.sourceName,
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      ingredients: recipe.extendedIngredients || [],
      nutrition: recipe.nutrition,
      analyzedInstructions: instructions,
      winePairing: recipe.winePairing,
      equipment: recipe.equipment,
      veryPopular: recipe.veryPopular,
      cheap: recipe.cheap,
      glutenFree: recipe.glutenFree,
      dairyFree: recipe.dairyFree,
      vegetarian: recipe.vegetarian,
      vegan: recipe.vegan,
      ketogenic: recipe.ketogenic,
      whole30: recipe.whole30,
      sustainable: recipe.sustainable
    };

  } catch (error) {
    console.error('Spoonacular recipe details error:', error);
    throw new Error(`Failed to get recipe details: ${error.message}`);
  }
};

// Get analyzed cooking instructions
export const getAnalyzedInstructions = async (recipeId) => {
  try {
    const params = new URLSearchParams({
      apiKey: API_KEY
    });

    const url = `${SPOONACULAR_BASE_URL}/${recipeId}/analyzedInstructions?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('No analyzed instructions available');
      return [];
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const instructions = data[0];
      return instructions.steps.map((step, index) => ({
        stepNumber: step.number,
        instruction: step.step,
        ingredients: step.ingredients || [],
        equipment: step.equipment || [],
        length: step.length || null,
        tips: generateSpoonacularTips(step.step, index)
      }));
    }

    return [];
  } catch (error) {
    console.error('Error getting analyzed instructions:', error);
    return [];
  }
};

// Generate cooking tips based on Spoonacular step content
const generateSpoonacularTips = (step, stepIndex) => {
  const tips = [];
  const stepLower = step.toLowerCase();
  
  // Heat and cooking tips
  if (stepLower.includes('heat') || stepLower.includes('hot') || stepLower.includes('temperature')) {
    tips.push('💡 Pro tip: Use a thermometer to check the correct temperature');
  }
  
  // Oil and frying tips
  if (stepLower.includes('oil') || stepLower.includes('fry') || stepLower.includes('sauté')) {
    tips.push('💡 Chef tip: Don\'t overcrowd the pan for even cooking');
  }
  
  // Seasoning tips
  if (stepLower.includes('salt') || stepLower.includes('season') || stepLower.includes('spice')) {
    tips.push('💡 Expert tip: Season in layers for depth of flavor');
  }
  
  // Time-related tips
  if (stepLower.includes('minute') || stepLower.includes('hour') || stepLower.includes('time')) {
    tips.push('💡 Pro tip: Use a timer to avoid overcooking');
  }
  
  // Mixing and preparation tips
  if (stepLower.includes('mix') || stepLower.includes('stir') || stepLower.includes('combine')) {
    tips.push('💡 Chef tip: Mix gently to avoid overworking the ingredients');
  }
  
  // Baking tips
  if (stepLower.includes('bake') || stepLower.includes('oven') || stepLower.includes('preheat')) {
    tips.push('💡 Expert tip: Preheat your oven for consistent results');
  }
  
  // Add general preparation tip for first step
  if (stepIndex === 0) {
    tips.push('💡 Chef tip: Prepare all ingredients before starting');
  }
  
  return tips.slice(0, 2); // Limit to 2 tips per step
};

// Calculate relevance score for ingredient-based results
const calculateIngredientRelevanceScore = (recipe, userIngredients) => {
  let score = 0;
  
  // Higher score for more used ingredients
  score += recipe.usedIngredientCount * 20;
  
  // Lower score for more missed ingredients
  score -= recipe.missedIngredientCount * 5;
  
  // Bonus for exact ingredient matches
  const usedIngredientNames = recipe.usedIngredients.map(ing => ing.name.toLowerCase());
  userIngredients.forEach(userIng => {
    if (usedIngredientNames.some(usedIng => usedIng.includes(userIng.toLowerCase()))) {
      score += 10;
    }
  });
  
  return Math.max(0, score);
};

// Search for specific cuisine types
export const searchRecipesByCuisine = async (cuisine, query = '', options = {}) => {
  return await searchRecipesWithSpoonacular(query, {
    ...options,
    cuisine: cuisine
  });
};

// Search for dietary restrictions
export const searchRecipesByDiet = async (diet, query = '', options = {}) => {
  return await searchRecipesWithSpoonacular(query, {
    ...options,
    diet: diet
  });
};

// Get random recipes for inspiration
export const getRandomRecipesSpoonacular = async (options = {}) => {
  try {
    const {
      number = 5,
      tags = '',
      includeNutrition = true
    } = options;

    const params = new URLSearchParams({
      apiKey: API_KEY,
      number: number.toString(),
      includeNutrition: includeNutrition.toString()
    });

    if (tags) {
      params.append('tags', tags);
    }

    const url = `${SPOONACULAR_BASE_URL}/random?${params.toString()}`;
    console.log(`Getting random recipes from: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular random recipes error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Got ${data.recipes.length} random recipes`);

    return data.recipes.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      thumbnail: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      source: 'Spoonacular Premium',
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || []
    }));

  } catch (error) {
    console.error('Spoonacular random recipes error:', error);
    throw new Error(`Failed to get random recipes: ${error.message}`);
  }
};

// Check if Spoonacular API key is configured (works with free or premium)
export const isSpoonacularConfigured = () => {
  return API_KEY && 
         API_KEY !== 'your-spoonacular-premium-api-key-here' && 
         API_KEY !== 'your-spoonacular-api-key-here' &&
         API_KEY.length > 10;
};

// Check if using premium account (more generous limits)
export const isSpoonacularPremium = () => {
  // Premium accounts typically have longer API keys
  return API_KEY && API_KEY.length > 50;
};

// Optimized search for free tier (minimal points usage)
export const searchRecipesFreeTier = async (query, options = {}) => {
  try {
    console.log(`🆓 Spoonacular FREE search for: "${query}"`);
    
    // Free tier optimized settings (minimal points usage)
    const {
      number = 2, // Limit results for free tier
      addRecipeInformation = false, // Skip to save points
      addRecipeInstructions = false, // Skip to save points
      addRecipeNutrition = false // Skip to save points
    } = options;

    const params = new URLSearchParams({
      query: query,
      apiKey: API_KEY,
      number: number.toString(),
      addRecipeInformation: addRecipeInformation.toString(),
      addRecipeInstructions: addRecipeInstructions.toString(),
      addRecipeNutrition: addRecipeNutrition.toString()
    });

    const url = `${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`;
    console.log(`Making FREE tier request to: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Spoonacular FREE found ${data.totalResults} total results, returning ${data.results.length}`);

    return data.results.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      thumbnail: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 'Not specified',
      servings: recipe.servings || 'Not specified',
      source: 'Spoonacular Free',
      relevanceScore: 90, // High relevance for free tier
      summary: recipe.summary || '',
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      nutrition: null, // Not available in free tier
      analyzedInstructions: [] // Not available in free tier
    }));

  } catch (error) {
    console.error('Spoonacular free search error:', error);
    throw new Error(`Spoonacular free search failed: ${error.message}`);
  }
};

// Get basic recipe info for free tier (minimal points)
export const getRecipeInfoFreeTier = async (recipeId) => {
  try {
    console.log(`📋 Getting FREE tier info for recipe: ${recipeId}`);
    
    const params = new URLSearchParams({
      apiKey: API_KEY,
      includeNutrition: 'false' // Skip nutrition to save points
    });

    const url = `${SPOONACULAR_BASE_URL}/${recipeId}/information?${params.toString()}`;
    console.log(`Making FREE tier details request to: ${url.replace(API_KEY, 'YOUR_API_KEY')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spoonacular recipe details error: ${response.status} ${response.statusText}`);
    }

    const recipe = await response.json();
    console.log(`✅ Got FREE tier info for: ${recipe.title}`);

    return {
      id: recipe.id,
      name: recipe.title,
      summary: recipe.summary || '',
      thumbnail: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 0,
      servings: recipe.servings || 4,
      source: recipe.sourceUrl || '',
      sourceName: recipe.sourceName || 'Spoonacular',
      cuisines: recipe.cuisines || [],
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      ingredients: recipe.extendedIngredients || [],
      nutrition: null, // Not available in free tier
      analyzedInstructions: [], // Not available in free tier
      veryPopular: recipe.veryPopular || false,
      cheap: recipe.cheap || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false,
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      ketogenic: recipe.ketogenic || false,
      whole30: recipe.whole30 || false,
      sustainable: recipe.sustainable || false
    };

  } catch (error) {
    console.error('Spoonacular free recipe details error:', error);
    throw new Error(`Failed to get free recipe details: ${error.message}`);
  }
};
