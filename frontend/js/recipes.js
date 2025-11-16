const API_CONFIG = {
  SPOONACULAR: {
    BASE_URL: "http://127.0.0.1:3000/recipes",
  },
};

class RecipesAPI {
  constructor() {
    this.apiKey = API_CONFIG.SPOONACULAR.API_KEY;
    this.baseURL = API_CONFIG.SPOONACULAR.BASE_URL;
  }

  async getRandomRecipes(limit = 6) {
    try {
      const response = await fetch(`${this.baseURL}?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.recipes;
    } catch (error) {
      console.error("Error fetching random recipes:", error);
      throw error;
    }
  }

  async searchRecipes(query, limit = 12) {
    try {
      const response = await fetch(
        `${this.baseURL}${
          API_CONFIG.SPOONACULAR.ENDPOINTS.SEARCH
        }?search=${encodeURIComponent(query)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error searching recipes:", error);
      throw error;
    }
  }

  async getRecipeDetails(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      throw error;
    }
  }
}

window.RecipesAPI = RecipesAPI;
