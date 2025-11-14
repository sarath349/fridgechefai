# 🍳 FridgeChef AI - Smart Recipe Generator

Transform your fridge ingredients into delicious meals with AI-powered recipe generation!

## 📱 App Features

### 🚀 Core Features
- **📸 Smart Photo Recognition**: Upload photos of ingredients and get AI-powered ingredient recognition
- **🤖 Advanced AI Recipe Generation**: Real-time AI-powered recipe suggestions with enhanced algorithm
- **⭐ Enhanced Favorites**: Save recipes with dietary preferences and user settings
- **🥗 Intelligent Matching**: Advanced ingredient matching with dietary preference integration
- **📊 Detailed Nutrition**: Comprehensive nutritional information for each recipe
- **🛒 Shopping Lists**: Auto-generated shopping lists for missing ingredients
- **📤 Recipe Sharing**: Share recipes via text, social media, or copy to clipboard
- **⚙️ User Preferences**: Customizable dietary restrictions and cooking preferences
- **🌍 Multi-Cuisine**: Recipes from Italian, Asian, Mediterranean, American, and Fusion cuisines
- **🎨 Modern UI**: Beautiful, intuitive design with smooth animations and responsive layout

### 🆕 New Features Added
- **Real AI Integration**: OpenAI API for recipe generation with fallback to Spoonacular API
- **Real Image Recognition**: Google Vision API for ingredient detection from photos
- **Smart Fallback System**: Graceful degradation to mock data when APIs are unavailable
- **Dietary Preferences**: 8 dietary options (Vegetarian, Vegan, Gluten-Free, etc.)
- **Recipe Sharing**: Copy to clipboard and native sharing functionality
- **Dynamic Recipe Generation**: Unique recipes generated in real-time based on ingredients
- **User Settings**: Persistent preferences for servings, difficulty, and dietary needs
- **Improved UI**: Modal preferences, better navigation, and enhanced visual design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Mac with Xcode installed
- For Android: Android Studio

### Installation

1. Navigate to project directory:
```bash
cd FridgeChefAI
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

## 🔑 API Configuration

### Setting Up Real AI APIs

The app now supports real AI APIs for enhanced functionality. You can configure them in `config.js`:

#### 1. OpenAI API (Recipe Generation)
- Sign up at [OpenAI](https://platform.openai.com/)
- Get your API key from the dashboard
- Add it to `config.js`: `OPENAI_API_KEY: 'your-actual-api-key'`

#### 2. Google Vision API (Image Recognition)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable the Vision API
- Create credentials and get your API key
- Add it to `config.js`: `GOOGLE_VISION_API_KEY: 'your-actual-api-key'`

#### 3. Alternative APIs (Optional)
- **Spoonacular API**: Sign up at [Spoonacular](https://spoonacular.com/food-api)
- **Hugging Face API**: Sign up at [Hugging Face](https://huggingface.co/)

### Configuration File

Edit `config.js` to add your API keys:

```javascript
export const API_CONFIG = {
  // Replace with your actual API keys
  OPENAI_API_KEY: 'your-openai-api-key-here',
  GOOGLE_VISION_API_KEY: 'your-google-vision-api-key-here',
  SPOONACULAR_API_KEY: 'your-spoonacular-api-key-here', // Optional
  HUGGINGFACE_API_KEY: 'your-huggingface-api-key-here', // Optional
};
```

### Development vs Production Mode

- **Development Mode**: Uses mock data (no API keys required)
- **Production Mode**: Uses real APIs when keys are configured
- **Smart Fallback**: If APIs fail, automatically falls back to mock data

The app is designed to always work, even without API keys!

### Testing the App

**Option 1: Expo Go (Fastest)**
1. Install Expo Go on your phone from App Store/Play Store
2. Scan the QR code from the terminal
3. Test all features immediately

**Option 2: iOS Simulator**
```bash
npx expo start --ios
```

**Option 3: Android Emulator**
```bash
npx expo start --android
```

**Option 4: Web Browser**
```bash
npx expo start --web
```

## 📲 Building for App Store

### iOS App Store

1. **Create an Apple Developer Account**
   - Go to https://developer.apple.com
   - Enroll in Apple Developer Program ($99/year)
   - Wait for approval (usually 24-48 hours)

2. **Install EAS CLI**
```bash
npm install -g eas-cli
```

3. **Login to Expo**
```bash
eas login
```

4. **Configure EAS Build**
```bash
eas build:configure
```

5. **Build for iOS**
```bash
eas build --platform ios
```

6. **Download the .ipa file** when build completes

7. **Submit to App Store**
```bash
eas submit --platform ios
```

OR manually:
- Open Xcode
- Go to Window → Organizer
- Upload the build to App Store Connect
- Fill in app details at https://appstoreconnect.apple.com
- Submit for review

### Android Play Store

1. **Build for Android**
```bash
eas build --platform android --profile production
```

2. **Download the .aab file** when build completes

3. **Submit to Play Store**
```bash
eas submit --platform android
```

OR manually:
- Go to https://play.google.com/console
- Create new app
- Upload the .aab file
- Fill in app details and screenshots
- Submit for review

## 🎯 App Store Optimization

### App Description (for both stores)

**Short Description:**
Transform fridge ingredients into delicious meals with AI recipe generation!

**Long Description:**
FridgeChef AI helps you reduce food waste and discover new recipes using ingredients you already have! Simply enter what's in your fridge, and our smart AI algorithm generates personalized recipes instantly.

**Key Features:**
✨ AI-Powered Recipe Generation
📸 Photo Upload Support
⭐ Save Favorite Recipes
🥗 Smart Ingredient Matching
📊 Nutritional Information
🎨 Beautiful, Intuitive Design
💚 Reduce Food Waste
💰 Save Money

Perfect for:
- Home cooks looking for meal inspiration
- Budget-conscious shoppers
- Anyone wanting to reduce food waste
- Busy people needing quick meal ideas

No subscriptions. No ads. Just great recipes!

### Keywords (for App Store)
recipe generator, cooking app, meal planner, ingredient scanner, food waste, recipe finder, meal ideas, cooking assistant, kitchen helper, recipe app

### Screenshots Needed
- Home screen with ingredient input
- Generated recipe display
- Favorites screen
- Photo upload feature
- Recipe instructions

### App Icon
The app currently uses default Expo icons. For best results, create a custom 1024x1024px icon with:
- Chef hat or fridge imagery
- Orange/teal color scheme (#FF6B35)
- Clean, modern design

## 🔧 Customization

### Customizing Recipe Generation

The app now uses dynamic AI-generated recipes. To customize the recipe generation:

1. **Add API Keys**: Configure OpenAI or Spoonacular APIs in `config.js`
2. **Modify Prompts**: Edit the AI prompts in `services/apiService.js`
3. **Adjust Fallback**: Customize the mock recipe generation in `App.js`

The app automatically generates unique recipes based on your ingredients - no static database needed!

### Changing Theme Colors

Modify the colors in the `styles` object at the bottom of `App.js`:
- Primary: `#FF6B35` (orange)
- Secondary: `#4ECDC4` (teal)
- Background: `#F8F9FA` (light gray)

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**iOS Build fails:**
- Ensure you have valid Apple Developer account
- Check bundle identifier is unique
- Verify certificates in Xcode

