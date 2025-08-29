// src/contexts/SearchContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem("searchQuery");
    return saved ? JSON.parse(saved) : null;
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("searchResults");
    return saved ? JSON.parse(saved) : [];
  });

  const [totalItems, setTotalItems] = useState(() => {
    const saved = localStorage.getItem("searchTotalItems");
    return saved ? JSON.parse(saved) : 0;
  });

  const [hasSearched, setHasSearched] = useState(() => !!searchQuery);

  // Persist to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("searchQuery", JSON.stringify(searchQuery));
    localStorage.setItem("searchResults", JSON.stringify(books));
    localStorage.setItem("searchTotalItems", JSON.stringify(totalItems));
  }, [searchQuery, books, totalItems]);

  const resetSearch = () => {
    setSearchQuery(null);
    setBooks([]);
    setTotalItems(0);
    setHasSearched(false);
    localStorage.removeItem("searchQuery");
    localStorage.removeItem("searchResults");
    localStorage.removeItem("searchTotalItems");
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        books,
        setBooks,
        totalItems,
        setTotalItems,
        hasSearched,
        setHasSearched,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
