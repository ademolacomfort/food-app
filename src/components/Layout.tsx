import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";
import { Search, Heart, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { label: "Recipes", icon: UtensilsCrossed, path: "/" },
    { label: "Saved", icon: Heart, path: "/saved" },
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#013220] text-white shadow-xl overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-deepgreen rotate-12 group-hover:rotate-0 transition-transform duration-300">
              <UtensilsCrossed size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">
                FLAVORS OF <span className="text-gold">AFRICA</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1">Authentic Nigerian Heritage</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-bold transition-all flex items-center gap-2 px-3 py-2 rounded-full",
                  location.pathname === item.path 
                    ? "bg-gold text-deepgreen shadow-inner" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-[#FAFAFA]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-deepgreen text-white py-12 mt-auto relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta via-gold to-terracotta" />
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-gold rounded flex items-center justify-center text-deepgreen">F</div>
                Flavors of Africa
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                Bringing the rich culinary heritage of the African continent to your kitchen. 
                Started with Nigeria, growing to represent every region.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gold">Regions</h4>
              <ul className="text-sm text-white/60 space-y-2">
                <li className="hover:text-gold cursor-pointer transition-colors">West Africa (Home)</li>
                <li className="hover:text-gold cursor-pointer transition-colors">East Africa (Coming Soon)</li>
                <li className="hover:text-gold cursor-pointer transition-colors">North Africa (Coming Soon)</li>
                <li className="hover:text-gold cursor-pointer transition-colors">South Africa (Coming Soon)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gold">Newsletter</h4>
              <p className="text-xs text-white/40">Get new recipes delivered to your inbox weekly.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm flex-grow focus:outline-none focus:border-gold" 
                />
                <button className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-terracotta/90 transition-colors">
                  Join
                </button>
              </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Flavors of Africa. All rights reserved.
         </div>
      </footer>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-deepgreen text-white h-16 border-t border-white/10 flex items-center justify-around z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] font-bold transition-colors",
              location.pathname === item.path ? "text-gold" : "text-white/60"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
