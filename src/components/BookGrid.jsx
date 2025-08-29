import React from "react";
import BookCard from "./BookCard";
import { cn } from "../lib/utils";

const BookGridSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-muted rounded-lg overflow-hidden shadow-card">
          <div className="h-48 bg-muted-foreground/20" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-2 bg-muted-foreground/20 rounded" />
              <div className="h-2 bg-muted-foreground/20 rounded" />
              <div className="h-2 bg-muted-foreground/20 rounded w-2/3" />
            </div>
            <div className="h-8 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BookGrid = ({
  books,
  isLoading = false,
  hasSearched = false,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <BookGridSkeleton />
      </div>
    );
  }

  if (hasSearched && books.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No books found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your search criteria or check your spelling. You can
            search by title, author, or genre.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => (
          <div
            key={book.id}
            className="animate-fade-in h-full"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <BookCard book={book} className="h-full flex flex-col" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
