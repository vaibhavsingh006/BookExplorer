import React from "react";
import { cn } from "../lib/utils";

const LoadingSpinner = ({ size = "md", className, message }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-2 spin-border-gray",
            sizeClasses[size]
          )}
        >
          <div
            className={cn(
              "absolute top-0 left-0 animate-spin rounded-full border-2 border-transparent spin-border",
              sizeClasses[size]
            )}
          />
        </div>

        {size !== "sm" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={cn(
                "text-accent animate-pulse",
                size === "lg" ? "h-4 w-4" : "h-3 w-3"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      {message && (
        <p
          className={cn(
            "mt-3 text-muted-foreground animate-pulse",
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
