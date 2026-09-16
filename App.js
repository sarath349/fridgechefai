import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import RecipeResultsScreen from './screens/RecipeResultsScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import CookingStepsScreen from './screens/CookingStepsScreen';
import SavedScreen from './screens/SavedScreen';
import ProfileScreen from './screens/ProfileScreen';
import { colors } from './constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    Home: '🏠',
    Explore: '⌕',
    Add: '+',
    Saved: '♡',
    Profile: '👤',
  };
  return (
    <View style={[styles.tabIconWrap, label === 'Add' && styles.addWrap, focused && label !== 'Add' && styles.tabIconFocused]}>
      <Text style={[styles.tabIcon, label === 'Add' && styles.addIcon, focused && label !== 'Add' && styles.tabIconActive]}>
        {icons[label]}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen
        name="Add"
        component={IngredientsScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => <TabIcon label="Add" focused={focused} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Ingredients');
          },
        })}
      />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Ingredients" component={IngredientsScreen} />
          <Stack.Screen name="RecipeResults" component={RecipeResultsScreen} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
          <Stack.Screen name="CookingSteps" component={CookingStepsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: Platform.OS === 'ios' ? 18 : 12,
    height: 68,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: colors.green,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconFocused: {},
  tabIcon: {
    fontSize: 18,
    color: colors.textLight,
  },
  tabIconActive: {
    color: colors.green,
  },
  addWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green,
    marginTop: -28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
});
