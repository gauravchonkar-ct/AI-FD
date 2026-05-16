import { Router } from "express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Recipe {
  id: string;
  name: string;
  category: string;
  mealType: string;
  ingredients: string[];
  allergens: string[];
  instructions: string;
  servings: string;
  calories: number | null;
  protein: string | null;
  carbs: string | null;
  fat: string | null;
  prepTime: string | null;
  source: string | null;
  matchScore: number | null;
}

function parseCSV(csvText: string): Recipe[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    // Handle quoted fields with commas
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && !inQuotes) {
        inQuotes = true;
      } else if (ch === '"' && inQuotes) {
        inQuotes = false;
      } else if (ch === "," && !inQuotes) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current);

    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (fields[i] || "").trim();
    });

    return {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      mealType: obj.mealType,
      ingredients: obj.ingredients
        ? obj.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      allergens: obj.allergens
        ? obj.allergens.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      instructions: obj.instructions || "",
      servings: obj.servings || "",
      calories: obj.calories ? parseInt(obj.calories) : null,
      protein: obj.protein || null,
      carbs: obj.carbs || null,
      fat: obj.fat || null,
      prepTime: obj.prepTime || null,
      source: obj.source || null,
      matchScore: null,
    };
  });
}

function loadRecipes(): Recipe[] {
  const csvPath = join(__dirname, "data/recipes.csv");
  const csvText = readFileSync(csvPath, "utf-8");
  return parseCSV(csvText);
}

function computeMatchScore(recipe: Recipe, availableIngredients: string[]): number {
  if (!availableIngredients.length) return 100;
  const normalized = availableIngredients.map((i) => i.toLowerCase().trim());
  let matched = 0;
  for (const ingredient of recipe.ingredients) {
    const ingLower = ingredient.toLowerCase();
    if (normalized.some((avail) => ingLower.includes(avail) || avail.includes(ingLower.split(" ")[0]))) {
      matched++;
    }
  }
  return Math.round((matched / recipe.ingredients.length) * 100);
}

const recipesRouter = Router();

recipesRouter.get("/recipes/stats/summary", (req, res) => {
  const recipes = loadRecipes();
  const byCategory: Record<string, number> = {};
  const byMealType: Record<string, number> = {};

  for (const r of recipes) {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    byMealType[r.mealType] = (byMealType[r.mealType] || 0) + 1;
  }

  res.json({
    totalRecipes: recipes.length,
    byCategory,
    byMealType,
  });
});

recipesRouter.get("/recipes/:id", (req, res) => {
  const recipes = loadRecipes();
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }
  res.json(recipe);
});

recipesRouter.get("/recipes", (req, res) => {
  let recipes = loadRecipes();

  const {
    ingredients: ingredientsParam,
    allergies: allergiesParam,
    dietaryType,
    category,
    sortBy,
    sortOrder,
  } = req.query as Record<string, string>;

  const availableIngredients = ingredientsParam
    ? ingredientsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const allergiesToExclude = allergiesParam
    ? allergiesParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  // Filter by allergens
  if (allergiesToExclude.length > 0) {
    recipes = recipes.filter((recipe) => {
      const recipeAllergens = recipe.allergens.map((a) => a.toLowerCase());
      return !allergiesToExclude.some((allergy) =>
        recipeAllergens.some((ra) => ra.includes(allergy) || allergy.includes(ra))
      );
    });
  }

  // Filter by dietary type
  if (dietaryType && dietaryType !== "all") {
    const types = dietaryType.split(",").map((t) => t.trim().toLowerCase());
    recipes = recipes.filter((recipe) => types.includes(recipe.mealType.toLowerCase()));
  }

  // Filter by category
  if (category && category !== "all") {
    recipes = recipes.filter(
      (recipe) => recipe.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Compute match scores
  recipes = recipes.map((recipe) => ({
    ...recipe,
    matchScore: computeMatchScore(recipe, availableIngredients),
  }));

  // If ingredients given, sort by match score descending by default
  if (availableIngredients.length > 0 && !sortBy) {
    recipes.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  } else {
    // Sorting
    const field = (sortBy as string) || "name";
    const order = (sortOrder as string) || "asc";
    recipes.sort((a, b) => {
      let aVal: string | number = 0;
      let bVal: string | number = 0;
      if (field === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (field === "calories") {
        aVal = a.calories ?? 0;
        bVal = b.calories ?? 0;
      } else if (field === "matchScore") {
        aVal = a.matchScore ?? 0;
        bVal = b.matchScore ?? 0;
      }
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  res.json({
    recipes,
    total: recipes.length,
  });
});

export default recipesRouter;
