#!/bin/bash

# 🚀 FridgeChef AI Build Script
# This script helps you build your app for both iOS and Android

echo "🍳 FridgeChef AI Build Script"
echo "=============================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
    echo "✅ EAS CLI installed!"
else
    echo "✅ EAS CLI found!"
fi

# Check if logged in to Expo
echo "🔐 Checking Expo login status..."
if eas whoami &> /dev/null; then
    echo "✅ Logged in to Expo!"
else
    echo "🔑 Please login to Expo:"
    eas login
fi

echo ""
echo "🏗️  Building Options:"
echo "1) iOS (App Store)"
echo "2) Android (Play Store)"
echo "3) Both iOS and Android"
echo ""

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "🍎 Building for iOS..."
        eas build --platform ios --profile production
        ;;
    2)
        echo "🤖 Building for Android..."
        eas build --platform android --profile production
        ;;
    3)
        echo "🍎🤖 Building for both platforms..."
        echo "Building iOS first..."
        eas build --platform ios --profile production
        echo "Building Android..."
        eas build --platform android --profile production
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Build process completed!"
echo "📱 Check your builds at: https://expo.dev/accounts/[your-username]/projects/fridgechef-ai/builds"
echo ""
echo "📋 Next steps:"
echo "1. Download your build files"
echo "2. Upload to App Store Connect (iOS) or Google Play Console (Android)"
echo "3. Submit for review"
echo ""
echo "📖 For detailed instructions, see APP_STORE_GUIDE.md"
