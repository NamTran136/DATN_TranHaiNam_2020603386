import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BookDto } from "../../types";

interface SearchState {
  searchInput: string;
  results: BookDto[];
}

const initialState: SearchState = {
  searchInput: "",
  results: [],
};

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchStart: (state) => {
      state.searchInput = "";
      state.results = [];
    },
    searchSetValue: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    searchSetResults: (state, action: PayloadAction<BookDto[]>) => {
      state.results = action.payload;
    }
  },
});

export const { searchStart, searchSetValue, searchSetResults } = SearchSlice.actions;

export default SearchSlice.reducer;
