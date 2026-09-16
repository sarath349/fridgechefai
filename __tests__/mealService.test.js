import { mapMealDetailsToRecipe } from '../services/mealService';

describe('mapMealDetailsToRecipe', () => {
  it('maps name and id from meal details', () => {
    const details = {
      id: '123',
      name: 'Pasta',
      area: 'Italian',
      category: 'Vegetarian',
      thumbnail: 'https://example.com/pasta.jpg',
      ingredients: [{ measure: '200g', ingredient: 'pasta' }],
      originalInstructions: 'Boil water. Cook pasta until done.',
      enhancedInstructions: [],
    };

    const recipe = mapMealDetailsToRecipe(details);

    expect(recipe.id).toBe('123');
    expect(recipe.name).toBe('Pasta');
    expect(recipe.cuisine).toBe('Italian');
    expect(recipe.servings).toBe(4);
  });

  it('formats ingredients with measure', () => {
    const details = {
      id: '1',
      name: 'Salad',
      ingredients: [{ measure: '1 cup', ingredient: 'lettuce' }],
      originalInstructions: 'Wash and chop the lettuce carefully.',
      enhancedInstructions: [],
    };

    const recipe = mapMealDetailsToRecipe(details);

    expect(recipe.ingredients).toEqual(['1 cup lettuce']);
  });

  it('sets Easy difficulty when few steps', () => {
    const details = {
      id: '1',
      name: 'Toast',
      ingredients: [],
      enhancedInstructions: [
        { instruction: 'Toast bread' },
        { instruction: 'Add butter' },
      ],
    };

    const recipe = mapMealDetailsToRecipe(details);

    expect(recipe.difficulty).toBe('Easy');
  });
});
