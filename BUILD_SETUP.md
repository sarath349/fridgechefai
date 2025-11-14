# 🚀 Quick Build Setup for App Store & Play Store

## 📱 **STEP-BY-STEP BUILD PROCESS**

### **1. Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

### **2. Login to Expo**
```bash
eas login
```

### **3. Configure Build**
```bash
eas build:configure
```
This will create an `eas.json` file (already exists in your project).

### **4. Build for iOS (App Store)**
```bash
eas build --platform ios --profile production
```

### **5. Build for Android (Play Store)**
```bash
eas build --platform android --profile production
```

### **6. Monitor Build Progress**
- Builds take 10-20 minutes
- You'll get a link to monitor progress
- Download the build when complete

---

## 📋 **PRE-BUILD CHECKLIST**

### **✅ Required Files:**
- [x] `app.json` configured ✓
- [x] `eas.json` configured ✓
- [x] App icons in `/assets/` ✓
- [x] Splash screen configured ✓

### **✅ API Keys:**
- [ ] Spoonacular API key added to `config.js`
- [ ] Google Vision API key added to `config.js` (optional)

### **✅ Testing:**
- [ ] App runs without crashes
- [ ] Image upload works
- [ ] Recipe generation works
- [ ] All features tested

---

## 🎯 **NEXT STEPS AFTER BUILD**

### **iOS (App Store):**
1. Download `.ipa` file from EAS
2. Upload to App Store Connect
3. Submit for review

### **Android (Play Store):**
1. Download `.aab` file from EAS
2. Upload to Google Play Console
3. Submit for review

---

## ⚡ **QUICK START COMMANDS**

```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Login
eas login

# 3. Build iOS
eas build --platform ios --profile production

# 4. Build Android
eas build --platform android --profile production
```

**That's it! Your builds will be ready for store submission! 🎉**


