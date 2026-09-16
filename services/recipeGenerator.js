import { generateRecipeWithFreeAPI, recognizeIngredientsWithGoogleVision } from './apiService';
import { searchRecipesByMultipleIngredients, getRecipeDetails } from './recipeAPI';
import { searchRecipesEnhanced, getRecipeDetailsEnhanced } from './enhancedRecipeAPI';
import {
  searchRecipesWithSpoonacular,
  searchRecipesByIngredientsSpoonacular,
  getRecipeDetailsSpoonacular,
  isSpoonacularConfigured,
  isSpoonacularPremium,
  searchRecipesFreeTier,
  getRecipeInfoFreeTier
} from './spoonacularAPI';

// PREMIUM Recipe Generator with Spoonacular API!
export const generateRecipeWithAI = async (ingredients, dietaryPreferences = [], userPreferences = {}) => {
  try {
    const ingredientList = ingredients.toLowerCase().split(',').map(i => i.trim()).filter(i => i.length > 0);
    
    if (ingredientList.length === 0) {
      return null;
    }

    console.log('🚀 Using SPOONACULAR PREMIUM API for maximum accuracy...');
    
    // Check if Spoonacular is configured
    if (isSpoonacularConfigured()) {
      try {
        const searchQuery = ingredientList.join(' ');
        
        // Check if using premium or free tier
        if (isSpoonacularPremium()) {
          console.log(`🚀 Spoonacular PREMIUM search for: "${searchQuery}"`);
          
          // Premium tier - full features
          const recipes = await searchRecipesWithSpoonacular(searchQuery, {
            addRecipeInformation: true,
            addRecipeInstructions: true,
            addRecipeNutrition: true,
            number: 3
          });
          
          if (recipes && recipes.length > 0) {
            console.log(`✅ Spoonacular PREMIUM found ${recipes.length} recipes`);
            console.log(`Top result: ${recipes[0].name}`);
            
            const recipeDetails = await getRecipeDetailsSpoonacular(recipes[0].id);
            return convertSpoonacularToAppFormat(recipeDetails, ingredientList, userPreferences);
          }
        } else {
          console.log(`🆓 Spoonacular FREE search for: "${searchQuery}"`);
          
          // Free tier - optimized for minimal points usage
          const recipes = await searchRecipesFreeTier(searchQuery, {
            number: 2 // Limit for free tier
          });
          
          if (recipes && recipes.length > 0) {
            console.log(`✅ Spoonacular FREE found ${recipes.length} recipes`);
            console.log(`Top result: ${recipes[0].name}`);
            
            const recipeDetails = await getRecipeInfoFreeTier(recipes[0].id);
            return convertSpoonacularFreeToAppFormat(recipeDetails, ingredientList, userPreferences);
          }
        }
        
        // Try ingredient-based search if name search fails (both tiers)
        console.log('Trying Spoonacular ingredient-based search...');
        const ingredientRecipes = await searchRecipesByIngredientsSpoonacular(ingredientList, {
          number: isSpoonacularPremium() ? 3 : 2,
          ranking: 2 // Maximize used ingredients
        });
        
        if (ingredientRecipes && ingredientRecipes.length > 0) {
          console.log(`✅ Spoonacular found ${ingredientRecipes.length} recipes by ingredients`);
          console.log(`Top result: ${ingredientRecipes[0].name} (${ingredientRecipes[0].usedIngredientCount} used ingredients)`);
          
          const recipeDetails = isSpoonacularPremium() 
            ? await getRecipeDetailsSpoonacular(ingredientRecipes[0].id)
            : await getRecipeInfoFreeTier(ingredientRecipes[0].id);
          
          return isSpoonacularPremium() 
            ? convertSpoonacularToAppFormat(recipeDetails, ingredientList, userPreferences)
            : convertSpoonacularFreeToAppFormat(recipeDetails, ingredientList, userPreferences);
        }
        
      } catch (spoonacularError) {
        console.log('Spoonacular search failed, trying fallback methods...', spoonacularError.message);
      }
    } else {
      console.log('⚠️ Spoonacular API not configured, using fallback methods...');
    }
    
    // Fallback to enhanced search
    try {
      const searchQuery = ingredientList.join(' ');
      const recipes = await searchRecipesEnhanced(searchQuery);
      
      if (recipes && recipes.length > 0) {
        console.log(`✅ Found ${recipes.length} recipes using enhanced search`);
        const recipeDetails = await getRecipeDetailsEnhanced(recipes[0].id);
        return convertEnhancedRecipeToAppFormat(recipeDetails, ingredientList, userPreferences);
      }
    } catch (enhancedError) {
      console.log('Enhanced search failed, trying original methods...');
      
      // Fallback to original search methods
      try {
        const recipes = await searchRecipesByMultipleIngredients(ingredientList);
        
        if (recipes && recipes.length > 0) {
          const recipeDetails = await getRecipeDetails(recipes[0].id);
          return convertTheMealDBToAppFormat(recipeDetails, ingredientList, userPreferences);
        }
      } catch (fallbackError) {
        console.log('All real recipe searches failed...');
      }
    }
    
    // Final fallback to AI generation
    console.log('No real recipes found, using AI generation...');
    return await generateRecipeWithFreeAPI(ingredientList, dietaryPreferences, userPreferences);
    
  } catch (error) {
    console.error('Recipe Generation Error:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
};

// Convert Spoonacular Free Tier Recipe format to app format
const convertSpoonacularFreeToAppFormat = (recipeDetails, originalIngredients, userPreferences) => {
  // Generate AI-enhanced instructions for free tier
  const aiInstructions = generateAIInstructionsForFreeTier(recipeDetails);
  
  return {
    name: recipeDetails.name,
    cookTime: `${recipeDetails.readyInMinutes || 30} minutes`,
    difficulty: estimateSpoonacularDifficulty(recipeDetails),
    cuisine: recipeDetails.cuisines && recipeDetails.cuisines.length > 0 ? recipeDetails.cuisines[0] : 'International',
    servings: recipeDetails.servings || userPreferences.servings || 4,
    ingredients: recipeDetails.ingredients.map(ing => 
      `${ing.amount} ${ing.unit} ${ing.name}`
    ),
    instructions: aiInstructions,
    enhancedInstructions: aiInstructions.map((instruction, index) => ({
      stepNumber: index + 1,
      instruction: instruction,
      tips: generateCookingTipsForStep(instruction, index),
      timing: estimateStepTiming(instruction),
      difficulty: estimateStepDifficulty(instruction)
    })),
    nutrition: 'Nutritional information available with Premium',
    shoppingList: generateShoppingListFromSpoonacular(recipeDetails.ingredients, originalIngredients),
    generatedAt: new Date().toISOString(),
    uniqueId: Date.now(),
    isRealRecipe: true,
    source: 'Spoonacular Free',
    thumbnail: recipeDetails.thumbnail,
    summary: recipeDetails.summary,
    diets: recipeDetails.diets || [],
    dishTypes: recipeDetails.dishTypes || [],
    accuracy: 'Free Tier',
    veryPopular: recipeDetails.veryPopular,
    cheap: recipeDetails.cheap,
    glutenFree: recipeDetails.glutenFree,
    dairyFree: recipeDetails.dairyFree,
    vegetarian: recipeDetails.vegetarian,
    vegan: recipeDetails.vegan,
    ketogenic: recipeDetails.ketogenic,
    whole30: recipeDetails.whole30,
    sustainable: recipeDetails.sustainable
  };
};

// Convert Spoonacular Premium Recipe format to app format
const convertSpoonacularToAppFormat = (recipeDetails, originalIngredients, userPreferences) => {
  return {
    name: recipeDetails.name,
    cookTime: `${recipeDetails.readyInMinutes} minutes`,
    difficulty: estimateSpoonacularDifficulty(recipeDetails),
    cuisine: recipeDetails.cuisines && recipeDetails.cuisines.length > 0 ? recipeDetails.cuisines[0] : 'International',
    servings: recipeDetails.servings || userPreferences.servings || 4,
    ingredients: recipeDetails.ingredients.map(ing => 
      `${ing.amount} ${ing.unit} ${ing.name}`
    ),
    instructions: recipeDetails.analyzedInstructions.map(step => step.instruction),
    enhancedInstructions: recipeDetails.analyzedInstructions, // Keep detailed steps with tips
    nutrition: formatSpoonacularNutrition(recipeDetails.nutrition),
    shoppingList: generateShoppingListFromSpoonacular(recipeDetails.ingredients, originalIngredients),
    generatedAt: new Date().toISOString(),
    uniqueId: Date.now(),
    isRealRecipe: true,
    source: 'Spoonacular Premium',
    thumbnail: recipeDetails.thumbnail,
    summary: recipeDetails.summary,
    diets: recipeDetails.diets || [],
    dishTypes: recipeDetails.dishTypes || [],
    accuracy: 'Premium',
    veryPopular: recipeDetails.veryPopular,
    cheap: recipeDetails.cheap,
    glutenFree: recipeDetails.glutenFree,
    dairyFree: recipeDetails.dairyFree,
    vegetarian: recipeDetails.vegetarian,
    vegan: recipeDetails.vegan,
    ketogenic: recipeDetails.ketogenic,
    whole30: recipeDetails.whole30,
    sustainable: recipeDetails.sustainable
  };
};

// Convert Enhanced Recipe format to app format
const convertEnhancedRecipeToAppFormat = (recipeDetails, originalIngredients, userPreferences) => {
  return {
    name: recipeDetails.name,
    cookTime: recipeDetails.cookTime || calculateCookingTimeFromInstructions(recipeDetails.enhancedInstructions),
    difficulty: recipeDetails.difficulty || calculateDifficultyFromSteps(recipeDetails.enhancedInstructions),
    cuisine: recipeDetails.area || 'International',
    servings: userPreferences.servings || 4,
    ingredients: recipeDetails.ingredients.map(ing => 
      ing.measure ? `${ing.measure} ${ing.ingredient}` : ing.ingredient
    ),
    instructions: recipeDetails.enhancedInstructions.map(step => step.instruction),
    enhancedInstructions: recipeDetails.enhancedInstructions, // Keep detailed steps with tips
    nutrition: `Real recipe from ${recipeDetails.area || 'International'} cuisine`,
    shoppingList: generateShoppingListFromRecipe(recipeDetails.ingredients, originalIngredients),
    generatedAt: new Date().toISOString(),
    uniqueId: Date.now(),
    isRealRecipe: true,
    source: 'Enhanced Search',
    thumbnail: recipeDetails.thumbnail,
    youtube: recipeDetails.youtube,
    tags: recipeDetails.tags,
    accuracy: 'High' // Enhanced search provides better accuracy
  };
};

// Convert TheMealDB recipe format to app format (fallback)
const convertTheMealDBToAppFormat = (recipeDetails, originalIngredients, userPreferences) => {
  return {
    name: recipeDetails.name,
    cookTime: calculateCookingTimeFromInstructions(recipeDetails.enhancedInstructions),
    difficulty: calculateDifficultyFromSteps(recipeDetails.enhancedInstructions),
    cuisine: recipeDetails.area || 'International',
    servings: userPreferences.servings || 4,
    ingredients: recipeDetails.ingredients.map(ing => 
      ing.measure ? `${ing.measure} ${ing.ingredient}` : ing.ingredient
    ),
    instructions: recipeDetails.enhancedInstructions.map(step => step.instruction),
    enhancedInstructions: recipeDetails.enhancedInstructions, // Keep detailed steps
    nutrition: `Real recipe from ${recipeDetails.area || 'International'} cuisine`,
    shoppingList: generateShoppingListFromRecipe(recipeDetails.ingredients, originalIngredients),
    generatedAt: new Date().toISOString(),
    uniqueId: Date.now(),
    isRealRecipe: true,
    source: 'TheMealDB',
    thumbnail: recipeDetails.thumbnail,
    youtube: recipeDetails.youtube,
    tags: recipeDetails.tags
  };
};

// Calculate cooking time from step instructions
const calculateCookingTimeFromInstructions = (steps) => {
  const totalSteps = steps.length;
  const estimatedMinutesPerStep = 3;
  const totalTime = totalSteps * estimatedMinutesPerStep;
  return `${Math.max(15, totalTime)} minutes`;
};

// Calculate difficulty from number and complexity of steps
const calculateDifficultyFromSteps = (steps) => {
  const stepCount = steps.length;
  if (stepCount <= 4) return 'Easy';
  if (stepCount <= 7) return 'Medium';
  return 'Hard';
};

// Generate shopping list from recipe ingredients vs user ingredients
const generateShoppingListFromRecipe = (recipeIngredients, userIngredients) => {
  const shoppingList = [];
  const userIngredientLower = userIngredients.map(ing => ing.toLowerCase());
  
  recipeIngredients.forEach(recipeIng => {
    const recipeIngLower = recipeIng.ingredient.toLowerCase();
    const hasIngredient = userIngredientLower.some(userIng => 
      userIng.includes(recipeIngLower) || recipeIngLower.includes(userIng)
    );
    
    if (!hasIngredient) {
      shoppingList.push(recipeIng.measure ? 
        `${recipeIng.measure} ${recipeIng.ingredient}` : 
        recipeIng.ingredient
      );
    }
  });
  
  return shoppingList.slice(0, 5); // Limit to 5 items
};

// Helper functions for Spoonacular Premium
const estimateSpoonacularDifficulty = (recipe) => {
  const time = recipe.readyInMinutes || 0;
  const ingredientCount = recipe.ingredients ? recipe.ingredients.length : 0;
  
  if (time <= 30 && ingredientCount <= 5) return 'Easy';
  if (time <= 60 && ingredientCount <= 10) return 'Medium';
  return 'Hard';
};

const formatSpoonacularNutrition = (nutrition) => {
  if (!nutrition || !nutrition.nutrients) return 'Nutritional information available';
  
  const nutrients = nutrition.nutrients;
  const calories = nutrients.find(n => n.name === 'Calories')?.amount || 0;
  const protein = nutrients.find(n => n.name === 'Protein')?.amount || 0;
  const carbs = nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
  const fat = nutrients.find(n => n.name === 'Fat')?.amount || 0;
  
  return `Calories: ${Math.round(calories)} | Protein: ${Math.round(protein)}g | Carbs: ${Math.round(carbs)}g | Fat: ${Math.round(fat)}g`;
};

const generateShoppingListFromSpoonacular = (recipeIngredients, userIngredients) => {
  const shoppingList = [];
  const userIngredientLower = userIngredients.map(ing => ing.toLowerCase());
  
  recipeIngredients.forEach(recipeIng => {
    const recipeIngLower = recipeIng.name.toLowerCase();
    const hasIngredient = userIngredientLower.some(userIng => 
      userIng.includes(recipeIngLower) || recipeIngLower.includes(userIng)
    );
    
    if (!hasIngredient) {
      shoppingList.push(`${recipeIng.amount} ${recipeIng.unit} ${recipeIng.name}`);
    }
  });
  
  return shoppingList.slice(0, 5); // Limit to 5 items
};

// Helper functions for Spoonacular Free Tier
const generateAIInstructionsForFreeTier = (recipeDetails) => {
  const baseInstructions = [
    'Prepare all ingredients as listed in the recipe.',
    'Heat oil in a large pan or pot over medium heat.',
    'Add the main ingredients and cook until tender.',
    'Season with salt, pepper, and spices to taste.',
    'Cook until all ingredients are well combined and heated through.',
    'Taste and adjust seasoning if needed.',
    'Serve hot and enjoy!'
  ];
  
  // Customize based on recipe type
  const recipeName = recipeDetails.name.toLowerCase();
  const customInstructions = [];
  
  if (recipeName.includes('biryani') || recipeName.includes('rice')) {
    customInstructions.push(
      'Wash and soak rice for 20 minutes.',
      'Heat oil in a large pot and add whole spices.',
      'Add onions and cook until golden brown.',
      'Add meat/vegetables and cook with spices.',
      'Layer rice over the meat/vegetable mixture.',
      'Cover and cook on low heat for 20-25 minutes.',
      'Let it rest for 10 minutes before serving.'
    );
  } else if (recipeName.includes('curry') || recipeName.includes('sauce')) {
    customInstructions.push(
      'Heat oil in a pan and add chopped onions.',
      'Add ginger-garlic paste and cook until fragrant.',
      'Add tomatoes and cook until they break down.',
      'Add spices and cook for 2-3 minutes.',
      'Add main ingredients and cook until tender.',
      'Add liquid (water/coconut milk) and simmer.',
      'Garnish with fresh herbs and serve.'
    );
  } else if (recipeName.includes('pasta') || recipeName.includes('noodles')) {
    customInstructions.push(
      'Bring a large pot of salted water to boil.',
      'Cook pasta according to package instructions.',
      'Meanwhile, heat oil in a large pan.',
      'Add aromatics and cook until softened.',
      'Add sauce ingredients and cook until heated.',
      'Drain pasta and toss with sauce.',
      'Serve immediately with grated cheese.'
    );
  } else {
    // Use base instructions for other recipes
    return baseInstructions;
  }
  
  return customInstructions.length > 0 ? customInstructions : baseInstructions;
};

const generateCookingTipsForStep = (instruction, stepIndex) => {
  const tips = [];
  const stepLower = instruction.toLowerCase();
  
  if (stepLower.includes('heat') || stepLower.includes('oil')) {
    tips.push('💡 Pro tip: Don\'t let the oil smoke - adjust heat as needed');
  }
  
  if (stepLower.includes('season') || stepLower.includes('salt')) {
    tips.push('💡 Chef tip: Season in layers for better flavor distribution');
  }
  
  if (stepLower.includes('cook') && stepLower.includes('until')) {
    tips.push('💡 Expert tip: Check doneness by testing with a fork or knife');
  }
  
  if (stepIndex === 0) {
    tips.push('💡 Preparation tip: Have all ingredients ready before starting');
  }
  
  return tips.slice(0, 1); // Limit to 1 tip for free tier
};

const estimateStepTiming = (instruction) => {
  const stepLower = instruction.toLowerCase();
  
  if (stepLower.includes('soak') || stepLower.includes('marinate')) {
    return '20-30 minutes';
  }
  if (stepLower.includes('boil') || stepLower.includes('simmer')) {
    return '10-15 minutes';
  }
  if (stepLower.includes('cook') || stepLower.includes('heat')) {
    return '5-8 minutes';
  }
  
  return '3-5 minutes';
};

const estimateStepDifficulty = (instruction) => {
  const stepLower = instruction.toLowerCase();
  
  if (stepLower.includes('layer') || stepLower.includes('fold') || stepLower.includes('knead')) {
    return 'Hard';
  }
  if (stepLower.includes('cook') || stepLower.includes('heat') || stepLower.includes('season')) {
    return 'Medium';
  }
  
  return 'Easy';
};

// Image recognition — Vision API only (no invented ingredients)
export const recognizeIngredientsFromImage = async (imageUri) => {
  try {
    console.log('🖼️ Recognizing ingredients with Google Vision...');
    return await recognizeIngredientsWithGoogleVision(imageUri);
  } catch (error) {
    console.error('❌ Image Recognition Error:', error);
    throw new Error(
      'Could not recognize ingredients from this photo. Add them manually instead.'
    );
  }
};

