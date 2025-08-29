import React from "react";
// import { Toaster } from "./components/ui/Toaster";
import { Toaster as Sonner } from "./components/ui/Sonner";
import { TooltipProvider } from "./components/ui/Tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Suspense, lazy } from "react";

import { FavoritesProvider } from "./contexts/FavoritesContext";

import Navigation from "./components/Navigation";
import LoadingSpinner from "./components/LoadingSpinner";

import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const BookDetails = lazy(() => import("./pages/BookDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" message="Loading page..." />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Search />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/favorites" element={<Favorites />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </FavoritesProvider>
  </QueryClientProvider>
);

export default App;
