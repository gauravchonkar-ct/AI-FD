import React, { useState } from "react";
import { useLocation } from "wouter";
import { useGetRecipeStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, X, ChefHat } from "lucide-react";

const ALLERGIES = ["gluten", "dairy", "eggs", "nuts", "fish", "shellfish", "peanuts", "soy"];

export default function Home() {
  const [, setLocation] = useLocation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);

  const { data: stats } = useGetRecipeStats();

  const handleAddIngredient = (e?: React.FormEvent) => {
    e?.preventDefault();
    const val = inputValue.trim().toLowerCase();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ingredients.length > 0) params.set("ingredients", ingredients.join(","));
    if (allergies.length > 0) params.set("allergies", allergies.join(","));
    setLocation(`/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="py-6 px-8 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Meal Planner</h1>
        </div>
        {stats && (
          <div className="hidden md:flex gap-6 text-sm text-muted-foreground font-medium">
            <span>{stats.totalRecipes} recipes</span>
            <span>{stats.byCategory?.breakfast || 0} breakfasts</span>
            <span>{stats.byCategory?.dinner || 0} dinners</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">What's in your fridge?</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Add your available ingredients and we'll craft the perfect recipe for you.
            </p>
          </div>

          <div className="bg-card border border-card-border p-8 rounded-3xl shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Your Ingredients
              </label>
              <form onSubmit={handleAddIngredient} className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. Tomatoes, Garlic, Olive Oil..."
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-background border-border/60 focus-visible:ring-primary/30"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <button type="submit" className="hidden" />
              </form>
              
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {ingredients.map(ing => (
                    <Badge key={ing} variant="secondary" className="px-3 py-1.5 text-sm gap-1 hover:bg-secondary/80">
                      {ing}
                      <button onClick={() => removeIngredient(ing)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Dietary Restrictions
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGIES.map(allergy => (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      allergies.includes(allergy)
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-background border border-border/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    No {allergy}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleSearch} 
                size="lg" 
                className="w-full text-lg py-7 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]"
              >
                <ChefHat className="mr-2 w-6 h-6" />
                Find Recipes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
