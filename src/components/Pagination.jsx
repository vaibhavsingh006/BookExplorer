import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  if (totalItems <= pageSize) return null;

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-2 py-1 rounded-md border text-sm flex items-center gap-1",
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-200"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>{" "}
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={cn(
            "px-2 py-1 rounded-md border text-sm",
            page === currentPage
              ? "bg-yellow-300 font-semibold"
              : "hover:bg-yellow-200"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-2 py-1 rounded-md border text-sm flex items-center gap-1",
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-yellow-200"
        )}
      >
        <span className="hidden sm:inline">Next</span>{" "}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
