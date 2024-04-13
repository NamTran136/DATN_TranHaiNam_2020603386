import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./features/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { SearchSlice } from "./features/searchSlice";

export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    search: SearchSlice.reducer
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
