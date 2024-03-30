export type SortOrder = "asc" | "desc";
export type ActionType = "add" | "edit" | "delete" | null;
export type ResultType = "success" | "failure";

export const API_URL = import.meta.env.VITE_REACT_URL_API;
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL_API;
export const CATEGORY = "Category";
export const BOOK = "Book";

export type CategoryDto = {
  id: number;
  name: string;
};

export type BookDto = {
  id: number;
  code: string;
  title: string;
  description: string;
  author: string;
  language: string;
  image: string;
  isPrivate: boolean;
  categoryId: number
  category: string;
};
