import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";

const SearchForm = ({ onSearch, isLoading = false, className }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const clearField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const clearAllFields = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    const hasAnyValue = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (!hasAnyValue) {
      newErrors.general = "Please fill in at least one search field";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSearch(formData);
    }
  };

  const hasAnyValue = Object.values(formData).some(
    (value) => value.trim() !== ""
  );

  return (
    <Card
      className={cn("p-6 bg-gradient-page shadow-book border-color", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Discover Your Next Great Read
          </h2>
          <p className="text-muted-foreground">
            Search through millions of books to find exactly what you're looking
            for
          </p>
        </div>

        {errors.general && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {errors.general}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Book Title
            </Label>
            <div className="relative">
              <Input
                id="title"
                type="text"
                placeholder="e.g. The Great Gatsby"
                value={formData.title}
                onChange={handleInputChange("title")}
                className="pr-8 bg-background outline-none focus:border-[#eca63a]"
                disabled={isLoading}
              />
              {formData.title && (
                <button
                  type="button"
                  onClick={() => clearField("title")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="author"
              className="text-sm font-medium text-foreground"
            >
              Author Name
            </Label>
            <div className="relative">
              <Input
                id="author"
                type="text"
                placeholder="e.g. F. Scott Fitzgerald"
                value={formData.author}
                onChange={handleInputChange("author")}
                className="pr-8 bg-background/50 border-border focus:border-accent focus:ring-accent/20"
                disabled={isLoading}
              />
              {formData.author && (
                <button
                  type="button"
                  onClick={() => clearField("author")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="genre"
              className="text-sm font-medium text-foreground"
            >
              Genre/Keyword
            </Label>
            <div className="relative">
              <Input
                id="genre"
                type="text"
                placeholder="e.g. fiction, mystery, science"
                value={formData.genre}
                onChange={handleInputChange("genre")}
                className="pr-8 bg-background/50 border-border focus:border-accent focus:ring-accent/20"
                disabled={isLoading}
              />
              {formData.genre && (
                <button
                  type="button"
                  onClick={() => clearField("genre")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            type="submit"
            disabled={isLoading || !hasAnyValue}
            className="bg-gradient-primary hover:bg-gradient-accent text-primary-foreground font-medium px-8 py-2 shadow-book hover:shadow-glow transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Books
              </>
            )}
          </Button>

          {hasAnyValue && !isLoading && (
            <Button
              type="button"
              variant="outline"
              onClick={clearAllFields}
              className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default SearchForm;
