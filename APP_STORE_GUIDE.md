# 📱 App Store & Google Play Store Upload Guide

## 🍎 **APPLE APP STORE SUBMISSION**

### **1. Prerequisites**

#### **Developer Account Setup:**
- **Apple Developer Program**: $99/year subscription
- **Sign up**: [developer.apple.com](https://developer.apple.com)
- **Required**: Apple ID, credit card, legal entity info

#### **Required Assets:**
- **App Icon**: 1024x1024px (PNG, no transparency)
- **Screenshots**: 
  - iPhone: 6.7", 6.5", 5.5" displays
  - iPad: 12.9", 11" displays
- **App Preview Videos**: 30 seconds max (optional but recommended)

### **2. Build Preparation**

#### **Update App Information:**
```bash
# Update app.json with production settings
```

**Required app.json updates:**
```json
{
  "expo": {
    "name": "FridgeChef AI",
    "slug": "fridgechef-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.fridgechefai",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access to take photos of ingredients for recipe generation.",
        "NSPhotoLibraryUsageDescription": "This app needs photo library access to select ingredient photos for recipe generation."
      }
    }
  }
}
```

#### **Build for iOS:**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production
```

### **3. App Store Connect Setup**

#### **Create New App:**
1. **Go to**: [App Store Connect](https://appstoreconnect.apple.com)
2. **Click**: "My Apps" → "+" → "New App"
3. **Fill out**:
   - **Name**: FridgeChef AI
   - **Primary Language**: English
   - **Bundle ID**: com.yourcompany.fridgechefai
   - **SKU**: fridgechef-ai-ios
   - **User Access**: Full Access

#### **App Information:**
- **Category**: Food & Drink
- **Subcategory**: Cooking
- **Content Rights**: You own or have rights to all content
- **Age Rating**: Complete questionnaire (likely 4+)

#### **App Description:**
```
🍳 FridgeChef AI - Smart Recipe Generator

Transform your ingredients into delicious meals with AI-powered recipe generation!

✨ KEY FEATURES:
• 📸 Smart ingredient recognition from photos
• 🔍 Real-time recipe search with Spoonacular API
• 👨‍🍳 Step-by-step cooking instructions with tips
• 🌱 Dietary preference filtering (Vegetarian, Vegan, Keto, etc.)
• ⭐ Save favorite recipes
• 📤 Share recipes with friends
• 🛒 Smart shopping lists

🎯 PERFECT FOR:
• Busy professionals who want quick meal ideas
• Home cooks looking to use up ingredients
• Anyone wanting to reduce food waste
• Cooking enthusiasts exploring new recipes

🚀 HOW IT WORKS:
1. Take a photo of your ingredients or type them in
2. AI analyzes and suggests perfect recipes
3. Get detailed cooking instructions with pro tips
4. Save favorites and share with friends

Download FridgeChef AI today and never wonder "What should I cook?" again!
```

#### **Keywords:**
```
recipe, cooking, ingredients, meal planning, food waste, AI cooking, kitchen assistant, recipe generator, meal prep, cooking tips
```

### **4. Screenshots & Assets**

#### **Required Screenshots (iPhone):**
- **6.7" Display**: 1290 x 2796 pixels
- **6.5" Display**: 1242 x 2688 pixels  
- **5.5" Display**: 1242 x 2208 pixels

#### **Required Screenshots (iPad):**
- **12.9" Display**: 2048 x 2732 pixels
- **11" Display**: 1668 x 2388 pixels

#### **App Icon Requirements:**
- **Size**: 1024 x 1024 pixels
- **Format**: PNG
- **No transparency**
- **No rounded corners** (Apple adds them)

### **5. Submission Process**

#### **Upload Build:**
1. **Download** your build from EAS
2. **Upload** via Xcode or Application Loader
3. **Wait** for processing (5-30 minutes)

#### **Submit for Review:**
1. **Select** your build in App Store Connect
2. **Add** screenshots and description
3. **Set** pricing (Free or Paid)
4. **Submit** for review

#### **Review Timeline:**
- **Initial Review**: 24-48 hours
- **Rejection/Approval**: Usually within 1 week
- **Live on Store**: Immediately after approval

---

## 🤖 **GOOGLE PLAY STORE SUBMISSION**

### **1. Prerequisites**

#### **Developer Account Setup:**
- **Google Play Console**: $25 one-time fee
- **Sign up**: [play.google.com/console](https://play.google.com/console)
- **Required**: Google account, payment method

#### **Required Assets:**
- **App Icon**: 512x512px (PNG)
- **Feature Graphic**: 1024x500px
- **Screenshots**: Phone, 7" tablet, 10" tablet
- **App Video**: 30 seconds to 2 minutes (optional)

### **2. Build Preparation**

#### **Update app.json for Android:**
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.fridgechefai",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

#### **Build for Android:**
```bash
# Build for Android
eas build --platform android --profile production
```

### **3. Google Play Console Setup**

#### **Create New App:**
1. **Go to**: [Google Play Console](https://play.google.com/console)
2. **Click**: "Create app"
3. **Fill out**:
   - **App name**: FridgeChef AI
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

#### **App Content:**
- **Category**: Food & Drink
- **Content rating**: Complete questionnaire
- **Target audience**: 13+ (likely)

#### **Store Listing:**
```
🍳 FridgeChef AI - Smart Recipe Generator

Transform your ingredients into delicious meals with AI-powered recipe generation!

✨ KEY FEATURES:
• 📸 Smart ingredient recognition from photos
• 🔍 Real-time recipe search with Spoonacular API
• 👨‍🍳 Step-by-step cooking instructions with tips
• 🌱 Dietary preference filtering (Vegetarian, Vegan, Keto, etc.)
• ⭐ Save favorite recipes
• 📤 Share recipes with friends
• 🛒 Smart shopping lists

🎯 PERFECT FOR:
• Busy professionals who want quick meal ideas
• Home cooks looking to use up ingredients
• Anyone wanting to reduce food waste
• Cooking enthusiasts exploring new recipes

🚀 HOW IT WORKS:
1. Take a photo of your ingredients or type them in
2. AI analyzes and suggests perfect recipes
3. Get detailed cooking instructions with pro tips
4. Save favorites and share with friends

Download FridgeChef AI today and never wonder "What should I cook?" again!
```

### **4. Required Assets**

#### **App Icon:**
- **Size**: 512 x 512 pixels
- **Format**: PNG
- **No transparency**

#### **Feature Graphic:**
- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPG
- **Text**: Should be minimal and readable

#### **Screenshots:**
- **Phone**: At least 2 screenshots
- **7" Tablet**: At least 1 screenshot
- **10" Tablet**: At least 1 screenshot

### **5. Submission Process**

#### **Upload APK/AAB:**
1. **Download** your build from EAS
2. **Go to**: Release → Production
3. **Upload** AAB file (recommended) or APK
4. **Fill out** release notes

#### **Content Rating:**
- **Complete** content rating questionnaire
- **Wait** for rating (usually instant)

#### **Review Timeline:**
- **Review**: 1-3 days
- **Live on Store**: Immediately after approval

---

## 🚀 **PRE-LAUNCH CHECKLIST**

### **Both Platforms:**

#### **✅ Technical Requirements:**
- [ ] App builds successfully
- [ ] All features work as expected
- [ ] No crashes or major bugs
- [ ] Performance is smooth
- [ ] All permissions properly requested
- [ ] Privacy policy URL added
- [ ] Terms of service URL added

#### **✅ Legal Requirements:**
- [ ] Privacy Policy created and hosted
- [ ] Terms of Service created
- [ ] All third-party APIs properly attributed
- [ ] No copyright violations
- [ ] Age rating questionnaire completed

#### **✅ Marketing Assets:**
- [ ] App icon (high quality)
- [ ] Screenshots for all required sizes
- [ ] App description optimized
- [ ] Keywords researched
- [ ] Feature graphic (Android)
- [ ] App preview video (optional)

#### **✅ API Keys:**
- [ ] Spoonacular API key configured
- [ ] Google Vision API key configured (optional)
- [ ] All API quotas sufficient for launch
- [ ] Fallback mechanisms in place

---

## 💡 **LAUNCH TIPS**

### **App Store Optimization (ASO):**
1. **Use relevant keywords** in title and description
2. **Include popular search terms** like "recipe", "cooking", "AI"
3. **Highlight unique features** like photo recognition
4. **Use emojis** to make description more engaging
5. **Update regularly** with new features

### **Launch Strategy:**
1. **Soft launch** in one country first
2. **Gather user feedback** and fix issues
3. **Global launch** after testing
4. **Promote** on social media and food blogs
5. **Monitor** app performance and user reviews

### **Post-Launch:**
1. **Respond to reviews** promptly
2. **Update app** regularly with new features
3. **Monitor** crash reports and fix issues
4. **Analyze** user behavior and improve UX
5. **Add new recipe sources** and features

---

## 📞 **SUPPORT & RESOURCES**

### **Apple Resources:**
- **App Store Review Guidelines**: [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines)
- **Human Interface Guidelines**: [developer.apple.com/design/human-interface-guidelines](https://developer.apple.com/design/human-interface-guidelines)

### **Google Resources:**
- **Play Console Help**: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)
- **Material Design**: [material.io/design](https://material.io/design)

### **Expo Resources:**
- **EAS Build**: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **App Store Deployment**: [docs.expo.dev/distribution/app-stores](https://docs.expo.dev/distribution/app-stores)

---

## 🎉 **SUCCESS!**

Once approved, your FridgeChef AI app will be live on both stores! 

**Remember to:**
- Monitor user reviews and ratings
- Update regularly with new features
- Respond to user feedback
- Keep API keys and quotas in check
- Promote your app on social media

**Good luck with your launch! 🚀🍳**
