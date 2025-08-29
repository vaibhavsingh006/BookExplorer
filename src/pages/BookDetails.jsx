import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Star,
  Calendar,
  User,
  BookOpen,
  Globe,
  ExternalLink,
  Building,
  Hash,
  MessageSquare,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import { Textarea } from "../components/ui/Textarea";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getBookById } from "../Api/booksApi";
import { useFavorites } from "../contexts/FavoritesContext";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";
import nocover from "../../public/nocover.jpg";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateFavoriteNotes,
    updateFavoriteTags,
    favorites,
  } = useFavorites();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const MAX_NOTES = 5;

  const [newNote, setNewNote] = useState("");

  const isBookFavorite = book ? isFavorite(book.id) : false;

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setError("Book ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const bookData = await getBookById(id);
        setBook(bookData);

        const favoriteBook = favorites.find((fav) => fav.id === bookData.id);
        if (favoriteBook) {
          setNotes(favoriteBook.notes || "");
          setTags(favoriteBook.tags || []);
        } else {
          setNotes("");
          setTags([]);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load book details";
        setError(errorMessage);

        toast({
          title: "Failed to load book",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id, favorites, toast]);

  useEffect(() => {
    if (!book) return;
    const favoriteBook = favorites.find((fav) => fav.id === book.id);
    if (favoriteBook) {
      setNotes(favoriteBook.notes || "");
      setTags(favoriteBook.tags || []);
    }
  }, [favorites, book]);

  const handleFavoriteToggle = () => {
    if (!book) return;

    if (isBookFavorite) {
      removeFromFavorites(book.id);
      setNotes("");
      setTags([]);

      toast({
        title: "Removed from favorites",
        description: `"${book.title}" has been removed from your favorites.`,
        variant: "default",
      });
    } else {
      addToFavorites(book, notes, tags);

      toast({
        title: "Added to favorites",
        description: `"${book.title}" has been added to your favorites.`,
        variant: "default",
      });
    }
  };

  const handleAddNote = () => {
    if (!book || !isBookFavorite || !newNote.trim()) return;

    if (notes.length >= MAX_NOTES) {
      toast({
        title: "Limit reached",
        description: `You can only save up to ${MAX_NOTES} notes.`,
        variant: "destructive",
      });
      return;
    }

    const updatedNotes = [...notes, newNote.trim()];
    setNotes(updatedNotes);
    updateFavoriteNotes(book.id, updatedNotes);
    setNewNote("");

    toast({
      title: "Note added",
      description: "Your note has been saved.",
    });
  };

  const handleRemoveNote = (noteToRemove) => {
    const updatedNotes = notes.filter((note) => note !== noteToRemove);
    setNotes(updatedNotes);
    updateFavoriteNotes(book.id, updatedNotes);
  };

  const handleAddTag = () => {
    if (!book || !isBookFavorite || !newTag.trim()) return;
    const tag = newTag.trim().toLowerCase();
    if (tags.includes(tag)) {
      toast({
        title: "Tag already exists",
        description: "This tag has already been added.",
        variant: "destructive",
      });
      return;
    }
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    updateFavoriteTags(book.id, updatedTags);
    setNewTag("");
    toast({ title: "Tag added", description: `Tag "${tag}" has been added.` });
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!book || !isBookFavorite) return;
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    updateFavoriteTags(book.id, updatedTags);
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

  const handleRetry = () => {
    if (id) window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading book details..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            title="Book Not Found"
            message={
              error || "The book you are looking for could not be found."
            }
            onRetry={handleRetry}
          />
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-16">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto gap-0 px-0 sm:px-6 lg:px-8 py-4 flex sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground px-2 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("searchQuery");
              localStorage.removeItem("searchResults");
              localStorage.removeItem("searchTotalItems");
              navigate("/?reset=true"); // 👈 force remount
            }}
            className="text-muted-foreground hover:text-foreground px-2 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-page border-color shadow-book">
              <div className="text-center space-y-6">
                <img
                  src={getImageUrl(book)}
                  alt={`Cover of ${book.title}`}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-book hover:shadow-glow transition-shadow duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x450/f1f1f1/666666?text=No+Cover";
                  }}
                />

                <Button
                  onClick={handleFavoriteToggle}
                  className={cn(
                    "w-full font-medium transition-all duration-200",
                    isBookFavorite
                      ? "bg-accent text-accent-foreground shadow-glow hover:bg-accent"
                      : "bg-gradient-primary text-primary-foreground hover:bg-gradient-accent shadow-book"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      isBookFavorite && "fill-current"
                    )}
                  />
                  {isBookFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </Button>

                {book.previewLink && (
                  <Button
                    variant="outline"
                    className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => window.open(book.previewLink, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Book
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-card border-color">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground leading-tight">
                  {book.title}
                </h1>

                {book.authors && book.authors.length > 0 && (
                  <div className="flex items-center text-lg text-muted-foreground">
                    <User className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>by {book.authors.join(", ")}</span>
                  </div>
                )}

                {book.averageRating && (
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < Math.floor(book.averageRating)
                              ? "text-accent fill-current"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      {book.averageRating.toFixed(1)}
                      {book.ratingsCount &&
                        ` (${book.ratingsCount.toLocaleString()} ratings)`}
                    </span>
                  </div>
                )}

                {book.categories && book.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {book.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-secondary/50 text-secondary-foreground border-border"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {book.description && (
              <Card className="p-6 shadow-card border-color">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Description
                </h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: book.description.replace(/\\n/g, "<br />"),
                  }}
                />
              </Card>
            )}

            <Card className="p-6 shadow-card border-color">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Book Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {book.publisher && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="text-foreground">{book.publisher}</p>
                    </div>
                  </div>
                )}

                {book.publishedDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="text-foreground">
                        {new Date(book.publishedDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                )}

                {book.pageCount && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pages</p>
                      <p className="text-foreground">
                        {book.pageCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {book.language && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="text-foreground">
                        {book.language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Favorites Notes and Tags */}
            {isBookFavorite && (
              <Card className="p-6 shadow-card border-color">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  My Notes & Tags
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Personal Notes
                    </Label>

                    {notes.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {notes.map((note, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start p-3 bg-background/50 border border-border rounded-lg"
                          >
                            <p className="text-sm text-foreground">{note}</p>
                            <button
                              onClick={() => handleRemoveNote(note)}
                              className="ml-2 text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Textarea
                      placeholder="Write a note about this book..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px] bg-background/50 border-border focus:border-accent"
                    />
                    <Button
                      onClick={handleAddNote}
                      variant="outline"
                      size="sm"
                      disabled={!newNote.trim()}
                      className="mt-2 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Add Note
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Tags
                    </Label>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-accent-hover border-color text-accent-foreground cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                            <button className="ml-1 text-xs">×</button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        className="flex-1 bg-background/50 border-border focus:border-accent"
                      />
                      <Button
                        onClick={handleAddTag}
                        variant="outline"
                        size="sm"
                        disabled={!newTag.trim()}
                        className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        <Hash className="h-3 w-3 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