**Android Build fails:**
- Check package name is unique
- Ensure you have accepted Google Play terms
- Verify signing certificates

## 📝 Pre-Submission Checklist

- [ ] Test app on real devices (iOS and Android)
- [ ] Verify all features work without crashes
- [ ] Test photo upload functionality
- [ ] Test recipe generation with various ingredients
- [ ] Test favorites save/delete functionality
- [ ] Create app icon (1024x1024px)
- [ ] Take screenshots for both stores
- [ ] Write compelling app description
- [ ] Set appropriate age rating
- [ ] Add privacy policy URL
- [ ] Test on different screen sizes
- [ ] Verify permissions work correctly

## 📄 App Store Requirements

### iOS App Store
- Apple Developer Account ($99/year)
- Privacy Policy URL
- App icon (1024x1024)
- Screenshots (various iPhone sizes)
- App preview video (optional but recommended)
- Detailed description
- Age rating
- Support URL

### Google Play Store
- Google Play Developer Account ($25 one-time)
- Privacy Policy URL
- Feature graphic (1024x500)
- App icon (512x512)
- Screenshots (various sizes)
- Detailed description
- Age rating
- Content rating questionnaire

## 🎉 Launch Strategy

1. **Soft Launch**: Release to one country first
2. **Gather Feedback**: Monitor reviews and ratings
3. **Iterate**: Fix bugs and add requested features
4. **Marketing**: Share on social media, Product Hunt
5. **ASO**: Optimize keywords and description
6. **Updates**: Release regular updates with new recipes

## 📊 Monetization Ideas (Future)

- Premium recipe collections
- Meal planning features
- Shopping list integration
- Dietary preference filters
- Integration with grocery delivery services
- Recipe sharing community

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review Expo documentation: https://docs.expo.dev
- Check React Native docs: https://reactnative.dev

## 📜 License

This project is ready for commercial use. You own the code and can publish it under your developer account.

## 🚀 Next Steps

1. Test the app thoroughly
2. Create custom app icon and screenshots
3. Sign up for Apple/Google developer accounts
4. Build and submit to stores
5. Market your app!

Good luck with your app launch! 🎉
