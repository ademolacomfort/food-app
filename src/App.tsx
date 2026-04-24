import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, collection, query, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { Layout } from "./components/Layout";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeDetail } from "./components/RecipeDetail";
import { MockPayment } from "./components/MockPayment";
import { NIGERIAN_RECIPES } from "./constants";
import { Recipe, UserProfile } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, History, ShoppingBag, ShieldCheck, Database, Heart } from "lucide-react";
import { cn } from "./lib/utils";

// --- Views ---

function HomeView() {
  const [recipes, setRecipes] = useState<Recipe[]>(NIGERIAN_RECIPES);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;
    return onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      }
    });
  }, []);

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase()));
    const matchesRegion = selectedRegion === "All" || r.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleSave = async (id: string) => {
    if (!auth.currentUser) {
      alert("Please sign in to save recipes!");
      return;
    }
    const userRef = doc(db, "users", auth.currentUser.uid);
    const isSaved = userProfile?.savedRecipes.includes(id);
    
    await updateDoc(userRef, {
      savedRecipes: isSaved ? arrayRemove(id) : arrayUnion(id)
    });
  };

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence>
        {selectedRecipe ? (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipeId(null)}
            isLocked={selectedRecipe.isPremium && !userProfile?.isPremium}
            onUnlock={() => setShowPayment(true)}
          />
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-deepgreen rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none" 
                   style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/az-subtle.png")' }} />
              
              <div className="md:w-2/3 relative z-10 space-y-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gold text-deepgreen px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase"
                >
                  Taste the Heritage
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-black leading-tight"
                >
                  Discover the Soul of <span className="text-terracotta">African Cuisine</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-white/70 italic"
                >
                  From Lagos to Accra, Nairobi to Casablanca. Explore authentic recipes passed down through generations.
                </motion.p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                      <input 
                        type="text"
                        placeholder="Search by name, ingredient, or spice..."
                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold transition-all backdrop-blur-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                   <div className="flex gap-2">
                     {["All", "West Africa"].map((reg) => (
                       <button
                         key={reg}
                         onClick={() => setSelectedRegion(reg)}
                         className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                          selectedRegion === reg ? "bg-gold text-deepgreen" : "bg-white/10 text-white/60 hover:bg-white/20"
                         }`}
                       >
                         {reg}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={userProfile?.savedRecipes.includes(recipe.id)}
                  onSave={handleSave}
                  onView={(id: string) => setSelectedRecipeId(id)}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <UtensilsCrossed size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-500">No recipes found matching your search.</h3>
                <p className="text-gray-400 mt-1">Try searching for "Rice", "Egusi", or "West Africa".</p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {showPayment && (
        <MockPayment
          onSuccess={() => {
            setShowPayment(false);
            if (selectedRecipeId) setSelectedRecipeId(selectedRecipeId); // Refresh state
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

function SavedView() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const savedIds = data.savedRecipes || [];
        const saved = NIGERIAN_RECIPES.filter(r => savedIds.includes(r.id));
        setSavedRecipes(saved);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" /></div>;

  if (!auth.currentUser) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-2xl font-bold text-deepgreen">Sign in to see your saved recipes</h2>
    </div>
  );

  const selectedRecipe = savedRecipes.find(r => r.id === selectedRecipeId);

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedRecipe ? (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipeId(null)}
          isLocked={false} // Assume the list only shows unlocked for simplicity or handle premium here
          onUnlock={() => {}}
        />
      ) : (
        <div className="space-y-8">
          <header>
            <h2 className="text-3xl font-black text-deepgreen">YOUR FLAVOR COLLECTION</h2>
            <p className="text-gray-500 italic mt-1">Recipes that won your heart.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSaved={true}
                onSave={async (id) => {
                   await updateDoc(doc(db, "users", auth.currentUser!.uid), {
                     savedRecipes: arrayRemove(id)
                   });
                }}
                onView={(id) => setSelectedRecipeId(id)}
              />
            ))}
          </div>

          {savedRecipes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <Heart size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-500">Your collection is empty.</h3>
              <p className="text-gray-400 mt-1">Found a recipe you like? Hit the heart icon to save it here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DashboardView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    return onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" /></div>;

  if (!auth.currentUser) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-2xl font-bold text-deepgreen">Sign in to access your dashboard</h2>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl overflow-hidden">
               {auth.currentUser.photoURL ? (
                 <img src={auth.currentUser.photoURL} alt="" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gold bg-deepgreen text-3xl font-bold">
                   {auth.currentUser.displayName?.[0] || "U"}
                 </div>
               )}
            </div>
            <h3 className="text-lg font-bold text-deepgreen">{auth.currentUser.displayName}</h3>
            <p className="text-xs text-gray-400">{auth.currentUser.email}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-black uppercase",
                  profile?.isPremium ? "bg-gold text-deepgreen" : "bg-gray-100 text-gray-400"
                )}>
                  {profile?.isPremium ? "Premium" : "Free Tier"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-deepgreen p-6 rounded-3xl text-white space-y-4 shadow-xl">
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-gold" />
                <h4 className="font-bold">Security & Trust</h4>
             </div>
             <p className="text-xs text-white/60">Your data is stored securely using Google Cloud Infrastructure.</p>
          </div>
        </aside>

        <section className="flex-grow space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Recipes</p>
                <p className="text-3xl font-black text-deepgreen mt-1">{profile?.savedRecipes.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login History</p>
                <div className="flex items-center gap-2 mt-2">
                  <History size={16} className="text-terracotta" />
                  <p className="text-sm font-bold text-gray-600">Last: {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : "Today"}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                <div className="flex items-center gap-2 mt-2">
                  <ShoppingBag size={16} className="text-gold" />
                  <p className="text-sm font-bold text-gray-600">0 Items Purchased</p>
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-deepgreen mb-6">Account Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <History size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">Login Successful</p>
                        <p className="text-xs text-gray-400">Web Dashboard • Today</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                ))}
              </div>
           </div>

           {profile?.isAdmin && (
             <div className="bg-terracotta/5 p-8 rounded-3xl border border-terracotta/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-terracotta flex items-center gap-2">
                    <ShieldCheck /> Admin Controls
                  </h3>
                  <button 
                    onClick={async () => {
                      // Simple seeding logic
                      for (const recipe of NIGERIAN_RECIPES) {
                        await setDoc(doc(db, "recipes", recipe.id), recipe);
                      }
                      alert("Database seeded!");
                    }}
                    className="bg-white text-terracotta border border-terracotta px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-terracotta hover:text-white transition-all shadow-sm"
                  >
                    <Database size={14} />
                    Sync Global Recipes
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-2xl border border-terracotta/10 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total App Users</p>
                      <p className="text-xl font-black text-deepgreen">1,402</p>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border border-terracotta/10 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Revenue (Mock)</p>
                      <p className="text-xl font-black text-deepgreen">₦450,000</p>
                   </div>
                </div>
             </div>
           )}
        </section>
      </div>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure user profile exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const profile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || "User",
            email: user.email || "",
            isPremium: false,
            savedRecipes: [],
            lastLogin: new Date().toISOString(),
            isAdmin: user.email === "ademolacomfortfunsho@gmail.com" // Bootstrapped Admin
          };
          await setDoc(userRef, profile);
        } else {
          await updateDoc(userRef, { lastLogin: new Date().toISOString() });
        }
      }
      setInitializing(false);
    });
  }, []);

  if (initializing) return (
    <div className="min-h-screen bg-deepgreen flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-deepgreen shadow-2xl"
      >
        <UtensilsCrossed size={32} strokeWidth={2.5} />
      </motion.div>
    </div>
  );

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/saved" element={<SavedView />} />
          <Route path="/dashboard" element={<DashboardView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function UtensilsCrossed(props: { size?: number, className?: string, strokeWidth?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={props.strokeWidth || 2} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <path d="m3 21 8.5-8.5" /><path d="M12 12c-5.4-2.8-5-8.1-1-11" /><path d="M12 12c5.4-2.8 5-8.1 1-11" /><path d="m11.5 12.5 8.5 8.5" /><path d="M19 15.5l-3.5-3.5" /><path d="M14 17.5l-3.5-3.5" /><path d="M11 12c1.4-1.4 3-1.4 4.4 0l.6 1L21 8l-2-2-5 5-1-.6C11.6 9 11.6 7.4 13 6l-2-2C9.4 5.6 9.4 7.2 10.8 8.6L10 9.4c-1.4-1.4-3-1.4-4.4 0L4 11l5 5 1.6-1.6c1.4 1.4 1.4 3 0 4.4l2 2Z" />
    </svg>
  );
}
