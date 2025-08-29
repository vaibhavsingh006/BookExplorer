import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavoritesContext = createContext(undefined);

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
};

const STORAGE_KEY = "book-explorer-favorites";

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw || raw === "undefined" || raw === "null" || raw.trim() === "") {
        if (raw) localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setFavorites(parsed);
      } else {
        console.warn("Favorites in storage is not an array. Resetting.");
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to load favorites:", err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const save = (updater) => {
    setFavorites((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save favorites:", err);
      }
      return next;
    });
  };

  const addToFavorites = (book, notes = "", tags = []) => {
    save((prev) => {
      if (prev.some((f) => f.id === book.id)) return prev; // no dupes
      return [
        ...prev,
        { ...book, dateAdded: new Date().toISOString(), notes, tags },
      ];
    });
  };

  const removeFromFavorites = (bookId) => {
    save((prev) => prev.filter((f) => f.id !== bookId));
  };

  const toggleFavorite = (book, notes = "", tags = []) => {
    save((prev) => {
      const exists = prev.some((f) => f.id === book.id);
      return exists
        ? prev.filter((f) => f.id !== book.id)
        : [
            ...prev,
            { ...book, dateAdded: new Date().toISOString(), notes, tags },
          ];
    });
  };

  const updateFavoriteNotes = (bookId, notes) => {
    save((prev) => prev.map((f) => (f.id === bookId ? { ...f, notes } : f)));
  };

  const updateFavoriteTags = (bookId, tags) => {
    save((prev) => prev.map((f) => (f.id === bookId ? { ...f, tags } : f)));
  };

  const isFavorite = (bookId) => favorites.some((f) => f.id === bookId);

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      updateFavoriteNotes,
      updateFavoriteTags,
    }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
