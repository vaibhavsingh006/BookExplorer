import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import SearchForm from "../components/SearchForm";
import BookGrid from "../components/BookGrid";
import ErrorMessage from "../components/ErrorMessage";
import { searchBooks } from "../Api/booksApi";
import { useToast } from "../hooks/use-toast";
import { useSearch } from "../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const Search = () => {
  const {
    searchQuery,
    setSearchQuery,
    books,
    setBooks,
    totalItems,
    setTotalItems,
    hasSearched,
    setHasSearched,
  } = useSearch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("reset") === "true") {
      setSearchQuery({});
      setBooks([]);
      setTotalItems(0);
      setHasSearched(false);

      navigate("/", { replace: true });
      return;
    }

    if (!searchQuery || Object.keys(searchQuery).length === 0) {
      setHasSearched(false);
      setBooks([]);
      setTotalItems(0);
    }
  }, [
    location.search,
    navigate,
    setSearchQuery,
    setBooks,
    setTotalItems,
    setHasSearched,
  ]);

  const handleSearch = async (formData, page = 1, showToast = true) => {
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      setSearchQuery(formData);

      const result = await searchBooks({
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim(),
        maxResults: pageSize,
        startIndex: (page - 1) * pageSize,
      });

      setBooks(result.books);
      const safeTotal = Math.min(result.totalItems, 150);
      setTotalItems(safeTotal);
      setCurrentPage(page);

      if (showToast) {
        if (result.books.length === 0) {
          toast({
            title: "No results found",
            description: "Try different search terms or check your spelling.",
            variant: "default",
          });
        } else {
          toast({
            title: "Search completed",
            description: `Found ${safeTotal.toLocaleString()} books matching your criteria.`,
            variant: "default",
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search books";
      setError(errorMessage);
      setBooks([]);
      setTotalItems(0);

      if (showToast) {
        toast({
          title: "Search failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const getSearchSummary = () => {
    if (!searchQuery) return "";

    const parts = [];
    if (searchQuery.title) parts.push(`title: "${searchQuery.title}"`);
    if (searchQuery.author) parts.push(`author: "${searchQuery.author}"`);
    if (searchQuery.genre) parts.push(`genre: "${searchQuery.genre}"`);

    return `Showing results for ${parts.join(", ")}`;
  };

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="bg-gradient-page border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-hover rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Book Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover millions of books from around the world. Search by title,
              author, or genre to find your next great read.
            </p>
          </div>

          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage
            title="Search Error"
            message={error}
            onRetry={handleRetry}
            className="mb-8"
          />
        )}

        {hasSearched && !error && (
          <div className="space-y-6">
            {books.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {getSearchSummary()}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {totalItems.toLocaleString()} books found
                  </p>
                </div>
              </div>
            )}

            <BookGrid
              books={books}
              isLoading={isLoading}
              hasSearched={hasSearched}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(page) => {
                setCurrentPage(page);
                handleSearch(searchQuery, page, false);
              }}
            />
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-hover rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to discover amazing books?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use the search form above to find books by title, author, or
              genre. Start your literary journey today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
