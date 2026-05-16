import React, { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useListRecipes, getListRecipesQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Flame, Info } from "lucide-react";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
const DIETARY_TYPES = ["All", "Veg", "Non-Veg", "Vegan", "Jain", "Kosher"];

export default function Results() {
  const [location] = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [location]);
  
  const initialIngredients = searchParams.get("ingredients") || "";
  const initialAllergies = searchParams.get("allergies") || "";

  const [category, setCategory] = useState("All");
  const [dietaryType, setDietaryType] = useState("All");
  const [sortBy, setSortBy] = useState("matchScore");

  const queryParams = {
    ingredients: initialIngredients,
    allergies: initialAllergies,
    category: category !== "All" ? category.toLowerCase() : undefined,
    dietaryType: dietaryType !== "All" ? dietaryType.toLowerCase() : undefined,
    sortBy: sortBy,
    sortOrder: sortBy === "name" ? "asc" : "desc"
  };

  const { data, isLoading } = useListRecipes(queryParams, {
    query: {
      queryKey: getListRecipesQueryKey(queryParams)
    }
  });

  const recipes = data?.recipes || [];

  const getScoreColor = (score?: number | null) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/40 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to ingredients</span>
          </Link>
          <div className="font-serif text-xl text-primary font-medium">Results</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-primary">Recipes for you</h1>
            <p className="text-muted-foreground">
              Based on {initialIngredients.split(",").length} ingredients
              {initialAllergies && ` (excluding ${initialAllergies})`}
            </p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">Best Match</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="calories">Calories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-8 pb-4">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meal Time</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === c 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dietary</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TYPES.map(d => (
                <button
                  key={d}
                  onClick={() => setDietaryType(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    dietaryType === d 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
                <div className="flex gap-2 pt-4">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border/50">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-primary mb-2">No recipes found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any recipes matching your specific ingredients and dietary preferences. Try removing some filters or adding more ingredients.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                <div className="group block bg-card hover:bg-secondary/20 border border-card-border hover:border-primary/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-md cursor-pointer h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(recipe.matchScore)}`}>
                      {recipe.matchScore}% Match
                    </div>
                    <Badge variant="outline" className="capitalize">{recipe.category}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                    {recipe.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto pt-4">
                    <Badge variant="secondary" className="capitalize bg-background">{recipe.mealType}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {recipe.ingredients.length} ingredients
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border/50 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prepTime || "30m"}</span>
                    </div>
                    {recipe.calories && (
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500/70" />
                        <span>{recipe.calories} kcal</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
