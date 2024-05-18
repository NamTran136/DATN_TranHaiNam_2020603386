export type SortOrder = "asc" | "desc";
export type ActionType = "add" | "edit" | "delete" | null;
export type ResultType = "success" | "failure";

export const API_URL = import.meta.env.VITE_REACT_URL_API;
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL_API;
export const CATEGORY = "Category";
export const BOOK = "Book";
export const AUTH = "Auth";
export const USER = "User";
export const COMMENT = "Comments";
export const FBOOK = "FavouriteBook";
export const WBOOK = "WatchedBook";
export const FEEDBACK = "Feedback";
export const BLOG = "Blogs";
export const COMMON = "Common";

export interface ColumnProps<T extends Object> {
  Header: string;
  value: keyof T;
}

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
  numOfDownloads: number;
  numOfViews: number;
  isPrivate: boolean;
  categoryId: number;
  category: string;
};
export type BookToAddDto = {
  code: string;
  title: string;
  description: string;
  author: string;
  language: string;
  imageUrl: string;
  isPrivate: boolean;
  category: string;
};
export type BookToEditDto = {
  id: number;
  file: any | undefined;
  title: string;
  description: string;
  author: string;
  language: string;
  imageUrl: string;
  isPrivate: boolean;
  category: string;
};

export type WatchedBookDto = {
  id: number;
  code: string;
  title: string;
  author: string;
  imageUrl: string;
  createdAt: string;
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

export type UserPrivateDto = {
  id: number;
  username: string;
  email: string;
  imageUrl: string;
};

export type CommentDto = {
  id: number;
  content: string;
  timeUp: string;
  username: string;
  imageUrl: string;
  title: string;
}

export type BlogDto = {
  id: number;
  title: string;
  description: string;
  time: string;
  fileUrl: string;
}

export type BlogInfoDto = {
  id: number;
  title: string;
  time: string;
  content: string;
};

export type FeedbackDto = {
  id: number;
  username: string;
  avatar: string;
  title: string;
  content: string;
  createdAt: string;
  filename: string;
  isActive: boolean; 
}