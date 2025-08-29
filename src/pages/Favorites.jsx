import React, { useState } from "react";
import {
  Heart,
  Search,
  Tag as TagIcon,
  Filter,
  X,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import BookGrid from "../components/BookGrid";
import { useFavorites } from "../contexts/FavoritesContext";
import { cn } from "../lib/utils";

const Favorites = () => {
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [sortOrder, setSortOrder] = useState("desc");

  const allTags = Array.from(
    new Set(favorites.flatMap((book) => book.tags || []))
  ).sort();

  const filteredAndSortedFavorites = favorites
    .filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.authors &&
          book.authors.some((author) =>
            author.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
        (book.notes &&
          book.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        !selectedTag ||
        selectedTag === "all" ||
        (book.tags && book.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "dateAdded":
          comparison =
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          const authorA = a.authors?.[0] || "";
          const authorB = b.authors?.[0] || "";
          comparison = authorA.localeCompare(authorB);
          break;
        default:
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("all");
    setSortBy("dateAdded");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchQuery ||
    (selectedTag && selectedTag !== "all") ||
    sortBy !== "dateAdded" ||
    sortOrder !== "desc";

  return (
    <div className="min-h-screen bg-background mt-16">
      <div className="bg-gradient-page border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-hover rounded-full mb-4">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Favorite Books
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {favorites.length === 0
                ? "Start building your personal library by adding books to your favorites"
                : `Your curated collection of ${favorites.length} book${
                    favorites.length === 1 ? "" : "s"
                  }`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <Card className="p-12 text-center shadow-card border-color">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-hover rounded-full mb-6">
              <Heart className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              No favorites yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Discover amazing books and add them to your favorites to create
              your personal reading collection.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-primary text-primary-foreground hover:bg-gradient-accent shadow-book hover:shadow-glow transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Start Exploring Books
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 shadow-card border-color">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-border focus:border-accent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {allTags.length > 0 && (
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Filter by tag" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="border-color">
                        <SelectItem value="all">All tags</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem
                            key={tag}
                            value={tag}
                            className={`hover:bg-yellow-200 ${
                              selectedTag === tag ? "bg-accent" : ""
                            }`}
                          >
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-full sm:w-40 bg-background border-border">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="border-color">
                        <SelectItem value="dateAdded">Date Added</SelectItem>
                        <SelectItem
                          value="title"
                          className={`hover:bg-yellow-200 ${
                            sortBy === "title" ? "bg-accent" : ""
                          }`}
                        >
                          Title
                        </SelectItem>
                        <SelectItem
                          value="author"
                          className={`hover:bg-yellow-200 ${
                            sortBy === "author" ? "bg-accent" : ""
                          }`}
                        >
                          Author
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      {/* {sortOrder === "desc" ? "↓" : "↑"} */}
                      {sortOrder === "desc" ? (
                        <ArrowDown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <ArrowUp className="h-4 w-4 text-yellow-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Active filters:
                    </span>

                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="text-accent-foreground bg-accent-hover border-color"
                      >
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-1 text-xs hover:text-accent"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {selectedTag && selectedTag !== "all" && (
                      <Badge
                        variant="secondary"
                        className=" text-accent-foreground bg-accent-hover border-color"
                      >
                        Tag: {selectedTag}
                        <button
                          onClick={() => setSelectedTag("all")}
                          className="ml-1 text-xs hover:text-accent"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {(sortBy !== "dateAdded" || sortOrder !== "desc") && (
                      <Badge
                        variant="secondary"
                        className="text-accent-foreground bg-accent-hover border-color"
                      >
                        Sort: {sortBy} ({sortOrder})
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredAndSortedFavorites.length === favorites.length
                  ? `${favorites.length} book${
                      favorites.length === 1 ? "" : "s"
                    } in your favorites`
                  : `${filteredAndSortedFavorites.length} of ${
                      favorites.length
                    } book${
                      favorites.length === 1 ? "" : "s"
                    } match your filters`}
              </p>

              {allTags.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {allTags.length} unique tag{allTags.length === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {filteredAndSortedFavorites.length === 0 ? (
              <Card className="p-8 text-center shadow-card">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No books match your filters
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing some filters.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <BookGrid books={filteredAndSortedFavorites} />
            )}

            {allTags.length > 0 && (
              <Card className="p-6 shadow-card border-color">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Your Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const tagCount = favorites.filter(
                      (book) => book.tags && book.tags.includes(tag)
                    ).length;

                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTag(selectedTag === tag ? "all" : tag)
                        }
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border",
                          selectedTag === tag
                            ? "bg-accent text-accent-foreground border-accent shadow-glow"
                            : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary hover:border-accent/50"
                        )}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                        <span className="ml-1 text-xs opacity-70">
                          {tagCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
