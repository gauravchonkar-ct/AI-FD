import React from "react";
import { useRoute, Link } from "wouter";
import { useGetRecipe, getGetRecipeQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Clock, Users, Flame, Info, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RecipeDetail() {
  const [, params] = useRoute("/recipe/:id");
  const id = params?.id;

  const { data: recipe, isLoading } = useGetRecipe(id || "", {
    query: {
      enabled: !!id,
      queryKey: getGetRecipeQueryKey(id || "")
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-24 rounded" />
        <Skeleton className="h-16 w-3/4 rounded" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Info className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-serif text-primary mb-2">Recipe not found</h1>
        <Link href="/" className="text-accent hover:underline">Return home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/40 py-4 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/results" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to results</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-10">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 capitalize px-3 py-1 text-sm">
                {recipe.category}
              </Badge>
              <Badge variant="outline" className="capitalize px-3 py-1 text-sm bg-card">
                {recipe.mealType}
              </Badge>
              {recipe.matchScore && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {recipe.matchScore}% Match
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
              {recipe.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground bg-card p-4 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary/70" />
                <span className="font-medium">{recipe.prepTime || "30 mins"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary/70" />
                <span className="font-medium">{recipe.servings || "2"} servings</span>
              </div>
              {recipe.calories && (
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500/70" />
                  <span className="font-medium">{recipe.calories} calories</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_2fr] gap-12 pt-8">
            {/* Ingredients Sidebar */}
            <div className="space-y-8">
              <div className="space-y-6 bg-card p-6 rounded-3xl border border-border/50">
                <h2 className="text-2xl font-serif text-primary">Ingredients</h2>
                <ul className="space-y-4">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/90">
                      <CheckCircle2 className="w-5 h-5 text-primary/60 shrink-0 mt-0.5" />
                      <span className="leading-tight">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {recipe.allergens && recipe.allergens.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">Allergens</h3>
                  <div className="flex flex-wrap gap-2 px-2">
                    {recipe.allergens.map(a => (
                      <Badge key={a} variant="destructive" className="bg-destructive/10 text-destructive border-none">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4 px-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nutrition</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-3 rounded-xl border border-border/50 text-center">
                    <div className="text-2xl font-medium text-foreground">{recipe.protein || "-"}</div>
                    <div className="text-xs text-muted-foreground uppercase">Protein</div>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/50 text-center">
                    <div className="text-2xl font-medium text-foreground">{recipe.carbs || "-"}</div>
                    <div className="text-xs text-muted-foreground uppercase">Carbs</div>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/50 text-center">
                    <div className="text-2xl font-medium text-foreground">{recipe.fat || "-"}</div>
                    <div className="text-xs text-muted-foreground uppercase">Fat</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Main */}
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-primary">Instructions</h2>
              <div className="prose prose-lg prose-p:leading-relaxed prose-p:text-foreground/80 max-w-none">
                {recipe.instructions.split('\n').filter(line => line.trim()).map((step, i) => (
                  <div key={i} className="flex gap-6 mb-8 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-serif flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {i + 1}
                    </div>
                    <p className="mt-1 m-0 flex-1">{step}</p>
                  </div>
                ))}
              </div>
              
              {recipe.source && (
                <div className="mt-12 pt-6 border-t border-border/50 text-sm text-muted-foreground">
                  Source: <a href={recipe.source} target="_blank" rel="noreferrer" className="text-accent hover:underline">{recipe.source}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
