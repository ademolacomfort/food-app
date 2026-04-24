import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function AuthButton() {
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.button
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center gap-2 bg-terracotta text-white px-4 py-2 rounded-full font-bold shadow-md hover:bg-terracotta/90 transition-colors disabled:opacity-50"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        ) : (
          <motion.div
            key="user"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-1 pr-3 rounded-full border border-white/20"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ""} className="w-8 h-8 rounded-full shadow-inner border border-white/40" />
            ) : (
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-deepgreen font-bold">
                {user.displayName?.[0] || <User size={16} />}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                {user.displayName || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
