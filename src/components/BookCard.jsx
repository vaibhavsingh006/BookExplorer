import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Calendar, User, ExternalLink } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { cn } from "../lib/utils";
import nocover from "../../public/nocover.jpg";
import { useFavorites } from "../contexts/FavoritesContext";

const BookCard = memo(({ book, className }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isBookFavorite = isFavorite(book.id);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBookFavorite) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };

  const getImageUrl = (book) => {
    if (book.imageLinks?.thumbnail) {
      return book.imageLinks.thumbnail.replace("http://", "https://");
    }
    if (book.imageLinks?.smallThumbnail) {
      return book.imageLinks.smallThumbnail.replace("http://", "https://");
    }
    return nocover;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const cleanDescription = (description) => {
    if (!description) return "No description available.";
    const cleaned = description
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return truncateText(cleaned, 150);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-card border border-border transition-all duration-300 animate-fade-in flex flex-col h-full sm:w-auto", // 👈 flex + full height
        className
      )}
    >
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className={cn(
            "rounded-full transition-all duration-200",
            isBookFavorite
              ? "bg-accent text-accent-foreground"
              : "bg-background text-muted-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", isBookFavorite && "fill-current")} />
        </Button>
      </div>

      <Link to={`/book/${book.id}`} className="block flex flex-col h-full">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Book Cover */}
          <div className="relative h-48 bg-card overflow-hidden">
            <img
              src={getImageUrl(book)}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
              onError={(e) => {
                e.target.src = nocover;
              }}
            />
          </div>

          {/* Book Info */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="font-semibold text-base text-foreground texth line-clamp-2 transition-colors duration-200">
              {book.title || "Untitled"}
            </h3>

            {book?.authors && book.authors.length > 0 ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {book.authors.slice(0, 2).join(", ")}
                  {book.authors.length > 2 && " et al."}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>Unknown Author</span>
              </div>
            )}

            {book?.publishedDate ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>
                  {isNaN(new Date(book.publishedDate).getFullYear())
                    ? "N/A"
                    : new Date(book.publishedDate).getFullYear()}
                </span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>N/A</span>
              </div>
            )}

            {book?.averageRating ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 mr-1 text-accent fill-current" />
                <span>
                  {!isNaN(book.averageRating)
                    ? book.averageRating.toFixed(1)
                    : "N/A"}
                </span>
                {book?.ratingsCount ? (
                  <span className="ml-1">({book.ratingsCount})</span>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>No rating</span>
              </div>
            )}

            {book?.categories && book.categories.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {book.categories.slice(0, 2).map((category, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-secondary text-secondary-foreground border-border"
                  >
                    {category}
                  </Badge>
                ))}
                {book.categories.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-muted-foreground"
                  >
                    +{book.categories.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground"
              >
                Uncategorized
              </Badge>
            )}

            <p className="text-sm text-muted-foreground line-clamp-3">
              {cleanDescription(book?.description)}
            </p>

            <div className="pt-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full btnh border-border text-muted-foreground"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
