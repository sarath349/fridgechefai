import { searchRecipesByName } from '../services/recipeAPI';

describe('searchRecipesByName', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns mapped recipes when API has meals', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        meals: [
          {
            idMeal: '52771',
            strMeal: 'Spicy Arrabiata Penne',
            strCategory: 'Vegetarian',
            strArea: 'Italian',
            strMealThumb: 'https://example.com/x.jpg',
            strInstructions: 'Cook pasta',
          },
        ],
      }),
    });

    const result = await searchRecipesByName('pasta');

    expect(fetch).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Spicy Arrabiata Penne');
    expect(result[0].id).toBe('52771');
  });

  it('returns empty array when no meals', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ meals: null }),
    });

    const result = await searchRecipesByName('zzzz');

    expect(result).toEqual([]);
  });
});
