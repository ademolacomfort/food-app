import { motion } from "motion/react";
import { Clock, ChefHat, Lock, ShoppingCart, Heart } from "lucide-react";
import { Recipe } from "../types";
import { cn } from "../lib/utils";

interface RecipeCardProps {
  key?: string | number;
  recipe: Recipe;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  onView: (id: string) => void;
}

export function RecipeCard({ recipe, onSave, isSaved, onView }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {recipe.isPremium && (
          <div className="absolute top-3 left-3 bg-gold text-deepgreen px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Lock size={12} />
            PREMIUM
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(recipe.id);
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors",
            isSaved ? "bg-terracotta text-white" : "bg-white/20 text-white hover:bg-white/40"
          )}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold/90">{recipe.region}</span>
          <h3 className="text-xl font-bold leading-tight line-clamp-1">{recipe.title}</h3>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2 italic">{recipe.description}</p>
          
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-terracotta" />
              {recipe.prepTime}
            </div>
            <div className="flex items-center gap-1">
              <ChefHat size={14} className="text-deepgreen" />
              {recipe.difficulty}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onView(recipe.id)}
            className="flex-grow bg-deepgreen text-white py-2 rounded-xl text-sm font-bold hover:bg-deepgreen/90 transition-colors"
          >
            Cook Now
          </button>
          <a
            href={recipe.buyIngredientsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-gray-200 rounded-xl text-deepgreen hover:bg-gray-50 transition-colors"
            title="Buy Ingredients"
          >
            <ShoppingCart size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
