# 🚀 Spoonacular Premium API Setup Guide

## 📋 Quick Setup Steps

### 1. **Sign Up for Spoonacular Premium**
- Go to [Spoonacular Pricing](https://spoonacular.com/food-api/pricing)
- Choose the **Cook Plan ($29/month)** - Perfect for development and scaling
- Create your account (no credit card needed for free tier initially)
- Add payment details during upgrade

### 2. **Get Your API Key**
- After payment, log into [Spoonacular Console](https://spoonacular.com/food-api/console)
- Generate or copy your API key
- Your API key will look like: `abc123def456ghi789...`

### 3. **Configure Your App**
- Open `/config.js` in your project
- Replace `'your-spoonacular-premium-api-key-here'` with your actual API key:

```javascript
// In config.js
export const API_CONFIG = {
  // ... other configs
  SPOONACULAR_API_KEY: 'your-actual-api-key-here',
  // ... rest of config
};
```

### 4. **Test Your Integration**
- Restart your app: `yarn start`
- Search for "biriyani" or "chicken curry"
- You should see logs: `🚀 Using SPOONACULAR PREMIUM API for maximum accuracy...`

## 🎯 What You Get with Spoonacular Premium

### ✅ **Massive Recipe Database**
- **365,000+ recipes** from around the world
- **Accurate ingredient matching**
- **Detailed nutritional information**
- **Step-by-step analyzed instructions**

### ✅ **Advanced Features**
- **Cuisine filtering** (Indian, Italian, Chinese, etc.)
- **Dietary restrictions** (Vegan, Keto, Gluten-free, etc.)
- **Ingredient-based search** with smart matching
- **Nutritional analysis** with detailed breakdowns
- **Equipment requirements** for each recipe

### ✅ **Perfect for Biryani Search**
- **Multiple biryani recipes** from different regions
- **Accurate ingredient lists** with measurements
- **Detailed cooking instructions** with timing
- **Nutritional information** for each recipe

## 💰 Pricing Plans

| Plan | Price/Month | Daily Points | Best For |
|------|-------------|--------------|----------|
| **Cook** | $29 | 1,500 | Development & Small Apps |
| **Culinarian** | $79 | 4,500 | Growing Apps |
| **Chef** | $149 | 10,000 | Production Apps |
| **Enterprise** | $300+ | Custom | Large Scale Apps |

## 🔧 API Usage Examples

### **Search for Biryani Recipes**
```javascript
// Your app will automatically search like this:
const recipes = await searchRecipesWithSpoonacular('biriyani', {
  cuisine: 'indian',
  addRecipeInformation: true,
  addRecipeInstructions: true,
  addRecipeNutrition: true
});
```

### **Search by Ingredients**
```javascript
// Find recipes with your available ingredients:
const recipes = await searchRecipesByIngredientsSpoonacular(['chicken', 'rice', 'spices'], {
  ranking: 2, // Maximize used ingredients
  number: 5
});
```

## 📊 What You'll See in Your App

### **Enhanced Recipe Display**
- **Premium Quality** badge 🏆
- **Dietary badges**: 🌱 Vegetarian, 🌿 Vegan, 🌾 Gluten Free
- **Popularity indicators**: ⭐ Popular, 💰 Budget Friendly
- **Accurate cooking times** and serving sizes
- **Detailed nutritional information**
- **Professional cooking tips** for each step

### **Better Search Results**
- **Higher accuracy** for biryani and other recipes
- **Multiple recipe options** with relevance scoring
- **Ingredient matching** with used/missed ingredients
- **Fallback to free APIs** if Spoonacular fails

## 🚨 Important Notes

### **API Key Security**
- ⚠️ **Never commit your API key to version control**
- ✅ Add `config.js` to your `.gitignore` file
- ✅ Use environment variables in production

### **Rate Limits**
- **Cook Plan**: 1,500 points/day (resets at midnight UTC)
- **Each search**: ~1-3 points depending on options
- **Overages**: $0.005 per point (automatically charged)

### **Caching**
- Your app caches responses for 1 hour
- This reduces API calls and improves performance
- Perfect for repeated searches

## 🎉 Benefits Over Free APIs

| Feature | Free APIs | Spoonacular Premium |
|---------|-----------|-------------------|
| **Recipe Database** | ~1,000 recipes | 365,000+ recipes |
| **Accuracy** | Limited | High accuracy |
| **Nutrition Info** | Basic | Detailed analysis |
| **Instructions** | Basic | Analyzed steps |
| **Ingredient Matching** | Poor | Smart matching |
| **Dietary Filters** | None | Comprehensive |
| **Cuisine Support** | Limited | Global cuisines |

## 🆘 Troubleshooting

### **"Spoonacular API not configured" Warning**
- Check your API key in `config.js`
- Make sure there are no extra spaces or quotes
- Restart your app after changing the config

### **No Recipe Results**
- Check your internet connection
- Verify API key is correct
- Check Spoonacular console for usage/quota

### **API Rate Limit Errors**
- Wait for quota reset (midnight UTC)
- Upgrade to higher plan if needed
- Implement better caching

## 📞 Support

- **Spoonacular Support**: [Contact Form](https://spoonacular.com/contact)
- **Documentation**: [Full API Docs](https://spoonacular.com/food-api/docs)
- **Console**: [Manage Your Account](https://spoonacular.com/food-api/console)

---

## 🚀 Ready to Get Started?

1. **Sign up** for Spoonacular Premium
2. **Get your API key**
3. **Update config.js**
4. **Restart your app**
5. **Search for biriyani** and enjoy accurate results!

**Your FridgeChef AI app will now have restaurant-quality recipe accuracy! 🍳✨**
