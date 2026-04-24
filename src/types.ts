export type Region = "West Africa" | "East Africa" | "North Africa" | "South Africa" | "Central Africa";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  region: Region;
  difficulty: Difficulty;
  isPremium: boolean;
  imageUrl: string;
  prepTime: string;
  category: string;
  buyIngredientsLink: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  isPremium: boolean;
  savedRecipes: string[];
  lastLogin: string;
  isAdmin: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  timestamp: string;
  details: string;
}
