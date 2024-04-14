export type SortOrder = "asc" | "desc";
export type ActionType = "add" | "edit" | "delete" | null;
export type ResultType = "success" | "failure";

export const API_URL = import.meta.env.VITE_REACT_URL_API;
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL_API;
export const CATEGORY = "Category";
export const BOOK = "Book";
export const AUTH = "Auth";
export const USER = "User";

export type CategoryDto = {
  id: number;
  name: string;
};
export type CategoryToEditDto = {
  name: string;
};

export type BookDto = {
  id: number;
  code: string;
  title: string;
  description: string;
  author: string;
  language: string;
  imageUrl: string;
  isPrivate: boolean;
  categoryId: number
  category: string;
};

export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type GoogleDto = {
  username: string;
  email: string;
  password: string;
  imageUrl: string;
}

export type ResponseLogin = {
  email: string;
  role: string;
  exp: number;
};

export type UserEditDto = {
  username: string;
  email: string;
  password: string;
  imageUrl: string;
};
export type UserDto = {
  username: string;
  email: string;
  role: string;
  image: string;
};