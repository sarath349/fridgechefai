// API Configuration
// Replace these with your actual API keys
export const API_CONFIG = {
  // OpenAI API for recipe generation
  OPENAI_API_KEY: 'your-openai-api-key-here',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  
  // Google Vision API for image recognition
  GOOGLE_VISION_API_KEY: 'your-google-vision-api-key-here',
  GOOGLE_VISION_BASE_URL: 'https://vision.googleapis.com/v1/images:annotate',
  
  // Alternative: Use Hugging Face API for free recipe generation
  HUGGINGFACE_API_KEY: 'your-huggingface-api-key-here',
  HUGGINGFACE_BASE_URL: 'https://api-inference.huggingface.co/models',
  
  // Spoonacular Premium API for accurate recipe generation
  SPOONACULAR_API_KEY: 'your-spoonacular-premium-api-key-here',
  SPOONACULAR_BASE_URL: 'https://api.spoonacular.com/recipes',
  
  // Spoonacular Premium endpoints
  SPOONACULAR_SEARCH_URL: 'https://api.spoonacular.com/recipes/complexSearch',
  SPOONACULAR_INGREDIENT_URL: 'https://api.spoonacular.com/recipes/findByIngredients',
  SPOONACULAR_DETAILS_URL: 'https://api.spoonacular.com/recipes/{id}/information',
  SPOONACULAR_INSTRUCTIONS_URL: 'https://api.spoonacular.com/recipes/{id}/analyzedInstructions'
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    useMockData: false, // NO MOCK DATA - REAL-TIME ONLY!
    apiTimeout: 15000,
  },
  production: {
    useMockData: false,
    apiTimeout: 15000,
  }
};

// Get current environment
export const getCurrentEnv = () => {
  return __DEV__ ? 'development' : 'production';
};

// Get current config
export const getConfig = () => {
  const env = getCurrentEnv();
  return ENV_CONFIG[env];
};
