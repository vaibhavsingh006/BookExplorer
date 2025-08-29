import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, BookOpen } from "lucide-react";
import { cn } from "../lib/utils";
import { useFavorites } from "../contexts/FavoritesContext";

const Navigation = () => {
  const location = useLocation();
  const { favorites } = useFavorites();

  const navItems = [
    {
      to: "/",
      label: "Search Books",
      icon: Search,
      isActive: location.pathname === "/",
    },
    {
      to: "/favorites",
      label: "My Favorites",
      icon: Heart,
      isActive: location.pathname === "/favorites",
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-card fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary hover:text-accent transition-colors duration-200"
          >
            <BookOpen className="h-8 w-8" />
            <span className="font-bold text-xl font-serif">Book Explorer</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    item.isActive
                      ? "bg-accent text-accent-foreground shadow-glow btn-shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>

                  {/* Badge for favorites count */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-0 animate-pulse-glow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
