export const colors = {
  bg: '#F7F4EE',
  bgSoft: '#FBF9F4',
  cream: '#FFFDF8',
  white: '#FFFFFF',
  green: '#1F4D3A',
  greenMid: '#2E6B4F',
  greenSoft: '#E7F3EC',
  greenMint: '#D8EFE3',
  orange: '#E85A1C',
  orangeSoft: '#FFF0E6',
  yellow: '#F6E7C1',
  text: '#1C2B24',
  textMuted: '#6B756F',
  textLight: '#9AA39C',
  border: '#E8E2D6',
  cardShadow: 'rgba(31, 77, 58, 0.08)',
  danger: '#D64545',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const categories = [
  { id: 'all', label: 'All', emoji: '▦', type: 'search', value: 'chicken' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🥞', type: 'category', value: 'Breakfast' },
  { id: 'lunch', label: 'Lunch', emoji: '🥗', type: 'category', value: 'Chicken' },
  { id: 'dinner', label: 'Dinner', emoji: '🍲', type: 'category', value: 'Beef' },
  { id: 'snacks', label: 'Snacks', emoji: '🍟', type: 'category', value: 'Starter' },
  { id: 'healthy', label: 'Healthy', emoji: '🌿', type: 'category', value: 'Vegetarian' },
  { id: 'indian', label: 'Indian', emoji: '🍛', type: 'area', value: 'Indian' },
  { id: 'italian', label: 'Italian', emoji: '🍕', type: 'area', value: 'Italian' },
];

// Dish menus loaded from TheMealDB search.php + lookup.php (full ingredients & steps)
export const popularDishes = [
  { id: 'biryani', label: 'Biryani', emoji: '🍛', query: 'biryani' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝', query: 'pasta' },
  { id: 'chicken', label: 'Chicken', emoji: '🍗', query: 'chicken' },
  { id: 'curry', label: 'Curry', emoji: '🥘', query: 'curry' },
  { id: 'salad', label: 'Salad', emoji: '🥗', query: 'salad' },
  { id: 'soup', label: 'Soup', emoji: '🥣', query: 'soup' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕', query: 'pizza' },
  { id: 'rice', label: 'Rice', emoji: '🍚', query: 'rice' },
];

export const popularIngredients = [
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'onion', name: 'Onion', emoji: '🧅' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗' },
  { id: 'egg', name: 'Egg', emoji: '🥚' },
  { id: 'rice', name: 'Rice', emoji: '🍚' },
  { id: 'potato', name: 'Potato', emoji: '🥔' },
  { id: 'carrot', name: 'Carrot', emoji: '🥕' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀' },
  { id: 'milk', name: 'Milk', emoji: '🥛' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  { id: 'spinach', name: 'Spinach', emoji: '🥬' },
  { id: 'mushroom', name: 'Mushroom', emoji: '🍄' },
  { id: 'pepper', name: 'Bell Pepper', emoji: '🫑' },
  { id: 'lemon', name: 'Lemon', emoji: '🍋' },
  { id: 'bread', name: 'Bread', emoji: '🍞' },
];
