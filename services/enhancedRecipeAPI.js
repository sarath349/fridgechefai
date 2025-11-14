// Enhanced Recipe API with Multiple Sources for Better Accuracy
const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Enhanced search with multiple strategies
export const searchRecipesEnhanced = async (query) => {
  console.log(`🔍 Enhanced search for: "${query}"`);
  
  try {
    // Strategy 1: Try recipe name search first (most accurate)
    let recipes = await searchByRecipeName(query);
    
    // Strategy 2: If no results, try ingredient-based search
    if (recipes.length === 0) {
      console.log('No recipe name matches, trying ingredient search...');
      recipes = await searchByIngredient(query);
    }
    
    // Strategy 3: If still no results, try category/area search
    if (recipes.length === 0) {
      console.log('No ingredient matches, trying category search...');
      recipes = await searchByCategory(query);
    }
    
    // Strategy 4: If still no results, try fuzzy matching
    if (recipes.length === 0) {
      console.log('No direct matches, trying fuzzy search...');
      recipes = await fuzzySearch(query);
    }
    
    console.log(`🎯 Found ${recipes.length} recipes using enhanced search`);
    return recipes;
    
  } catch (error) {
    console.error('Enhanced search error:', error);
    return [];
  }
};

// Search by recipe name (most accurate)
const searchByRecipeName = async (query) => {
  try {
    console.log(`Searching recipe names for: "${query}"`);
    const response = await fetch(`${THEMEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.meals && data.meals.length > 0) {
      console.log(`✅ Found ${data.meals.length} recipes by name`);
      return data.meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        thumbnail: meal.strMealThumb,
        source: 'TheMealDB-Name',
        relevanceScore: calculateRelevanceScore(meal.strMeal, query)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Recipe name search error:', error);
    return [];
  }
};

// Search by ingredient (less accurate but broader)
const searchByIngredient = async (query) => {
  try {
    console.log(`Searching ingredients for: "${query}"`);
    const response = await fetch(`${THEMEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.meals && data.meals.length > 0) {
      console.log(`✅ Found ${data.meals.length} recipes by ingredient`);
      return data.meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        thumbnail: meal.strMealThumb,
        source: 'TheMealDB-Ingredient',
        relevanceScore: calculateRelevanceScore(meal.strMeal, query)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Ingredient search error:', error);
    return [];
  }
};

// Search by category/area
const searchByCategory = async (query) => {
  try {
    console.log(`Searching categories for: "${query}"`);
    
    // Get all categories first
    const categoryResponse = await fetch(`${THEMEALDB_BASE_URL}/categories.php`);
    const categoryData = await categoryResponse.json();
    
    if (categoryData.categories) {
      const matchingCategory = categoryData.categories.find(cat => 
        cat.strCategory.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(cat.strCategory.toLowerCase())
      );
      
      if (matchingCategory) {
        console.log(`Found matching category: ${matchingCategory.strCategory}`);
        const response = await fetch(`${THEMEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(matchingCategory.strCategory)}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          console.log(`✅ Found ${data.meals.length} recipes in category`);
          return data.meals.slice(0, 5).map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            thumbnail: meal.strMealThumb,
            source: 'TheMealDB-Category',
            relevanceScore: calculateRelevanceScore(meal.strMeal, query)
          }));
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Category search error:', error);
    return [];
  }
};

// Fuzzy search using common recipe patterns
const fuzzySearch = async (query) => {
  try {
    console.log(`Performing fuzzy search for: "${query}"`);
    
    // Common recipe name patterns
    const patterns = [
      `${query} recipe`,
      `${query} dish`,
      `${query} food`,
      `how to make ${query}`,
      `traditional ${query}`
    ];
    
    let allResults = [];
    
    for (const pattern of patterns) {
      try {
        const response = await fetch(`${THEMEALDB_BASE_URL}/search.php?s=${encodeURIComponent(pattern)}`);
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          const results = data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            thumbnail: meal.strMealThumb,
            source: 'TheMealDB-Fuzzy',
            relevanceScore: calculateRelevanceScore(meal.strMeal, query)
          }));
          allResults.push(...results);
        }
      } catch (error) {
        console.log(`Fuzzy search pattern failed: ${pattern}`);
      }
    }
    
    // Remove duplicates and sort by relevance
    const uniqueResults = [];
    const seen = new Set();
    
    allResults.forEach(recipe => {
      if (!seen.has(recipe.id)) {
        seen.add(recipe.id);
        uniqueResults.push(recipe);
      }
    });
    
    // Sort by relevance score
    const sortedResults = uniqueResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    if (sortedResults.length > 0) {
      console.log(`✅ Found ${sortedResults.length} recipes via fuzzy search`);
    }
    
    return sortedResults.slice(0, 3); // Return top 3 most relevant
    
  } catch (error) {
    console.error('Fuzzy search error:', error);
    return [];
  }
};

// Calculate relevance score for search results
const calculateRelevanceScore = (recipeName, query) => {
  const recipe = recipeName.toLowerCase();
  const searchTerm = query.toLowerCase();
  
  let score = 0;
  
  // Exact match gets highest score
  if (recipe === searchTerm) {
    score += 100;
  }
  
  // Contains the exact search term
  if (recipe.includes(searchTerm)) {
    score += 50;
  }
  
  // Contains parts of the search term
  const searchWords = searchTerm.split(' ');
  searchWords.forEach(word => {
    if (word.length > 2 && recipe.includes(word)) {
      score += 20;
    }
  });
  
  // Bonus for common recipe keywords
  if (recipe.includes('recipe') || recipe.includes('dish') || recipe.includes('food')) {
    score += 10;
  }
  
  return score;
};

// Get detailed recipe with enhanced instructions
export const getRecipeDetailsEnhanced = async (recipeId) => {
  try {
    console.log(`Getting enhanced details for recipe: ${recipeId}`);
    const response = await fetch(`${THEMEALDB_BASE_URL}/lookup.php?i=${recipeId}`);
    const data = await response.json();
    
    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];
      
      // Extract ingredients and measurements
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            ingredient: ingredient.trim(),
            measure: measure ? measure.trim() : ''
          });
        }
      }
      
      // Parse original instructions into enhanced steps
      const enhancedInstructions = parseInstructionsEnhanced(meal.strInstructions || '');
      
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        thumbnail: meal.strMealThumb,
        ingredients: ingredients,
        originalInstructions: meal.strInstructions,
        enhancedInstructions: enhancedInstructions,
        youtube: meal.strYoutube,
        source: meal.strSource,
        tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
        cookTime: estimateCookTime(enhancedInstructions),
        difficulty: estimateDifficulty(enhancedInstructions, ingredients.length)
      };
    }
    
    throw new Error('Recipe not found');
  } catch (error) {
    console.error('Enhanced recipe details error:', error);
    throw new Error('Failed to get recipe details');
  }
};

// Enhanced instruction parsing
const parseInstructionsEnhanced = (instructions) => {
  if (!instructions) return [];
  
  // Split by common separators and clean up
  const steps = instructions
    .split(/\.\s*(?=[A-Z])|\.\s*(?=\d+\.)|\.\s*(?=Step)|\.\s*(?=Instructions?)|\.\s*(?=Meanwhile)|\.\s*(?=Next)|\.\s*(?=Then)|\.\s*(?=Now)|\.\s*(?=Finally)/)
    .map(step => step.trim())
    .filter(step => step.length > 15) // Filter out very short steps
    .map((step, index) => {
      // Clean up the step
      let cleanStep = step;
      if (!cleanStep.endsWith('.') && !cleanStep.endsWith('!')) {
        cleanStep += '.';
      }
      
      // Add cooking tips based on content
      const tips = generateCookingTips(cleanStep, index);
      
      return {
        stepNumber: index + 1,
        instruction: cleanStep,
        tips: tips,
        timing: estimateStepTiming(cleanStep),
        difficulty: estimateStepDifficulty(cleanStep)
      };
    });
  
  return steps;
};

// Generate cooking tips based on step content
const generateCookingTips = (step, stepIndex) => {
  const tips = [];
  const stepLower = step.toLowerCase();
  
  // Heat-related tips
  if (stepLower.includes('heat') || stepLower.includes('hot')) {
    tips.push('💡 Pro tip: Preheat your pan for better cooking results');
  }
  
  // Oil-related tips
  if (stepLower.includes('oil') || stepLower.includes('fry')) {
    tips.push('💡 Chef tip: Don\'t overcrowd the pan when frying');
  }
  
  // Seasoning tips
  if (stepLower.includes('salt') || stepLower.includes('season')) {
    tips.push('💡 Expert tip: Season in layers for depth of flavor');
  }
  
  // Time-related tips
  if (stepLower.includes('minute') || stepLower.includes('hour')) {
    tips.push('💡 Pro tip: Use a timer to avoid overcooking');
  }
  
  // Add general tips for certain steps
  if (stepIndex === 0) {
    tips.push('💡 Chef tip: Prepare all ingredients before starting');
  }
  
  return tips.slice(0, 2); // Limit to 2 tips per step
};

// Estimate timing for individual steps
const estimateStepTiming = (step) => {
  const stepLower = step.toLowerCase();
  
  if (stepLower.includes('fry') || stepLower.includes('sauté')) {
    return '2-3 minutes';
  }
  if (stepLower.includes('simmer') || stepLower.includes('boil')) {
    return '5-10 minutes';
  }
  if (stepLower.includes('bake') || stepLower.includes('roast')) {
    return '15-30 minutes';
  }
  if (stepLower.includes('marinate')) {
    return '30 minutes to 2 hours';
  }
  
  return null;
};

// Estimate difficulty for individual steps
const estimateStepDifficulty = (step) => {
  const stepLower = step.toLowerCase();
  
  if (stepLower.includes('mix') || stepLower.includes('add') || stepLower.includes('pour')) {
    return 'Easy';
  }
  if (stepLower.includes('fry') || stepLower.includes('sauté') || stepLower.includes('simmer')) {
    return 'Medium';
  }
  if (stepLower.includes('fold') || stepLower.includes('whisk') || stepLower.includes('knead')) {
    return 'Hard';
  }
  
  return 'Medium';
};

// Estimate total cooking time
const estimateCookTime = (steps) => {
  const totalSteps = steps.length;
  const estimatedMinutes = totalSteps * 4; // Average 4 minutes per step
  return `${Math.max(15, estimatedMinutes)} minutes`;
};

// Estimate overall difficulty
const estimateDifficulty = (steps, ingredientCount) => {
  const stepCount = steps.length;
  const complexity = stepCount + (ingredientCount * 0.5);
  
  if (complexity <= 5) return 'Easy';
  if (complexity <= 10) return 'Medium';
  return 'Hard';
};


