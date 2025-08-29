import axios from "axios";
import {} from "../contexts/FavoritesContext";

const BASE_URL = "https://www.googleapis.com/books/v1";

const transformGoogleBookToBook = (googleBook) => {
  return {
    id: googleBook.id,
    title: googleBook.volumeInfo.title,
    authors: googleBook.volumeInfo.authors,
    description: googleBook.volumeInfo.description,
    imageLinks: googleBook.volumeInfo.imageLinks,
    publishedDate: googleBook.volumeInfo.publishedDate,
    publisher: googleBook.volumeInfo.publisher,
    pageCount: googleBook.volumeInfo.pageCount,
    categories: googleBook.volumeInfo.categories,
    averageRating: googleBook.volumeInfo.averageRating,
    ratingsCount: googleBook.volumeInfo.ratingsCount,
    language: googleBook.volumeInfo.language,
    previewLink: googleBook.volumeInfo.previewLink,
    infoLink: googleBook.volumeInfo.infoLink,
  };
};

export const searchBooks = async (params) => {
  try {
    // Build search query
    const queryParts = [];

    if (params.title) {
      queryParts.push(`intitle:${encodeURIComponent(params.title)}`);
    }

    if (params.author) {
      queryParts.push(`inauthor:${encodeURIComponent(params.author)}`);
    }

    if (params.genre) {
      queryParts.push(`subject:${encodeURIComponent(params.genre)}`);
    }

    if (queryParts.length === 0) {
      throw new Error("At least one search field must be provided");
    }

    const query = queryParts.join("+");
    const maxResults = Math.min(params.maxResults || 12, 40);
    const startIndex = params.startIndex || 0;

    const response = await axios.get(`${BASE_URL}/volumes`, {
      params: {
        q: query,
        maxResults,
        startIndex,
        orderBy: "relevance",
      },
      timeout: 10000,
    });

    const books = (response.data.items || []).map(transformGoogleBookToBook);

    return {
      books,
      totalItems: response.data.totalItems || 0,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out. Please try again.");
      }
      if (!error.response) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred while searching for books.");
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/volumes/${id}`, {
      timeout: 10000,
    });

    return transformGoogleBookToBook(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Book not found");
      }
      if (error.response?.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out. Please try again.");
      }
      if (!error.response) {
        throw new Error("Network error. Please check your connection.");
      }
    }

    throw new Error("Failed to fetch book details");
  }
};
