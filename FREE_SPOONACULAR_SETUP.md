# 🆓 Free Spoonacular API Setup Guide

## 🚀 Quick Setup for FREE Spoonacular API

### 1. **Get Your Free API Key**
- Go to [Spoonacular Console](https://spoonacular.com/food-api/console)
- Sign up for a **FREE account** (no credit card required)
- Get your API key from the console
- Free tier includes **150 requests per day** (perfect for testing!)

### 2. **Add API Key to Your App**
- Open `/config.js` in your project
- Replace the placeholder with your actual API key:

```javascript
// In config.js
export const API_CONFIG = {
  // ... other configs
  SPOONACULAR_API_KEY: 'your-actual-free-api-key-here',
  // ... rest of config
};
```

### 3. **Test Your Integration**
- Restart your app: `yarn start`
- Search for "biriyani" or "chicken curry"
- You should see logs: `🆓 Spoonacular FREE search for: "biriyani"`

## 🎯 What You Get with FREE Spoonacular

### ✅ **Free Tier Features**
- **150 requests per day** (resets at midnight UTC)
- **Basic recipe search** with recipe names and images
- **Ingredient lists** with measurements
- **Basic recipe information** (cooking time, servings)
- **Dietary information** (vegetarian, vegan, etc.)

### ✅ **AI-Enhanced Instructions**
- **Custom cooking instructions** based on recipe type
- **Specialized biryani instructions** with authentic steps
- **Professional cooking tips** for each step
- **Timing suggestions** for cooking
- **Difficulty assessment** per step

### ✅ **Smart Fallback System**
- **Free Spoonacular** → Enhanced TheMealDB → AI Generation
- **Always gets results** even if one API fails
- **Optimized for minimal API usage**

## 📊 Free vs Premium Comparison

| Feature | FREE (150/day) | PREMIUM (1500/day) |
|---------|---------------|-------------------|
| **Recipe Search** | ✅ Basic | ✅ Advanced |
| **Recipe Details** | ✅ Basic | ✅ Full Details |
| **Instructions** | ✅ AI-Generated | ✅ Analyzed Steps |
| **Nutrition Info** | ❌ | ✅ Detailed |
| **Ingredient Matching** | ✅ Basic | ✅ Smart Matching |
| **Daily Requests** | 150 | 1500 |
| **Cost** | FREE | $29/month |

## 🍛 Perfect for Biryani Search

### **What You'll Get:**
- **Real biryani recipes** from Spoonacular database
- **Authentic cooking instructions** with AI enhancement
- **Proper ingredient lists** with measurements
- **Cooking time estimates** and serving sizes
- **Dietary badges** (vegetarian, vegan options)

### **Example Biryani Instructions:**
1. **Wash and soak rice for 20 minutes**
2. **Heat oil in a large pot and add whole spices**
3. **Add onions and cook until golden brown**
4. **Add meat/vegetables and cook with spices**
5. **Layer rice over the meat/vegetable mixture**
6. **Cover and cook on low heat for 20-25 minutes**
7. **Let it rest for 10 minutes before serving**

## 🔍 What You'll See in Logs

```
🆓 Spoonacular FREE search for: "biriyani"
Making FREE tier request to: https://api.spoonacular.com/recipes/complexSearch?query=biriyani...
✅ Spoonacular FREE found 5 total results, returning 2
📋 Getting FREE tier info for recipe: 12345
✅ Got FREE tier info for: Authentic Chicken Biryani
```

## 🎨 Enhanced UI Features

### **Free Tier Display:**
- **"Spoonacular Free"** source badge
- **Dietary badges**: 🌱 Vegetarian, 🌿 Vegan, 🌾 Gluten Free
- **Popularity indicators**: ⭐ Popular, 💰 Budget Friendly
- **AI-generated cooking instructions** with tips
- **Step-by-step timing** and difficulty

### **Recipe Cards Show:**
- Real recipe name and thumbnail
- Cooking time and serving size
- Complete ingredient list
- AI-enhanced cooking steps
- Professional cooking tips
- Shopping list for missing ingredients

## 🚨 Free Tier Limitations

### **What's Limited:**
- **150 requests per day** (enough for ~50 recipe searches)
- **No detailed nutrition info** (shows "Available with Premium")
- **Basic recipe details** (no analyzed instructions)
- **Limited to 2 results** per search

### **Smart Optimizations:**
- **Caches responses** for 1 hour to reduce API calls
- **Falls back to free APIs** if quota exceeded
- **AI generates instructions** when detailed ones aren't available
- **Minimal point usage** per request

## 🆙 When to Upgrade to Premium

### **Upgrade if you need:**
- **More than 150 requests/day**
- **Detailed nutritional information**
- **Analyzed cooking instructions**
- **Advanced ingredient matching**
- **Production app deployment**

### **Premium Benefits:**
- **1500 requests/day** (10x more)
- **Full nutritional analysis**
- **Analyzed cooking steps**
- **Smart ingredient matching**
- **Priority support**

## 🎉 Ready to Start?

### **Quick Start Steps:**
1. **Sign up** for free Spoonacular account
2. **Get your API key** from the console
3. **Update config.js** with your key
4. **Restart your app**
5. **Search for biriyani** and enjoy!

### **Your App Will:**
- ✅ **Find real biryani recipes** from Spoonacular
- ✅ **Generate authentic cooking instructions**
- ✅ **Show dietary information** and badges
- ✅ **Provide professional cooking tips**
- ✅ **Work within free tier limits**

**Start with the free tier to test everything, then upgrade to Premium when you're ready for production! 🚀**

---

## 💡 Pro Tips

- **Cache results** to maximize your 150 daily requests
- **Use specific searches** (e.g., "chicken biryani" not just "biriyani")
- **Check quota usage** in Spoonacular console
- **Upgrade to Premium** when you need more requests

**Your FridgeChef AI app now works great with the FREE Spoonacular API! 🍳✨**


