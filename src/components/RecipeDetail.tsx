import { motion } from "motion/react";
import { Clock, ChefHat, ArrowLeft, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Recipe } from "../types";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isLocked: boolean;
  onUnlock: () => void;
}

export function RecipeDetail({ recipe, onBack, isLocked, onUnlock }: RecipeDetailProps) {
  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-12 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold">
            <Clock size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-deepgreen">Premium Recipe Locked</h2>
            <p className="text-gray-600 mt-2">Unlock this authentic African flavor by upgrading to Premium.</p>
          </div>
          <button
            onClick={onUnlock}
            className="w-full max-w-xs bg-terracotta text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-terracotta/90 transition-all transform hover:scale-[1.02]"
          >
            Unlock All Premium Recipes
          </button>
          <button onClick={onBack} className="text-deepgreen/60 text-sm font-medium hover:underline">
            Go back to library
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto p-4 md:py-8"
    >
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-deepgreen font-bold group"
      >
        <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        Back to Recipes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {recipe.region}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Clock className="text-terracotta" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Time</p>
                <p className="font-bold text-deepgreen">{recipe.prepTime}</p>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <ChefHat className="text-earth" />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Difficulty</p>
                <p className="font-bold text-deepgreen">{recipe.difficulty}</p>
              </div>
            </div>
          </div>

          <a
            href={recipe.buyIngredientsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-deepgreen text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg hover:shadow-deepgreen/20 transition-all"
          >
            <ShoppingCart size={20} />
            Buy Ingredients Online
          </a>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-deepgreen leading-tight">
              {recipe.title}
            </h1>
            <p className="text-lg text-gray-600 mt-4 italic leading-relaxed">
              {recipe.description}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-deepgreen border-l-4 border-gold pl-4">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-deepgreen border-l-4 border-terracotta pl-4">Instructions</h2>
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
